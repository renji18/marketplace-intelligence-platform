import { SetMetadata } from '@nestjs/common';
import { Role } from 'prisma/generated/prisma/enums';

export const ROLES_KEY = 'roles';

export const Admin = () => SetMetadata(ROLES_KEY, [Role.ADMIN]);
export const Seller = () => SetMetadata(ROLES_KEY, [Role.SELLER]);
export const Buyer = () => SetMetadata(ROLES_KEY, [Role.BUYER]);
