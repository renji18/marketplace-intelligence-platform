import { Routes, Route } from "react-router-dom";
import { ADMIN, BUYER, SELLER } from "@/utils/assets";

import RequireAuth from "./RequreAuth";
import AppShell from "@/ui/AppShell";
import RequireRole from "./RequireRole";

// pages
import SignIn from "@/pages/auth/SignIn";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import Unauthorized from "@/pages/shared/Unauthorized";

// shared
import Profile from "@/pages/shared/Profile";

// admin
import AdminDashboard from "@/pages/admin/Dashboard";

// // seller
import SellerDashboard from "@/pages/seller/Dashboard";

// // buyer
import BuyerDashboard from "@/pages/buyer/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Protected */}
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          {/* Shared */}
          <Route path="/profile" element={<Profile />} />

          {/* Admin */}
          <Route element={<RequireRole roles={[ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* <Route path="/admin/companies" element={<Companies />} /> */}
          </Route>

          {/* Seller */}
          <Route element={<RequireRole roles={[SELLER]} />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            {/* <Route path="/seller/products" element={<SellerProducts />} /> */}
          </Route>

          {/* Buyer */}
          <Route element={<RequireRole roles={[BUYER]} />}>
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            {/* <Route path="/cart" element={<Cart />} /> */}
          </Route>
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRoutes;
