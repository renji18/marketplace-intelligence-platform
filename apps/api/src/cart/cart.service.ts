import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from 'src/db/db';

@Injectable()
export class CartService {
  async addToCart(buyerId: string, productId: string) {
    let buyerCart = await prisma.cart.findUnique({
      where: { buyerId, buyer: { user: { auth: { isDeleted: false } } } },
      select: { id: true },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId, isDeleted: false },
      select: {
        id: true,
        productPrices: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            price: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await prisma.$transaction(async (tx) => {
      if (!buyerCart) {
        buyerCart = await tx.cart.create({
          data: {
            buyerId,
          },
          select: {
            id: true,
          },
        });
      }

      await tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: buyerCart.id,
            productId,
          },
        },
        update: {
          cartId: buyerCart.id,
          productId,
          quantity: { increment: 1 },
          price: product?.productPrices?.[0]?.price,
        },
        create: {
          cartId: buyerCart.id,
          productId,
          quantity: 1,
          price: product?.productPrices?.[0]?.price,
        },
      });
    });

    return { message: 'Product added to cart' };
  }

  async getMyCart(buyerId: string) {
    const cart = await prisma.cart.findUnique({
      where: { buyerId, buyer: { user: { auth: { isDeleted: false } } } },
      select: {
        id: true,
        cartItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return {
        message: 'No items in cart',
      };
    }

    return {
      message: 'Cart fetched successfully',
      cart,
    };
  }
}
