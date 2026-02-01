import { Navigate, Outlet } from "react-router-dom";
import { MySelector } from "@/redux/store";
import { ALLOWED_ROLES } from "@/utils/assets";

type RoleKey = keyof typeof ALLOWED_ROLES;

const RequireRole = ({ roles }: { roles: RoleKey[] }) => {
  const { user } = MySelector((state) => state.auth);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireRole;
