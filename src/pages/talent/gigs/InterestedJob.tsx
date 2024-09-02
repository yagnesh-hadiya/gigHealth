import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import {
  debounce,
  formatDate,
  formatDateString,
  showToast,
} from "../../../helpers";
import { getInterestedJobList } from "../../../services/GigHistoryServices";
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
import { setViewPage } from "../../../store/ProfessionalAuthStore";
import { useDispatch } from "react-redux";
interface InterestedJobProps {
  search: string;
  startDate: Date | null;
  endDate: Date | null;
}
const InterestedJob = ({ search, startDate, endDate }: InterestedJobProps) => {
  const navigate = useNavigate();
  const size = 15;
  const abortController = new AbortController();
  const pageRef = useRef<number>(1);
  const jobIdRef = useRef<number | undefined>();
  const [loading, setLoading] = useState<"idle" | "loading" | "error">(
    "loading"
  );
  const [callBack, setCallBack] = useState<boolean>(false);
  const [abort, setAbort] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [interestedJobList, setInterestedJobList] = useState<{
    total: number;
    data: any;
  }>({
    total: 0,
    data: [],
  });
  const dispatch = useDispatch();

  const toggleModal = () => setModal((prev) => !prev);

  const fetchInterestedJobs = debounce(async () => {
    try {
      setLoading("loading");
      const response = await getInterestedJobList(
        size,
        pageRef.current,
        abortController,
        search,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      if (pageRef.current === 1) {
        setInterestedJobList({
          data:
            response?.rows.map((row: any) => ({ ...row, interested: true })) ||
            [], // Initialize interested key to true
          total: response?.count,
        });
      } else {
        setInterestedJobList(
          (prevJobList: { total: number; data: SearchJobList[] }) => {
            const newJobList = [
              ...prevJobList.data,
              ...response?.rows
                ?.filter(
                  (newJob: SearchJobList) =>
                    !prevJobList.data.some(
                      (prevJob: SearchJobList) => prevJob?.Id === newJob?.Id
                    )
                )
                .map((newJob: any) => ({ ...newJob, interested: true })),
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
    fetchInterestedJobs();
    return () => abortController.abort();
  }, [abort, search, startDate, endDate, callBack]);

  const fetchMoreInterestedJobs = async () => {
    try {
      const response = await getInterestedJobList(
        size,
        pageRef.current,
        abortController,
        search,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      if (pageRef.current === 1) {
        setInterestedJobList({
          data:
            response?.rows.map((row: any) => ({ ...row, interested: true })) ||
            [], // Initialize interested key to true
          total: response?.count,
        });
      } else {
        setInterestedJobList(
          (prevJobList: { total: number; data: SearchJobList[] }) => {
            const newJobList = [
              ...prevJobList.data,
              ...response?.rows
                ?.filter(
                  (newJob: SearchJobList) =>
                    !prevJobList.data.some(
                      (prevJob: SearchJobList) => prevJob?.Id === newJob?.Id
                    )
                )
                .map((newJob: any) => ({ ...newJob, interested: true })),
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

  const handleApplyButton = (Id: number) => {
    const isLoggedIn = getLoggedInStatus();

    if (isLoggedIn) {
      navigate(`/talent/search-jobs/view-jobs/${Id}`);
    }
  };

  const getJobApplicationIndex = (jobId: number) => {
    const job = interestedJobList?.data?.find(
      (j: { Job: { Id: number } }) => j?.Job?.Id === jobId
    );
    if (job) {
      const id = job?.Job?.JobApplications[0]?.Id;
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

  const handleJobInterest = async (id: number, interested: boolean) => {
    try {
      const res = await getMarkJobInterest(id, !interested);
      if (res.status === 200) {
        setInterestedJobList((prevList) => ({
          total: prevList.total,
          data: prevList.data.map((item: { Job: { Id: number } }) =>
            item.Job?.Id === id ? { ...item, interested: !interested } : item
          ),
        }));
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="job-listings">
      <div className="job-list-cards-wr">
        {loading === "loading" ? (
          <Loader styles={{ top: "10%" }} />
        ) : interestedJobList?.data?.length == 0 ? (
          <NoRecordsMessage msg={"There are no records to display"} />
        ) : (
          <InfiniteScroll
            dataLength={interestedJobList.data.length}
            next={fetchMoreInterestedJobs}
            hasMore={interestedJobList.total > interestedJobList.data?.length}
            loader={<Loader styles={{ position: "relative" }} />}
            scrollableTarget="custom-scrollable-target1"
          >
            {interestedJobList?.data?.map((item: any) => {
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
                        <Button
                          color="link"
                          className={`transparent-btn like-btn ${
                            item.interested ? "active" : ""
                          }`}
                          onClick={() =>
                            handleJobInterest(item.Job?.Id, item.interested)
                          }
                        >
                          <span className="material-symbols-outlined">
                            favorite
                          </span>
                        </Button>
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
                          {item?.Job?.Facility?.Name
                            ? item?.Job.Facility.Name
                            : ""}
                        </p>
                      </div>
                      <div className="d-flex align-items-center m-b-12">
                        <span className="location-icon material-symbols-outlined me-2">
                          location_on
                        </span>
                        <p className="mb-0">
                          {item?.Job?.Facility?.Address
                            ? item?.Job.Facility.Address
                            : ""}
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
                        Hours Per Week:{" "}
                        <span className="fw-400">
                          {item.Job.HrsPerWeek} Hours
                        </span>
                      </p>
                      <p className="mb-0">
                        Openings:{" "}
                        <span className="fw-400">{item.Job.NoOfOpenings}</span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mobile-wrap gap-12-0 gigs-flex">
                      <div className="d-flex">
                        {isWithinPrevious1Month(item.Job.CreatedOn) && (
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
                        <div className="gigs-badge">
                          <p>
                            Saved On:{" "}
                            <span className="fw-400">
                              {formatDateString(item.CreatedOn)}{" "}
                              {moment(item.CreatedOn).format("hh:mm:ss")}
                            </span>
                          </p>
                        </div>
                        {item?.Job?.JobApplications &&
                        item?.Job.JobApplications.length > 0 ? (
                          item.Job.JobApplications.some(
                            (app: {
                              JobApplicationStatus: { Status: string };
                            }) =>
                              app.JobApplicationStatus?.Status === "Applied" ||
                              app.JobApplicationStatus?.Status === "Submitted"
                          ) ? (
                            <Button
                              className="purple-outline-btn mb-0"
                              outline
                              style={{ minWidth: "100px" }}
                              onClick={() => {
                                toggleModal();
                                jobIdRef.current = item?.Job.Id;
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
                                item?.Job?.JobApplications[0]
                                  ?.JobApplicationStatus?.Status
                              }
                            </Button>
                          )
                        ) : (
                          item.Job.JobStatus.Status !== "On Hold" && (
                            <Button
                              className="yellow-btn mb-0 mobile-btn"
                              onClick={() => handleApplyButton(item?.Job?.Id)}
                              style={{ minWidth: "100px" }}
                            >
                              Apply Now
                            </Button>
                          )
                        )}
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
          onWithdraw={() => handleWithDraw(jobIdRef.current)}
        />
      )}
    </div>
  );
};

export default InterestedJob;
