import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
        totalQuantity: true,
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

    if (product.totalQuantity === 0) {
      throw new BadRequestException('Cannot add. Item out of stock');
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

      await tx.product.update({
        where: { id: productId },
        data: {
          totalCarts: { increment: 1 },
          totalQuantity: { decrement: 1 },
        },
      });
    });

    return { message: 'Product added to cart' };
  }

  async removeFromCart(buyerId: string, productId: string, quantity: number) {
    const buyerCart = await prisma.cart.findUnique({
      where: { buyerId, buyer: { user: { auth: { isDeleted: false } } } },
      select: { id: true },
    });

    if (!buyerCart) {
      throw new NotFoundException('Cart not found');
    }

    const itemInCart = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: buyerCart.id,
          productId,
        },
      },
      select: { id: true, quantity: true },
    });

    if (!itemInCart) {
      throw new NotFoundException('Item not in cart');
    }

    if (itemInCart.quantity < quantity) {
      throw new BadRequestException('Not enough quantity in cart');
    }

    await prisma.$transaction(async (tx) => {
      await prisma.product.update({
        where: { id: productId },
        data: {
          totalQuantity: { increment: quantity },
        },
      });

      if (itemInCart.quantity === quantity) {
        await tx.cartItem.delete({ where: { id: itemInCart.id } });
      } else {
        await tx.cartItem.update({
          where: {
            id: itemInCart.id,
          },
          data: {
            quantity: { decrement: 1 },
          },
        });
      }
    });

    return {
      message: 'Item removed from cart',
    };
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
