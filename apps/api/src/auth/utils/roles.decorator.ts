import { SetMetadata } from '@nestjs/common';

export enum ALLOWED_ROLES {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';

export const Admin = () => SetMetadata(ROLES_KEY, [ALLOWED_ROLES.ADMIN]);
export const Seller = () => SetMetadata(ROLES_KEY, [ALLOWED_ROLES.SELLER]);
export const Buyer = () => SetMetadata(ROLES_KEY, [ALLOWED_ROLES.BUYER]);
