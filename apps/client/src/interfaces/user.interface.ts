import type { ALLOWED_ROLES } from "@/utils/assets";

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  phoneNumber?: string;
  seller?: {
    id: string;
  };
  buyer?: {
    id: string;
  };
  admin?: {
    id: string;
  };
  role: keyof typeof ALLOWED_ROLES;
  createdAt: string;
}
