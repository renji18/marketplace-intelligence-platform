import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { envData } from 'src/utils/env.manager';
import { Public } from './utils/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Token max age set to 30 days
  private readonly TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

  private getCookieOptions() {
    return {
      httpOnly: true,
      signed: true,
      path: '/',
      maxAge: this.TOKEN_MAX_AGE,
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
        envData().access_cookie,
        tokens.access_token,
        this.getCookieOptions(),
      )
      .status(200)
      .json({ message: 'OTP sent successfully' });
  }

  @Post('verify-otp')
  async verifyOtp(
    @Req() req: Request,
    @Body() body: { otp: string },
    @Res() res: Response,
  ) {
    const verified = await this.authService.verifyOtp(req['user'], body.otp);

    if (verified) {
      res.json({ message: 'Logged in successfully' });
    } else {
      res
        .clearCookie(envData().access_cookie, this.getCookieOptions())
        .status(400)
        .json({ message: 'Invalid or Expired OTP. Login again.' });
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res
      .clearCookie(envData().access_cookie, this.getCookieOptions())
      .status(200)
      .json({ message: 'Logged out successfully' });
  }
}
