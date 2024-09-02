import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useEffect, useMemo, useReducer, useState } from "react";
import ChecklistTabs from "./ChecklistTabs";
import RightDetails from "./RightDetails";
import { showToast } from "../../../helpers";
import {
  getProfessionalJobDetails,
  getProfessionalRequiredDocs,
  markInterestedJob,
} from "../../../services/TalentJobs";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/custom/CustomSpinner";
import myProfileReducer from "../../../helpers/reducers/MyProfileReducer";
import { ActionType } from "../../../types/ProfessionalAuth";
import ReactQuill from "react-quill";
import { isWithinPrevious1Month } from "../../common";
import {
  getFacilityImage,
  getViewPage,
  setFacilityImage,
} from "../../../store/ProfessionalAuthStore";
import { useDispatch, useSelector } from "react-redux";
import Camera from "../../../assets/images/camera.svg";

const ViewJob = () => {
  const initialState = {
    selectedState: null,
    selectedCity: null,
    selectedZip: null,
    states: [],
    cities: [],
    zip: [],
    selectedQuestion: null,
    bgQuestions: [],
    documents: [],
    uploadedDocuments: [],
    additionalDetails: [],
    gendersList: [],
    federalQuestions: [],
    emergencyContactList: [],
    talentJobDetailsList: [],
    requiredDocsList: [],
  };

  const [heart, setHeart] = useState<boolean>(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [state, dispatch] = useReducer(myProfileReducer, initialState);
  const [fetchDetails, setFetchDetails] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const dispatchStore = useDispatch();
  const facilityImage = useSelector(getFacilityImage);
  const breadCrumb = useSelector(getViewPage);
  const navigate = useNavigate();
  const params = useParams();
  const jobId = Number(params?.Id);

  const facImg = useMemo(() => {
    if (facilityImage) {
      return facilityImage;
    } else {
      Camera;
    }
  }, [facilityImage]);

  const handleToggle1 = async () => {
    setHeart((prev) => !prev);
    try {
      await markInterestedJob(jobId, !heart);
    } catch (error: any) {
      console.error(error);
      setLoading("idle");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("loading");
        const [detailsResponse, docsResponse] = await Promise.allSettled([
          getProfessionalJobDetails(jobId),
          getProfessionalRequiredDocs(jobId),
        ]);
        if (detailsResponse.status === "fulfilled") {
          dispatch({
            type: ActionType.SetTalentJobDetails,
            payload: detailsResponse.value?.data?.data[0],
          });
          setHeart(
            detailsResponse.value?.data?.data[0]?.JobInterests?.length > 0
              ? true
              : false
          );
          const imageUrlFromApi: string =
            detailsResponse.value.data?.data[0]?.Image;
          dispatchStore(setFacilityImage(imageUrlFromApi));

          if (imageUrlFromApi) {
            setImageURL(imageUrlFromApi);
            setImageLoading(false);
          } else {
            setImageURL(Camera);
            setImageLoading(false);
          }
        }
        if (docsResponse.status === "fulfilled") {
          dispatch({
            type: ActionType.SetRequiredDocsDetails,
            payload: docsResponse.value?.data?.data[0]?.[0]?.CompChecklist,
          });
        }
        setLoading("idle");
      } catch (error: any) {
        console.error(error);
        setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };

    fetchData().catch((error: any) => {
      console.error("Error fetching data:", error);
      setLoading("idle");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    });
  }, [fetchDetails]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="view_jobs_wrapper">
        <div className="talent-breadcrumb">
          <Breadcrumb
            onClick={() => {
              if (breadCrumb === "Home") {
                navigate("/talent/main-home");
              } else if (breadCrumb === "Search Jobs") {
                navigate("/talent/search-jobs");
              } else if (breadCrumb === "Gigs") {
                navigate("/talent/gigs");
              } else if (breadCrumb === "Onboarding") {
                navigate("/talent/onboarding");
              }
            }}
          >
            <BreadcrumbItem>
              <NavLink
                to={
                  breadCrumb === "Home"
                    ? "/talent/main-home"
                    : breadCrumb === "Search Jobs"
                    ? "/talent/search-jobs"
                    : breadCrumb === "Gigs"
                    ? "/talent/gigs"
                    : breadCrumb === "Onboarding"
                    ? "/talent/onboarding"
                    : ""
                }
              >
                {breadCrumb}{" "}
              </NavLink>
            </BreadcrumbItem>
            <BreadcrumbItem
              active
              className="text-capitalize"
              style={{ cursor: "pointer" }}
            >
              {state.talentJobDetailsList?.Title
                ? state.talentJobDetailsList?.Title
                : "-"}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="view-job-flex">
          <div className="view-job-col view-job-right-side">
            <div className="job-info-flex">
              <div className="img-wr facility-camera-wrapper">
                {imageLoading && (
                  <div>
                    <Loader />
                    <img
                      src={Camera}
                      alt="camera-img"
                      height={120}
                      width={120}
                      className=""
                    />
                  </div>
                )}
                {!imageLoading && imageURL && (
                  <img
                    src={facImg || imageURL}
                    height={120}
                    width={120}
                    alt="facilityPicture"
                  />
                )}
                {!imageLoading && !imageURL && !facImg && (
                  <img
                    src={facImg || imageURL}
                    height={120}
                    width={120}
                    alt="camera-img"
                    className=""
                  />
                )}
              </div>
              <div className="job-info">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="text-capitalize">
                    {state.talentJobDetailsList?.Title
                      ? state.talentJobDetailsList?.Title
                      : "-"}
                  </h3>
                  <Button
                    color="link"
                    className={`transparent-btn like-btn ${
                      heart ? "active" : ""
                    }`}
                    onClick={handleToggle1}
                  >
                    <span className="material-symbols-outlined">favorite</span>
                  </Button>
                </div>
                <div className="d-flex flex-wrap gap-8-16 mb-3">
                  <p>
                    Profession:{" "}
                    <span className="fw-400">
                      {state.talentJobDetailsList?.JobProfession?.Profession
                        ? state.talentJobDetailsList?.JobProfession?.Profession
                        : "-"}
                    </span>
                  </p>
                  <p>
                    Specialty:{" "}
                    <span className="fw-400">
                      {state.talentJobDetailsList?.JobSpeciality?.Speciality
                        ? state.talentJobDetailsList?.JobSpeciality?.Speciality
                        : "-"}
                    </span>
                  </p>
                  <p>
                    Experience:{" "}
                    <span className="fw-400">
                      {state.talentJobDetailsList?.MinYearsExperience
                        ? `${state.talentJobDetailsList?.MinYearsExperience} Years`
                        : "-"}
                    </span>
                  </p>
                  <p>
                    Openings:{" "}
                    <span className="fw-400">
                      {state.talentJobDetailsList?.NoOfOpenings
                        ? state.talentJobDetailsList?.NoOfOpenings
                        : "-"}
                    </span>
                  </p>
                </div>
                <div className="d-flex">
                  {isWithinPrevious1Month(
                    state.talentJobDetailsList?.CreatedOn
                  ) && <div className="list-badge new-badge me-2">NEW</div>}
                  <div className="list-badge me-2">
                    Job ID:{" "}
                    {state.talentJobDetailsList?.Id
                      ? state.talentJobDetailsList?.Id
                      : "-"}
                  </div>
                  <div
                    className={`list-badge ${
                      state.talentJobDetailsList?.JobStatus?.Status ===
                        "Active-Featured" ||
                      state.talentJobDetailsList?.JobStatus?.Status === "Active"
                        ? "active-badge"
                        : state.talentJobDetailsList?.JobStatus?.Status ===
                          "On Hold"
                        ? "on-hold-badge"
                        : ""
                    }`}
                  >
                    {state.talentJobDetailsList?.JobStatus?.Status}
                  </div>
                </div>
              </div>
            </div>
            <div className="desc-wrapper">
              <h3 className="mb-3">Job Description</h3>
              <div className="react-quill-wr mb-2">
                <ReactQuill
                  value={
                    state.talentJobDetailsList?.Description
                      ? state.talentJobDetailsList?.Description
                      : "--"
                  }
                  modules={{ toolbar: [] }}
                  readOnly
                  theme="snow"
                />
              </div>

              <div className="pt-2">
                <h3 className="mb-3">Pay Package</h3>
              </div>
              <div className="list-grp-wrapper mb-3">
                <ListGroup>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div className="d-flex align-items-center gap-4-4 flex-wrap mobile-listing-itm-flex">
                        <span className="fw-500">Regular Hourly Rate</span>
                        <span className="bracket-text">
                          {`($${state.talentJobDetailsList?.RegularHourlyRate}/hr x ${state.talentJobDetailsList?.HrsPerWeek} hrs/week)`}
                        </span>
                      </div>
                      <span className="fw-500">
                        {`$${
                          state.talentJobDetailsList?.RegularHourlyRate &&
                          state.talentJobDetailsList?.HrsPerWeek
                            ? (
                                state.talentJobDetailsList?.RegularHourlyRate *
                                state.talentJobDetailsList?.HrsPerWeek
                              ).toFixed(2)
                            : ""
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div className="d-flex align-items-center gap-4-4 flex-wrap mobile-listing-itm-flex">
                        <span className="fw-500">Overtime Hourly Rate</span>
                        <span className="bracket-text">
                          {`($${state.talentJobDetailsList?.OvertimeRate}/hr x ${state.talentJobDetailsList?.OvertimeHrsPerWeek} hrs/week)`}
                        </span>
                      </div>
                      <span className="fw-500">
                        {`$${
                          state.talentJobDetailsList?.OvertimeRate &&
                          state.talentJobDetailsList?.OvertimeHrsPerWeek
                            ? (
                                state.talentJobDetailsList?.OvertimeRate *
                                state.talentJobDetailsList?.OvertimeHrsPerWeek
                              ).toFixed(2)
                            : ""
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div className="d-flex align-items-center gap-4-4 flex-wrap mobile-listing-itm-flex">
                        <span className="fw-500">Lodging Stipend</span>
                        <span className="bracket-text">
                          {`($${state.talentJobDetailsList?.HousingStipend}/hr x ${state.talentJobDetailsList?.DaysOnAssignment} hrs/week)`}
                        </span>
                      </div>
                      <span className="fw-500">
                        {`$${
                          state.talentJobDetailsList?.HousingStipend &&
                          state.talentJobDetailsList?.DaysOnAssignment
                            ? (
                                state.talentJobDetailsList?.HousingStipend *
                                state.talentJobDetailsList?.DaysOnAssignment
                              ).toFixed(2)
                            : ""
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div className="d-flex align-items-center gap-4-4 flex-wrap mobile-listing-itm-flex">
                        <span className="fw-500">
                          Meals & Incidentals Stipend
                        </span>
                        <span className="bracket-text">
                          {`($${state.talentJobDetailsList?.MealsAndIncidentals}/hr x ${state.talentJobDetailsList?.DaysOnAssignment} hrs/week)`}
                        </span>
                      </div>
                      <span className="fw-500">
                        {`$${
                          state.talentJobDetailsList?.HousingStipend &&
                          state.talentJobDetailsList?.DaysOnAssignment
                            ? (
                                state.talentJobDetailsList?.HousingStipend *
                                state.talentJobDetailsList?.DaysOnAssignment
                              ).toFixed(2)
                            : ""
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div className="d-flex align-items-center gap-4-4 flex-wrap mobile-listing-itm-flex">
                        <span className="fw-600">Total Gross Pay</span>
                        <span className="bracket-text">{`(${
                          state.talentJobDetailsList?.HrsPerWeek +
                          state.talentJobDetailsList?.OvertimeHrsPerWeek
                        } hrs/week)`}</span>
                      </div>
                      <span className="fw-500">
                        {`$${
                          state.talentJobDetailsList?.TotalGrossPay &&
                          state.talentJobDetailsList?.TotalGrossPay
                            ? state.talentJobDetailsList?.TotalGrossPay?.toFixed(
                                2
                              )
                            : ""
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </div>

              <h3 className="mb-3">Additional Pay Details</h3>
              <div className="list-grp-wrapper mb-3">
                <ListGroup>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div>
                        <span className="fw-500">Holiday Rate</span>
                      </div>
                      <span className="fw-500">
                        {" "}
                        {`$${
                          state.talentJobDetailsList?.HolidayRate
                            ? state.talentJobDetailsList?.HolidayRate?.toFixed(
                                2
                              )
                            : "-"
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div>
                        <span className="fw-500">On-Call Rate</span>
                      </div>
                      <span className="fw-500">
                        {" "}
                        {`$${
                          state.talentJobDetailsList?.OnCallRate
                            ? state.talentJobDetailsList?.OnCallRate?.toFixed(2)
                            : "-"
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div>
                        <span className="fw-500">Call Back Rate</span>
                      </div>
                      <span className="fw-500">
                        {" "}
                        {`$${
                          state.talentJobDetailsList?.CallBackRate
                            ? state.talentJobDetailsList?.CallBackRate?.toFixed(
                                2
                              )
                            : "-"
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div className="d-flex align-items-center gap-4-4 flex-wrap mobile-listing-itm-flex">
                        <span className="fw-500">Double Time Pay Rate</span>
                        <span className="bracket-text">(California Only)</span>
                      </div>
                      <span className="fw-500">
                        {" "}
                        {`$${
                          state.talentJobDetailsList?.DoubleTimeRate
                            ? state.talentJobDetailsList?.DoubleTimeRate?.toFixed(
                                2
                              )
                            : "-"
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="items-flex">
                      <div>
                        <span className="fw-500">Travel Reimbursement</span>
                      </div>
                      <span className="fw-500">
                        {" "}
                        {`$${
                          state.talentJobDetailsList?.TravelReimbursement
                            ? state.talentJobDetailsList?.TravelReimbursement?.toFixed(
                                2
                              )
                            : "-"
                        }`}
                      </span>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </div>

              <h3 style={{ marginBottom: "12px" }}>Compliance Checklist</h3>
              <ChecklistTabs
                documentList={state.talentJobDetailsList?.CompChecklist}
              />
            </div>
          </div>
          <div className="view-job-col view-job-left-side">
            <RightDetails
              details={state.talentJobDetailsList}
              requiredDocs={state.requiredDocsList}
              setFetchDetails={setFetchDetails}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewJob;
