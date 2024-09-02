import Header from "./header";
import { Outlet } from "react-router-dom";
import "../../scss/applicant.scss";
import "../../scss/applicant-control.scss";

const Layout = () => {
  return (
    <>
      <Header />
      <main id="Talent-layout-container">
        <div className="talent-content">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
