import Header from "./header/index";
import Sidebar from "./sidebar/index";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <Sidebar />

      <main id="layout-container">
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
