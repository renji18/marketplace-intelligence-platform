import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MySelector, type MyDispatch } from "@/redux/store";
import { getAllProducts } from "@/redux/slice/product/asyncFn";
import ProductCard from "@/components/product/ProductCard";

const Products = () => {
  const dispatch = useDispatch<MyDispatch>();

  const { products, loading } = MySelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold text-secondary-1">Products</h1>

      {loading && <p className="text-gray">Loading products…</p>}

      {!loading && products?.length === 0 && (
        <p className="text-gray">No products available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} addToCart />
        ))}
      </div>
    </div>
  );
};

export default Products;
