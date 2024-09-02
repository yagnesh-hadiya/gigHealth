import { useCallback, useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, TabContent, TabPane } from "reactstrap";
import SubmissionProfileHeader from "../Submissions/SubmissionHeader";
import SubmissionHeadingInfo from "../Submissions/SubmissionHeadingInfo";
import ProfileDetailsSubmission from "../Submissions/ProfileDetailSubmission";
import ApplicantSubmittedDocument, {
  ApplicantDocumentObjectType,
} from "./ApplicantSubmittedDocument";
import CoverPageDetails from "../Submissions/CoverPageDetails";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  fetchApplicantProfessionalDetails,
  getJobSubmissionDocuments,
} from "../../../../../services/ApplicantsServices";
import { capitalize } from "../../../../../helpers";
import { RightJobContentData } from "../../../../../types/JobsTypes";

type SubmissionProfileModalProps = {
  currentApplicantId: number;
  facilityId: number;
  jobId: number;
  job: RightJobContentData;
  professionalId: number;
  isOpen: boolean;
  toggle: () => void;
  fetchApplicants: () => void;
  status: string;
};

const ApplicantProfileModal = ({
  currentApplicantId,
  facilityId,
  jobId,
  job,
  professionalId,
  isOpen,
  toggle,
  fetchApplicants,
  status,
}: SubmissionProfileModalProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">(
    "loading"
  );
  const [activeTab, setActiveTab] = useState<number>(1);
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);
  const [documents, setDocuments] = useState<ApplicantDocumentObjectType[]>([]);
  const hasValidationError = documents.some(
    (document) => document.IsRequired && !document.ProfessionalDocument
  );

  const fetchDocuments = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await getJobSubmissionDocuments({
        currentApplicantId: currentApplicantId,
        jobId: jobId,
        professionalId: professionalId,
        facilityId: facilityId,
      });
      if (res.status === 200) {
        setDocuments(res.data.data);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
      setLoading("error");
    }
  }, [currentApplicantId, facilityId, jobId, professionalId]);

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
    fetchDocuments();
  }, [fetchDocuments, fetchProfessional]);

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
       
      >
        <ModalHeader toggle={toggle}>
          {currentProfessional
            ? `${capitalize(currentProfessional.FirstName)} ${capitalize(
                currentProfessional.LastName
              )}`
            : ""}
          ’s Profile
        </ModalHeader>
        <ModalBody style={{height:'760px',overflow:'auto'}}>
          <div className="view-file-wrapper">
            <div>
              <div
                className="header-wrap"
                style={{ position: "sticky", top: "-19px", zIndex: "9999" }}
              >
                <SubmissionProfileHeader
                  activeTab={activeTab}
                  toggleTab={toggleTab}
                />
              </div>

              <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
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
                    />
                  </div>
                  <ProfileDetailsSubmission
                    jobId={jobId}
                    facilityId={facilityId}
                    professionalId={professionalId}
                    toggle={toggle}
                    toggleTab={toggleTab}
                  />
                </TabPane>
                <TabPane tabId={2}>
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
                    />
                  </div>
                  <ApplicantSubmittedDocument
                    documents={documents}
                    setDocuments={setDocuments}
                    hasValidationError={hasValidationError}
                    toggle={toggle}
                    currentApplicantId={currentApplicantId}
                    jobId={jobId}
                    facilityId={facilityId}
                    professionalId={professionalId}
                    toggleTab={toggleTab}
                  />
                </TabPane>
                <TabPane tabId={3}>
                  <CoverPageDetails
                    fetchApplicants={fetchApplicants}
                    currentApplicantId={currentApplicantId}
                    hasValidationError={hasValidationError}
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

export default ApplicantProfileModal;
