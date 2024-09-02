import { Form, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, FormGroup, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomSelect from "../../../components/custom/CustomSelect";
import { getMarkJobInterest } from "../../../services/SearchJobsServices";
import Building from ".././.././../assets/images/building.svg";
import { showToast } from "../../../helpers";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import NoRecordsMessage from "../../facilities/facilitylisting/jobs/NoRecordsMessage";
import { getLoggedInStatus } from "../../../services/ProfessionalAuth";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import { TalentJobsListingType } from "../../../types/TalentJobs";
import WithdrawModal from "./WithdrawModal";
import { jobWithdraw } from "../../../services/TalentJobs";
import { useDispatch } from "react-redux";
import { setViewPage } from "../../../store/ProfessionalAuthStore";

const sortByOption = [
  {
    label: "Highest Pay",
    value: 1,
  },
  {
    label: "Newest",
    value: 2,
  },
  {
    label: "Start Date",
    value: 3,
  },
];
interface JobListingProps {
  loading: Boolean;
  toggle: () => void;
  jobList: any;
  sortByFilter: any;
  setSortByFilter: any;
  search: any;
  setSearch: any;
  callBack: any;
  setFetchJobsList: React.Dispatch<SetStateAction<boolean>>;
}
const JobListing = ({
  loading,
  toggle,
  jobList,
  sortByFilter,
  setSortByFilter,
  setSearch,
  search,
  callBack,
  setFetchJobsList,
}: JobListingProps) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState<boolean>(false);
  const [loadings, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const toggleModal = () => setModal((prev) => !prev);
  const jobIdRef = useRef<number | undefined>();
  const dispatch = useDispatch();

  const handleCategoryChange = (selectedOption: any) => {
    setSortByFilter(
      selectedOption === null ? { label: "--", value: 0 } : selectedOption
    );
  };
  const [favoriteStatus, setFavoriteStatus] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    if (getLoggedInStatus() && jobList && jobList.data) {
      const initialFavoriteStatus = jobList.data.reduce(
        (status: any, item: { Id: any; JobInterests: string | any[] }) => ({
          ...status,
          [item.Id]: item.JobInterests.length > 0,
        }),
        {}
      );
      setFavoriteStatus(initialFavoriteStatus);
    }
  }, [jobList]);

  const handleJobInterest = async (id: number, isFavorite: boolean) => {
    try {
      const res = await getMarkJobInterest(id, !isFavorite);
      if (res.status === 200) {
        setFavoriteStatus((prevStatus) => ({
          ...prevStatus,
          [id]: !isFavorite,
        }));
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleChange = (text: string) => {
    setSearch(text);
  };

  const isWithinPrevious1Month = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return date >= oneMonthAgo && date <= today;
  };

  const viewJobClick = (Id: number) => {
    const isLoggedIn = getLoggedInStatus();
    dispatch(setViewPage("Search Jobs"));
    if (isLoggedIn) {
      navigate(`/talent/search-jobs/view-jobs/${Id}`);
    } else {
      navigate("/talent/register");
    }
  };

  const handleApplyButton = (Id: number) => {
    const isLoggedIn = getLoggedInStatus();

    if (isLoggedIn) {
      navigate(`/talent/search-jobs/view-jobs/${Id}`);
    }
  };

  const getJobApplicationIndex = (jobId: number) => {
    const job: TalentJobsListingType = jobList?.data?.find(
      (j: TalentJobsListingType) => j?.Id === jobId
    );
    if (job) {
      const id = job?.JobApplications[0]?.Id;
      return id;
    }
  };

  const handleWithDraw = async (jobId: number | undefined) => {
    const applicationIndex = getJobApplicationIndex(jobId ?? 0);
    try {
      setLoading("loading");
      if (jobId && applicationIndex) {
        const response = await jobWithdraw(jobId, applicationIndex);
        if (response.status === 200) {
          showToast(
            "success",
            "Job application withdraw successfully" || response.data?.message
          );
          setFetchJobsList((prev) => !prev);
        }
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

  return (
    <>
      {loadings === "loading" && <Loader />}
      <div className="job-listings">
        <div className="listing-input-wr w-100">
          <div className="d-flex align-items-center">
            <Button
              onClick={toggle}
              color="link"
              className="transparent-btn filter-slider-icon me-2"
            >
              <span className="material-symbols-outlined">tune</span>
              filter
            </Button>
            <div className="w-100">
              <Form>
                <FormGroup className="search-input-wr mb-0">
                  <CustomInput
                    type="text"
                    placeholder="Search Your Job Here"
                    id="auth_email"
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e.target.value);
                    }}
                  />
                  <span className="material-symbols-outlined">search</span>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h3 className="job-listing-title mb-2 me-2">
            {jobList.total} Openings{" "}
            {jobList.total > 0 && (
              <span>({jobList.newJobCount} New Openings)</span>
            )}
          </h3>
          <div className="d-flex align-items-center drp-without-borders mb-2">
            <Label for="select_profession" className="mb-0 flex-label">
              Sort By:
            </Label>
            <CustomSelect
              value={sortByFilter}
              id="select_sort_by_filter"
              placeholder="--"
              onChange={handleCategoryChange}
              name=""
              noOptionsMessage={() => ""}
              options={sortByOption}
              isSearchable={false}
              isClearable={sortByFilter?.value === 0 ? false : true}
            />
          </div>
        </div>
        <div className="job-list-cards-wr" id="custom-scrollable-target">
          {loading ? (
            <Loader styles={{ top: "10%", left: "10%" }} />
          ) : jobList?.data?.length == 0 ? (
            <NoRecordsMessage msg={"There are no records to display"} />
          ) : (
            <InfiniteScroll
              dataLength={jobList.data.length}
              next={callBack}
              hasMore={jobList.total > jobList.data?.length}
              loader={<Loader styles={{ position: "relative" }} />}
              scrollableTarget="custom-scrollable-target"
            >
              {jobList?.data?.map((item: TalentJobsListingType) => {
                return (
                  <Card key={item.Id} className="job-list-card">
                    <CardBody className="job-list-card-body">
                      <div className="d-flex align-items-center justify-content-between gap-0-20 mobile-wrap">
                        <h3 className="list-title m-b-12 text-capitalize">
                          {item?.Title ? item.Title : ""}
                        </h3>
                        <div className="d-flex m-b-12">
                          <h3
                            className={`${
                              getLoggedInStatus() ? "me-3" : "me-0"
                            } price-title mb-0 text-nowrap`}
                          >
                            ${item.TotalGrossPay.toFixed(2)}
                            <span>/week</span>
                          </h3>

                          {getLoggedInStatus() && (
                            <Button
                              color="link"
                              className={`transparent-btn like-btn ${
                                favoriteStatus[item.Id] ? "active" : ""
                              }`}
                              onClick={() =>
                                handleJobInterest(
                                  item.Id,
                                  favoriteStatus[item.Id]
                                )
                              }
                            >
                              <span className="material-symbols-outlined">
                                favorite
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center m-b-12">
                        {getLoggedInStatus() && (
                          <>
                            <img src={Building} />
                            <span className="hospital-detail-text me-2 text-capitalize">
                              {item?.Facility?.Name ? item.Facility.Name : ""}
                            </span>
                          </>
                        )}
                        <span className="location-icon material-symbols-outlined me-1">
                          location_on
                        </span>
                        <p className="mb-0">{item.Facility.State.State}</p>
                      </div>
                      <div className="d-flex align-items-center flex-wrap list-gap m-b-12">
                        <p className="mb-0">
                          Profession:{" "}
                          <span className="fw-400">
                            {item.JobProfession.Profession}
                          </span>
                        </p>
                        <p className="mb-0">
                          Specialty:{" "}
                          <span className="fw-400">
                            {item.JobSpeciality.Speciality}
                          </span>
                        </p>
                        <p className="mb-0">
                          Hours Per Week:{" "}
                          <span className="fw-400">{item.HrsPerWeek}</span>
                        </p>
                        <p className="mb-0">
                          Openings:{" "}
                          <span className="fw-400">{item.NoOfOpenings}</span>
                        </p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mobile-wrap gap-12-0">
                        <div className="d-flex">
                          {isWithinPrevious1Month(item.CreatedOn) && (
                            <div className="list-badge new-badge me-2">NEW</div>
                          )}
                          <div className="list-badge me-2">
                            Job ID: {item?.Id}
                          </div>
                          <div
                            className={`${
                              item.JobStatus.Status === "Active-Featured" ||
                              item.JobStatus.Status === "Active"
                                ? "active-badge"
                                : item.JobStatus.Status === "On Hold"
                                ? "on-hold-badge"
                                : "bg-danger text-white"
                            } list-badge me-2`}
                          >
                            {item.JobStatus.Status}
                          </div>
                        </div>
                        <div className="d-flex" style={{ gap: "10px" }}>
                          {getLoggedInStatus() &&
                          item?.JobApplications &&
                          item?.JobApplications.length > 0 ? (
                            item.JobApplications.some(
                              (app) =>
                                app.JobApplicationStatus?.Status ===
                                  "Applied" ||
                                app.JobApplicationStatus?.Status === "Submitted"
                            ) ? (
                              <Button
                                className="purple-outline-btn mb-0"
                                outline
                                style={{ minWidth: "100px" }}
                                onClick={() => {
                                  toggleModal();
                                  jobIdRef.current = item?.Id;
                                }}
                              >
                                Withdraw
                              </Button>
                            ) : (
                              <Button
                                className="purple-outline-btn"
                                outline
                                style={{
                                  minWidth: "100px",
                                  color: "#7f47dd",
                                }}
                                disabled
                              >
                                {
                                  item?.JobApplications[0]?.JobApplicationStatus
                                    ?.Status
                                }
                              </Button>
                            )
                          ) : (
                            item.JobStatus.Status !== "On Hold" &&
                            getLoggedInStatus() && (
                              <Button
                                className="yellow-btn mb-0 mobile-btn"
                                onClick={() => handleApplyButton(item?.Id)}
                                style={{ minWidth: "100px" }}
                              >
                                Apply Now
                              </Button>
                            )
                          )}
                          <Button
                            className="blue-gradient-btn  mb-0 mobile-btn"
                            onClick={() => viewJobClick(item?.Id)}
                          >
                            View Job
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </InfiniteScroll>
          )}
        </div>
      </div>
      {modal && (
        <WithdrawModal
          isOpen={modal}
          toggle={toggleModal}
          onWithdraw={() => handleWithDraw(jobIdRef.current)}
        />
      )}
    </>
  );
};

export default JobListing;
