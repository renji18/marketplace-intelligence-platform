import type { CompanyInterface } from "@/interfaces/company.interface";

export const initialState: {
  bootstrap: boolean;
  error: string | null;
  loading: boolean;
  message: string | null;
  company?: CompanyInterface;
  companies?: Array<CompanyInterface>;
} = {
  bootstrap: true,
  loading: true,
  error: null,
  message: null,
};
