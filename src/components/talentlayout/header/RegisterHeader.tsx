import { Button } from "reactstrap";
import TalentHeader from "../../../assets/images/talent-header-img.png";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const RegisterHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [hamburgerActive, setHamburgerActive] = useState(false);
  const navigate = useNavigate();

  const registerClick = () => {
    navigate("/talent/register");
  };
  const loginClick = () => {
    navigate("/talent/login");
  };
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setHamburgerActive(!hamburgerActive);
  };

  return (
    <div className="talent-header-wrapper">
      <div className="talent-header">
        <img src={TalentHeader} alt="logo" className="auth-left-img" />
        <div className="list-menu-wr">
          <div className={showMenu ? "show-menu" : "hide-menu"}>
            <ul>
              <li>
                <NavLink to="/talent/home">
                  <span className="material-symbols-outlined mobile-icon">
                    home
                  </span>
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/talent/search-jobs">
                  <span className="material-symbols-outlined mobile-icon">
                    search
                  </span>
                  <span>Search Jobs</span>
                </NavLink>
              </li>
              <li className="mobile-li">
                <NavLink to="/talent/login">
                  <span className="material-symbols-outlined">login</span>
                  <span>Login</span>
                </NavLink>
              </li>
              <li className="mobile-li">
                <NavLink to="/talent/register">
                  <span className="material-symbols-outlined">how_to_reg</span>
                  <span>Register</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="btn-wrapper mt-0 mobile-btn-wr">
            <Button className="yellow-btn me-3 mb-0" onClick={loginClick}>
              Login
            </Button>
            <Button className="blue-gradient-btn mb-0" onClick={registerClick}>
              Register
            </Button>
          </div>
          <div
            className={`hamburger-menu ${hamburgerActive ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterHeader;
