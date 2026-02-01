import { Navigate, Outlet } from "react-router-dom";
import { type MyDispatch, MySelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSellerCompany } from "@/redux/slice/company/asyncFn";

const RequireSellerCompany = () => {
  const dispatch = useDispatch<MyDispatch>();
  const { company } = MySelector((state) => state.company);

  useEffect(() => {
    if (!company) {
      dispatch(getSellerCompany());
    }
  }, [company, dispatch]);

  if (!company?.id) {
    return <Navigate to="/seller/create-company" replace />;
  }

  if (!company?.isVerified) {
    return <Navigate to="/seller/company-pending" replace />;
  }

  return <Outlet />;
};

export default RequireSellerCompany;
