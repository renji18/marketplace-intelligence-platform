import { Controller, Get, Param, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Buyer, Seller } from 'src/auth/utils/roles.decorator';
import { Request } from 'express';
import { getPayload } from 'src/utils/get-payload';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Buyer()
  @Get('place/:addressId')
  placeOrder(@Req() req: Request, @Param('addressId') addressId: string) {
    return this.orderService.placeOrder(getPayload(req).roleId, addressId);
  }

  @Buyer()
  @Get('get/buyer')
  getMyOrders(@Req() req: Request) {
    return this.orderService.getMyOrders(getPayload(req).roleId);
  }

  @Buyer()
  @Get('cancel/:orderId')
  cancelOrder(@Req() req: Request, @Param('orderId') orderId: string) {
    return this.orderService.cancelOrder(getPayload(req).roleId, orderId);
  }

  @Seller()
  @Get('deliver/:orderId')
  deliverOrder(@Req() req: Request, @Param('orderId') orderId: string) {
    return this.orderService.deliverOrder(orderId);
  }

  @Seller()
  @Get('get/seller')
  getCompanyOrders(@Req() req: Request) {
    return this.orderService.getCompanyOrders(getPayload(req).roleId);
  }
}
