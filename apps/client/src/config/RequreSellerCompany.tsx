import { Navigate, Outlet } from "react-router-dom";
import { MySelector } from "@/redux/store";

const RequireSellerCompany = () => {
  const { company } = MySelector((state) => state.company);

  console.log(company, "com");

  if (!company?.id) {
    return <Navigate to="/seller/create-company" replace />;
  }

  if (!company?.isVerified) {
    return <Navigate to="/seller/company-pending" replace />;
  }

  return <Outlet />;
};

export default RequireSellerCompany;
