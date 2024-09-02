import { useDispatch, useSelector } from "react-redux";
import TeamCard from "./TeamCard";
import {
  getAuthDetails,
  setIsloggedIn,
} from "../../../store/ProfessionalAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearCookies,
  getLoggedInStatus,
} from "../../../services/ProfessionalAuth";

const index = () => {
  const authDetails = useSelector(getAuthDetails);
  const navigate = useNavigate();
  const isLoggedIn = getLoggedInStatus();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn === "1") {
      navigate("/talent/my-team");
    } else {
      clearCookies();
      localStorage.removeItem("isLoggedIn");
      dispatch(setIsloggedIn(false));
      navigate("/talent/login");
    }
  }, [isLoggedIn]);

  return (
    <div className="drp-main-white-bg">
      <div className="white-bg-container">
        <h3 className="main-title mb-3">My Team</h3>
        <div className="team-card-wr">
          {authDetails &&
            authDetails.length > 0 &&
            authDetails?.map((data) => {
              return <TeamCard {...data} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default index;
