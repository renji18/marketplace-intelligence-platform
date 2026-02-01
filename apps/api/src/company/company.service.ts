import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from 'src/db/db';

@Injectable()
export class CompanyService {
  async getMyCompany(sellerId: string) {
    const company = await prisma.company.findUnique({
      where: { ownerId: sellerId, isDeleted: false },
      select: {
        id: true,
        name: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Company for seller not found');
    }

    return {
      message: 'Company found successfully',
      company,
    };
  }

  async createCompany(sellerId: string, companyName: string) {
    if (!companyName) {
      throw new BadRequestException('Company name not provided');
    }

    const company = await prisma.company.upsert({
      where: {
        ownerId: sellerId,
      },
      update: {
        name: companyName,
        isDeleted: false,
        deletedAt: null,
      },
      create: {
        name: companyName,
        ownerId: sellerId,
      },
      select: { id: true },
    });

    return {
      message: 'Company created successfully',
      companyId: company.id,
    };
  }

  async getAllCompanies() {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        isVerified: true,
        isDeleted: true,
        createdAt: true,
        deletedAt: true,
        owner: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      message: 'Companies fetched successfully',
      companies,
    };
  }
}
