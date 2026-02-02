export interface ProductInterface {
  id: string;
  name: string;
  description?: string;
  totalQuantity: number;
  totalViews: number;
  totalCarts: number;
  totalOrders: number;
  productPrices: Array<{
    id: string;
    price: string;
    reason?: string;
  }>;
  productImages?: Array<{
    id: string;
    image: string;
  }>;
  productCategory: {
    id: string;
    name: string;
  };
}
