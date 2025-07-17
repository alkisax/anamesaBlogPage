import { Outlet } from "react-router-dom";

import HeaderHomepage from "../pages/homepageComponents/HeaderHomepage";
import FooterHomepage from "../pages/homepageComponents/FooterHomepage";

function Layout({ backEndUrl, admin, isAdmin, handleLogout }) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderHomepage
        backEndUrl={backEndUrl}
        admin={admin}
        handleLogout={handleLogout}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterHomepage
        admin={admin}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default Layout;