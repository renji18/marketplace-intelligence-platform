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

  useEffect(() => {
    if (product && isEdit) {
      setForm({
        name: product.name,
        description: product.description,
        quantity: product.totalQuantity,
        price: Number(product.productPrices?.[0]?.price),
        priceReason: product.productPrices?.[0]?.reason ?? "",
        category: product.productCategory?.name ?? "",
        image: product.productImages?.[0]?.image ?? "",
      });
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
