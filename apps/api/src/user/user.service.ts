import { Injectable, NotFoundException } from '@nestjs/common';
import { PayloadInterface } from 'src/interface/payload.interface';
import { prisma } from 'src/db/db';

@Injectable()
export class UserService {
  async getUser(payload: PayloadInterface) {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId, auth: { isDeleted: false } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        phoneNumber: true,
        admin: { select: { id: true } },
        seller: { select: { id: true } },
        buyer: { select: { id: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.admin) delete user.admin;
    if (!user.seller) delete user.seller;
    if (!user.buyer) delete user.buyer;

    return { message: 'User fetched successfully', user };
  }
}
