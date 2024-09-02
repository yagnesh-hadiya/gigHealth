import { useCallback, useEffect, useState } from "react";
// import File from "../../../../assets/images/file.svg";
import ProfessionalGigHistoryServices from "../../../../services/ProfessionalGigHistoryServices";
import Loader from "../../../../components/custom/CustomSpinner";
import { ProfessionalOnboardingDocumentType } from "../../../../types/ProfessionalOnboardingTypes";
import { capitalize, showToast } from "../../../../helpers";

type RequiredToApplyProps = {
  professionalId: number;
  facilityId: number;
  jobApplicationId: number;
  jobId: number;
};

const RequiredToApply = ({
  professionalId,
  facilityId,
  jobApplicationId,
  jobId,
}: RequiredToApplyProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProfessionalOnboardingDocumentType[]>([]);

  const noDocuments = data.filter((doc) => doc.ProfessionalDocument);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res =
        await ProfessionalGigHistoryServices.getRequiredToApplyDocuments({
          professionalId: professionalId,
          facilityId: facilityId,
          jobApplicationId: jobApplicationId,
          jobId: jobId,
        });

      if (res.status === 200) {
        setData(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching documents", error);
    }
  }, [facilityId, jobApplicationId, jobId, professionalId]);

  const downloadDocument = async (documentId: number, fileName: string) => {
    setLoading(true);
    try {
      const res = await ProfessionalGigHistoryServices.downloadDocument({
        professionalId: professionalId,
        facilityId: facilityId,
        jobId: jobId,
        jobApplicationId: jobApplicationId,
        documentId: documentId,
      });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "file");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error downloading document", error);
      showToast(
        "error",
        error.response.data.message || "Error downloading file"
      );
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <>
      {loading && <Loader />}
      <div className="offer-wrapper">
        {noDocuments.length === 0 ? (
          <div className="no-data-found text-center">
            There are no records to display.
          </div>
        ) : (
          <>
            {data.map((doc) => (
              <div key={doc.Id}>
                {doc.ProfessionalDocument && (
                  <>
                    <h6 className="heading-margin mt-2">
                      {doc.DocumentMaster.Type
                        ? capitalize(doc.DocumentMaster.Type)
                        : "N/A"}
                      {doc.IsRequired && <span className="asterisk">*</span>}
                    </h6>
                    <div className="view-file-wrapper onboarding-wrapper">
                      {doc.ProfessionalDocument ? (
                        <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
                          <div
                            className="file-img d-flex"
                            onClick={() => {
                              if (doc.ProfessionalDocument) {
                                downloadDocument(
                                  doc.Id,
                                  doc.ProfessionalDocument.FileName
                                );
                              }
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
                                className="file-name mt-0"
                                style={{
                                  marginBottom: "0px",
                                  marginRight: "10px",
                                }}
                              >
                                {doc.DocumentMaster.Type
                                  ? capitalize(doc.DocumentMaster.Type)
                                  : "N/A"}
                              </p>
                            </div>
                            <div className="file-content">
                              <p style={{ marginBottom: "0px" }}>
                                <span className="onboard-title">
                                  Uploaded On:
                                </span>
                                <span className="onboard-info-content">
                                  {" "}
                                  {doc.ProfessionalDocument
                                    ? new Date(
                                        doc.ProfessionalDocument?.CreatedOn
                                      ).toLocaleString()
                                    : "N/A"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center view-file-info-section pb-3 pt-3 text-center justify-content-center">
                          No document uploaded
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default RequiredToApply;
