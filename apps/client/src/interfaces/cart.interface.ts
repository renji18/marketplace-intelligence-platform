interface CartItemInterface {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    productImages: Array<{ image: string }>;
  };
}

export interface CartInterface {
  id: string;
  cartItems: Array<CartItemInterface>;
}
