import RegisterHeader from "./RegisterHeader";
import MainHeader from "./MainHeader";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../../store/ProfessionalAuthStore";
import { getLoggedInStatus } from "../../../services/ProfessionalAuth";

const Header = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const loggedInState = getLoggedInStatus();

  return isLoggedIn || loggedInState === "1" ? (
    <MainHeader />
  ) : (
    <RegisterHeader />
  );
};

export default Header;
