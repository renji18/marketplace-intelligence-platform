import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { Public } from './utils/public.decorator';
import { EnvConfigService } from 'src/config/env-manager.service';
import { AccessWithoutVerification } from './utils/access-without-verification.decorator';

@Controller('auth')
export class AuthController {
  private readonly cookies: {
    access_cookie: string;
    refresh_cookie: string;
  };

  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvConfigService,
  ) {
    this.cookies = this.envService.cookieOptions;
  }

  private getCookieOptions() {
    return {
      httpOnly: true,
      signed: true,
      path: '/',
      sameSite: 'none' as const,
      secure: true,
    };
  }

  @Public()
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(body);

    if (!tokens) {
      throw new InternalServerErrorException('Error generating tokens');
    }

    res
      .cookie(
        this.cookies.access_cookie,
        tokens.access_token,
        this.getCookieOptions(),
      )
      .cookie(
        this.cookies.refresh_cookie,
        tokens.refresh_token,
        this.getCookieOptions(),
      )
      .status(200)
      .json({ message: 'OTP sent successfully' });
  }

  @AccessWithoutVerification()
  @Post('verify-otp')
  async verifyOtp(
    @Req() req: Request,
    @Body() body: { otp: string },
    @Res() res: Response,
  ) {
    const tokens = await this.authService.verifyOtp(req['user'], body.otp);

    if (tokens) {
      res
        .cookie(
          this.cookies.access_cookie,
          tokens.access_token,
          this.getCookieOptions(),
        )
        .cookie(
          this.cookies.refresh_cookie,
          tokens.refresh_token,
          this.getCookieOptions(),
        )
        .status(200)
        .json({ message: 'Logged in successfully' });
    } else {
      res
        .clearCookie(this.cookies.access_cookie, this.getCookieOptions())
        .clearCookie(this.cookies.refresh_cookie, this.getCookieOptions())
        .status(400)
        .json({ message: 'Invalid or Expired OTP. Login again.' });
    }
  }

  @Public()
  @Get('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.signedCookies[this.cookies.refresh_cookie];

    if (!refreshToken) {
      throw new NotFoundException('Refresh token missing');
    }

    const accessToken = await this.authService.refreshToken(refreshToken);

    res
      .cookie(this.cookies.access_cookie, accessToken, this.getCookieOptions())
      .status(200)
      .json({
        message: 'Token refreshed',
      });
  }

  @AccessWithoutVerification()
  @Get('logout')
  async logout(@Res() res: Response) {
    res
      .clearCookie(this.cookies.access_cookie, this.getCookieOptions())
      .clearCookie(this.cookies.refresh_cookie, this.getCookieOptions())
      .status(200)
      .json({ message: 'Logged out successfully' });
  }
}
