import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { loginUser } from "@/redux/slice/auth/asyncFn";
import { MySelector, type MyDispatch } from "@/redux/store";
import Button from "@/ui/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();
  const { loading } = MySelector((state) => state.auth);

  const [authData, setAuthData] = useState({ email: "", password: "" });

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-1">Welcome back</h1>
          <p className="text-gray mt-1 text-sm">
            Sign in to manage your marketplace
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <AuthInput
            id="email"
            label="Email"
            placeholder="mail@abc.com"
            value={authData.email}
            inputType="email"
            setData={(value) =>
              setAuthData((prev) => ({ ...prev, email: value }))
            }
          />

          <AuthInput
            id="password"
            label="Password"
            placeholder="••••••••"
            value={authData.password}
            inputType="password"
            setData={(value) =>
              setAuthData((prev) => ({ ...prev, password: value }))
            }
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            className="text-sm text-secondary-1 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        <Button
          text="Log in"
          variant="primary"
          className="w-full tracking-wide hover:bg-secondary-1"
          onClick={() => dispatch(loginUser({ ...authData, navigate }))}
          disabled={loading || !authData.email || !authData.password}
        />

        <p className="text-center text-sm text-secondary-1">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="font-medium cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
