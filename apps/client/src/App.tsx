import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MySelector, type MyDispatch } from "./redux/store";
import { getUser } from "./redux/slice/auth/asyncFn";
import AppRoutes from "./config/AppRoutes";
import { getSellerCompany } from "./redux/slice/company/asyncFn";

const App = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const { user, bootstrap: authBootstrap } = MySelector((state) => state.auth);
  const { company, bootstrap: companyBootstrap } = MySelector(
    (state) => state.company,
  );

  useEffect(() => {
    if (!user?.id) dispatch(getUser(navigate));
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (!company && user?.seller?.id) {
      dispatch(getSellerCompany());
    }
  }, [company, user?.seller, dispatch]);

  if (authBootstrap || (user?.seller && companyBootstrap)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <AppRoutes />;
};

export default App;
