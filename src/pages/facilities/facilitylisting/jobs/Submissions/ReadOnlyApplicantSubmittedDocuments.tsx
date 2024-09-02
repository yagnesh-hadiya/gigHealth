import { useCallback, useEffect, useState } from "react";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { getJobSubmissionDocuments } from "../../../../../services/ApplicantsServices";
import Loader from "../../../../../components/custom/CustomSpinner";
import ReadOnlyApplicantDocumentCard from "../Applicant/ReadOnlyApplicantDocumentCard";
import { ApplicantDocumentObjectType } from "../Applicant/ApplicantSubmittedDocument";

type ReadOnlyApplicantSubmittedDocumentsTypes = {
  professionalId: number;
  jobId: number;
  facilityId: number;
  currentApplicantId: number;
  toggle: () => void;
  toggleTab: (tabId: number) => void;
};

const ReadOnlyApplicantSubmittedDocuments = ({
  jobId,
  professionalId,
  facilityId,
  currentApplicantId,
  toggle,
  toggleTab,
}: ReadOnlyApplicantSubmittedDocumentsTypes) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [documents, setDocuments] = useState<ApplicantDocumentObjectType[]>([]);

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

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="offer-wrapper p-3">
        <h5>
          <p>Onboarding Documents</p>
        </h5>
        <h6 className="heading-margin">
          License Verification Report<span className="asterisk">*</span>
        </h6>

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
            documents
              .filter((doc) => doc.ProfessionalDocument !== null)
              .map((document) => (
                <ReadOnlyApplicantDocumentCard
                  ApplicantDocumentObject={document}
                  jobId={jobId}
                  professionalId={professionalId}
                  facilityId={facilityId}
                  currentApplicantId={currentApplicantId}
                />
              ))}
        </div>

        <div className="mt-4">
          <CustomButton
            className="primary-btn ms-0"
            onClick={() => {
              toggleTab(3);
            }}
          >
            Next
          </CustomButton>
          <CustomButton className="secondary-btn" onClick={toggle}>
            Cancel
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default ReadOnlyApplicantSubmittedDocuments;
