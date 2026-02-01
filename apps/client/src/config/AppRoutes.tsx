import { Routes, Route } from "react-router-dom";
import { ADMIN, BUYER, SELLER } from "@/utils/assets";

import RequireAuth from "./RequreAuth";
import AppShell from "@/ui/AppShell";
import RequireRole from "./RequireRole";
import RequireSellerCompany from "./RequreSellerCompany";

// pages
import SignIn from "@/pages/auth/SignIn";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import Unauthorized from "@/pages/shared/Unauthorized";

// shared
import Profile from "@/pages/shared/Profile";

// admin
import AdminDashboard from "@/pages/admin/Dashboard";
import AllCompanies from "@/pages/admin/AllCompanies";

// // seller
import SellerDashboard from "@/pages/seller/Dashboard";
import CreateCompany from "@/pages/seller/CreateCompany";
import CompanyApprovalPending from "@/pages/seller/CompanyApprovalPending";

// // buyer
import BuyerDashboard from "@/pages/buyer/Dashboard";
import MyCompany from "@/pages/seller/MyCompany";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ───────────── Public ───────────── */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* ───────────── Authenticated ───────────── */}
      <Route element={<RequireAuth />}>
        {/* ─── Authenticated but OUTSIDE AppShell ─── */}
        <Route element={<RequireRole roles={[SELLER]} />}>
          <Route path="/seller/create-company" element={<CreateCompany />} />
          <Route
            path="/seller/company-pending"
            element={<CompanyApprovalPending />}
          />
        </Route>

        {/* ─── Authenticated INSIDE AppShell ─── */}
        <Route element={<AppShell />}>
          {/* Shared */}
          <Route path="/profile" element={<Profile />} />

          {/* Admin */}
          <Route element={<RequireRole roles={[ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<AllCompanies />} />
          </Route>

          {/* Seller (must have active company) */}
          <Route element={<RequireRole roles={[SELLER]} />}>
            <Route element={<RequireSellerCompany />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/company" element={<MyCompany />} />
            </Route>
          </Route>

          {/* Buyer */}
          <Route element={<RequireRole roles={[BUYER]} />}>
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* ───────────── Fallback ───────────── */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRoutes;
