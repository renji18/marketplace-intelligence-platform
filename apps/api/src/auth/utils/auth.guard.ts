import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { EnvConfigService } from 'src/config/env-manager.service';
import { PayloadInterface } from 'src/interface/payload.interface';
import { ACCESS_WITHOUT_VERIFICATION } from './access-without-verification.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly envService: EnvConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(
      request,
      this.envService.cookieOptions.access_cookie,
    );

    if (!token) {
      throw new UnauthorizedException('Not logged in');
    }

    const accessWithoutVerification = this.reflector.getAllAndOverride<boolean>(
      ACCESS_WITHOUT_VERIFICATION,
      [context.getHandler(), context.getClass()],
    );

    try {
      const payload: PayloadInterface =
        await this.jwtService.verifyAsync(token);

      if (!accessWithoutVerification) {
        if (!payload.verified) {
          throw new UnauthorizedException('Please verify yourself first');
        }
      }

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(
    request: Request,
    access_cookie: string,
  ): string | undefined {
    return request.signedCookies?.[access_cookie];
  }
}
