import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import {
  debounce,
  formatDate,
  formatDateString,
  showToast,
} from "../../../helpers";
import { getAppliedJobList } from "../../../services/GigHistoryServices";
import Loader from "../../../components/custom/CustomSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import NoRecordsMessage from "../../facilities/facilitylisting/jobs/NoRecordsMessage";
import { getMarkJobInterest } from "../../../services/SearchJobsServices";
import { toast } from "react-toastify";
import { isWithinPrevious1Month } from "../../common";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import WithdrawModal from "../searchjobs/WithdrawModal";
import { jobWithdraw } from "../../../services/TalentJobs";
import { getLoggedInStatus } from "../../../services/ProfessionalAuth";
import AppliedJobHistoryModal from "./AppliedJobHistoryModal";
import AssignmentJobHistoryMobileModal from "./AssignmentJobHistoryMobileModal";
import { setViewPage } from "../../../store/ProfessionalAuthStore";
import { useDispatch } from "react-redux";
interface AppliedJobsProps {
  search: string;
  startDate: Date | null;
  endDate: Date | null;
}
const AppliedJobs = ({ search, startDate, endDate }: AppliedJobsProps) => {
  const navigate = useNavigate();
  const [callBack, setCallBack] = useState<boolean>(false);
  const size = 15;
  const abortController = new AbortController();
  const pageRef = useRef<number>(1);
  const jobIdsRef = useRef<number | undefined>();
  const [loading, setLoading] = useState<"idle" | "loading" | "error">(
    "loading"
  );
  const [abort, setAbort] = useState<boolean>(false);
  const [appliedJobList, setAppliedJobList] = useState<{
    total: number;
    data: any;
  }>({
    total: 0,
    data: [],
  });
  const dispatch = useDispatch();
  const [modal, setModal] = useState<boolean>(false);
  const toggleModal = () => setModal((prev) => !prev);

  const [favoriteStatus, setFavoriteStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Set to true if screen width is less than 768px
    };

    // Initial check on component mount
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (getLoggedInStatus() && appliedJobList && appliedJobList.data) {
      const initialFavoriteStatus = appliedJobList.data.reduce(
        (
          status: any,
          item: { Job: { Id: any; JobInterests: string | any[] } }
        ) => ({
          ...status,
          [item.Job.Id]: item.Job.JobInterests.length > 0,
        }),
        {}
      );
      setFavoriteStatus(initialFavoriteStatus);
    }
  }, [appliedJobList]);

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

  const fetchAppliedJobs = debounce(async () => {
    try {
      setLoading("loading");
      const response = await getAppliedJobList(
        size,
        pageRef.current,
        abortController,
        search,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      if (pageRef.current === 1) {
        setAppliedJobList({
          data: response?.rows || [],
          total: response?.count,
        });
      } else {
        setAppliedJobList(
          (prevJobList: { total: number; data: SearchJobList[] }) => {
            const newJobList = [
              ...prevJobList.data,
              ...response?.rows?.filter(
                (newJob: SearchJobList) =>
                  !prevJobList.data.some(
                    (prevJob: SearchJobList) => prevJob?.Id === newJob?.Id
                  )
              ),
            ];
            return {
              total: response?.count,
              data: newJobList,
            };
          }
        );
      }
      pageRef.current += 1;
      setLoading("idle");
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      setLoading("idle");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 200);

  useEffect(() => {
    pageRef.current = 1;
    fetchAppliedJobs();
    return () => abortController.abort();
  }, [abort, search, startDate, endDate, callBack]);

  const fetchMoreInterestedJobs = async () => {
    try {
      const response = await getAppliedJobList(
        size,
        pageRef.current,
        abortController,
        search,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      if (pageRef.current === 1) {
        setAppliedJobList({
          data: response?.rows || [],
          total: response?.count,
        });
      } else {
        setAppliedJobList(
          (prevJobList: { total: number; data: SearchJobList[] }) => {
            const newJobList = [
              ...prevJobList.data,
              ...response?.rows?.filter(
                (newJob: SearchJobList) =>
                  !prevJobList.data.some(
                    (prevJob: SearchJobList) => prevJob?.Id === newJob?.Id
                  )
              ),
            ];
            return {
              total: response?.count,
              data: newJobList,
            };
          }
        );
      }
      pageRef.current += 1;
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  const handleViewJob = (Id: number) => {
    dispatch(setViewPage("Gigs"));
    navigate(`/talent/search-jobs/view-jobs/${Id}`);
  };

  const getJobApplicationIndex = (jobId: number) => {
    const job = appliedJobList?.data?.find(
      (j: { Job: { Id: number } }) => j?.Job?.Id === jobId
    );
    if (job) {
      const id = job?.Id;
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
          setCallBack((prev) => !prev);
        }
      }
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
    <div className="job-listings">
      <div className="job-list-cards-wr">
        {loading === "loading" ? (
          <Loader styles={{ top: "10%" }} />
        ) : appliedJobList?.data?.length == 0 ? (
          <NoRecordsMessage msg={"There are no records to display"} />
        ) : (
          <InfiniteScroll
            dataLength={appliedJobList.data.length}
            next={fetchMoreInterestedJobs}
            hasMore={appliedJobList.total > appliedJobList.data?.length}
            loader={<Loader styles={{ position: "relative" }} />}
            scrollableTarget="custom-scrollable-target2"
          >
            {appliedJobList?.data?.map((item: any) => {
              return (
                <Card className="job-list-card" key={item.Id}>
                  <CardBody className="job-list-card-body">
                    <div className="d-flex align-items-center justify-content-between gap-0-20 mobile-wrap">
                      <h3 className="list-title text-capitalize">
                        {item?.Job?.Title ? item?.Job?.Title : ""}
                      </h3>
                      <div className="d-flex m-b-12">
                        <h3 className="price-title mb-0 me-3 text-nowrap">
                          ${item?.Job?.TotalGrossPay.toFixed(2)}
                          <span>/week</span>
                        </h3>
                        {getLoggedInStatus() && (
                          <Button
                            color="link"
                            className={`transparent-btn like-btn ${
                              favoriteStatus[item.Job.Id] ? "active" : ""
                            }`}
                            onClick={() =>
                              handleJobInterest(
                                item.Job.Id,
                                favoriteStatus[item.Job.Id]
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
                    <div
                      className="d-flex flex-wrap"
                      style={{ gap: "10px 15px" }}
                    >
                      <div className="d-flex align-items-center m-b-12">
                        <span className="location-icon material-symbols-outlined me-2">
                          corporate_fare
                        </span>
                        <p className="mb-0 text-capitalize">
                          {item?.Facility?.Name ? item.Facility.Name : ""}
                        </p>
                      </div>
                      <div className="d-flex align-items-center m-b-12">
                        <span className="location-icon material-symbols-outlined me-2">
                          location_on
                        </span>
                        <p className="mb-0 text-capitalize">
                          {item?.Facility?.Address ?? ""}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center flex-wrap list-gap m-b-12">
                      <p className="mb-0">
                        Profession:{" "}
                        <span className="fw-400">
                          {item.Job.JobProfession.Profession}
                        </span>
                      </p>
                      <p className="mb-0">
                        Specialty:{" "}
                        <span className="fw-400">
                          {item.Job.JobSpeciality.Speciality}
                        </span>
                      </p>
                      <p className="mb-0">
                        Start Date:{" "}
                        <span className="fw-400">
                          {item.Job.ContractStartDate
                            ? formatDateString(item.Job.ContractStartDate)
                            : "-"}
                        </span>
                      </p>
                      <p className="mb-0">
                        Duration:{" "}
                        <span className="fw-400">
                          {item.Job.ContractLength} Weeks
                        </span>
                      </p>
                      <p className="mb-0">
                        Experience:{" "}
                        <span className="fw-400">
                          {item.Job.MinYearsExperience
                            ? item.Job.MinYearsExperience + " Years"
                            : "-"}
                        </span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mobile-wrap gap-12-0 gigs-flex">
                      <div className="d-flex">
                        {isWithinPrevious1Month(item.Job.AppliedOn) && (
                          <div className="list-badge new-badge me-2">NEW</div>
                        )}
                        <div className="list-badge me-2">
                          Job ID: {item.Job?.Id}
                        </div>
                        <div
                          className={`${
                            item.Job.JobStatus.Status === "Active-Featured" ||
                            item.Job.JobStatus.Status === "Active"
                              ? "active-badge"
                              : item.Job.JobStatus.Status === "On Hold"
                              ? "on-hold-badge"
                              : "bg-danger text-white"
                          } list-badge me-2`}
                        >
                          {item.Job.JobStatus.Status}
                        </div>
                      </div>
                      <div
                        className="right-buttons-wrapper"
                        style={{ gap: "8px 10px" }}
                      >
                        {isMobile ? (
                          <AssignmentJobHistoryMobileModal
                            slotId={item.Id}
                            jobId={item.Job.Id}
                            jobApplicationId={item.Id}
                          />
                        ) : (
                          <AppliedJobHistoryModal
                            slotId={item.Id}
                            jobId={item.Job.Id}
                            jobApplicationId={item.Id}
                          />
                        )}
                        <div className="gigs-badge">
                          <p>
                            Applied On:{" "}
                            <span className="fw-400">
                              {formatDateString(item.AppliedOn)}{" "}
                              {moment(item.AppliedOn).format("hh:mm:ss")}
                            </span>
                          </p>
                        </div>
                        <Button
                          className="blue-gradient-btn mb-0 mobile-btn"
                          onClick={() => handleViewJob(item?.Job.Id)}
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
      {modal && (
        <WithdrawModal
          isOpen={modal}
          toggle={toggleModal}
          onWithdraw={() => handleWithDraw(jobIdsRef.current)}
        />
      )}
    </div>
  );
};

export default AppliedJobs;
