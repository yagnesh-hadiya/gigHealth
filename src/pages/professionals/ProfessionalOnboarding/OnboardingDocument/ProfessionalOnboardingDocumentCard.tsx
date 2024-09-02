import Checkbox from "../../../../components/custom/CustomCheckbox";
import { capitalize, formatDate, showToast } from "../../../../helpers";
import { ProfessionalOnboardingDocumentType } from "../../../../types/ProfessionalOnboardingTypes";
import FileIcon from "../../../../assets/images/file.svg";
import round from "../../../../assets/images/round-check.svg";
import round_arrow from "../../../../assets/images/arrow_circle_down.svg";
import UploadProfessionalOnboardingDocument from "./UploadProfessionalOnboardingDocument";
import ProfessionalOnboardingServices from "../../../../services/ProfessionalOnboardingServices";
import { useState } from "react";
import OnboardingApprovalModal from "./OnboardingApprove";
import OnboardingRejectionModal from "./OnboardingRejection";
import Loader from "../../../../components/custom/CustomSpinner";
import { FormGroup, Label } from "reactstrap";
import CustomButton from "../../../../components/custom/CustomBtn";
import moment from "moment";
import SelectOnboardingDocument from "./SelectOnboardingDocument";

type ProfessionalOnboardingDocumentCardProps = {
  doc: ProfessionalOnboardingDocumentType;
  professionalId: number;
  jobId: number;
  facilityId: number;
  jobApplicationId: number;
  selectedDocument: number[] | null;
  setSelectedDocument: (data: number[]) => void;
  currentDocument: ProfessionalOnboardingDocumentType | null;
  setCurrentDocument: (data: ProfessionalOnboardingDocumentType) => void;
  fetch: () => void;
  fetchOnboardingDocuments: () => void;
};

const modifyFilename = (file: File, name: string) => {
  const fileExtension = file.name.split(".").pop();
  const modifiedName = `${name}.${fileExtension}`;
  const modifiedFile = new File([file], modifiedName, { type: file.type });
  return modifiedFile;
};

const ProfessionalOnboardingDocumentCard = ({
  doc,
  professionalId,
  facilityId,
  jobApplicationId,
  jobId,
  selectedDocument,
  setSelectedDocument,
  currentDocument,
  setCurrentDocument,
  fetch,
  fetchOnboardingDocuments,
}: ProfessionalOnboardingDocumentCardProps) => {
  const [uploadedDocument, setUploadedDocument] = useState<File>();
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  const isDocumentExpired = () => {
    if (!doc.ExpiryDate) return false;
    const expiryDate = moment(doc.ExpiryDate);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

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

  const deleteDocument = async (documentId: number) => {
    setLoading("loading");
    try {
      const response = await ProfessionalOnboardingServices.deleteDocument({
        jobId,
        facilityId,
        professionalId,
        jobApplicationId,
        documentId,
      });
      if (response.status === 200) {
        showToast("success", response.data.message || "Document deleted");
        fetch();
        fetchOnboardingDocuments();
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.message || "An error occurred");
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | undefined = e.target.files?.[0];

    if (selectedFile) {
      setUploadedDocument(selectedFile);
    }
  };

  const onSubmit = async ({ name, docId }: { name: string; docId: number }) => {
    if (!uploadedDocument) {
      return showToast("error", "Please select a file");
    }

    const maxFileSize: number = 2;
    if (uploadedDocument) {
      const fileSizeMb: number = uploadedDocument?.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        return showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
      }
    }

    const modifiedFiles = modifyFilename(uploadedDocument, name);

    setLoading("loading");
    try {
      const res = await ProfessionalOnboardingServices.uploadOnboardingDocument(
        {
          jobId: jobId,
          professionalId: professionalId,
          facilityId: facilityId,
          jobApplicationId: jobApplicationId,
          documentId: docId,
          document: modifiedFiles,
        }
      );
      if (res.status === 200) {
        fetch();
        fetchOnboardingDocuments();
        setLoading("idle");
        showToast(
          "success",
          res.data.message || "Submission document uploaded successfully."
        );
      }
    } catch (error: any) {
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
      console.error(error);
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <h6
        className="heading-margin"
        style={{
          margin: "10px 0",
        }}
      >
        {capitalize(doc.DocumentMaster.Type)}

        {doc.IsRequired ? (
          <span className="asterisk">*</span>
        ) : (
          <button
            style={{
              marginLeft: "10px",
            }}
            className="remove-button"
            onClick={() => deleteDocument(doc.Id)}
          >
            Remove
          </button>
        )}
      </h6>

      {doc.ProfessionalDocument === null &&
        doc.JobSuggestedDocCount?.Count > 0 && (
          <SelectOnboardingDocument
            facilityId={facilityId}
            jobId={jobId}
            professionalId={professionalId}
            jobApplicationId={jobApplicationId}
            jobComplianceId={doc.Id}
            documentId={doc.DocumentMaster.Id}
            fetchDocuments={() => {
              fetch();
              fetchOnboardingDocuments();
            }}
            type="professional"
            DocCount={
              doc.JobSuggestedDocCount?.Count
                ? doc.JobSuggestedDocCount?.Count
                : 0
            }
          />
        )}

      {doc.ProfessionalDocument !== null && isDocumentExpired() ? (
        <div
          className="view-file-wrapper onboarding-wrapper mb-3"
          style={{
            border: "1px solid",
            borderColor: "#E1BAAA",
            backgroundColor: "rgba(231, 76, 60, 0.06)",
            padding: "10px",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between flex-wrap"
            style={{ gap: "8px" }}
          >
            <div className="d-flex align-items-center">
              <div
                className="d-flex hover:border-blue"
                style={{
                  height: "50px",
                  width: "50px",
                  border: "1px solid",
                  borderColor: "#DDDDEA",
                  borderRadius: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  marginRight: "10px",
                }}
                onClick={() => {
                  downloadDoc(
                    doc.Id,
                    doc.ProfessionalDocument?.FileName
                      ? doc.ProfessionalDocument?.FileName
                      : "document.pdf"
                  );
                }}
              >
                <img
                  src={FileIcon}
                  style={{
                    height: "32px",
                    width: "32px",
                  }}
                />
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

                    <>
                      <div className="me-2">
                        <span className="onboard-title">Effective Date: </span>
                        <span className="onboard-info-content">
                          {doc.EffectiveDate}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "#E74C3C",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            fontStyle: "normal",
                            lineHeight: "11px",
                          }}
                        >
                          Expiry Date:{" "}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            fontStyle: "normal",
                            lineHeight: "11px",
                          }}
                        >
                          {doc.ExpiryDate}
                        </span>
                      </div>
                    </>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="view-file-wrapper bg-white border-0 p-0 mt-3">
            <FormGroup>
              <div
                className="file-picker-wrapper d-flex p-2 px-4"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <Label
                    for={`file-picker-${doc.ProfessionalDocument.Id}`}
                    className="file-picker-label-small"
                  >
                    Upload File
                  </Label>
                  <div>
                    {uploadedDocument && (
                      <p className="file-name">{uploadedDocument.name}</p>
                    )}
                    <p className="file-para">
                      Supported Formats: doc, docx, pdf, jpg, jpeg, png, heic up
                      to 2 MB
                    </p>
                  </div>
                  <input
                    id={`file-picker-${doc.ProfessionalDocument.Id}`}
                    name={`file-picker-${doc.ProfessionalDocument.Id}`}
                    className="custom-input"
                    accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .heic"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleDocumentChange(e);
                    }}
                  />
                </div>

                <div>
                  <CustomButton
                    className="primary-btn"
                    onClick={() => {
                      onSubmit({
                        name: doc.DocumentMaster.Type,
                        docId: doc.Id,
                      });
                    }}
                  >
                    Save & Upload
                  </CustomButton>
                </div>
              </div>
            </FormGroup>
          </div>
        </div>
      ) : doc.ProfessionalDocument !== null ? (
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
                title="Click to download"
                onClick={() => {
                  downloadDoc(
                    doc.Id,
                    doc.ProfessionalDocument?.FileName
                      ? doc.ProfessionalDocument?.FileName
                      : "document.pdf"
                  );
                }}
              >
                {/* <img src={FileIcon} className="" /> */}
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
                        {moment(doc.ProfessionalDocument.CreatedOn).format(
                          "MM-DD-YYYY"
                        )}
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
                        <div className="me-2">
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
                              {moment(
                                doc.ApprovedOn ? doc.ApprovedOn : ""
                              ).format("MM-DD-YYYY")}
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
      ) : (
        <UploadProfessionalOnboardingDocument
          name={capitalize(doc.DocumentMaster.Type)}
          key={doc.Id}
          documentId={doc.Id}
          jobId={jobId}
          facilityId={facilityId}
          professionalId={professionalId}
          jobApplicationId={jobApplicationId}
          fetchDocuments={() => {
            fetch();
            fetchOnboardingDocuments();
          }}
        />
      )}

      {rejectionModalOpen && currentDocument && (
        <OnboardingRejectionModal
          isOpen={rejectionModalOpen}
          toggle={toggleRejectionModal}
          facilityId={facilityId}
          jobId={jobId}
          professionalId={professionalId}
          jobApplicationId={jobApplicationId}
          document={currentDocument}
          fetchDocuments={() => {
            fetch();
            fetchOnboardingDocuments();
          }}
        />
      )}
      {approvalModalOpen && currentDocument && (
        <OnboardingApprovalModal
          isOpen={approvalModalOpen}
          toggle={toggleApprovalModal}
          facilityId={facilityId}
          jobId={jobId}
          professionalId={professionalId}
          jobApplicationId={jobApplicationId}
          document={currentDocument}
          fetchDocuments={() => {
            fetch();
            fetchOnboardingDocuments();
          }}
        />
      )}
    </>
  );
};

export default ProfessionalOnboardingDocumentCard;
