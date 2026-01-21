import { Route, Routes, useNavigate } from "react-router-dom";
import Seller from "./pages/seller";
import Admin from "./pages/admin";
import Buyer from "./pages/buyer";
import SignIn from "./pages/auth/SignIn";
import VerifyOtp from "./pages/auth/VerifyOtp";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { type MyDispatch } from "./redux/store";
import { getUser } from "./redux/slice/auth/asyncFn";

const App = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUser(navigate));
  }, [dispatch, navigate]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/buyer" element={<Buyer />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default App;
