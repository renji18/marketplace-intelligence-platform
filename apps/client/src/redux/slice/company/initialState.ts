import type { CompanyInterface } from "@/interfaces/company.interface";

export const initialState: {
  loading: boolean;
  error: string | null;
  message: string | null;
  company?: CompanyInterface;
  companies?: Array<CompanyInterface>;
} = {
  loading: true,
  error: null,
  message: null,
};
