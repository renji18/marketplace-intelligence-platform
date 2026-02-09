import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MySelector, type MyDispatch } from "@/redux/store";
import { getSingleProduct } from "@/redux/slice/product/asyncFn";
import Button from "@/ui/Button";
import type { ProductInterface } from "@/interfaces/product.interface";
import { SELLER } from "@/utils/assets";
import { setProduct } from "@/redux/slice/product";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();
  const { handleAddToCart } = useCart();

  const { product, products } = MySelector((state) => state.product);
  const { user } = MySelector((state) => state.auth);
  const { itemToCartId } = MySelector((state) => state.cart);

  const [productData, setProductData] = useState<ProductInterface>();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (itemToCartId && user && user?.buyer) handleAddToCart(itemToCartId);
  }, [itemToCartId, handleAddToCart, user]);

  useEffect(() => {
    if (!productId) return;

    if (product) {
      setProductData(product);
    } else if (!product && products?.length) {
      const findProduct = products?.find((p) => p.id === productId);
      if (findProduct) {
        setProductData(findProduct);
      } else {
        dispatch(getSingleProduct(productId));
      }
    } else {
      dispatch(getSingleProduct(productId));
    }
  }, [productId, dispatch, product, products]);

  useEffect(() => {
    if (productData?.productImages?.length) {
      setActiveImage(productData.productImages[0].image);
    }
  }, [productData]);

  if (!productData) {
    return <p className="text-gray">Loading product…</p>;
  }

  const prices = productData.productPrices ?? [];

  const currentPrice = prices[0]?.price;
  const previousPrice = prices[1]?.price;

  const priceTrend =
    currentPrice && previousPrice
      ? Number(currentPrice) - Number(previousPrice)
      : 0;

  const isSeller = user?.role === SELLER;

  return (
    <div className="max-w-5xl space-y-8">
      {isSeller && (
        <Button
          text="Edit product"
          size="sm"
          onClick={() => {
            dispatch(setProduct(productData));
            navigate("/seller/product/upsert");
          }}
          className="absolute right-10"
        />
      )}

      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white border rounded-md p-4 space-y-4">
          {/* Poster image */}
          <img
            src={activeImage ?? ""}
            alt={productData.name}
            className="w-full h-80 object-contain rounded-md"
          />

          {/* Thumbnails */}
          {productData?.productImages &&
            productData?.productImages?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {productData.productImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image)}
                    className={`h-16 w-16 rounded-md border overflow-hidden ${
                      activeImage === img.image
                        ? "ring-2 ring-primary-1"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt="Product thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-secondary-1">
            {productData?.name}
          </h1>

          {currentPrice && (
            <p className="text-xl font-bold text-secondary-1">
              ₹{currentPrice}
            </p>
          )}

          <p className="text-sm text-gray">
            Category: {productData?.productCategory?.name ?? "—"}
          </p>

          <p className="text-sm text-gray">
            Stock: {productData?.totalQuantity}
          </p>

          {/* Actions */}
          <div className="pt-4">
            {!isSeller && (
              <Button
                text="Add to cart"
                disabled={productData?.totalQuantity === 0}
                onClick={() => {
                  handleAddToCart(productData.id);
                }}
              />
            )}
          </div>

          {/* Stats (seller-facing but harmless for buyers) */}
          {isSeller && (
            <div className="flex gap-6 text-xs text-gray pt-2">
              <span>Views: {productData?.totalViews}</span>
              <span>Orders: {productData?.totalOrders}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-sm font-medium text-secondary-1 mb-2">
          Description
        </h2>
        <p className="text-sm text-gray whitespace-pre-line">
          {productData?.description || "No description provided."}
        </p>
      </div>

      {/* Price history */}
      {isSeller && prices.length > 0 && (
        <div className="bg-white border rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-secondary-1">
              Price history
            </h2>

            {priceTrend !== 0 && (
              <span
                className={`text-xs font-medium ${
                  priceTrend > 0 ? "text-success" : "text-error"
                }`}
              >
                {priceTrend > 0 ? "▲ Increased" : "▼ Decreased"} by ₹
                {Math.abs(priceTrend)?.toFixed(3)}
              </span>
            )}
          </div>

          <div className="divide-y">
            {prices?.map((p, index) => (
              <div key={p.id} className="flex items-start justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-secondary-1">
                    ₹{p.price}
                    {index === 0 && (
                      <span className="ml-2 text-xs text-success">
                        (Current)
                      </span>
                    )}
                  </p>

                  {p.reason && (
                    <p className="text-xs text-gray mt-0.5">
                      Reason: {p.reason}
                    </p>
                  )}
                </div>

                {p.createdAt && (
                  <p className="text-xs text-gray">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
