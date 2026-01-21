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

  const [authData, setAuthData] = useState<{ email: string; password: string }>(
    { email: "", password: "" },
  );

  return (
    <AuthLayout>
      <div className="w-[50%] pr-20 flex flex-col items-center">
        <p className="text-3xl text-secondary-1 font-bold">
          Log in to your Account
        </p>
        <p className="text-gray mt-0.5">
          See what is going on with your business
        </p>

        <div className="w-full mt-8 mb-2 space-y-6">
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
            placeholder="**************"
            value={authData.password}
            inputType="password"
            setData={(value) =>
              setAuthData((prev) => ({ ...prev, password: value }))
            }
          />
        </div>

        <div className="w-full">
          <p className="text-end text-sm font-light text-secondary-1 cursor-pointer">
            Forgot password?
          </p>
        </div>

        <Button
          text="Log In"
          variant="primary-light"
          customCss="w-full text-center tracking-wide mt-6 mb-2 hover:bg-secondary-1"
          fn={() => {
            dispatch(loginUser({ ...authData, navigate }));
          }}
          disabled={loading || !authData.email || !authData.password}
        />

        <p className="text-secondary-1 text-sm font-light cursor-pointer">
          Create account instead?
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
