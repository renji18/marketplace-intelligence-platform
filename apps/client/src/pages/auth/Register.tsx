import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import Button from "@/ui/Button";
import { useDispatch } from "react-redux";
import { type MyDispatch } from "@/redux/store";
import { registerUser } from "@/redux/slice/auth/asyncFn";
import { BUYER, SELLER } from "@/utils/assets";

const Register = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: typeof BUYER | typeof SELLER;
    phoneNumber?: string;
    password: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    role: "BUYER",
    phoneNumber: "",
    password: "",
  });

  const isValid =
    form.firstName && form.lastName && form.email && form.password && form.role;

  return (
    <AuthLayout>
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-1">
            Create an account
          </h1>
          <p className="text-sm text-gray mt-1">
            Sign up to start using the platform
          </p>
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            id="firstName"
            label="First name"
            placeholder="Ananya"
            value={form.firstName}
            setData={(v) => setForm((p) => ({ ...p, firstName: v }))}
          />
          <AuthInput
            id="lastName"
            label="Last name"
            placeholder="Sharma"
            value={form.lastName}
            setData={(v) => setForm((p) => ({ ...p, lastName: v }))}
          />
        </div>

        {/* Email */}
        <AuthInput
          id="email"
          label="Email"
          placeholder="ananya.sharma@example.com"
          value={form.email}
          inputType="email"
          setData={(v) => setForm((p) => ({ ...p, email: v }))}
        />

        {/* Role */}
        <div>
          <label className="text-gray text-sm">Register as</label>
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, role: BUYER }))}
              className={`flex-1 border rounded-md py-2 text-sm ${
                form.role === BUYER
                  ? "border-primary-1 bg-accent text-secondary-1"
                  : "border-gray-300 text-gray"
              }`}
            >
              Buyer
            </button>

            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, role: SELLER }))}
              className={`flex-1 border rounded-md py-2 text-sm ${
                form.role === SELLER
                  ? "border-primary-1 bg-accent text-secondary-1"
                  : "border-gray-300 text-gray"
              }`}
            >
              Seller
            </button>
          </div>
        </div>

        {/* Phone (optional) */}
        <AuthInput
          id="phone"
          label="Phone number (optional)"
          placeholder="+91 9123456789"
          value={form?.phoneNumber ?? ""}
          setData={(v) => setForm((p) => ({ ...p, phoneNumber: v }))}
        />

        {/* Password */}
        <AuthInput
          id="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          inputType="password"
          setData={(v) => setForm((p) => ({ ...p, password: v }))}
        />

        {/* Submit */}
        <Button
          text="Create account"
          className="w-full"
          disabled={!isValid}
          onClick={() => {
            dispatch(
              registerUser({
                navigate,
                ...form,
              }),
            );
          }}
        />

        {/* Footer */}
        <p className="text-sm text-center text-gray">
          Already have an account?{" "}
          <span
            className="text-secondary-1 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
