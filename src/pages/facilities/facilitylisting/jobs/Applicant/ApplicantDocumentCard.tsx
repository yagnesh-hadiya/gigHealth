import { Col, Label, Row } from "reactstrap";
import File from "../../../../../assets/images/file.svg";
import { ApplicantDocumentObjectType } from "./ApplicantSubmittedDocument";
import {
  deleteSubmissionDocument,
  removeSubmissionDocument,
  uploadSubmissionDocument,
} from "../../../../../services/ApplicantsServices";
import Loader from "../../../../../components/custom/CustomSpinner";
import { useState } from "react";
import { toast } from "react-toastify";
import { capitalize, showToast } from "../../../../../helpers";
import { downloadSubmissionDocument } from "../../../../../services/SubmissionServices";
import SelectDocument from "../../../../professionals/ProfessionalOnboarding/OnboardingDocument/SelectDocument";

type ApplicantDocumentCardProps = {
  professionalId: number;
  jobId: number;
  facilityId: number;
  currentApplicantId: number;
  ApplicantDocumentObject: ApplicantDocumentObjectType;
  fetchDocuments: () => void;
};

const ApplicantDocumentCard = ({
  professionalId,
  jobId,
  facilityId,
  currentApplicantId,
  ApplicantDocumentObject,
  fetchDocuments,
}: ApplicantDocumentCardProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");

  const handleDocumentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files?.[0];
    if (!files) {
      showToast("error", "No file selected");
      setLoading("idle");
      return;
    }

    const maxFileSize: number = 2;
    if (files) {
      const fileSizeMb: number = files?.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        return showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
      }
    }

    setLoading("loading");

    try {
      if (e.target.files?.length === 1) {
        const res = await uploadSubmissionDocument({
          jobId: jobId,
          professionalId: professionalId,
          facilityId: facilityId,
          currentApplicantId: currentApplicantId,
          submissionDocumentId: ApplicantDocumentObject.Id,
          document: e.target.files?.[0],
        });
        if (res.status === 200) {
          fetchDocuments();
          setLoading("idle");
          toast.success(
            res.data.message || "Submission document uploaded successfully."
          );
        }
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

  const download = async () => {
    setLoading("loading");
    try {
      const res = await downloadSubmissionDocument({
        jobId: jobId,
        professionalId: professionalId,
        facilityId: facilityId,
        jobApplicationId: currentApplicantId,
        documentId: ApplicantDocumentObject.Id,
      });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          ApplicantDocumentObject.ProfessionalDocument?.FileName || "file"
        );
        document.body.appendChild(link);
        link.click();
        setLoading("idle");
      }
    } catch (error) {
      setLoading("error");
      console.error(error);
    }
  };

  const removeDocument = async () => {
    setLoading("loading");
    try {
      const res = await removeSubmissionDocument({
        jobId: jobId,
        professionalId: professionalId,
        facilityId: facilityId,
        currentApplicantId: currentApplicantId,
        submissionDocumentId: ApplicantDocumentObject.Id,
      });
      if (res.status === 200) {
        fetchDocuments();
        setLoading("idle");
        toast.success(
          res.data.message || "Submission document removed successfully."
        );
      }
    } catch (error) {
      setLoading("error");
      console.error(error);
    }
  };

  const deleteDocument = async () => {
    setLoading("loading");
    try {
      const res = await deleteSubmissionDocument({
        jobId: jobId,
        professionalId: professionalId,
        facilityId: facilityId,
        currentApplicantId: currentApplicantId,
        submissionDocumentId: ApplicantDocumentObject.Id,
      });
      if (res.status === 200) {
        fetchDocuments();
        setLoading("idle");
        toast.success(
          res.data.message || "Submission document deleted successfully."
        );
      }
    } catch (error) {
      setLoading("error");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {loading === "loading" && <Loader />}

      <h6 className="heading-margin">
        {capitalize(ApplicantDocumentObject.DocumentMaster.Type)}
        {ApplicantDocumentObject.IsRequired && (
          <span className="asterisk"> *</span>
        )}
        {ApplicantDocumentObject.IsRequired === false && (
          <button className="remove-button ms-2" onClick={deleteDocument}>
            Remove
          </button>
        )}
      </h6>

      {ApplicantDocumentObject.ProfessionalDocument === null &&
        ApplicantDocumentObject?.JobSuggestedDocCount?.Count > 0 && (
          <div className="mb-2">
            <SelectDocument
              facilityId={facilityId}
              jobApplicationId={currentApplicantId}
              jobId={jobId}
              professionalId={professionalId}
              documentId={ApplicantDocumentObject.DocumentMaster.Id}
              jobComplianceId={ApplicantDocumentObject.Id}
              DocCount={
                ApplicantDocumentObject?.JobSuggestedDocCount?.Count
                  ? ApplicantDocumentObject?.JobSuggestedDocCount?.Count
                  : 0
              }
              fetchDocuments={fetchDocuments}
            />
          </div>
        )}

      <Row>
        {ApplicantDocumentObject.ProfessionalDocument !== null ? (
          <Col>
            <div className="view-file-wrapper onboarding-wrapper">
              <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
                <div className="file-img d-flex">
                  <img src={File} alt="file" onClick={download} />
                </div>
                <div>
                  <div className="d-flex align-items-center">
                    <p
                      className="file-name"
                      style={{ marginBottom: "0px", marginRight: "10px" }}
                    >
                      {capitalize(
                        ApplicantDocumentObject.ProfessionalDocument.FileName
                      )}
                    </p>

                    <button className="remove-button" onClick={removeDocument}>
                      Remove
                    </button>
                  </div>
                  <div className="file-content">
                    <p style={{ marginBottom: "0px" }}>
                      <span className="onboard-title text-green">
                        Uploaded Successfully.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ) : (
          <Col>
            {/* <FormGroup> */}
            <div className="file-picker-wrapper">
              <div className="file-picker-label-wrapper">
                <Label
                  for={`exampleFile + ${ApplicantDocumentObject.Id}`}
                  className="file-picker-label"
                >
                  Upload File
                </Label>
              </div>
              <p className="file-para">
                Supported Formats: doc, docx, pdf, .jpg, .jpeg, .heic up to 2 MB
              </p>
              <input
                className="custom-input"
                id={`exampleFile + ${ApplicantDocumentObject.Id}`}
                name={`exampleFile + ${ApplicantDocumentObject.Id}`}
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .heic"
                type="file"
                style={{ display: "none" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleDocumentChange(e);
                }}
              />
            </div>
            {/* </FormGroup> */}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ApplicantDocumentCard;
