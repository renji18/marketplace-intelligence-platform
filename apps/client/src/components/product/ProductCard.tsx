import { useCart } from "@/hooks/useCart";
import type { ProductInterface } from "@/interfaces/product.interface";
import Button from "@/ui/Button";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  addToCart,
}: {
  product: ProductInterface;
  addToCart?: boolean;
}) => {
  const navigate = useNavigate();
  const { handleAddToCart } = useCart();

  const image =
    product.productImages?.[0]?.image ?? "https://via.placeholder.com/200";

  const price = product.productPrices?.[0]?.price;

  const openProductPage = () => {
    if (addToCart) {
      navigate("/product/" + product?.id);
    } else {
      navigate("/seller/product/" + product?.id);
    }
  };

  return (
    <div
      onClick={openProductPage}
      className="bg-white border rounded-md shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
    >
      {/* Image */}
      <img
        src={image}
        alt={product.name}
        className="h-20 w-20 rounded-md object-cover border"
      />

      {/* Info */}
      <div className="flex-1">
        <p className="font-medium text-secondary-1">{product.name}</p>

        <p className="text-sm text-gray">
          {product.productCategory?.name ?? "—"}
        </p>

        {price && (
          <p className="text-sm font-semibold text-secondary-1 mt-1">
            ₹{price}
          </p>
        )}

        {product.totalQuantity !== undefined && (
          <p className="text-xs text-gray mt-1">
            Stock: {product.totalQuantity}
            {product.totalOrders !== undefined &&
              ` · Orders: ${product.totalOrders}`}
          </p>
        )}
      </div>

      {/* Optional footer / secondary action */}
      {addToCart && (
        <Button
          text="Add to cart"
          onClick={() => {
            handleAddToCart(product.id);
          }}
          className="flex items-center max-h-fit"
        />
      )}
    </div>
  );
};

export default ProductCard;
