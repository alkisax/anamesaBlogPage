import { Outlet } from "react-router-dom";

import HeaderHomepage from "../pages/homepageComponents/HeaderHomepage";
import FooterHomepage from "../pages/homepageComponents/FooterHomepage";

function Layout({ backEndUrl }) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderHomepage backEndUrl={backEndUrl} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterHomepage />
    </div>
  );
}

export default Layout;