import { setBuyerNavigateToLink } from "@/redux/slice/auth";
import { setItemToCartId } from "@/redux/slice/cart";
import { addToCart, removeFromCart } from "@/redux/slice/cart/asyncFn";
import { type MyDispatch, MySelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useCart() {
  const navigate = useNavigate();
  const dispatch = useDispatch<MyDispatch>();
  const { user } = MySelector((state) => state.auth);

  const handleAddToCart = (productId: string) => {
    dispatch(setItemToCartId(productId));

    if (!user || !user?.buyer) {
      dispatch(setBuyerNavigateToLink(`/product/${productId}`));
      navigate("/login");
      return;
    }

    dispatch(addToCart(productId));
    dispatch(setItemToCartId(undefined));
  };

  const handleRemoveFromCart = (productId: string, quantity: number = 1) => {
    dispatch(removeFromCart({ productId, quantity }));
  };

  return { handleAddToCart, handleRemoveFromCart };
}
