import authImage from "@/assets/auth.png";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex items-center">
      <div className="">
        <img src={authImage} alt="authImage" />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
