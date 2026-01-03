import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './utils/auth.guard';
import { RolesGuard } from './utils/roles.guard';
import { EnvConfigService } from 'src/config/env-manager.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [EnvConfigService],
      useFactory: (envConfig: EnvConfigService) => ({
        secret: envConfig.accessTokenOptions.secret,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
