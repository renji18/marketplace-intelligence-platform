import type { ProductInterface } from "@/interfaces/product.interface";

export const initialState: {
  error: string | null;
  loading: boolean;
  message: string | null;
  product?: ProductInterface;
  products?: Array<ProductInterface>;
} = {
  loading: true,
  error: null,
  message: null,
};
