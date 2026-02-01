import authImage from "@/assets/auth.png";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-lato">
      {/* Left illustration */}
      <div className="hidden lg:flex items-center justify-center">
        <img
          src={authImage}
          alt="Authentication"
          className="h-auto"
        />
      </div>

      {/* Right auth content */}
      <div className="flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
