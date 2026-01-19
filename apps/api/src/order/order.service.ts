import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from 'src/db/db';

@Injectable()
export class OrderService {
  async placeOrder(buyerId: string, addressId: string) {
    const cart = await prisma.cart.findUnique({
      where: { buyerId, buyer: { user: { auth: { isDeleted: false } } } },
      select: {
        id: true,
        cartItems: {
          select: {
            id: true,
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (!cart.cartItems.length) {
      throw new NotFoundException('No items in cart');
    }

    let orderId: string = '';

    await prisma.$transaction(async (tx) => {
      const orderTotal = cart.cartItems.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
      }, 0);

      const order = await tx.order.create({
        data: {
          buyerId,
          addressId,
          totalPrice: orderTotal,
        },
        select: { id: true },
      });

      orderId = order.id;

      await tx.orderItem.createMany({
        data: cart.cartItems.map((c) => ({
          quantity: c.quantity,
          price: c.price,
          orderId: order.id,
          productId: c.productId,
        })),
      });

      await tx.cart.delete({ where: { id: cart.id } });
      await tx.cart.create({ data: { buyerId, id: cart.id } });
    });

    return {
      message: 'Order created successfully',
      orderId,
    };
  }

  async getMyOrders(buyerId: string) {
    const orders = await prisma.order.findMany({
      where: { buyerId, buyer: { user: { auth: { isDeleted: false } } } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalPrice: true,
        status: true,
        address: {
          select: {
            id: true,
            addressLine: true,
            city: true,
            state: true,
            country: true,
            pincode: true,
          },
        },
        orderItems: {
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

    return {
      message: 'Orders fetched successfully',
      orders,
    };
  }

  async cancelOrder(buyerId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId, buyerId },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PLACED') {
      throw new BadRequestException(
        'Cannot cancel a delivered or cancelled order',
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    return {
      message: 'Order cancelled successfully',
    };
  }

  async deliverOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PLACED') {
      throw new BadRequestException(
        'Cannot deliver a delivered or cancelled order',
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' },
    });

    return {
      message: 'Order delivered successfully',
    };
  }

  async getCompanyOrders(sellerId: string) {
    const orders = await prisma.order.findMany({
      where: {
        orderItems: { every: { product: { company: { ownerId: sellerId } } } },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalPrice: true,
        status: true,
        address: {
          select: {
            id: true,
            addressLine: true,
            city: true,
            state: true,
            country: true,
            pincode: true,
          },
        },
        orderItems: {
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

    if (!orders) {
      throw new NotFoundException('Orders not found');
    }

    return {
      message: 'Orders fetched successfully',
      orders,
    };
  }
}
