import { SetMetadata } from '@nestjs/common';

export const ACCESS_WITHOUT_VERIFICATION = 'accessWithoutVerification';
export const AccessWithoutVerification = () =>
  SetMetadata(ACCESS_WITHOUT_VERIFICATION, true);
