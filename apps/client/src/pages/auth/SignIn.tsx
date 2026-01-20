import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { loginUser } from "@/redux/slice/auth/asyncFn";
import type { MyDispatch } from "@/redux/store";
import Button from "@/ui/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const [authData, setAuthData] = useState<{ email: string; password: string }>(
    { email: "", password: "" },
  );

  return (
    <AuthLayout>
      <div className="w-[50%] pr-20 flex flex-col items-center">
        <p className="text-2xl text-secondary-1">Log in to your Account</p>
        <p className="text-gray">See what is going on with your business</p>

        <div className="w-full mt-6 mb-1 space-y-3">
          <AuthInput
            id="email"
            label="Email"
            placeholder="Please provide your email"
            value={authData.email}
            setData={(value) =>
              setAuthData((prev) => ({ ...prev, email: value }))
            }
          />

          <AuthInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={authData.password}
            setData={(value) =>
              setAuthData((prev) => ({ ...prev, password: value }))
            }
          />
        </div>

        <div className="w-full">
          <p className="text-end">Forgot password?</p>
        </div>

        <Button
          text="Login"
          variant="primary-light"
          customCss="max-w-fit mt-6 mb-1"
          fn={() => {
            dispatch(loginUser({ ...authData, navigate }));
          }}
        />
        <p>Create account instead?</p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
