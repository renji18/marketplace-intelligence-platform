import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CompanyModule } from './company/company.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import envConfig from './config/env-manager.service';
import { GlobalModule } from './config/global.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    GlobalModule,
    AuthModule,
    AdminModule,
    CompanyModule,
    ProductModule,
    UserModule,
    CartModule,
    OrderModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
