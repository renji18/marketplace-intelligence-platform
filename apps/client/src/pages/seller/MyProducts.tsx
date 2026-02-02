import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MySelector, type MyDispatch } from "@/redux/store";
import Button from "@/ui/Button";
import ProductCard from "@/components/product/ProductCard";
import { useNavigate } from "react-router-dom";
import { getSellerProducts } from "@/redux/slice/product/asyncFn";

const MyProducts = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();
  const { products, loading } = MySelector((state) => state.product);

  useEffect(() => {
    dispatch(getSellerProducts());
  }, [dispatch]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-1">
            My Products
          </h1>
          <p className="text-sm text-gray">Manage your product listings</p>
        </div>

        <Button
          text="Add product"
          size="sm"
          onClick={() => navigate("/seller/product/upsert")}
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading && <p className="text-gray">Loading…</p>}

        {!loading && products?.length === 0 && (
          <p className="text-gray">You haven’t added any products yet.</p>
        )}

        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
