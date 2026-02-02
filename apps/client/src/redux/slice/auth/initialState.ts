import type { UserInterface } from "@/interfaces/user.interface";

export const initialState: {
  bootstrap: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
  user?: UserInterface;
} = {
  bootstrap: true,
  loading: true,
  error: null,
  message: null,
};
