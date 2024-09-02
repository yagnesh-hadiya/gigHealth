import { Button, Card, CardBody, ListGroup, ListGroupItem } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  debounce,
  formatDate,
  formatDateString,
  showToast,
} from "../../../helpers";
import { getAssignmentsList } from "../../../services/GigHistoryServices";
import Loader from "../../../components/custom/CustomSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import NoRecordsMessage from "../../facilities/facilitylisting/jobs/NoRecordsMessage";
import ArticleBtn from "../../../components/custom/ArticleBtn";
import ViewAssignmentModal from "./ViewAssignmentModal";
import AssignmentDocumentStatusModal from "./AssignmentDocumentStatusModal";
import AppliedJobHistoryModal from "./AppliedJobHistoryModal";
import ExpiredDocuments from "./ExpiredDocuments";
import { getStatusColor } from "../../../constant/StatusColors";
import AssignmentJobHistoryMobileModal from "./AssignmentJobHistoryMobileModal";
import { setViewPage } from "../../../store/ProfessionalAuthStore";
import { useDispatch } from "react-redux";
interface AssignmentProps {
  search: string;
  startDate: Date | null;
  endDate: Date | null;
}
const Assignment = ({ search, startDate, endDate }: AssignmentProps) => {
  const navigate = useNavigate();
  const size = 15;
  const abortController = new AbortController();
  const pageRef = useRef<number>(1);
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">(
    "loading"
  );
  const [jobId, setJobId] = useState<number>(0);
  const [jobApplicationId, setJobApplicationId] = useState<number>(0);
  const [jobAssignmentId, setJobAssignmentId] = useState<number>(0);
  const [abort, setAbort] = useState<boolean>(false);
  const [assignmentList, setAssignmentList] = useState<{
    total: number;
    data: any;
  }>({
    total: 0,
    data: [],
  });
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const fetchAssignment = debounce(async () => {
    try {
      setLoading("loading");
      const response = await getAssignmentsList(
        size,
        pageRef.current,
        abortController,
        search,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      if (pageRef.current === 1) {
        setAssignmentList({
          data: response?.rows || [],
          total: response?.count,
        });
      } else {
        setAssignmentList(
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
    fetchAssignment();
    return () => abortController.abort();
  }, [abort, search, startDate, endDate]);

  const fetchMoreAssignment = async () => {
    try {
      const response = await getAssignmentsList(
        size,
        pageRef.current,
        abortController,
        search,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      if (pageRef.current === 1) {
        setAssignmentList({
          data: response?.rows || [],
          total: response?.count,
        });
      } else {
        setAssignmentList(
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

  return (
    <div className="job-listings">
      <div className="job-list-cards-wr">
        {loading === "loading" ? (
          <Loader styles={{ top: "10%" }} />
        ) : assignmentList?.data?.length == 0 ? (
          <NoRecordsMessage msg={"There are no records to display"} />
        ) : (
          <InfiniteScroll
            dataLength={assignmentList.data.length}
            next={fetchMoreAssignment}
            hasMore={assignmentList.total > assignmentList.data?.length}
            loader={<Loader styles={{ position: "relative" }} />}
            scrollableTarget="custom-scrollable-target2"
          >
            {assignmentList?.data?.map((item: any) => {
              return (
                <Card key={item.Id} className="job-list-card assignment-card">
                  <CardBody className="job-list-card-body">
                    <div className="d-flex align-items-center justify-content-between gap-0-20 mobile-wrap">
                      <h3 className="list-title m-b-12 text-capitalize">
                        {item?.Job?.Title ? item?.Job?.Title : ""}
                      </h3>
                      <div className="d-flex m-b-12">
                        <h3 className="price-title mb-0 me-3 text-nowrap">
                          ${item?.TotalGrossPay?.toFixed(2) ?? ""}
                          <span>/week</span>
                        </h3>
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
                        Start Date:{" "}
                        <span className="fw-400">
                          {item.StartDate
                            ? formatDateString(item.StartDate)
                            : "-"}
                        </span>
                      </p>
                      <p className="mb-0">
                        End Date:{" "}
                        <span className="fw-400">
                          {item.StartDate
                            ? formatDateString(item.EndDate)
                            : "-"}
                        </span>
                      </p>
                      {/* <p className="mb-0">
                        Compliance Associate: <span className="fw-400">-</span>
                      </p> */}
                    </div>
                    <div className="d-flex align-items-center justify-content-between mobile-wrap gap-12-0 gigs-flex mb-3">
                      <h3 className="list-title m-0">Placement Details</h3>
                      <Button
                        className="blue-gradient-btn mb-0 mobile-btn"
                        onClick={() => handleViewJob(item?.Job.Id)}
                      >
                        View Job
                      </Button>
                    </div>
                    <div className="dt-wrapper custom-table-wrapper mb-3 for-desktop-only">
                      <table>
                        <thead>
                          <tr>
                            <th>Profession</th>
                            <th>Unit</th>
                            <th>Scrub Color</th>
                            <th>Compliance Due</th>
                            <th>Document Status</th>
                            <th>Start & End Date</th>
                            <th>Application Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="inside-div">
                                {item.JobProfession.Profession}
                              </div>
                            </td>
                            <td>
                              <div className="inside-div text-capitalize">
                                {item.Unit}
                              </div>
                            </td>
                            <td>
                              <div className="inside-div">
                                {item?.Job.ScrubColor?.Color ?? "-"}
                              </div>
                            </td>
                            <td>
                              <div className="inside-div">
                                {item.ComplianceDueDate}
                              </div>
                            </td>
                            <td>
                              <div className="inside-div">
                                {item.JobApplication !== null ? (
                                  <AssignmentDocumentStatusModal
                                    selectedItem={item.JobComplianceDocuments}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="inside-div">
                                {item.StartDate
                                  ? formatDateString(item.StartDate)
                                  : "-"}{" "}
                                -{" "}
                                {item.EndDate
                                  ? formatDateString(item.EndDate)
                                  : "-"}
                              </div>
                            </td>
                            <td>
                              <div className="inside-div">
                                <div
                                  className="assignment-talent"
                                  style={{
                                    color: getStatusColor(
                                      item.JobApplicationStatus.Status
                                    ),
                                    borderColor: getStatusColor(
                                      item.JobApplicationStatus.Status
                                    ),
                                  }}
                                >
                                  {item.JobApplicationStatus.Status}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="inside-div">
                                <div className="center-align d-flex text-nowrap ">
                                  <ArticleBtn
                                    onEye={() => {
                                      setJobApplicationId(
                                        item.JobApplicationId
                                      );
                                      setJobAssignmentId(item.Id);
                                      setJobId(item.Job.Id);
                                      setAssignmentModal(true);
                                    }}
                                  />

                                  {!isMobile && (
                                    <AppliedJobHistoryModal
                                      slotId={item.Id}
                                      jobId={item.Job.Id}
                                      jobApplicationId={item.JobApplicationId}
                                      history={true}
                                    />
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="listing-for-mobile-only">
                      <div className="list-grp-wrapper mb-3">
                        <ListGroup>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Profession</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                <p className="fw-500">
                                  {item.JobProfession.Profession}
                                </p>
                              </div>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Unit</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                <p className="fw-500 text-capitalize">
                                  {item.Unit}
                                </p>
                              </div>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Scrub Color</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                <p className="fw-500">
                                  {item?.Job.ScrubColor?.Color ?? "-"}
                                </p>
                              </div>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Compliance Due</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                <p className="fw-500">
                                  {item.ComplianceDueDate}
                                </p>
                              </div>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Document Status</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                {item.JobApplication !== null ? (
                                  <AssignmentDocumentStatusModal
                                    isMobile={true}
                                    selectedItem={item.JobComplianceDocuments}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Start & End Date</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                {item.StartDate
                                  ? formatDateString(item.StartDate)
                                  : "-"}{" "}
                                -{" "}
                                {item.EndDate
                                  ? formatDateString(item.EndDate)
                                  : "-"}
                              </div>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Application Status</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                <div className="inside-div">
                                  <span
                                    style={{
                                      color: getStatusColor(
                                        item.JobApplicationStatus.Status
                                      ),
                                      borderColor: getStatusColor(
                                        item.JobApplicationStatus.Status
                                      ),
                                    }}
                                  >
                                    {item.JobApplicationStatus.Status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className="items-flex">
                              <div className="width-48">
                                <h3>Action</h3>
                              </div>
                              <div className="width-48 d-flex justify-content-end">
                                <div className="d-flex">
                                  <ArticleBtn
                                    onEye={() => {
                                      setJobApplicationId(
                                        item.JobApplicationId
                                      );
                                      setJobAssignmentId(item.Id);
                                      setJobId(item.Job.Id);
                                      setAssignmentModal(true);
                                    }}
                                  />
                                  {isMobile && (
                                    <AssignmentJobHistoryMobileModal
                                      slotId={item.Id}
                                      jobId={item.Job.Id}
                                      jobApplicationId={item.JobApplicationId}
                                      history={true}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </ListGroupItem>
                        </ListGroup>
                      </div>
                    </div>
                    {item.JobComplianceDocuments && (
                      <ExpiredDocuments doc={item} />
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </InfiniteScroll>
        )}
      </div>
      {assignmentModal && (
        <ViewAssignmentModal
          isOpen={assignmentModal}
          toggle={() => setAssignmentModal((prev) => !prev)}
          jobId={jobId}
          jobApplicationId={jobApplicationId}
          jobAssignmentId={jobAssignmentId}
        />
      )}
    </div>
  );
};

export default Assignment;
