import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/ui/Button";
import { useDispatch } from "react-redux";
import { type MyDispatch, MySelector } from "@/redux/store";
import FormInput from "@/components/product/FormInput";
import { upsertProduct } from "@/redux/slice/product/asyncFn";

const UpsertProduct = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const { product } = MySelector((state) => state.product);

  const isEdit = Boolean(product?.id);

  const [form, setForm] = useState<{
    name: string;
    description?: string;
    quantity: number;
    price: number;
    priceReason?: string;
    category: string;
    image?: string | number;
  }>({
    name: "",
    quantity: 0,
    price: 0,
    category: "",
  });
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [removeProductImageIds, setRemoveProductImageIds] = useState<string[]>(
    [],
  );

  useEffect(() => {
    if (product && isEdit) {
      setForm({
        name: product.name,
        description: product.description,
        quantity: product.totalQuantity,
        price: Number(product.productPrices?.[0]?.price),
        priceReason: product.productPrices?.[0]?.reason ?? "",
        category: product.productCategory?.name ?? "",
        image: product.productImages?.[0]?.id ?? "",
      });

      if (product.productImages?.length) {
        setActiveImage(product.productImages[0].image);
      }
    }
  }, [product, isEdit]);

  const handleSubmit = () => {
    dispatch(
      upsertProduct({
        product: {
          ...(isEdit && { id: product?.id }),
          ...form,
          image: Number(form.image),
        },
        navigate,
      }),
    );
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-secondary-1">
        {isEdit ? "Edit product" : "Create product"}
      </h1>

      {isEdit &&
        product?.productImages &&
        product?.productImages?.length > 0 && (
          <div className="bg-white border rounded-md p-4 space-y-4">
            {/* Poster */}
            <img
              src={activeImage ?? ""}
              alt="Product"
              className="w-full h-64 object-cover rounded-md"
            />

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
              {product.productImages.map((img) => {
                const markedForRemoval = removeProductImageIds.includes(img.id);

                return (
                  <div
                    key={img.id}
                    className={`relative h-16 w-16 rounded-md border overflow-hidden ${
                      markedForRemoval
                        ? "opacity-40"
                        : activeImage === img.image
                          ? "ring-2 ring-primary-1"
                          : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveImage(img.image)}
                      className="h-full w-full"
                    >
                      <img
                        src={img.image}
                        alt="thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </button>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() =>
                        setRemoveProductImageIds((prev) =>
                          prev.includes(img.id)
                            ? prev.filter((id) => id !== img.id)
                            : [...prev, img.id],
                        )
                      }
                      className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            {removeProductImageIds.length > 0 && (
              <p className="text-xs text-gray">
                {removeProductImageIds.length} image(s) will be removed on save
              </p>
            )}
          </div>
        )}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <FormInput
          label="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <FormInput
          label="Description"
          value={form.description ?? ""}
          onChange={(v) => setForm({ ...form, description: v })}
        />
        <FormInput
          label="Quantity"
          type="number"
          value={form.quantity}
          onChange={(v) => setForm({ ...form, quantity: Number(v) })}
        />
        <FormInput
          label="Price"
          type="number"
          value={form.price}
          onChange={(v) => setForm({ ...form, price: Number(v) })}
        />
        <FormInput
          label="Price reason"
          value={form.priceReason ?? ""}
          onChange={(v) => setForm({ ...form, priceReason: v })}
        />
        <FormInput
          label="Image"
          type="number"
          value={form.image ?? ""}
          onChange={(v) => setForm({ ...form, image: Number(v) })}
        />
        <FormInput
          label="Category"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
        />
      </div>

      <Button
        text={isEdit ? "Update product" : "Create product"}
        onClick={handleSubmit}
      />
    </div>
  );
};

export default UpsertProduct;
