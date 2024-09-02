import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import TalentHeader from "../../../assets/images/talent-header-img.png";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { showToast } from "../../../helpers";
import {
  getLoggedInStatus,
  getProfessionalProfile,
  professionalLogOut,
} from "../../../services/ProfessionalAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthDetails,
  setAuthDetails,
  setIsloggedIn,
} from "../../../store/ProfessionalAuthStore";
import { authDetails } from "../../../types/StoreInitialTypes";
import OfferDetailsModal from "../../../pages/talent/gigs/OfferDetailsModal";
import { getFormattedName } from "../../../pages/common";

const MainHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [hamburgerActive, setHamburgerActive] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();
  const authDetails: authDetails[] = useSelector(getAuthDetails);
  const dispatch = useDispatch();
  const isLoggedIn = getLoggedInStatus();

  useEffect(() => {
    if (isLoggedIn === "1") {
      const fetchValue = async () => {
        const response = await getProfessionalProfile();
        dispatch(setAuthDetails(response.data?.data));
      };
      fetchValue();
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (authDetails.length > 0) {
        setName(getFormattedName(authDetails[0], isMobileView));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [authDetails, isMobile]);

  const handlePasswordChange = () => {
    navigate("/talent/change-password");
  };

  const handleMyTeam = () => {
    navigate("/talent/my-team");
  };

  const handlePersonalInfo = () => {
    navigate("/talent/personal-information");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setHamburgerActive(!hamburgerActive);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const [modal, setModal] = useState<boolean>(false);

  const toggleOfferDetailsModal = () => {
    setModal((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await professionalLogOut();
      localStorage.removeItem("isLoggedIn");
      showToast("success", "User Logged out successfully");
      setTimeout(() => {
        dispatch(setIsloggedIn(false));
        navigate("/talent/login");
      }, 500);
    } catch (error: any) {
      console.error(error);
      showToast("error", error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="talent-header-wrapper main-header">
        <div className="talent-header">
          <img src={TalentHeader} alt="logo" className="auth-left-img" />
          <div className="list-menu-wr">
            <div className={showMenu ? "show-menu" : "hide-menu"}>
              <ul>
                <li>
                  <NavLink to="/talent/main-home" onClick={toggleMenu}>
                    <span className="material-symbols-outlined mobile-icon">
                      home
                    </span>
                    <span>Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/talent/my-profile" onClick={toggleMenu}>
                    <span className="material-symbols-outlined mobile-icon">
                      person
                    </span>
                    <span>My Profile</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/talent/search-jobs">
                    <span className="material-symbols-outlined mobile-icon">
                      manage_search
                    </span>
                    <span>Search Jobs</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/talent/gigs">
                    <span className="material-symbols-outlined mobile-icon">
                      timeline
                    </span>
                    <span>Gigs</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/talent/onboarding" onClick={toggleMenu}>
                    <span className="material-symbols-outlined mobile-icon">
                      work_history
                    </span>
                    <span>Onboarding</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-center gap-0-16">
            <div className="main-header-drp">
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret>
                  <div className="drp-avatar-wr me-2">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <span className="text-capitalize">{name}</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={handlePersonalInfo}>
                    <div className="drp-avatar-wr blue-bg-color me-2">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <span> Personal Information </span>
                  </DropdownItem>
                  <DropdownItem onClick={handleMyTeam}>
                    <div className="drp-avatar-wr blue-bg-color me-2">
                      <span className="material-symbols-outlined">
                        supervisor_account
                      </span>
                    </div>
                    <span> My Team </span>
                  </DropdownItem>
                  <DropdownItem onClick={handlePasswordChange}>
                    <div className="drp-avatar-wr blue-bg-color me-2">
                      <span className="material-symbols-outlined fs-6">
                        lock
                      </span>
                    </div>
                    <span> Change Password </span>
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>
                    <div className="drp-avatar-wr blue-bg-color me-2">
                      <span className="material-symbols-outlined fs-5 ps-1">
                        logout
                      </span>
                    </div>
                    <span> Logout </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
      {modal && (
        <OfferDetailsModal isOpen={modal} toggle={toggleOfferDetailsModal} />
      )}
    </>
  );
};

export default MainHeader;
