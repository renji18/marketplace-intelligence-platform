import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
