import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto, Roles } from './dto/register.dto';
import { prisma } from 'src/config/db';
import { generateOTP, hashPassword, verifyPassword } from 'src/utils/password';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { envData } from 'src/utils/env.manager';
import { ALLOWED_ROLES } from './utils/roles.decorator';
import { PayloadInterface } from './utils/payload';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  register = async (body: RegisterDto) => {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true },
    });

    if (user) {
      throw new BadRequestException('User with the given email already exists');
    }

    const encryptedPassword = await hashPassword(body.password);

    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        auth: {
          create: {
            password: encryptedPassword,
          },
        },
        ...(body.role === Roles.seller
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
      message: `${body.role === Roles.buyer ? 'Buyer' : 'Seller'} registered successfully`,
    };
  };

  login = async (body: LoginDto) => {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: body.email },
        select: {
          id: true,
          email: true,
          auth: { select: { isDeleted: true, id: true, password: true } },
          seller: { select: { id: true } },
          buyer: { select: { id: true } },
          admin: { select: { id: true } },
        },
      });

      if (!user || user?.auth?.isDeleted) {
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

      const role: ALLOWED_ROLES | 'NA' = user?.admin?.id
        ? ALLOWED_ROLES.ADMIN
        : user?.seller?.id
          ? ALLOWED_ROLES.SELLER
          : user?.buyer?.id
            ? ALLOWED_ROLES.BUYER
            : 'NA';

      if (role === 'NA') {
        throw new NotFoundException('Unknown user');
      }

      const payload: PayloadInterface = {
        email: user.email,
        userId: user.id,
        role,
        verified: false,
      };

      const tokens = await this._generateTokens(payload);

      return tokens;
    });
  };

  verifyOtp = async (payload: PayloadInterface, otp: string) => {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          auth: {
            select: {
              id: true,
              isDeleted: true,
              otp: true,
              otpValidUntil: true,
            },
          },
        },
      });

      if (!user || user?.auth?.isDeleted) {
        throw new NotFoundException('User not found');
      }

      if (!user?.auth?.otpValidUntil || new Date() > user.auth.otpValidUntil) {
        return false;
      }

      const validOtp = await verifyPassword(otp, user.auth.otp);

      if (!validOtp) {
        return false;
      }

      await tx.auth.update({
        where: { id: user.auth.id },
        data: {
          otp: null,
          otpValidUntil: null,
        },
      });

      return true;
    });
  };

  // ============================= PRIVATE METHODS =============================

  private _generateTokens = async (payload: PayloadInterface) => {
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: envData().access_secret,
        expiresIn: envData().access_expiry,
      }),
    };
  };
}
