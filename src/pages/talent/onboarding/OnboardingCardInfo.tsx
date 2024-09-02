import CardTableHead from "./CardTableHead";
import CardTableBody from "./CardTableBody";
import { OnboardingCardInfoProps } from "../../../types/TalentOnboardingTypes";
import moment from "moment";
import { ListGroup, ListGroupItem } from "reactstrap";
import CardListgroupItem from "./CardListgroupItem";
import { getStatusColor } from "../../../constant/StatusColors";
import ViewOnboardingAssignmentModal from "./ViewOnboardingAssignmentModal";
import { useEffect, useState } from "react";
import ArticleBtn from "../../../components/custom/ArticleBtn";
import TalentOpeningDocumentStatusModal from "./TalentAssignmentDocumentStatusModal";
import AssignmentJobHistoryMobileModal from "../gigs/AssignmentJobHistoryMobileModal";
import { capitalize } from "../../../helpers";

const OnboardingCardInfo = ({ list, fetchData }: OnboardingCardInfoProps) => {
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
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

  const listGroupItems = [
    {
      title: "Profession",
      data: `${
        list?.JobApplication?.JobAssignments[0]?.JobProfession?.Profession ??
        "-"
      }`,
    },
    {
      title: "Unit",
      data: `${
        list?.JobApplication?.JobAssignments[0]?.Unit
          ? capitalize(list?.JobApplication?.JobAssignments[0]?.Unit)
          : "-"
      }`,
    },
    {
      title: "Scrub Color",
      data: `${
        list?.Job?.ScrubColor?.Color
          ? capitalize(list?.Job?.ScrubColor?.Color)
          : "-"
      }`,
    },
    {
      title: "Compliance Due",
      data: `${
        list?.JobApplication?.JobAssignments[0]?.ComplianceDueDate
          ? moment(
              list?.JobApplication?.JobAssignments[0]?.ComplianceDueDate
            ).format("MM/DD/YYYY")
          : "-"
      }`,
    },
  ];

  return (
    <>
      <h3 className="list-title mb-3">Placement Details</h3>
      <div className="dt-wrapper custom-table-wrapper mb-3 for-desktop-only">
        <table>
          <CardTableHead />
          <CardTableBody list={list} fetchData={fetchData} />
        </table>
      </div>
      <div className="listing-for-mobile-only">
        <div className="list-grp-wrapper mb-3">
          <ListGroup>
            {listGroupItems.map((item, index) => (
              <CardListgroupItem
                key={index}
                title={item.title}
                data={item.data}
              />
            ))}
            <ListGroupItem>
              <div className="items-flex">
                <div className="width-48">
                  <h3>Document Status</h3>
                </div>
                <div className="width-48 d-flex justify-content-end">
                  <p className="fw-500">
                    {" "}
                    {list?.JobApplication !== null ? (
                      <TalentOpeningDocumentStatusModal
                        selectedItem={
                          list?.JobApplication?.JobComplianceDocuments
                        }
                        isMobile={true}
                      />
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </div>
            </ListGroupItem>
            <ListGroupItem>
              <div className="items-flex">
                <div className="width-48">
                  <h3>Start & End Date</h3>
                </div>
                <div className="width-48 d-flex justify-content-end">
                  <p className="fw-500">
                    {" "}
                    {list?.JobApplication?.JobAssignments[0]?.StartDate
                      ? moment(
                          list?.JobApplication?.JobAssignments[0]?.StartDate
                        ).format("MM/DD/YYYY")
                      : "-"}{" "}
                    -{" "}
                    {list?.JobApplication?.JobAssignments[0]?.EndDate
                      ? moment(
                          list?.JobApplication?.JobAssignments[0]?.EndDate
                        ).format("MM/DD/YYYY")
                      : "-"}
                  </p>
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
                    <div
                      className="assignment-talent"
                      style={{
                        color: `${getStatusColor(
                          list?.JobApplication?.JobAssignments[0]
                            ?.JobApplicationStatus?.Status
                        )}`,
                        fontWeight: "500",
                      }}
                    >
                      {list?.JobApplication?.JobAssignments[0]
                        ?.JobApplicationStatus?.Status ?? "-"}
                    </div>
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
                        setAssignmentModal(true);
                      }}
                    />

                    {isMobile && (
                      <AssignmentJobHistoryMobileModal
                        slotId={list?.Id}
                        jobId={list?.JobId}
                        jobApplicationId={list?.JobApplicationId}
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
      {assignmentModal && (
        <ViewOnboardingAssignmentModal
          isOpen={assignmentModal}
          toggle={() => setAssignmentModal((prev) => !prev)}
          jobId={list?.JobId}
          jobApplicationId={list?.JobApplicationId}
          jobAssignmentId={list?.JobApplication?.JobAssignments[0]?.Id}
        />
      )}
    </>
  );
};

export default OnboardingCardInfo;
