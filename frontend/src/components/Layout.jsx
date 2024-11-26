import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="mt-.5 p-4">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
