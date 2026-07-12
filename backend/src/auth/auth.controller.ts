import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService, GoogleProfile } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { CurrentUser, AuthenticatedUser } from './current-user.decorator';

// Kept in sync with JWT_EXPIRES_IN in .env (7 days).
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setAuthCookie(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });
  }

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.signup(dto);
    this.setAuthCookie(res, token);
    return user;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(dto);
    this.setAuthCookie(res, token);
    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getUserById(user.userId);
  }

  // Kicks off the OAuth dance: the guard redirects the browser to Google's
  // consent screen, so this handler body never actually runs.
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as GoogleProfile;
    const { token } = await this.authService.loginWithGoogle(profile);
    this.setAuthCookie(res, token);

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    res.redirect(`${frontendUrl}/profile`);
  }
}
