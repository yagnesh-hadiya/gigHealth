import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Logo from "../../../assets/images/brendan-logo.png";
import LogoRound from "../../../assets/images/logoround_new.jpg";
import profile from "../../../assets/images/profile.svg";
import logout from "../../../assets/images/logout.svg";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import Arrow from "../../../assets/images/dropdown-arrow.svg";
import { Link, useLocation } from "react-router-dom";
import { logOut } from "../../../services/AuthServices";
import { useNavigate } from "react-router-dom";
import { checkAclPermission, showToast } from "../../../helpers";
import { SidebarProps } from "../../../types/LayoutTypes";
import { fetchProfile } from "../../../services/AuthServices";
import { UserProfile } from "../../../types/AuthTypes";
import { useDispatch } from "react-redux";
import { setUserEmail, setUserName } from "../../../store/UserSlice";
import {
  cleanUpFirebase,
  onFirebaseMessage,
  requestForToken,
} from "../../../helpers/firebase/firebase";
import { MessagePayload } from "firebase/messaging";
import Notification from "../../../helpers/firebase/Notification";
import { toast } from "react-toastify";
import UsersIcon from "../../icons/Users";
import WorkspaceIcon from "../../icons/Workspace";
import FacilitiesIcon from "../../icons/Facilities";
import JobsIcon from "../../icons/Jobs";
import TalentIcon from "../../icons/Talent";
import DocumentIcon from "../../icons/Document";
// import MessageIcon from "../../icons/Messages";
import TemplateIcon from "../../icons/Templates";
import { ActiveSidebarMenuContext } from "../../../helpers/context/ActiveSidebar";
import { SelectedMenuContext } from "../../../helpers/context/SelectedSidebar";
import { removeActiveMenu } from "../../../helpers/tokens";

const Sidebar: React.FC<SidebarProps> = () => {
  const [, setDropdownOpen] = useState(false);
  const [notificationQueue, setNotificationQueue] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tokenFetched = useRef(false);
  const { activeMenu, setActiveMenu } = useContext(ActiveSidebarMenuContext);
  const [activeColor, setActiveColor] = useState<string>("#FFFFFF");
  const { selectedMenu, setSelectedMenu } = useContext(SelectedMenuContext);
  const params: string = useLocation().pathname;

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setUserProfile(data);
        dispatch(setUserName(`${data?.firstName} ${data?.lastName}`));
        dispatch(setUserEmail(data?.email));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const showToastForExport = async (notification: any) => {
    return new Promise((resolve: any) => {
      toast(
        <Notification
          title={notification.data?.title ?? ""}
          link={notification.data?.link ?? ""}
        />,
        {
          position: "bottom-right",
          closeOnClick: true,
          autoClose: false,
          pauseOnHover: true,
          theme: "light",
          onClose: () => resolve(),
        }
      );
    });
  };

  useEffect(() => {
    if (!tokenFetched.current) {
      requestForToken();
      tokenFetched.current = true;
    }

    const unsubscribe = onFirebaseMessage((payload: MessagePayload) => {
      showToastForExport(payload);
    });

    return () => {
      unsubscribe?.();
      if (!tokenFetched.current) {
        cleanUpFirebase();
      }
    };
  }, []);

  useEffect(() => {
    setActiveMenu(activeMenu);
  }, [activeMenu]);

  const menuItems = [
    // {
    //   text: "Workspace",
    //   module: "workspace",
    //   path: "",
    // },
    {
      text: "Manage Users",
      module: "users",
      path: "/users",
    },
    {
      text: "Facilities",
      module: "facilities",
      path: "/facility",
    },
    {
      text: "Jobs",
      module: "jobs",
      path: "/jobs",
    },
    {
      text: "Job Templates",
      module: "job-templates",
      path: "",
    },
    {
      text: "Professionals",
      module: "professionals",
      path: "/professionals",
    },
    {
      text: "Role Management",
      module: "roles",
      path: "/roles",
    },
    {
      text: "Documents Master",
      module: "documentmaster",
      path: "/document-master",
    },
    // {
    //   text: "Messages",
    //   module: "messages",
    //   path: "",
    // },
  ];

  const allowedMenus = useMemo(() => {
    return menuItems.filter((menu) =>
      checkAclPermission(menu.module, null, ["GET"])
    );
  }, []);

  const getFirstAvailableModule = () => {
    return allowedMenus[0];
  };

  const handleLogout = async () => {
    try {
      await logOut();
      showToast("success", "User Logged out successfully");
      tokenFetched.current = false;
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      showToast("error", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const channel = new BroadcastChannel("notificationChannel");

    const handleBackgroundMessage = (event: any) => {
      const response = event?.data;

      if (
        response?.action === "notification" &&
        document.visibilityState === "hidden"
      ) {
        setNotificationQueue([response.payload]);
      }
    };

    channel?.addEventListener("message", handleBackgroundMessage);

    return () => {
      channel?.removeEventListener("message", handleBackgroundMessage);
    };
  }, []);

  useEffect(() => {
    const processQueue = () => {
      if (notificationQueue.length > 0) {
        const nextNotification = notificationQueue[0];
        showToastForExport(nextNotification);
      }
    };

    processQueue();
  }, [notificationQueue]);

  useEffect(() => {
    if ((allowedMenus.length > 0 && selectedMenu === true) || params === "/") {
      const firstAvailableModule: {
        text: string;
        path: string;
        module: string;
      } = getFirstAvailableModule();
      setActiveMenu(activeMenu ? activeMenu : firstAvailableModule?.text);

      const routes: { [key: string]: string } = {
        Workspace: "/",
        "Manage Users": "/users",
        Facilities: "/facility",
        Jobs: "/jobs",
        Professionals: "/professionals",
        "Role Management": "/roles",
        "Documents Master": "/document-master",
        // Messages: "/messages",
      };

      const route = routes[firstAvailableModule?.text || ""];
      if (route) {
        navigate(route);
        setActiveColor(firstAvailableModule?.text || "");
      }

      setSelectedMenu(false);
    } else if (allowedMenus.length > 0 && params === "/login") {
      const selectedMenu = menuItems.find((item) => item.path === params);
      if (selectedMenu) {
        setActiveColor(selectedMenu?.text);
        setActiveMenu(selectedMenu?.text);
      }
    } else if (params.startsWith("/view")) {
      setActiveColor("Jobs");
      setActiveMenu("Jobs");
    } else if (allowedMenus.length > 0 && params.split("/", 2).join("/")) {
      const selectedMenu = menuItems.find(
        (item) => item.path === params.split("/", 2).join("/")
      );
      if (selectedMenu) {
        setActiveColor(selectedMenu?.text ?? "Jobs");
        setActiveMenu(selectedMenu?.text ?? "Jobs");
      }
    } else {
      const selectedMenu = menuItems.find((item) => item.path === params);
      if (selectedMenu) {
        setActiveColor(selectedMenu?.text);
        setActiveMenu(selectedMenu?.text);
      }
    }
  }, []);

  const iconMap: { [key: string]: React.FC<any> } = {
    workspace: WorkspaceIcon,
    users: UsersIcon,
    facilities: FacilitiesIcon,
    jobs: JobsIcon,
    professionals: TalentIcon,
    roles: TemplateIcon,
    documentmaster: DocumentIcon,
    // messages: MessageIcon,
  };

  const handleMenuClick = (module: string) => {
    setActiveMenu(module);
    setActiveColor(module);
  };

  return (
    <nav className="navbar-menu">
      <>
        <div className="main-logo-round">
          <img src={LogoRound} alt="logo" />
        </div>
        <div className="sidebar-dropdown small-screen-dropdown sidebar-dropdown-section">
          <Dropdown toggle={toggle}>
            <UncontrolledDropdown className="me-2" direction="end">
              <DropdownToggle caret size="md">
                <span className="name-logo">
                  {userProfile?.firstName?.charAt(0).toUpperCase()}
                  {userProfile?.lastName?.charAt(0).toUpperCase()}
                </span>
              </DropdownToggle>
              <DropdownMenu>
                <Link to="/profile" className="forgot-pass-btn">
                  <DropdownItem>My Profile</DropdownItem>
                </Link>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Dropdown>
        </div>
      </>

      <>
        <div className="main-logo">
          <img src={Logo} alt="logo" />
        </div>
        <div className="sidebar-dropdown sidebar-dropdown-section">
          <Dropdown toggle={toggle}>
            <UncontrolledDropdown className="me-2" direction="down">
              <DropdownToggle caret size="md">
                <span className="name-logo">
                  {userProfile?.firstName?.charAt(0).toUpperCase()}
                  {userProfile?.lastName?.charAt(0).toUpperCase()}
                </span>
                <span
                  className="full-name"
                  title={`${
                    userProfile?.firstName
                      ? userProfile.firstName.charAt(0).toUpperCase() +
                        userProfile.firstName.slice(1)
                      : ""
                  } ${
                    userProfile?.lastName
                      ? userProfile.lastName.charAt(0).toUpperCase() +
                        userProfile.lastName.slice(1)
                      : ""
                  }`}
                >
                  {userProfile?.firstName
                    ? userProfile.firstName.charAt(0).toUpperCase() +
                      userProfile.firstName.slice(1)
                    : ""}
                  {"  "}
                  {userProfile?.lastName
                    ? userProfile.lastName.charAt(0).toUpperCase() +
                      userProfile.lastName.slice(1)
                    : ""}
                </span>
                <img src={Arrow} alt="down-arrow" />
              </DropdownToggle>
              <DropdownMenu>
                <Link to="/profile" className="forgot-pass-btn">
                  <DropdownItem>
                    <img src={profile} className="dropdown-icon" />
                    My Profile
                  </DropdownItem>
                </Link>
                <DropdownItem onClick={handleLogout}>
                  <img src={logout} className="dropdown-icon" />
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Dropdown>
        </div>
      </>

      <ul className="navbar__list">
        {allowedMenus.map((item, i) => {
          const Icon = iconMap[item.module];
          return (
            <li
              className={`navbar__li-box ${
                item.text === activeMenu ? "active-sidebar" : ""
              }`}
              key={i}
            >
              <Link
                onClick={() => {
                  removeActiveMenu();
                  handleMenuClick(item.text);
                }}
                to={item.path}
                className={`navbar__li-link`}
              >
                <Icon
                  color={item.text === activeColor ? "#FFFFFF" : "#7F47DD"}
                />
                <span className={`navbar__li`}>{item.text} </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
