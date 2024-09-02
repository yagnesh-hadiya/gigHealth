import { SetStateAction, useRef, useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { capitalize } from "../../../helpers";
import InfiniteScroll from "react-infinite-scroll-component";
import NoRecordsMessage from "../../facilities/facilitylisting/jobs/NoRecordsMessage";
import Loader from "../../../components/custom/CustomSpinner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setViewPage } from "../../../store/ProfessionalAuthStore";
interface SuggestedJobsProps {
  suggestedJobList: {
    total: number;
    data: SuggestedJob[];
  };
  callBack: () => void;
  perPage: number;
  pageNo: number;
  loading: "idle" | "loading" | "error";
}
const SuggestedJobs = ({
  suggestedJobList,
  callBack,
  perPage,
  pageNo,
  loading,
}: SuggestedJobsProps) => {
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const startDrag = (e: {
    pageX: number;
    currentTarget: { offsetLeft: number; scrollLeft: SetStateAction<number> };
  }) => {
    setIsDown(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };
  const navigate = useNavigate();

  const endDrag = () => {
    setIsDown(false);
  };

  const drag = (e: {
    preventDefault: () => void;
    pageX: number;
    currentTarget: { offsetLeft: number; scrollLeft: number };
  }) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 1;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        left: container.scrollWidth,
        behavior: "smooth",
      });
    }
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

  const handleViewJob = (Id: number) => {
    dispatch(setViewPage("Home"));
    navigate(`/talent/search-jobs/view-jobs/${Id}`);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="home-title mb-1">Suggested Jobs</h3>
        {suggestedJobList && suggestedJobList.data?.length > 0 && (
          <div className="home-pagination-wr">
            <p>
              {pageNo}-{perPage} of {suggestedJobList.total} Jobs
            </p>
            <Button
              color="link"
              className="transparent-btn pagination-nav-btn"
              onClick={scrollToStart}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </Button>
            <Button
              color="link"
              className="transparent-btn pagination-nav-btn"
              onClick={scrollToEnd}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </Button>
          </div>
        )}
      </div>

      <div
        id="custom-scrollable-target"
        className="card-x-scroll-wr mb-0 "
        onMouseDown={startDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onMouseMove={drag}
        ref={scrollContainerRef}
      >
        {suggestedJobList?.data?.length == 0 && loading === "idle" ? (
          <NoRecordsMessage msg={"No suggested jobs found..!"} />
        ) : (
          <InfiniteScroll
            dataLength={suggestedJobList.data.length}
            next={callBack}
            hasMore={suggestedJobList.total > suggestedJobList.data?.length}
            loader={
              <Loader
                styles={{
                  position: "relative",
                }}
              />
            }
            className="align-items-center card-x-scroll-wr mb-3"
            scrollableTarget="custom-scrollable-target"
          >
            {suggestedJobList?.data?.map((item: SuggestedJob) => (
              <Card className="main-home-card" key={item.Id}>
                <CardBody>
                  <div className="d-flex mobile-title-flex-home align-items-center justify-content-between">
                    <h3 className="m-b-12 me-3">
                      {item?.Title ? capitalize(item.Title) : ""}
                    </h3>
                    <h3 className="price m-b-12">
                      ${item.TotalGrossPay.toFixed(2)}
                      <span>/week</span>
                    </h3>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span className="material-symbols-outlined me-2">
                      corporate_fare
                    </span>
                    <p className="mb-0">
                      {item?.Facility?.Name
                        ? capitalize(item.Facility.Name)
                        : ""}
                    </p>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span className="material-symbols-outlined me-2">
                      pin_drop
                    </span>
                    <p className="mb-0">{item.Facility.State.State}</p>
                  </div>
                  <div className="key-value-flex mb-3 gap-8 mobile-col-dir-key">
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
                  <div className="d-flex align-items-center justify-content-between mobile-col-dir-key">
                    <div className="d-flex">
                      {isWithinPrevious1Month(item.CreatedOn) && (
                        <div className="list-badge new-badge me-2">
                          <div>NEW</div>
                        </div>
                      )}
                      <div className="list-badge me-2">Job ID: {item.Id}</div>
                      <div
                        className={`${
                          item.JobStatus.Status === "Active-Featured" ||
                          item.JobStatus.Status === "Active"
                            ? "active-badge"
                            : item.JobStatus.Status === "On Hold"
                            ? "on-hold-badge"
                            : "bg-danger text-white"
                        } list-badge `}
                      >
                        {item.JobStatus.Status}
                      </div>
                    </div>
                    <Button
                      className="blue-gradient-btn mb-0"
                      style={{ minWidth: "90px" }}
                      onClick={() => handleViewJob(item?.Id)}
                    >
                      View Job
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
};

export default SuggestedJobs;
