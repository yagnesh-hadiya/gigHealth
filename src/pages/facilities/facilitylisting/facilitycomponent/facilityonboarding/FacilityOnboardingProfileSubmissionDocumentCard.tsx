import Loader from "../../../../../components/custom/CustomSpinner";
import { capitalize, formatDate, showToast } from "../../../../../helpers";
import { ProfessionalOnboardingDocumentType } from "../../../../../types/ProfessionalOnboardingTypes";
import { useState } from "react";
import round from "../../../../../assets/images/round-check.svg";
import round_arrow from "../../../../../assets/images/arrow_circle_down.svg";
import FacilityOnboardingServices from "../../../../../services/FacilityOnboardingServices";
import UploadFacilityOnboardingDocument from "./UploadFacilityOnboardingDocument";
import FacilityOnboardingRejection from "./FacilityOnboardingRejection";
import FacilityOnboardingApprove from "./FacilityOnboardingApprove";
import moment from "moment";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { FormGroup, Label } from "reactstrap";
import FileIcon from "../../../../../assets/images/file.svg";
import SelectOnboardingDocument from "../../../../professionals/ProfessionalOnboarding/OnboardingDocument/SelectOnboardingDocument";

type FacilityOnboardingProfileSubmissionDocumentCardProps = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  fetchDocuments: () => void;
  fetchList: () => void;
  onboardingDocument: ProfessionalOnboardingDocumentType;
};

const modifyFilename = (file: File, name: string) => {
  const fileExtension = file.name.split(".").pop();
  const modifiedName = `${name}.${fileExtension}`;
  const modifiedFile = new File([file], modifiedName, { type: file.type });
  return modifiedFile;
};

const FacilityOnboardingProfileSubmissionDocumentCard = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  fetchList,
  fetchDocuments,
  onboardingDocument,
}: FacilityOnboardingProfileSubmissionDocumentCardProps) => {
  const [uploadedDocument, setUploadedDocument] = useState<File>();
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  const isDocumentExpired = () => {
    if (!onboardingDocument.ExpiryDate) return false;
    const expiryDate = moment(onboardingDocument.ExpiryDate);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const removeDocument = async (documentId: number) => {
    setLoading("loading");
    try {
      const response = await FacilityOnboardingServices.removeDocument({
        jobId,
        facilityId,
        professionalId,
        jobApplicationId,
        documentId,
      });
      if (response.status === 200) {
        showToast("success", response.data.message || "Document removed");
        fetchList();
        fetchDocuments();
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
      const response = await FacilityOnboardingServices.deleteDocument({
        jobId,
        facilityId,
        professionalId,
        jobApplicationId,
        documentId,
      });
      if (response.status === 200) {
        showToast("success", response.data.message || "Document deleted");
        fetchList();
        fetchDocuments();
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "An error occurred");
    }
  };

  const downloadDoc = async (documentId: number, name: string) => {
    setLoading("loading");
    try {
      const res = await FacilityOnboardingServices.downloadDocument({
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

  const toggleRejectionModal = () => setRejectionModalOpen(!rejectionModalOpen);
  const toggleApprovalModal = () => setApprovalModalOpen(!approvalModalOpen);

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
      const res = await FacilityOnboardingServices.uploadOnboardingDocument({
        jobId: jobId,
        professionalId: professionalId,
        facilityId: facilityId,
        jobApplicationId: jobApplicationId,
        documentId: docId,
        document: modifiedFiles,
      });
      if (res.status === 200) {
        fetchList();
        fetchDocuments();
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
      <div>
        <>
          <h6 className="heading-margin mt-0">
            {capitalize(onboardingDocument.DocumentMaster.Type)}

            {onboardingDocument.IsRequired ? (
              <span className="asterisk">*</span>
            ) : (
              <button
                style={{
                  marginLeft: "10px",
                }}
                className="remove-button"
                onClick={() => deleteDocument(onboardingDocument.Id)}
              >
                Remove
              </button>
            )}
          </h6>

          {onboardingDocument.ProfessionalDocument === null &&
            onboardingDocument.JobSuggestedDocCount?.Count > 0 && (
              <SelectOnboardingDocument
                facilityId={facilityId}
                jobId={jobId}
                professionalId={professionalId}
                jobApplicationId={jobApplicationId}
                jobComplianceId={onboardingDocument.Id}
                documentId={onboardingDocument.DocumentMaster.Id}
                fetchDocuments={() => {
                  fetchList();
                  fetchDocuments();
                }}
                type="facility"
                DocCount={
                  onboardingDocument.JobSuggestedDocCount?.Count
                    ? onboardingDocument.JobSuggestedDocCount?.Count
                    : 0
                }
              />
            )}

          {onboardingDocument.ProfessionalDocument !== null &&
          isDocumentExpired() ? (
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
                        onboardingDocument.Id,
                        onboardingDocument.ProfessionalDocument?.FileName
                          ? onboardingDocument.ProfessionalDocument?.FileName
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
                        {capitalize(onboardingDocument.DocumentMaster.Type)}
                      </p>
                      <span
                        className="remove-button"
                        onClick={() => removeDocument(onboardingDocument.Id)}
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
                            {formatDate(
                              onboardingDocument.ProfessionalDocument.CreatedOn
                            )}
                          </span>
                        </div>

                        <>
                          <div className="me-2">
                            <span className="onboard-title">
                              Effective Date:{" "}
                            </span>
                            <span className="onboard-info-content">
                              {moment(
                                onboardingDocument.EffectiveDate
                                  ? onboardingDocument.EffectiveDate
                                  : ""
                              ).format("MM-DD-YYYY")}
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
                              {onboardingDocument.ExpiryDate}
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
                        for={`file-picker-${onboardingDocument.ProfessionalDocument.Id}`}
                        className="file-picker-label-small"
                      >
                        Upload File
                      </Label>
                      <div>
                        {uploadedDocument && (
                          <p className="file-name">{uploadedDocument.name}</p>
                        )}
                        <p className="file-para">
                          Supported Formats: doc, docx, pdf, jpg, jpeg, png,
                          heic up to 2 MB
                        </p>
                      </div>
                      <input
                        id={`file-picker-${onboardingDocument.ProfessionalDocument.Id}`}
                        name={`file-picker-${onboardingDocument.ProfessionalDocument.Id}`}
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
                            name: onboardingDocument.DocumentMaster.Type,
                            docId: onboardingDocument.Id,
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
          ) : onboardingDocument.ProfessionalDocument !== null ? (
            <div className="view-file-wrapper onboarding-wrapper mb-3">
              <div
                className="d-flex align-items-center view-file-info-section justify-content-between pb-3 pt-3 flex-wrap"
                style={{ gap: "8px" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="file-img d-flex"
                    onClick={() => {
                      downloadDoc(
                        onboardingDocument.Id,
                        onboardingDocument.ProfessionalDocument?.FileName
                          ? onboardingDocument.ProfessionalDocument?.FileName
                          : "document.pdf"
                      );
                    }}
                  >
                    <img src={FileIcon} className="" />
                  </div>
                  <div>
                    <div className="d-flex align-items-center">
                      <p
                        className="file-name"
                        style={{ marginBottom: "0px", marginRight: "10px" }}
                      >
                        {capitalize(onboardingDocument.DocumentMaster.Type)}
                      </p>
                      <span
                        className="remove-button"
                        onClick={() => removeDocument(onboardingDocument.Id)}
                      >
                        Remove
                      </span>
                    </div>
                    {!onboardingDocument.IsApproved && (
                      <>
                        <span className="onboard-title">Uploaded On:</span>
                        <span
                          className="onboard-info-content"
                          style={{ marginRight: "15px" }}
                        >
                          {formatDate(
                            onboardingDocument.ProfessionalDocument.CreatedOn
                          )}
                        </span>
                      </>
                    )}

                    <div className="file-content">
                      <p style={{ marginBottom: "0px" }}>
                        {onboardingDocument.IsInternalUse && (
                          <>
                            <img src={round_arrow} className="" />
                            <span className="onboard-title text-red mx-2">
                              Internal Use Only
                            </span>
                          </>
                        )}

                        {onboardingDocument.IsApproved && (
                          <div>
                            <div className="me-2">
                              <span className="onboard-title">
                                Uploaded On:
                              </span>
                              <span
                                className="onboard-info-content"
                                style={{ marginRight: "15px" }}
                              >
                                {formatDate(
                                  onboardingDocument.ProfessionalDocument
                                    .CreatedOn
                                )}
                              </span>
                              <span className="onboard-title">
                                Effective Date:{" "}
                              </span>
                              <span
                                className="onboard-info-content"
                                style={{ marginRight: "15px" }}
                              >
                                {moment(
                                  onboardingDocument.EffectiveDate
                                    ? onboardingDocument.EffectiveDate
                                    : ""
                                ).format("MM-DD-YYYY")}
                              </span>
                              <span className="onboard-title">
                                Expiry Date:{" "}
                              </span>
                              <span className="onboard-info-content">
                                {onboardingDocument.ExpiryDate}
                              </span>
                            </div>

                            <p
                              style={{ marginBottom: "0px" }}
                              className="d-flex"
                            >
                              <div className="me-2">
                                <span className="onboard-title">
                                  <img src={round} /> Approved By:{" "}
                                </span>
                                <span className="onboard-info-content">
                                  {onboardingDocument.ApprovedByUser
                                    ? `${capitalize(
                                        onboardingDocument.ApprovedByUser
                                          .FirstName
                                      )}  ${capitalize(
                                        onboardingDocument.ApprovedByUser
                                          .LastName
                                      )}`
                                    : ""}
                                </span>
                              </div>
                              <div className="me-2">
                                <span className="onboard-title">
                                  Approved On:{" "}
                                </span>
                                <span
                                  className="onboard-info-content"
                                  style={{ marginRight: "15px" }}
                                >
                                  {formatDate(
                                    onboardingDocument.ApprovedOn
                                      ? onboardingDocument.ApprovedOn
                                      : ""
                                  )}
                                </span>
                              </div>
                            </p>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {!onboardingDocument.IsApproved && (
                  <div className="d-flex">
                    <button
                      className="approve-button"
                      onClick={() => {
                        toggleApprovalModal();
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className=" onboarding-remove-button Onboarding-button-text-color hover:bg-white"
                      onClick={() => {
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
            <UploadFacilityOnboardingDocument
              name={capitalize(onboardingDocument.DocumentMaster.Type)}
              key={onboardingDocument.Id}
              documentId={onboardingDocument.Id}
              jobId={jobId}
              facilityId={facilityId}
              professionalId={professionalId}
              jobApplicationId={jobApplicationId}
              fetchDocuments={fetchList}
              fetchList={fetchList}
            />
          )}
        </>

        {rejectionModalOpen && (
          <FacilityOnboardingRejection
            isOpen={rejectionModalOpen}
            toggle={toggleRejectionModal}
            facilityId={facilityId}
            jobId={jobId}
            professionalId={professionalId}
            jobApplicationId={jobApplicationId}
            document={onboardingDocument}
            fetchDocuments={fetchList}
            fetchList={fetchList}
          />
        )}
        {approvalModalOpen && (
          <FacilityOnboardingApprove
            isOpen={approvalModalOpen}
            toggle={toggleApprovalModal}
            facilityId={facilityId}
            jobId={jobId}
            professionalId={professionalId}
            jobApplicationId={jobApplicationId}
            document={onboardingDocument}
            fetchDocuments={fetchList}
            fetchList={fetchList}
          />
        )}
      </div>
    </>
  );
};

export default FacilityOnboardingProfileSubmissionDocumentCard;
