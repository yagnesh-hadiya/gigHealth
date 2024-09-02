import { useCallback, useEffect, useState } from "react";
import RejectionModal from "../../facilitycomponent/facilityonboarding/RejectionModal";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { getJobSubmissionDocuments } from "../../../../../services/ApplicantsServices";
import ApplicantDocumentCard from "./ApplicantDocumentCard";
import Loader from "../../../../../components/custom/CustomSpinner";
import AddNewDocumentModal from "../../facilitycomponent/facilityonboarding/AddNewDocModal";
import { showToast } from "../../../../../helpers";

type ApplicantSubmittedDocumentTypes = {
  professionalId: number;
  jobId: number;
  facilityId: number;
  currentApplicantId: number;
  toggle: () => void;
  toggleTab: (tabId: number) => void;
  documents: ApplicantDocumentObjectType[];
  setDocuments: (data: ApplicantDocumentObjectType[]) => void;
  hasValidationError: boolean;
};

type DocumentMaster = {
  Id: number;
  Type: string;
  Description: string;
};

type ProfessionalDocument = {
  Id: number;
  FileName: string;
};

type JobSuggestedDocCount = {
  Count: number;
};

export type ApplicantDocumentObjectType = {
  Id: number;
  IsRequired: boolean;
  IsApproved: boolean;
  ApprovedOn: string;
  EffectiveDate: string | null;
  ExpiryDate: string | null;
  DocumentMaster: DocumentMaster;
  ProfessionalDocument: ProfessionalDocument | null;
  JobSuggestedDocCount: JobSuggestedDocCount;
};

const ApplicantSubmittedDocument = ({
  jobId,
  professionalId,
  facilityId,
  currentApplicantId,
  toggle,
  toggleTab,
  documents,
  setDocuments,
  hasValidationError,
}: ApplicantSubmittedDocumentTypes) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [addNewOpen, setAddNewOpen] = useState<boolean>(false);

  const toggleRejectionModal = () => setRejectionModalOpen(!rejectionModalOpen);

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
  }, [currentApplicantId, facilityId, jobId, professionalId, setDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleNewDocument = () => {
    setAddNewOpen(true);
  };

  return (
    <div
      style={{
        margin: "10px 0px",
      }}
    >
      {loading === "loading" && <Loader />}
      <div className="offer-wrapper mt-0 px-3" style={{boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.15)"}}>
        <h5>
          <p>Upload Documents For Submission</p>
        </h5>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: "1 50%",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {documents &&
            documents.map((document) => (
              <ApplicantDocumentCard
                ApplicantDocumentObject={document}
                jobId={jobId}
                professionalId={professionalId}
                facilityId={facilityId}
                currentApplicantId={currentApplicantId}
                fetchDocuments={fetchDocuments}
              />
            ))}
        </div>

        <div className="right-buttons justify-content-start mt-4">
          <CustomButton
            className="professional-button text-nowrap"
            onClick={handleNewDocument}
          >
            Add New Document
          </CustomButton>
        </div>

        <div className="mt-4 mb-2" style={{ marginLeft: "0px" }}>
          <CustomButton
            className="primary-btn ms-0"
            onClick={() => {
              if (hasValidationError === true) {
                showToast("error", "Please upload all the required documents.");
              } else toggleTab(3);
            }}
          >
            Next
          </CustomButton>
          <CustomButton className="secondary-btn" onClick={toggle}>
            Cancel
          </CustomButton>
        </div>
        {rejectionModalOpen && (
          <RejectionModal
            isOpen={rejectionModalOpen}
            toggle={toggleRejectionModal}
          />
        )}
        {addNewOpen && (
          <AddNewDocumentModal
            jobId={jobId}
            professionalId={professionalId}
            facilityId={facilityId}
            currentApplicantId={currentApplicantId}
            isOpen={addNewOpen}
            toggle={() => setAddNewOpen(!addNewOpen)}
            fetchDocuments={fetchDocuments}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicantSubmittedDocument;
