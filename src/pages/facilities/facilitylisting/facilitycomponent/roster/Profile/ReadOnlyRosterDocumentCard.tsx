import {
  capitalize,
  formatDateInDayMonthYear,
} from "../../../../../../helpers";
import File from "../../../../../../assets/images/file.svg";
import { ProfessionalDocumentType } from "../../../../../../types/ProfessionalTypes";
import { useCallback, useState } from "react";
import Loader from "../../../../../../components/custom/CustomSpinner";
import RosterServices from "../../../../../../services/RosterServices";

const ReadOnlyRosterDocumentCard = ({
  facilityId,
  jobId,
  professionalId,
  documentCard,
}: {
  documentCard: ProfessionalDocumentType;
  facilityId: number;
  jobId: number;
  professionalId: number;
}) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const download = useCallback(async () => {
    setLoading("loading");
    try {
      const response = await RosterServices.downloadProfessionalDocument({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        docId: documentCard.Id,
      });
      if (response.status === 200) {
        const contentDisposition = response.headers["content-disposition"];
        let filename = "download";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }
        const file = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const fileURL = URL.createObjectURL(file);
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.download = filename;
        fileLink.click();
        URL.revokeObjectURL(fileURL);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
      setLoading("error");
    }
  }, [documentCard.Id, facilityId, jobId, professionalId]);

  if (
    documentCard.Certification === null &&
    documentCard.License === null &&
    documentCard.JobComplianceDocument === null
  ) {
    return;
  }

  return (
    <div className="details-wrapper" style={{ padding: "10px 10px" }}>
      {loading === "loading" && <Loader />}
      <div className="box-wrapper ">
        <div className="d-flex align-items-center view-file-info-section pb-3 pt-2">
          <div className="file-img d-flex doc-wrapper" onClick={download}>
            <img src={File} className="" />
          </div>
          <div className="file-content">
            {documentCard.Certification && (
              <span className="info-title">
                {capitalize(documentCard.Certification.Name) || "--"}
              </span>
            )}

            {documentCard.JobComplianceDocument && (
              <div>
                <span className="info-title">Document: </span>
                <span className="info-content">
                  {capitalize(
                    documentCard.JobComplianceDocument.DocumentMaster.Type
                      ? documentCard.JobComplianceDocument.DocumentMaster.Type
                      : "--"
                  )}
                </span>
              </div>
            )}

            {documentCard.License && (
              <>
                <div>
                  <span className="info-title">License Number: </span>
                  <span className="info-content">
                    {documentCard.License.LicenseNumber}
                  </span>
                </div>
                <span className="info-title">State: </span>
                <span className="info-content">
                  {capitalize(documentCard.License.State?.State) || "--"}
                </span>
                <span className="info-title">Expiration Date: </span>
                <span className="info-content">
                  {documentCard.License.Expiry
                    ? formatDateInDayMonthYear(
                        documentCard.License.Expiry?.toString()
                      )
                    : "--"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyRosterDocumentCard;
