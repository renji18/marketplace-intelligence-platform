export interface CompanyInterface {
  id: string;
  name: string;
  isVerified: boolean;
  isDeleted?: boolean;
  createdAt: string;
  owner?: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}
