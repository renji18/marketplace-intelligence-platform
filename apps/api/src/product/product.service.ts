import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { prisma } from 'src/db/db';
import { getNewId } from 'src/utils/getNewId';

@Injectable()
export class ProductService {
  async getMyProducts(sellerId: string) {
    const products = await prisma.product.findMany({
      where: { company: { ownerId: sellerId }, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        totalQuantity: true,
        totalViews: true,
        totalCarts: true,
        totalOrders: true,
        productPrices: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            price: true,
            reason: true,
          },
        },
        productImages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            image: true,
          },
        },
        productCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      message: 'Products fetched successfully',
      products,
    };
  }

  async modifyProduct(sellerId: string, body: ProductDto) {
    const company = await prisma.company.findUnique({
      where: { ownerId: sellerId, isDeleted: false },
      select: { id: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    let category = await prisma.productCategory.findUnique({
      where: { name: body.category },
      select: { id: true },
    });

    let productId = '';

    await prisma.$transaction(async (tx) => {
      if (!category) {
        category = await tx.productCategory.create({
          data: { name: body.category },
          select: { id: true },
        });
      }

      const product = await tx.product.upsert({
        where: {
          id: body.id ?? getNewId(),
        },
        update: {
          name: body.name,
          description: body.description,
          productCategoryId: category.id,
          totalQuantity: body.quantity,
        },
        create: {
          name: body.name,
          description: body.description,
          productCategoryId: category.id,
          companyId: company.id,
          totalQuantity: body.quantity,
        },
        select: { id: true },
      });

      productId = product.id;

      // price
      if (body?.price) {
        await tx.productPrice.create({
          data: {
            price: body.price,
            reason: body.priceReason ?? 'New price updated',
            productId,
          },
        });
      }

      // image
      if (body?.image) {
        await tx.productImage.create({
          data: {
            image: `https://picsum.photos/id/${body.image}/200/300`,
            productId,
          },
        });
      }

      // remove product images
      if (body?.removeProductImageIds?.length) {
        await tx.productImage.deleteMany({
          where: { id: { in: body?.removeProductImageIds } },
        });
      }
    });

    return {
      message: 'Product modified successfully',
      productId,
    };
  }

  async getAllCategories() {
    const categories = await prisma.productCategory.findMany({
      select: { id: true, name: true },
    });

    return {
      message: 'Categories fetched successfully',
      categories,
    };
  }

  async getAllProducts() {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        totalQuantity: true,
        productCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        productImages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            image: true,
          },
        },
        productPrices: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            price: true,
            reason: true,
          },
        },
      },
    });

    return {
      message: 'Products fetched successfully',
      products,
    };
  }

  async getSingleProducts(productId: string) {
    const product = await prisma.product.findUnique({
      where: { isDeleted: false, id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        totalQuantity: true,
        productCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        productImages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            image: true,
          },
        },
        productPrices: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            price: true,
            reason: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        totalViews: { increment: 1 },
      },
    });

    return {
      message: 'Products fetched successfully',
      product,
    };
  }
}
