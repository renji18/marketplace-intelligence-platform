import { Global, Module } from '@nestjs/common';
import { EnvConfigService } from './env-manager.service';
import { EmailService } from './email.service';

@Global()
@Module({
  providers: [EnvConfigService, EmailService],
  exports: [EnvConfigService, EmailService],
})
export class GlobalModule {}
