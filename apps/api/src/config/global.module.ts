import { Global, Module } from '@nestjs/common';
import { EnvConfigService } from './env-manager.service';

@Global()
@Module({
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class GlobalModule {}
