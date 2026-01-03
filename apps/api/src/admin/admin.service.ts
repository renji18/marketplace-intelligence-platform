import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create.admin.dto';
import { prisma } from 'src/db/db';
import { hashPassword } from 'src/utils/password';

@Injectable()
export class AdminService {
  createAdmin = async (body: CreateAdminDto) => {
    return { message: 'CHECK SERVICE FILE' };

    const admin = await prisma.admin.findFirst({
      where: { user: { email: body.email } },
      select: { id: true },
    });

    if (admin) {
      throw new ConflictException('Admin already exists');
    }

    const plainPassword = 'Secure@123';
    const encryptedPassword = await hashPassword(plainPassword);

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        auth: {
          create: {
            password: encryptedPassword,
          },
        },
        admin: {
          create: {},
        },
      },
      select: { id: true },
    });

    if (!user) {
      throw new InternalServerErrorException('Error creating admin');
    }

    return { message: 'Admin created successfully' };
  };
}
