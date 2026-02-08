import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { prisma } from 'src/db/db';
import {
  generateOTP,
  generateTempPassword,
  hashPassword,
  verifyPassword,
} from 'src/utils/password';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from '../interface/payload.interface';
import { EnvConfigService } from 'src/config/env-manager.service';
import { Role } from 'prisma/generated/prisma/enums';
import { EmailService } from 'src/config/email.service';
import { forgotPasswordEmail } from 'src/utils/email/forgot-password.email';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { verifyEmailAccount } from 'src/utils/email/verify.email';
import { sendLoginOtp } from 'src/utils/email/send-otp.email';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterDto) {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true },
    });

    if (user) {
      throw new BadRequestException('User with the given email already exists');
    }

    if (body.role === 'ADMIN') {
      throw new BadRequestException('Cannot register a new Admin');
    }

    const encryptedPassword = await hashPassword(body.password);

    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        role: body.role,
        auth: {
          create: {
            password: encryptedPassword,
          },
        },
        ...(body.role === Role.SELLER
          ? { seller: { create: {} } }
          : { buyer: { create: {} } }),
      },
      select: {
        id: true,
      },
    });

    if (!newUser) {
      throw new InternalServerErrorException(
        'Error registering user, please try again',
      );
    }

    return {
      message: `${body.role === Role.BUYER ? 'Buyer' : 'Seller'} registered successfully`,
    };
  }

  async login(body: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: body.email, auth: { isDeleted: false } },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        auth: { select: { id: true, password: true, verified: true } },
        seller: { select: { id: true } },
        buyer: { select: { id: true } },
        admin: { select: { id: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user?.auth?.verified) {
      const tempPassword = generateTempPassword();

      console.log(tempPassword, 'VERIFY ACCOUNT TEMP PASSWORD');

      await prisma.auth.update({
        where: { userId: user.id },
        data: {
          tempPassword: await hashPassword(tempPassword),
          tempPasswordTimestamp: new Date(
            new Date().getTime() + 60 * 60 * 1000,
          ),
        },
      });

      await this.emailService.sendEmail({
        to: body.email,
        subject: 'Verify your account',
        html: verifyEmailAccount(
          `${this.envService.appOptions.client_url}/reset-password?email=${encodeURIComponent(body.email)}`,
          tempPassword,
        ),
      });

      return {
        message: 'User not verified. Verification email sent successfully!',
        access_token: null,
        refresh_token: null,
      };
    }

    const validpassword = await verifyPassword(
      body?.password,
      user.auth.password,
    );

    if (!validpassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const otp = generateOTP();
    console.log(otp, 'THE OTP');
    const encryptedOtp = await hashPassword(otp);

    await prisma.auth.update({
      where: { id: user.auth.id },
      data: {
        otp: encryptedOtp,
        otpValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await this.emailService.sendEmail({
      to: body.email,
      subject: 'Your One-Time Password (OTP) for Login Verification',
      html: sendLoginOtp(user.firstName, otp),
    });

    const roleId: string =
      user?.admin?.id ?? user?.seller?.id ?? user?.buyer?.id ?? 'NA';

    if (roleId === 'NA') {
      throw new NotFoundException('Unknown user');
    }

    const payload: PayloadInterface = {
      email: user.email,
      userId: user.id,
      roleName: user.role,
      roleId,
      verified: false,
    };

    const tokens = await this._generateTokens(payload);

    return { ...tokens, message: 'OTP sent successfully' };
  }

  async verifyOtp(payload: PayloadInterface, otp: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: payload.userId, auth: { isDeleted: false } },
        select: {
          id: true,
          auth: {
            select: {
              id: true,
              otp: true,
              otpValidUntil: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user?.auth?.otpValidUntil || new Date() > user.auth.otpValidUntil) {
        return { tokens: null, roleName: null };
      }

      const validOtp = await verifyPassword(otp, user.auth.otp);

      if (!validOtp) {
        return { tokens: null, roleName: null };
      }

      await tx.auth.update({
        where: { id: user.auth.id },
        data: {
          otp: null,
          otpValidUntil: null,
        },
      });

      const newPayload: PayloadInterface = {
        email: payload.email,
        userId: payload.userId,
        roleName: payload.roleName,
        roleId: payload.roleId,
        verified: true,
      };

      const tokens = await this._generateTokens(newPayload);

      return { tokens, roleName: payload.roleName };
    });
  }

  async refreshToken(token: string) {
    const payload: PayloadInterface = await this.jwtService.verifyAsync(token, {
      secret: this.envService.refreshTokenOptions.secret,
    });

    if (!payload.verified) {
      throw new ForbiddenException('Please verify yourself first');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, auth: { isDeleted: false } },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete payload['iat'];
    delete payload['exp'];

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.envService.accessTokenOptions.secret,
      expiresIn: this.envService.accessTokenOptions.expiresIn,
    });

    return accessToken;
  }

  async resetPassword(userId: string, body: ResetPasswordDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { auth: { select: { id: true, password: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verifyPassword(
      body.oldPassword,
      user.auth.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return prisma.$transaction(async (tx) => {
      await tx.auth.update({
        where: { id: user.auth.id },
        data: {
          password: await hashPassword(body.newPassword),
        },
      });

      return true;
    });
  }

  async sendForgotPasswordEmail(email: string) {
    if (!email) {
      throw new NotFoundException('Email not provided');
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, auth: { select: { id: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tempPassword = generateTempPassword();

    console.log(tempPassword, 'FORGOT PASSWORD TEMP PASSWORD');

    await prisma.$transaction(async (tx) => {
      await tx.auth.update({
        where: { id: user.auth.id },
        data: {
          tempPassword: await hashPassword(tempPassword),
          tempPasswordTimestamp: new Date(
            new Date().getTime() + 60 * 60 * 1000,
          ),
        },
      });
    });

    await this.emailService.sendEmail({
      to: email,
      subject: `Forgot password for email ${email}`,
      html: forgotPasswordEmail(
        `${this.envService.appOptions.client_url}/reset-password?email=${encodeURIComponent(email)}`,
        tempPassword,
      ),
    });

    return {
      message: 'Forgot Password email sent successfully!',
    };
  }

  async verifyAndReset(body: ResetPasswordDto) {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: {
        auth: {
          select: { id: true, tempPassword: true, tempPasswordTimestamp: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (new Date() >= user?.auth?.tempPasswordTimestamp) {
      throw new UnauthorizedException('OTP expired');
    }

    const isPasswordValid = await verifyPassword(
      body?.oldPassword,
      user?.auth?.tempPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await prisma.auth.update({
      where: { id: user?.auth?.id },
      data: {
        verified: true,
        password: await hashPassword(body.newPassword),
        tempPassword: null,
        tempPasswordTimestamp: new Date(Date.now()),
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }

  // ============================= PRIVATE METHODS =============================

  private async _generateTokens(payload: PayloadInterface) {
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.envService.accessTokenOptions.secret,
        expiresIn: this.envService.accessTokenOptions.expiresIn,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.envService.refreshTokenOptions.secret,
        expiresIn: this.envService.refreshTokenOptions.expiresIn,
      }),
    };
  }
}
