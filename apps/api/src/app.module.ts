import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { CompanyModule } from './company/company.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import envConfig from './config/env-manager.service';
import { GlobalModule } from './config/global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    GlobalModule,
    AuthModule,
    AdminModule,
    SellerModule,
    BuyerModule,
    CompanyModule,
    ProductModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
