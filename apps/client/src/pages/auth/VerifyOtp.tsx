import AuthLayout from "@/components/auth/AuthLayout";
import { verifyOtp } from "@/redux/slice/auth/asyncFn";
import { MySelector, type MyDispatch } from "@/redux/store";
import Button from "@/ui/Button";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

let currentOTPIndex: number = 0;

const VerifyOtp = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const { loading } = MySelector((state) => state.auth);

  const inputRef = useRef<HTMLInputElement>(null);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOtpIndex(currentOTPIndex - 1);
    else setActiveOtpIndex(currentOTPIndex + 1);

    setOtp(newOtp);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, 6);
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    const lastIndex = Math.min(digits.length, 6) - 1;
    setActiveOtpIndex(lastIndex < 5 ? lastIndex + 1 : 5);
  };

  const handleVerify = useCallback(() => {
    dispatch(
      verifyOtp({
        otp: otp.join(""),
        navigate,
      }),
    );
  }, [dispatch, otp, navigate]);

  useEffect(() => {
    const handleVerifyOtpKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && otp.join("").length === 6) {
        handleVerify();
      }
    };

    window.addEventListener("keydown", handleVerifyOtpKeyDown);
    return () => {
      window.removeEventListener("keydown", handleVerifyOtpKeyDown);
    };
  }, [handleVerify, otp]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <AuthLayout>
      <div className="w-[50%] pr-20 flex flex-col items-center">
        <p className="text-3xl text-secondary-1 font-bold">OTP Verification</p>
        <p className="text-gray mt-0.5">Enter the OTP sent to your email</p>

        <div className="gap-3 lg:gap-2.5 flex items-center justify-center w-full mt-8">
          {otp.map((_, indx) => (
            <input
              ref={indx === activeOtpIndex ? inputRef : null}
              type={"password"}
              key={indx}
              onChange={handleChange}
              value={otp[indx]}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                currentOTPIndex = indx;
                if (e.key === "Backspace")
                  setActiveOtpIndex(currentOTPIndex - 1);
              }}
              className={`text-[#1F1F1F] rounded-lg border border-secondary-1 active:border-none active:outline-1 outline-secondary-2 font-normal h-11 w-12 text-center caret-transparent pb-2 text-2xl`}
            />
          ))}
        </div>

        <Button
          text="Verify"
          variant="primary-light"
          customCss="w-full text-center tracking-wide mt-6 mb-2 hover:bg-secondary-1"
          fn={handleVerify}
          disabled={!isOtpComplete || loading}
        />

        <p className="text-secondary-1 text-sm font-light cursor-pointer">
          Create account instead?
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
