import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import Button from "@/ui/Button";
import { useDispatch } from "react-redux";
import { type MyDispatch } from "@/redux/store";
import { verifyAndReset } from "@/redux/slice/auth/asyncFn";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<MyDispatch>();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const email = params.get("email") ?? "";

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isValid =
    form.oldPassword &&
    form.newPassword &&
    form.confirmPassword &&
    form.newPassword === form.confirmPassword;

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-1">
            Reset password
          </h1>
          <p className="text-sm text-gray mt-1">
            Enter the details sent to your email
          </p>
        </div>

        <AuthInput
          id="tempPassword"
          label="Temporary password"
          placeholder="Enter temp password"
          value={form.oldPassword}
          inputType="text"
          setData={(v) => setForm((p) => ({ ...p, oldPassword: v }))}
        />

        <AuthInput
          id="newPassword"
          label="New password"
          placeholder="••••••••"
          value={form.newPassword}
          inputType="password"
          setData={(v) => setForm((p) => ({ ...p, newPassword: v }))}
        />

        <AuthInput
          id="confirmPassword"
          label="Confirm new password"
          placeholder="••••••••"
          value={form.confirmPassword}
          inputType="password"
          setData={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
        />

        <Button
          text="Reset password"
          className="w-full"
          disabled={!isValid}
          onClick={() => {
            dispatch(verifyAndReset({ ...form, email, navigate }));
          }}
        />
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
