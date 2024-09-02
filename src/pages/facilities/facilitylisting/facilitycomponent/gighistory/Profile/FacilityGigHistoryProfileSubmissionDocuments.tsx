import { useCallback, useEffect, useState } from "react";
import FacilityGigHistoryServices from "../../../../../../services/FacilityGigHistoryServices";
import Loader from "../../../../../../components/custom/CustomSpinner";
import ReadOnlyApplicantDocumentCard from "../../../jobs/Applicant/ReadOnlyApplicantDocumentCard";
import CustomButton from "../../../../../../components/custom/CustomBtn";
import { ApplicantDocumentObjectType } from "../../../jobs/Applicant/ApplicantSubmittedDocument";

type FacilityGigHistoryProfileSubmissionDocumentsTypes = {
  professionalId: number;
  jobId: number;
  facilityId: number;
  jobApplicationId: number;
  toggle: () => void;
  toggleTab: (tabId: number) => void;
};

const FacilityGigHistoryProfileSubmissionDocuments = ({
  jobId,
  professionalId,
  facilityId,
  jobApplicationId,
  toggle,
  toggleTab,
}: FacilityGigHistoryProfileSubmissionDocumentsTypes) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [documents, setDocuments] = useState<ApplicantDocumentObjectType[]>([]);

  const fetchDocuments = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await FacilityGigHistoryServices.fetchSubmissionDocuments({
        jobApplicationId: jobApplicationId,
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
  }, [jobApplicationId, facilityId, jobId, professionalId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="offer-wrapper">
        <h5>
          <p>Onboarding Documents</p>
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
            documents
              .filter((doc) => doc.ProfessionalDocument !== null)
              .map((document) => (
                <ReadOnlyApplicantDocumentCard
                  ApplicantDocumentObject={document}
                  jobId={jobId}
                  professionalId={professionalId}
                  facilityId={facilityId}
                  currentApplicantId={jobApplicationId}
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

export default FacilityGigHistoryProfileSubmissionDocuments;
