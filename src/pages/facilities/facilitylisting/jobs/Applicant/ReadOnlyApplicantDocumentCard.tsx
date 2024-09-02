import { Col, Row } from "reactstrap";
import File from "../../../../../assets/images/file.svg";
import { ApplicantDocumentObjectType } from "./ApplicantSubmittedDocument";
import { capitalize } from "../../../../../helpers";
import { downloadSubmissionDocument } from "../../../../../services/SubmissionServices";
import { useState } from "react";
import Loader from "../../../../../components/custom/CustomSpinner";

type ReadOnlyApplicantDocumentCardProps = {
  ApplicantDocumentObject: ApplicantDocumentObjectType;
  professionalId: number;
  jobId: number;
  facilityId: number;
  currentApplicantId: number;
};

const ReadOnlyApplicantDocumentCard = ({
  professionalId,
  jobId,
  facilityId,
  currentApplicantId,
  ApplicantDocumentObject,
}: ReadOnlyApplicantDocumentCardProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");

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

  return (
    <div
      style={{
        width: "49%",
      }}
    >
      {loading === "loading" && <Loader />}
      {ApplicantDocumentObject.ProfessionalDocument !== null && (
        <h6 className="heading-margin">
          {capitalize(ApplicantDocumentObject.DocumentMaster.Type)}
          {ApplicantDocumentObject.IsRequired && (
            <span className="asterisk"> *</span>
          )}
        </h6>
      )}

      <Row>
        {ApplicantDocumentObject.ProfessionalDocument !== null && (
          <Col>
            <div className="view-file-wrapper onboarding-wrapper">
              <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
                <div className="file-img d-flex" onClick={download}>
                  <img src={File} alt="file" />
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
        )}
      </Row>
    </div>
  );
};

export default ReadOnlyApplicantDocumentCard;
