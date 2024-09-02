import moment from "moment";
import { OnboardingCardInfoProps } from "../../../types/TalentOnboardingTypes";
import { getStatusColor } from "../../../constant/StatusColors";
import ArticleBtn from "../../../components/custom/ArticleBtn";
import { useState } from "react";
import TalentAppliedJobHistoryModal from "./TalentJobHistoryModal";
import ViewOnboardingAssignmentModal from "./ViewOnboardingAssignmentModal";
import TalentOpeningDocumentStatusModal from "./TalentAssignmentDocumentStatusModal";

const CardTableBody = ({ list }: OnboardingCardInfoProps) => {
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);

  return (
    <>
      <tbody>
        <tr>
          <td>
            <div className="inside-div text-capitalize">
              {list?.JobApplication?.JobAssignments[0]?.JobProfession
                ?.Profession ?? "-"}
            </div>
          </td>
          <td>
            <div className="inside-div text-capitalize">
              {list?.JobApplication?.JobAssignments[0]?.Unit ?? "-"}
            </div>
          </td>
          <td>
            <div className="inside-div text-capitalize">
              {list?.Job?.ScrubColor?.Color ?? "-"}
            </div>
          </td>
          <td>
            <div className="inside-div">
              {list?.JobApplication?.JobAssignments[0]?.ComplianceDueDate
                ? moment(
                    list?.JobApplication?.JobAssignments[0]?.ComplianceDueDate
                  ).format("MM/DD/YYYY")
                : "-"}
            </div>
          </td>
          <td>
            <div
              className="inside-div d-flex align-items-center"
              style={{ minHeight: "56px" }}
            >
              <div className="d-flex" style={{ lineHeight: "normal" }}>
                {list?.JobApplication !== null ? (
                  <TalentOpeningDocumentStatusModal
                    selectedItem={list?.JobApplication?.JobComplianceDocuments}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </td>
          <td>
            <div className="inside-div">
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
            </div>
          </td>
          <td>
            <div className="inside-div text-capitalize">
              <span
                style={{
                  color: `${getStatusColor(
                    list?.JobApplication?.JobAssignments[0]
                      ?.JobApplicationStatus?.Status
                  )}`,
                  fontWeight: "600",
                }}
              >
                {list?.JobApplication?.JobAssignments[0]?.JobApplicationStatus
                  ?.Status ?? "-"}
              </span>
            </div>
          </td>
          <td>
            <div className="inside-div">
              <div className="d-flex">
                <div
                  className="center-align custom-article-btn d-flex flex-nowrap"
                  style={{ marginTop: "0px" }}
                >
                  <ArticleBtn
                    onEye={() => {
                      setAssignmentModal(true);
                    }}
                  />

                  <TalentAppliedJobHistoryModal
                    slotId={list?.Id}
                    jobId={list?.JobId}
                    jobApplicationId={list?.JobApplicationId}
                    history={true}
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
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

export default CardTableBody;
