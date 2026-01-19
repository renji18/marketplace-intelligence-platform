import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Seller } from 'src/auth/utils/roles.decorator';
import { Request } from 'express';
import { getPayload } from 'src/utils/get-payload';
import { ProductDto } from './dto/product.dto';
import { Public } from 'src/auth/utils/public.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Seller()
  @Get('my')
  getMyProducts(@Req() req: Request) {
    return this.productService.getMyProducts(getPayload(req).roleId);
  }

  @Seller()
  @Post('modify')
  modifyProduct(@Req() req: Request, @Body() body: ProductDto) {
    return this.productService.modifyProduct(getPayload(req).roleId, body);
  }

  @Seller()
  @Delete('image/:productImageId')
  removeProductImage(
    @Req() req: Request,
    @Param('productImageId') productImageId: string,
  ) {
    return this.productService.removeProductImage(
      getPayload(req).roleId,
      productImageId,
    );
  }

  @Public()
  @Get('categories')
  getAllCategories() {
    return this.productService.getAllCategories();
  }

  @Public()
  @Get('all')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Public()
  @Get(':productId')
  getSingleProducts(@Param('productId') productId: string) {
    return this.productService.getSingleProducts(productId);
  }
}
