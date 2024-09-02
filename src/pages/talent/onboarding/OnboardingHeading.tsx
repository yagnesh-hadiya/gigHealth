import { Button } from "reactstrap";
import HeadingInfo from "./HeadingInfo";
import { TalentOnboardingListType } from "../../../types/TalentOnboardingTypes";
import { useNavigate } from "react-router-dom";
import {
  getAuthDetails,
  setViewPage,
} from "../../../store/ProfessionalAuthStore";
import { useDispatch, useSelector } from "react-redux";

const OnboardingHeading = (list: TalentOnboardingListType) => {
  const navigate = useNavigate();
  const programTeam = useSelector(getAuthDetails);
  const dispatch = useDispatch();

  const handleViewJob = (Id: number) => {
    dispatch(setViewPage("Onboarding"));
    navigate(`/talent/search-jobs/view-jobs/${Id}`);
  };
  return (
    <>
      <HeadingInfo {...list} />
      <div
        className="d-flex align-items-center justify-content-between column-rev-wrap gap-12-0 gigs-flex"
        style={{ marginBottom: "12px" }}
      >
        {((programTeam && programTeam[0]?.ProgramManager) ||
          programTeam[0]?.EmploymentExpert) && (
          <h3 className="list-title m-0">Program Team Details</h3>
        )}
        <Button
          className="blue-gradient-btn mb-0 mobile-btn"
          onClick={() => handleViewJob(list?.JobId)}
        >
          View Job
        </Button>
      </div>
    </>
  );
};

export default OnboardingHeading;
