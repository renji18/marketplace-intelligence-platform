import { Controller, Get, Param, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';
import { Buyer } from 'src/auth/utils/roles.decorator';
import { getPayload } from 'src/utils/get-payload';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Buyer()
  @Get('add/:productId')
  addToCart(@Req() req: Request, @Param('productId') productId: string) {
    return this.cartService.addToCart(getPayload(req).roleId, productId);
  }

  @Buyer()
  @Get('remove/:productId/:quantity')
  removeFromCart(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Param('quantity') quantity: string,
  ) {
    return this.cartService.removeFromCart(
      getPayload(req).roleId,
      productId,
      Number(quantity),
    );
  }

  @Buyer()
  @Get('get')
  getMyCart(@Req() req: Request) {
    return this.cartService.getMyCart(getPayload(req).roleId);
  }
}
