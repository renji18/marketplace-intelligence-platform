import { Link } from "react-router-dom";
import { MySelector } from "@/redux/store";
import Button from "@/ui/Button";
import logo from "@/assets/logo-white.png";

const PublicNavbar = () => {
  const { user } = MySelector((state) => state.auth);

  return (
    <header className="border-b text-white bg-secondary-1">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/products" className="font-bold text-secondary-1">
          <img src={logo} alt="logo" className="h-12" />
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/products" className="text-sm text-gray">
            Products
          </Link>

          {user ? (
            <Link to="/profile">
              <Button text="Account" size="sm" />
            </Link>
          ) : (
            <Link to="/login">
              <Button text="Login" size="sm" variant="secondary" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
