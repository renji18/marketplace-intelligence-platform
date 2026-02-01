import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MySelector, type MyDispatch } from "./redux/store";
import { getUser } from "./redux/slice/auth/asyncFn";
import AppRoutes from "./config/AppRoutes";

const App = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const { user } = MySelector((state) => state.auth);

  useEffect(() => {
    if (!user?.id) dispatch(getUser(navigate));
  }, [dispatch, navigate, user]);

  return <AppRoutes />;
};

export default App;
