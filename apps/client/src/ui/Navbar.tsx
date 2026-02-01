import { logOut } from "@/redux/slice/auth/asyncFn";
import { type MyDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b flex items-center px-4 sm:px-6">
      <button onClick={onMenuClick} className="lg:hidden mr-3 text-secondary-1">
        ☰
      </button>

      <div className="flex-1 font-medium text-secondary-1">Dashboard</div>

      <Button
        onClick={() => dispatch(logOut(navigate))}
        text="Logout"
        // className="text-sm text-gray cursor-pointer"
      />
    </header>
  );
};

export default Navbar;
