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
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-1">
            OTP Verification
          </h1>
          <p className="text-gray text-sm mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((_, indx) => (
            <input
              ref={indx === activeOtpIndex ? inputRef : null}
              type="text"
              inputMode="numeric"
              key={indx}
              onChange={handleChange}
              value={otp[indx]}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                currentOTPIndex = indx;
                if (e.key === "Backspace")
                  setActiveOtpIndex(currentOTPIndex - 1);
              }}
              className="
          h-12 w-12 sm:h-14 sm:w-14
          text-xl text-center
          rounded-md
          border border-gray-300
          focus:border-secondary-1
          focus:ring-2 focus:ring-secondary-2
          outline-none
        "
            />
          ))}
        </div>

        <Button
          text="Verify"
          variant="primary"
          className="w-full tracking-wide hover:bg-secondary-1"
          onClick={handleVerify}
          disabled={!isOtpComplete || loading}
        />

        <p className="text-center text-sm text-secondary-1 cursor-pointer hover:underline">
          Didn&apos;t receive the code?
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
