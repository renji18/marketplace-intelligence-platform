import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MySelector, type MyDispatch } from "@/redux/store";
import { getSingleProduct } from "@/redux/slice/product/asyncFn";
import Button from "@/ui/Button";
import type { ProductInterface } from "@/interfaces/product.interface";
import { SELLER } from "@/utils/assets";
import { setProduct } from "@/redux/slice/product";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const { product, products } = MySelector((state) => state.product);
  const { user } = MySelector((state) => state.auth);

  const [productData, setProductData] = useState<ProductInterface>();
  const [activeImage, setActiveImage] = useState<string | null>(null);

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

  const price = productData?.productPrices?.[0]?.price;

  const isSeller = user?.role === SELLER;

  return (
    <div className="max-w-5xl space-y-8">
      <Button
        text="Edit product"
        size="sm"
        onClick={() => {
          dispatch(setProduct(productData));
          navigate("/seller/product/upsert");
        }}
        className="absolute right-10"
      />

      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white border rounded-md p-4 space-y-4">
          {/* Poster image */}
          <img
            src={activeImage ?? ""}
            alt={productData.name}
            className="w-full h-80 object-cover rounded-md"
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

          {price && (
            <p className="text-xl font-bold text-secondary-1">₹{price}</p>
          )}

          <p className="text-sm text-gray">
            Category: {productData?.productCategory?.name ?? "—"}
          </p>

          <p className="text-sm text-gray">
            Stock: {productData?.totalQuantity}
          </p>

          {/* Actions */}
          <div className="pt-4">
            {isSeller ? (
              <Button
                text="Edit product"
                variant="secondary"
                onClick={() => {
                  // navigate to edit page
                }}
              />
            ) : (
              <Button
                text="Add to cart"
                disabled={productData?.totalQuantity === 0}
                onClick={() => {
                  // add to cart
                }}
              />
            )}
          </div>

          {/* Stats (seller-facing but harmless for buyers) */}
          <div className="flex gap-6 text-xs text-gray pt-2">
            <span>Views: {productData?.totalViews}</span>
            <span>Orders: {productData?.totalOrders}</span>
          </div>
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
    </div>
  );
};

export default ProductDetail;
