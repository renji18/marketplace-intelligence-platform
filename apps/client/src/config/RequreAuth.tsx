import { Navigate, Outlet } from "react-router-dom";
import { MySelector } from "@/redux/store";

const RequireAuth = () => {
  const { user } = MySelector((state) => state.auth);

  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
