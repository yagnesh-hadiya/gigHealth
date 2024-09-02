import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../../../helpers";
import JobSidebar from "./JobSidebar";
import { getJobDetails } from "../../../../services/JobsServices";
import { RightJobContentData } from "../../../../types/JobsTypes";
import Loader from "../../../../components/custom/CustomSpinner";
import ViewJobCard from "./ViewJobCard";
import ApplicantList from "./Applicant/ApplicantList";
import OpeningsAssignments from "./OpeningsAndAssignment/OpeningsAssignments";
import Submissions from "./Submissions/Submissions";
import { removeActiveMenu } from "../../../../helpers/tokens";

const ViewJob = () => {
  // const { activeComponent, setActiveComponent } = useContext<FacilityActiveComponentProps>(FacilityActiveComponentContext);
  const [data, setData] = useState<RightJobContentData[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [activeComponent, setActiveComponent] = useState<string>("Job Details");
  const navigate = useNavigate();
  const params = useParams();
  const jobId = params?.jId;
  const facilityId = params.fId;

  // const viewData = useLocation();
  // const facilityId = viewData.search.split('').pop();

  // const facilityId = viewData?.state?.facilityId;
  console.log("activeComponent", activeComponent);

  const handleNavigate = () => {
    navigate("/jobs");
    removeActiveMenu();
  };

  const fetchJobDetails = () => {
    if (facilityId && jobId) {
      setLoading(true);
      getJobDetails(facilityId, jobId)
        .then((response) => {
          setData(response.data?.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        });
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const componentMapping: { [key: string]: React.ReactNode } = {
    "Job Details": (
      <>
        <ViewJobCard
          Id={data[0]?.Id}
          Title={data[0]?.Title}
          Facility={data[0]?.Facility}
          BillRate={data[0]?.BillRate}
          MinYearsExperience={data[0]?.MinYearsExperience}
          NoOfOpenings={data[0]?.NoOfOpenings}
          Location={data[0]?.Location}
          Description={data[0]?.Description}
          ContractStartDate={data[0]?.ContractStartDate}
          ShiftStartTime={data[0]?.ShiftStartTime}
          ShiftEndTime={data[0]?.ShiftEndTime}
          NoOfShifts={data[0]?.NoOfShifts}
          ContractLength={data[0]?.ContractLength}
          HrsPerWeek={data[0]?.HrsPerWeek}
          RegularHourlyRate={data[0]?.RegularHourlyRate}
          HousingStipend={data[0]?.HousingStipend}
          MealsAndIncidentals={data[0]?.MealsAndIncidentals}
          TotalGrossPay={data[0]?.TotalGrossPay}
          HolidayRate={data[0]?.HolidayRate}
          OnCallRate={data[0]?.OnCallRate}
          TravelReimbursement={data[0]?.TravelReimbursement}
          CreatedOn={data[0]?.CreatedOn}
          JobProfession={data[0]?.JobProfession}
          JobSpeciality={data[0]?.JobSpeciality}
          CompChecklist={data[0]?.CompChecklist}
          ApplicantCount={data[0]?.ApplicantCount}
          JobStatus={data[0]?.JobStatus}
          OvertimeRate={data[0]?.OvertimeRate}
          CallBackRate={data[0]?.CallBackRate}
          OvertimeHrsPerWeek={data[0]?.OvertimeHrsPerWeek}
          DaysOnAssignment={data[0]?.DaysOnAssignment}
        />
      </>
    ),
    "Openings & Assignments": <OpeningsAssignments />,
    Submissions: <Submissions job={data[0]} />,
    // "Job Templates": <JobTemplates />,
    Applicants: <ApplicantList job={data[0]} />,
  };

  return (
    <>
      <div className="navigate-wrapper">
        <Link to="" onClick={handleNavigate} className="link-btn">
          Jobs
        </Link>
        <span> / View Job - </span>
        {data && (
          <span className="text-capitalize">{data[0]?.Title ?? "--"}</span>
        )}
      </div>

      <div className="sidebar-section-wrapper template-sidebar">
        <div className="leftside">
          <JobSidebar
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
        </div>
        <div className="rightside">
          {loading && <Loader />}
          <div className="facility-listing-wrapper">
            {componentMapping[activeComponent]}
          </div>
        </div>
        {/* </Row> */}
      </div>
    </>

    // {/* <Row>
    //   <Col md="2">
    //     <JobSidebar
    //       activeComponent={activeComponent}
    //       setActiveComponent={setActiveComponent}
    //     />
    //   </Col>
    //   <Col md="10">
    //     {loading && <Loader />}

    //     <div className="mt-3 facility-listing-wrapper">
    //       {componentMapping[activeComponent]}
    //     </div>
    //   </Col>
    // </Row> */}
  );
};

export default ViewJob;
