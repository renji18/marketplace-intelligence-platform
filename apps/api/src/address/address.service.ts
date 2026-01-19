import { Injectable, NotFoundException } from '@nestjs/common';
import { AddAddressDto } from './dto/add-address.dto';
import { prisma } from 'src/db/db';
import { getNewId } from 'src/utils/getNewId';

@Injectable()
export class AddressService {
  async modifyAddress(buyerId: string, body: AddAddressDto) {
    const buyer = await prisma.buyer.findUnique({
      where: { id: buyerId, user: { auth: { isDeleted: false } } },
      select: { id: true },
    });

    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    const address = await prisma.address.upsert({
      where: {
        id: body?.id ?? getNewId(),
      },
      update: {
        ...body,
        buyerId,
      },
      create: {
        ...body,
        buyerId,
      },
      select: {
        id: true,
      },
    });

    return {
      message: 'Modify address',
      addressId: address.id,
    };
  }

  async getMyAddresses(buyerId: string) {
    const address = await prisma.address.findMany({
      where: { buyerId, buyer: { user: { auth: { isDeleted: false } } } },
      select: {
        id: true,
        addressLine: true,
        city: true,
        state: true,
        country: true,
        pincode: true,
      },
    });

    return {
      message: 'Addresses fetched successfully',
      address,
    };
  }

  async deleteAddress(buyerId: string, addressId: string) {
    await prisma.address.delete({ where: { id: addressId, buyerId } });

    return {
      message: 'Address deleted successfully',
    };
  }
}
