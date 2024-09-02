import { useCallback, useEffect, useState } from "react";
import DownloadIcon from "../../../../components/icons/Download";
import CustomButton from "../../../../components/custom/CustomBtn";
import ProfessionalOnboardingServices from "../../../../services/ProfessionalOnboardingServices";
import { ProfessionalOnboardingDocumentType } from "../../../../types/ProfessionalOnboardingTypes";
import { showToast } from "../../../../helpers";
import Loader from "../../../../components/custom/CustomSpinner";
import ProfessionalOnboardingDocumentCard from "./ProfessionalOnboardingDocumentCard";
import OnboardingAddNewSubmissionDoc from "./OnboardingAddNewSubmissionDoc";

type ProfessionalSubmissionDocumentsProps = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  fetchOnboardingDocuments: () => void;
};

const ProfessionalSubmissionDocuments = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  fetchOnboardingDocuments,
}: ProfessionalSubmissionDocumentsProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [addNewDoc, setAddNewDoc] = useState(false);
  const [data, setData] = useState<ProfessionalOnboardingDocumentType[]>([]);
  const [currentDocument, setCurrentDocument] =
    useState<ProfessionalOnboardingDocumentType | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<number[] | null>(
    null
  );

  const fetch = useCallback(async () => {
    setLoading("loading");
    try {
      const response =
        await ProfessionalOnboardingServices.getSubmissionDocuments({
          jobId,
          facilityId,
          professionalId,
          jobApplicationId,
        });
      if (response.status === 200) {
        setData(response.data.data);
        setLoading("idle");
      }
    } catch (error: any) {
    console.error(error);
      showToast("error", error.response.data.message || "An error occurred");
    }
  }, [facilityId, jobId, professionalId, jobApplicationId]);

  const downloadDocuments = async () => {
    setLoading("loading");
    try {
      const response =
        await ProfessionalOnboardingServices.downloadAllDocuments({
          jobId,
          facilityId,
          professionalId,
          jobApplicationId,
          documentIds:
            selectedDocument === null || selectedDocument.length === 0
              ? data.reduce(
                  (acc: number[], doc: ProfessionalOnboardingDocumentType) => {
                    if (doc.ProfessionalDocument !== null) {
                      acc.push(doc.Id);
                    }
                    return acc;
                  },
                  []
                )
              : (selectedDocument as number[]),
        });

      if (response.status === 200) {
        showToast("success", response.data.message || "Download successful");

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/zip",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = `onboarding-${professionalId}-${jobApplicationId}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // const zip = await JSZip.loadAsync(response.data);
        // zip.forEach((relativePath, file) => {
        //   file.async("blob").then((content) => {
        //     const url = window.URL.createObjectURL(content);
        //     const link = document.createElement("a");
        //     link.href = url;
        //     link.download = `${relativePath}.pdf`;
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        //   });
        // });

        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error.response.data);
      setLoading("error");
      showToast("error", error.response.data.message || "An error occurred");
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggleAddNewModal = () => setAddNewDoc(!addNewDoc);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="offer-wrapper">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fs-18">Onboarding Documents</h5>

          {data.filter((doc) => doc.ProfessionalDocument !== null).length >
            0 && (
            <div className=" note-wrapper search-date-margin">
              <button
                className="note-right-button button-text-color document-btn hover:bg-white"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={downloadDocuments}
              >
                <DownloadIcon color={isHovered ? "#fff" : ""} />
                {selectedDocument && selectedDocument.length > 0
                  ? "Download Selected"
                  : "Download All"}
              </button>
            </div>
          )}
        </div>

        {data.map((doc) => (
          <ProfessionalOnboardingDocumentCard
            key={doc.Id}
            doc={doc}
            facilityId={facilityId}
            professionalId={professionalId}
            jobId={jobId}
            jobApplicationId={jobApplicationId}
            setSelectedDocument={setSelectedDocument}
            selectedDocument={selectedDocument}
            currentDocument={currentDocument}
            setCurrentDocument={setCurrentDocument}
            fetch={fetch}
            fetchOnboardingDocuments={fetchOnboardingDocuments}
          />
        ))}

        <div className="right-buttons text-start justify-content-start mt-4">
          <CustomButton
            className="professional-button text-nowrap"
            onClick={() => setAddNewDoc(true)}
          >
            Add new Documents
          </CustomButton>
        </div>

        {addNewDoc && (
          <OnboardingAddNewSubmissionDoc
            isOpen={addNewDoc}
            toggle={toggleAddNewModal}
            facilityId={facilityId}
            jobId={jobId}
            professionalId={professionalId}
            jobApplicationId={jobApplicationId}
            fetchDocuments={() => {
              fetch();
              fetchOnboardingDocuments();
            }}
          />
        )}
      </div>
    </>
  );
};

export default ProfessionalSubmissionDocuments;
