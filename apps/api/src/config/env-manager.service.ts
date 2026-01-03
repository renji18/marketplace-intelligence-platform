import { Injectable } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export default registerAs('env', () => ({
  cookie_secret: process.env.COOKIE_SECRET,

  access_cookie: process.env.JWT_ACCESS_COOKIE,
  refresh_cookie: process.env.JWT_REFRESH_COOKIE,

  access_secret: process.env.JWT_ACCESS_SECRET,
  access_expiry: process.env.JWT_ACCESS_EXPIRY as StringValue,

  refresh_secret: process.env.JWT_REFRESH_SECRET,
  refresh_expiry: process.env.JWT_REFRESH_EXPIRY as StringValue,

  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
}));

@Injectable()
export class EnvConfigService {
  readonly env = this.configService.getOrThrow('env', { infer: true });

  constructor(private readonly configService: ConfigService) {}

  get accessTokenOptions() {
    return {
      secret: this.env.access_secret,
      expiresIn: this.env.access_expiry,
    };
  }

  get refreshTokenOptions() {
    return {
      secret: this.env.refresh_secret,
      expiresIn: this.env.refresh_expiry,
    };
  }

  get cookieOptions() {
    return {
      access_cookie: this.env.access_cookie,
      refresh_cookie: this.env.refresh_cookie,
      cookie_secret: this.env.cookie_secret,
    };
  }

  get appOptions() {
    return {
      port: this.env.port,
      client_url: this.env.client_url,
    };
  }
}
