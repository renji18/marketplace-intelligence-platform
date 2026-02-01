import type { UserRole } from "@/types/role.type";

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  phoneNumber?: string;
  seller?: {
    id: string;
    company?: {
      id: string;
      name: string;
      isVerified: boolean;
      createdAt: string;
    };
  };
  buyer?: {
    id: string;
  };
  admin?: {
    id: string;
  };
  role: UserRole;
}
