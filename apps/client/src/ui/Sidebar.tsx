import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/config/navigation";
import { MySelector } from "@/redux/store";
import logo from "@/assets/logo-white.png";

const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user } = MySelector((state) => state.auth);
  const role = user?.role;

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed z-40 inset-y-0 left-0
          w-64 bg-secondary-1 text-white
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 font-bold text-lg justify-center">
          <img src={logo} alt="logo" className="h-12" />
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.filter((item) =>
            role ? item.roles.includes(role) : false,
          ).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                block px-3 py-2 rounded-md text-sm
                ${
                  isActive
                    ? "bg-primary-1 text-white"
                    : "text-gray-200 hover:bg-secondary-2 hover:text-secondary-1"
                }
              `
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
