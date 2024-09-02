import { useCallback, useEffect, useState } from "react";

import { Modal, ModalHeader, ModalBody, TabContent, TabPane } from "reactstrap";
import ProfileDetailsSubmission from "./ProfileDetailSubmission";
// import SubmittedDocument from "./SubmittedDocuments";
import SubmissionHeadingInfo from "./SubmissionHeadingInfo";
import SubmissionProfileHeader from "./SubmissionHeader";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import { fetchApplicantProfessionalDetails } from "../../../../../services/ApplicantsServices";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import Loader from "../../../../../components/custom/CustomSpinner";
import ReadOnlyCoverPageDetails from "./ReadOnlyCoverPageDetails";
import { capitalize } from "../../../../../helpers";
import ReadOnlyApplicantSubmittedDocuments from "./ReadOnlyApplicantSubmittedDocuments";

type SubmissionProfileModalProps = {
  isOpen: boolean;
  toggle: () => void;
  currentApplicantId: number;
  facilityId: number;
  jobId: number;
  job: RightJobContentData;
  professionalId: number;
  fetchApplicants: () => void;
  status: string;
};

const SubmissionProfileModal = ({
  currentApplicantId,
  facilityId,
  jobId,
  professionalId,
  isOpen,
  toggle,
  job,
  fetchApplicants,
  status,
}: SubmissionProfileModalProps) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const [loading, setLoading] = useState<"loading" | "idle" | "error">(
    "loading"
  );
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);

  const fetchProfessional = useCallback(async () => {
    setLoading("loading");
    try {
      const professional = await fetchApplicantProfessionalDetails({
        jobId: jobId,
        professionalId: professionalId,
        facilityId: facilityId,
      });
      setCurrentProfessional(professional.data.data[0]);
      setLoading("idle");
    } catch (error: any) {
      setLoading("error");
      console.error(error);
    }
  }, [facilityId, jobId, professionalId]);

  useEffect(() => {
    fetchProfessional();
  }, [fetchProfessional]);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      {loading === "loading" && currentProfessional === null && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        className="onboard-modal"
      >
        <ModalHeader toggle={toggle}>
          {capitalize(
            currentProfessional?.FirstName ? currentProfessional?.FirstName : ""
          )}{" "}
          {capitalize(
            currentProfessional?.LastName ? currentProfessional?.LastName : ""
          )}
          ’s Profile
        </ModalHeader>
        <ModalBody>
          <div className="view-file-wrapper">
            <div>
              <div
                className="header-wrap"
                style={{ position: "sticky", top: "-18px", zIndex: "9999" }}
              >
                <SubmissionProfileHeader
                  activeTab={activeTab}
                  toggleTab={toggleTab}
                />
              </div>
              <div>
                <SubmissionHeadingInfo
                  status={status}
                  toggle={toggle}
                  currentApplicantId={currentApplicantId}
                  jobId={jobId}
                  facilityId={facilityId}
                  professionalId={professionalId}
                  currentProfessional={currentProfessional}
                  fetchApplicants={fetchApplicants}
                  isReadOnly={true}
                />
              </div>
              <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                  <ProfileDetailsSubmission
                    professionalId={professionalId}
                    jobId={jobId}
                    facilityId={facilityId}
                    toggle={toggle}
                    toggleTab={toggleTab}
                  />
                </TabPane>
                <TabPane tabId={2}>
                  <ReadOnlyApplicantSubmittedDocuments
                    currentApplicantId={currentApplicantId}
                    professionalId={professionalId}
                    jobId={jobId}
                    facilityId={facilityId}
                    toggle={toggle}
                    toggleTab={toggleTab}
                  />
                </TabPane>
                <TabPane tabId={3}>
                  <ReadOnlyCoverPageDetails
                    currentApplicantId={currentApplicantId}
                    facilityId={facilityId}
                    jobId={jobId}
                    professionalId={professionalId}
                    job={job}
                    toggle={toggle}
                    professionalDetails={
                      currentProfessional
                        ? currentProfessional
                        : ({} as ProfessionalDetails)
                    }
                  />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SubmissionProfileModal;
