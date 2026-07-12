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
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
      },
    });

    const token = this.signToken({ sub: user.id, email: user.email });
    return { user: this.toPublicUser(user), token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.signToken({ sub: user.id, email: user.email });
    return { user: this.toPublicUser(user), token };
  }

  async loginWithGoogle(profile: GoogleProfile) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      // Link to an existing password account with the same (Google-verified)
      // email if one exists, otherwise create a fresh account.
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: profile.email },
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
              email: profile.email,
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
