import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import Button from "@/ui/Button";
import { useDispatch } from "react-redux";
import { type MyDispatch } from "@/redux/store";
import { sendForgotPasswordEmail } from "@/redux/slice/auth/asyncFn";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<MyDispatch>();

  const [email, setEmail] = useState("");

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-1">
            Forgot password
          </h1>
          <p className="text-sm text-gray mt-1">
            Enter your email to reset your password
          </p>
        </div>

        <AuthInput
          id="email"
          label="Email address"
          placeholder="mail@abc.com"
          value={email}
          inputType="email"
          setData={setEmail}
        />

        <Button
          text="Send reset link"
          className="w-full"
          disabled={!email}
          onClick={() => {
            dispatch(sendForgotPasswordEmail({ email, navigate }));
          }}
        />
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
