import { Button, Card, CardBody } from "reactstrap";
import {
  capitalize,
  formatDateString,
  formatPhoneNumber,
} from "../../../helpers";
import { useSelector } from "react-redux";
import { getAuthDetails } from "../../../store/ProfessionalAuthStore";
import { useEffect, useRef, useState } from "react";
import NoRecordsMessage from "../../facilities/facilitylisting/jobs/NoRecordsMessage";
import DocumentsStatus from "./DocumentsStatus";
interface AssignmentProps {
  assignmentList: AssignmentList[];
  selectedItem: any;
}
const UpcomingAssignment = ({
  assignmentList,
  selectedItem,
}: AssignmentProps) => {
  const authDetails = useSelector(getAuthDetails);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
  const startDrag = (e: any) => {
    setIsDown(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const endDrag = () => {
    setIsDown(false);
  };
  const drag = (e: any) => {
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
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="home-title">Upcoming Assignment</h3>
        {assignmentList.length > 1 && (
          <div className="home-pagination-wr">
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
        className="card-x-scroll-wr mb-0"
        onMouseDown={startDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onMouseMove={drag}
        ref={scrollContainerRef}
      >
        {assignmentList?.length > 0 ? (
          assignmentList?.map((item: AssignmentList) => (
            <Card className="main-home-card main-home-large-card" key={item.Id}>
              <CardBody>
                <div className="d-flex progress-bar-flex">
                  <div className="w-100">
                    <div
                      className="d-flex flex-wrap"
                      style={{ gap: "8px 16px" }}
                    >
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
                        <p className="mb-0">{item.Facility.Address}</p>
                      </div>
                    </div>
                    <div className="key-value-flex mb-3">
                      <p className="mb-0">
                        Profession:{" "}
                        <span className="fw-400">
                          {authDetails[0]?.JobProfession?.Profession}
                        </span>
                      </p>
                      <p className="mb-0">
                        Unit: <span className="fw-400">{item.Unit}</span>
                      </p>
                      <p className="mb-0">
                        Start & End Date:{" "}
                        <span className="fw-400">
                          {formatDateString(item.StartDate)} -{" "}
                          {formatDateString(item.EndDate)}
                        </span>
                      </p>
                      <p className="mb-0">
                        Shift Time:{" "}
                        <span className="fw-400">
                          {item.ShiftStartTime} - {item.ShiftEndTime}
                        </span>
                      </p>

                      <p className="mb-0">
                        Program Manager:{" "}
                        <span className="fw-400">
                          {" "}
                          {authDetails && authDetails[0]?.ProgramManager
                            ? capitalize(
                                authDetails[0]?.ProgramManager.FirstName +
                                  " " +
                                  authDetails[0]?.ProgramManager.LastName
                              )
                            : "-"}
                        </span>
                      </p>
                      <p className="mb-0">
                        Phone:{" "}
                        <span className="fw-400">
                          {" "}
                          {formatPhoneNumber(authDetails[0]?.Phone)}
                        </span>
                      </p>
                      <p className="mb-0">
                        Email:{" "}
                        <span className="fw-400"> {authDetails[0]?.Email}</span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap mobile-badge-flex">
                      <Button
                        className="blue-gradient-btn mb-0"
                        style={{ minWidth: "90px" }}
                        onClick={() => selectedItem(item)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  {item?.JobComplianceDocuments.length && (
                    <div className="right-progress-wr">
                      <DocumentsStatus
                        isMobile={isMobile}
                        DocumentList={item?.JobComplianceDocuments}
                      />
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <NoRecordsMessage msg={"There are no records to display"} />
        )}
      </div>
    </>
  );
};

export default UpcomingAssignment;
