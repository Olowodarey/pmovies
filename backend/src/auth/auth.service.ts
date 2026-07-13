import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

// Emails are case-insensitive per RFC 5321 §2.4, but Postgres text comparison
// is case-sensitive. Without normalization a user could sign up as
// "Foo@Gmail.com" with a password, then later Google-login as "foo@gmail.com"
// and end up with two separate accounts sharing one real email address.
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface GoogleProfile {
  googleId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private toPublicUser(user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  async signup(dto: SignupDto) {
    const email = normalizeEmail(dto.email);

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      // If the existing account has no password (Google-only), point them at
      // the correct sign-in method instead of a generic "email taken" error.
      if (existing.googleId && !existing.passwordHash) {
        throw new ConflictException(
          'This email is registered with Google. Please continue with Google.',
        );
      }
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name: dto.name,
      },
    });

    const token = this.signToken({ sub: user.id, email: user.email });
    return { user: this.toPublicUser(user), token };
  }

  async login(dto: LoginDto) {
    const email = normalizeEmail(dto.email);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // If the account exists but has no password (Google-only), tell the user
    // to use Google instead of a misleading "invalid password" message.
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please continue with Google.',
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.signToken({ sub: user.id, email: user.email });
    return { user: this.toPublicUser(user), token };
  }

  async loginWithGoogle(profile: GoogleProfile) {
    const email = normalizeEmail(profile.email);

    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      // Link to an existing password account with the same (Google-verified)
      // email if one exists, otherwise create a fresh account.
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      user = existingByEmail
        ? await this.prisma.user.update({
            where: { id: existingByEmail.id },
            data: {
              googleId: profile.googleId,
              avatarUrl: existingByEmail.avatarUrl ?? profile.avatarUrl,
              name: existingByEmail.name ?? profile.name,
            },
          })
        : await this.prisma.user.create({
            data: {
              email,
              googleId: profile.googleId,
              name: profile.name,
              avatarUrl: profile.avatarUrl,
            },
          });
    }

    const token = this.signToken({ sub: user.id, email: user.email });
    return { user: this.toPublicUser(user), token };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.toPublicUser(user);
  }

  private signToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
