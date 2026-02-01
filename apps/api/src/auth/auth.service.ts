import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { prisma } from 'src/db/db';
import { generateOTP, hashPassword, verifyPassword } from 'src/utils/password';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from '../interface/payload.interface';
import { EnvConfigService } from 'src/config/env-manager.service';
import { Role } from 'prisma/generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvConfigService,
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
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: body.email, auth: { isDeleted: false } },
        select: {
          id: true,
          email: true,
          role: true,
          auth: { select: { id: true, password: true } },
          seller: { select: { id: true } },
          buyer: { select: { id: true } },
          admin: { select: { id: true } },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
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

      await tx.auth.update({
        where: { id: user.auth.id },
        data: {
          otp: encryptedOtp,
          otpValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        },
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

      return tokens;
    });
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
