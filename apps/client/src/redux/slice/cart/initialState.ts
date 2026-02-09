import type { CartInterface } from "@/interfaces/cart.interface";

export const initialState: {
  error: string | null;
  loading: boolean;
  message: string | null;
  cart?: CartInterface;
  itemToCartId?: string;
} = {
  loading: true,
  error: null,
  message: null,
};
