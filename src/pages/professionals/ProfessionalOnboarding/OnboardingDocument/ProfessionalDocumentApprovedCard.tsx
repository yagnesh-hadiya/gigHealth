import { useState } from "react";
import Checkbox from "../../../../components/custom/CustomCheckbox";
import { capitalize, formatDate, showToast } from "../../../../helpers";
import ProfessionalOnboardingServices from "../../../../services/ProfessionalOnboardingServices";
import { ProfessionalOnboardingDocumentType } from "../../../../types/ProfessionalOnboardingTypes";
// import File from "../../../../assets/images/file.svg";
import round from "../../../../assets/images/round-check.svg";
import round_arrow from "../../../../assets/images/arrow_circle_down.svg";
import Loader from "../../../../components/custom/CustomSpinner";
import OnboardingRejectionModal from "./OnboardingRejection";
import OnboardingApprovalModal from "./OnboardingApprove";
import moment from "moment";

type ProfessionalDocumentApprovedCardProps = {
  doc: ProfessionalOnboardingDocumentType;
  selectedDocument: number[];
  setSelectedDocument: (id: number[]) => void;
  currentDocument: ProfessionalOnboardingDocumentType | null;
  setCurrentDocument: (data: ProfessionalOnboardingDocumentType) => void;
  fetch: () => void;
  fetchOnboardingDocuments: () => void;
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
};

const ProfessionalDocumentApprovedCard = ({
  doc,
  selectedDocument,
  setCurrentDocument,
  setSelectedDocument,
  fetch,
  fetchOnboardingDocuments,
  jobId,
  facilityId,
  professionalId,
  jobApplicationId,
}: ProfessionalDocumentApprovedCardProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  const toggleRejectionModal = () => setRejectionModalOpen(!rejectionModalOpen);
  const toggleApprovalModal = () => setApprovalModalOpen(!approvalModalOpen);

  const downloadDoc = async (documentId: number, name: string) => {
    setLoading("loading");
    try {
      const res = await ProfessionalOnboardingServices.downloadDocument({
        jobId,
        facilityId,
        professionalId,
        jobApplicationId,
        documentId,
      });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name || "file");
        document.body.appendChild(link);
        link.click();
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "An error occurred");
    }
  };

  const removeDocument = async (documentId: number) => {
    setLoading("loading");
    try {
      const response = await ProfessionalOnboardingServices.removeDocument({
        jobId,
        facilityId,
        professionalId,
        jobApplicationId,
        documentId,
      });
      if (response.status === 200) {
        showToast("success", response.data.message || "Document removed");
        fetch();
        fetchOnboardingDocuments();
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "An error occurred");
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      {doc.ProfessionalDocument && (
        <div className="view-file-wrapper onboarding-wrapper mb-3">
          <div
            className="d-flex align-items-center view-file-info-section justify-content-between pb-3 pt-3 flex-wrap"
            style={{ gap: "8px" }}
          >
            <div className="d-flex align-items-center">
              <div className="">
                <Checkbox
                  disabled={false}
                  checked={selectedDocument?.includes(doc.Id)}
                  onChange={() => {
                    if (selectedDocument?.includes(doc.Id)) {
                      setSelectedDocument(
                        selectedDocument?.filter((id) => id !== doc.Id)
                      );
                    } else {
                      setSelectedDocument([
                        ...(selectedDocument || []),
                        doc.Id,
                      ]);
                    }
                  }}
                />
              </div>
              <div
                className="file-img d-flex"
                onClick={() => {
                  downloadDoc(
                    doc.Id,
                    doc.ProfessionalDocument?.FileName
                      ? doc.ProfessionalDocument?.FileName
                      : "document.pdf"
                  );
                }}
              >
                {/* <img src={File} className="" /> */}
                <span className="material-symbols-outlined filled">
                    description
                 </span>

              </div>
              <div>
                <div className="d-flex align-items-center">
                  <p
                    className="file-name"
                    style={{ marginBottom: "0px", marginRight: "10px" }}
                  >
                    {capitalize(doc.DocumentMaster.Type)}
                  </p>
                  <span
                    className="remove-button"
                    onClick={() => removeDocument(doc.Id)}
                  >
                    Remove
                  </span>
                </div>
                <div className="file-content">
                  <p
                    style={{ marginBottom: "0px" }}
                    className="d-flex flex-wrap"
                  >
                    <div className="me-2">
                      <span className="onboard-title">Uploaded On:</span>
                      <span className="onboard-info-content">
                        {formatDate(doc.ProfessionalDocument.CreatedOn)}
                      </span>
                    </div>
                    {doc.IsInternalUse && (
                      <>
                        <img src={round_arrow} className="" />
                        <span className="onboard-title text-red mx-2">
                          Internal Use Only
                        </span>
                      </>
                    )}

                    {doc.IsApproved && (
                      <>
                        <div className="me-2">
                          <span className="onboard-title">
                            Effective Date:{" "}
                          </span>
                          <span
                            className="onboard-info-content"
                            style={{ marginRight: "15px" }}
                          >
                            {moment(doc.EffectiveDate).format("MM-DD-YYYY")}
                          </span>
                        </div>
                        <div>
                          <span className="onboard-title">Expiry Date: </span>
                          <span className="onboard-info-content">
                            {moment(doc.ExpiryDate).format("MM-DD-YYYY")}
                          </span>
                        </div>

                        <p
                          style={{ marginBottom: "0px" }}
                          className="d-flex flex-wrap"
                        >
                          <div className="me-2">
                            <span className="onboard-title">
                              <img src={round} /> Approved By:{" "}
                            </span>
                            <span className="onboard-info-content">
                              {doc.ApprovedByUser
                                ? `${capitalize(
                                    doc.ApprovedByUser.FirstName
                                  )}  ${capitalize(
                                    doc.ApprovedByUser.LastName
                                  )}`
                                : ""}
                            </span>
                          </div>
                          <div className="me-2">
                            <span className="onboard-title">Approved On: </span>
                            <span
                              className="onboard-info-content"
                              style={{ marginRight: "15px" }}
                            >
                              {formatDate(doc.ApprovedOn ? doc.ApprovedOn : "")}
                            </span>
                          </div>
                        </p>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            {!doc.IsApproved && (
              <div className="d-flex">
                <button
                  className="approve-button"
                  onClick={() => {
                    setCurrentDocument(doc);
                    if (setCurrentDocument === null) return;
                    toggleApprovalModal();
                  }}
                >
                  Approve
                </button>
                <button
                  className=" onboarding-remove-button Onboarding-button-text-color hover:bg-white"
                  onClick={() => {
                    setCurrentDocument(doc);
                    if (setCurrentDocument === null) return;
                    toggleRejectionModal();
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {rejectionModalOpen && (
        <OnboardingRejectionModal
          isOpen={rejectionModalOpen}
          toggle={toggleRejectionModal}
          facilityId={facilityId}
          jobId={jobId}
          professionalId={professionalId}
          jobApplicationId={jobApplicationId}
          document={doc}
          fetchDocuments={() => {
            fetch();
            fetchOnboardingDocuments();
          }}
        />
      )}
      {approvalModalOpen && (
        <OnboardingApprovalModal
          isOpen={approvalModalOpen}
          toggle={toggleApprovalModal}
          facilityId={facilityId}
          jobId={jobId}
          professionalId={professionalId}
          jobApplicationId={jobApplicationId}
          document={doc}
          fetchDocuments={() => {
            fetch();
            fetchOnboardingDocuments();
          }}
        />
      )}
    </>
  );
};

export default ProfessionalDocumentApprovedCard;
