import AuthLayout from "@/components/auth/AuthLayout";

const CheckEmail = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-secondary-1">
          Check your email
        </h1>

        <p className="text-sm text-gray">
          We&apos;ve sent you a password reset email.
          <br />
          It contains a temporary password and a link to reset your password.
        </p>

        <p className="text-sm text-gray">
          This page is no longer needed.
          <br />
          Please continue from the email we sent you.
        </p>

        <p className="text-xs text-gray">You can safely close this tab.</p>
      </div>
    </AuthLayout>
  );
};

export default CheckEmail;
