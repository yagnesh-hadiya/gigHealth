import { useCallback, useEffect, useState } from "react";
import { WorkHistoryType } from "../../../../../../types/ProfessionalDetails";
import { WorkReferenceType } from "../../../../../../types/WorkReferenceTypes";
import {
  CertificationList,
  EducationList,
  LicenseList,
} from "../../../../../../types/StoreInitialTypes";
import { showToast } from "../../../../../../helpers";
import Loader from "../../../../../../components/custom/CustomSpinner";
import ReadOnlyEducationCard from "../../../jobs/Submissions/ReadOnlyEducationCard";
import ReadOnlyReferenceCard from "../../../jobs/Submissions/ReadOnlyReferenceCard";
import WorkHistoryCard from "../../../../../professionals/WorkHistoryCard";
import ReadOnlyRosterCertificateCard from "../../roster/Profile/ReadOnlyRosterCertificateCard";
import ReadOnlyRosterLicensesCard from "../../roster/Profile/ReadOnlyRosterLicensesCard";
import FacilityGigHistoryServices from "../../../../../../services/FacilityGigHistoryServices";
import CustomPagination from "../../../../../../components/custom/CustomPagination";
import ReadOnlyDocumentCard from "../../../jobs/Submissions/ReadOnlyDocumentCard";
import { ProfessionalDocument } from "../../../../../../types/ProfessionalDocumentType";

type GigProfileDetailsAndDocumentsTypes = {
  professionalId: number;
  jobId: number;
  facilityId: number;
};

const GigProfileDetailsAndDocuments = ({
  professionalId,
  jobId,
  facilityId,
}: GigProfileDetailsAndDocumentsTypes) => {
  const [workHistory, setWorkHistory] = useState<WorkHistoryType[]>([]);
  const [workReference, setWorkReference] = useState<WorkReferenceType[]>([]);
  const [workEducation, setWorkEducation] = useState<EducationList[]>([]);
  const [workLicenses, setWorkLicenses] = useState<LicenseList[]>([]);
  const [workCertification, setWorkCertification] = useState<
    CertificationList[]
  >([]);
  const [workDocuments, setWorkDocuments] = useState<ProfessionalDocument[]>(
    []
  );
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    setPage(selectedPage);
  };

  const fetchDocuments = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await FacilityGigHistoryServices.fetchProfessionalDocuments({
        facilityId,
        jobId,
        professionalId,
        size,
        page,
      });
      if (res.status === 200) {
        setTotalRows(res.data.data[0]?.count);
        setTotalPages(Math.ceil(res.data.data[0]?.count / size));
        setWorkDocuments(res.data.data[0].rows);
        setLoading("idle");
      }
    } catch (error: any) {
      showToast("Error fetching documents", error);
      console.error("Error fetching documents:", error);
    }
  }, [facilityId, jobId, professionalId, page, size]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    setLoading("loading");

    const fetchData = async (
      apiFunction: () => Promise<any>,
      setter: (data: any) => void
    ) => {
      try {
        const result = await apiFunction();
        setter(result.data.data);
      } catch (error: any) {
        showToast("Error fetching data", error);
        console.error("Error fetching data:", error);
      }
    };

    const apiCalls = [
      FacilityGigHistoryServices.fetchProfessionalWorkHistory,
      FacilityGigHistoryServices.fetchProfessionalReferences,
      FacilityGigHistoryServices.fetchProfessionalEducation,
      FacilityGigHistoryServices.fetchProfessionalLicenses,
      FacilityGigHistoryServices.fetchProfessionalCertifications,
    ];

    const setters = [
      setWorkHistory,
      setWorkReference,
      setWorkEducation,
      setWorkLicenses,
      setWorkCertification,
    ];

    Promise.allSettled(
      apiCalls.map((apiFunction, index) =>
        fetchData(
          () => apiFunction({ jobId, professionalId, facilityId }),
          setters[index]
        )
      )
    ).then(() => setLoading("idle"));
  }, [facilityId, jobId, professionalId]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <div
          className="facility-header-wrap"
          style={{
            padding: "10px 10px",
          }}
        >
          {workHistory.length > 0 && (
            <>
              <span className="section-header">Work History</span>
              <div>
                {workHistory.map((history) => (
                  <WorkHistoryCard
                    fetch={() => {
                      return;
                    }}
                    workHistory={history}
                    professionalId={1}
                    isReadOnly={true}
                  />
                ))}
              </div>
            </>
          )}

          {workReference.length > 0 && (
            <>
              <div
                className="details-header section-header"
                style={{ padding: "10px 21px" }}
              >
                References
              </div>
              {workReference.map((reference) => (
                <ReadOnlyReferenceCard reference={reference} />
              ))}
            </>
          )}
        </div>

        {workEducation.length > 0 && (
          <div
            style={{
              borderRadius: "4px",
              background: "#fff",
              boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              className="facility-header-wrap"
              style={{ padding: "10px 10px" }}
            >
              <span className="section-header" style={{ marginLeft: "20px" }}>
                Education
              </span>
              {workEducation.map((education) => (
                <ReadOnlyEducationCard education={education} />
              ))}
            </div>
          </div>
        )}

        {(workLicenses.length > 0 || workCertification.length > 0) && (
          <div
            style={{
              borderRadius: "4px",
              background: "#fff",
              boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              className="facility-header-wrap"
              style={{ padding: "10px 10px" }}
            >
              <span className="section-header" style={{ padding: "10px 21px" }}>
                Professional Information
              </span>
              <div className="wrapper">
                <div className="details-wrapper">
                  {workLicenses.length > 0 && (
                    <span className="prof-card-header">Licenses</span>
                  )}
                  {workLicenses.map((license) => (
                    <ReadOnlyRosterLicensesCard license={license} />
                  ))}

                  {workCertification.length > 0 && (
                    <span
                      className="prof-card-header"
                      style={{
                        marginTop: "10px",
                        marginBottom: "0px",
                      }}
                    >
                      Certifications
                    </span>
                  )}
                  {workCertification.map((certification) => (
                    <ReadOnlyRosterCertificateCard
                      certificate={certification}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {workDocuments.length > 0 && (
          <div
            style={{
              borderRadius: "4px",
              background: "#fff",
              boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              className="facility-header-wrap"
              style={{ padding: "10px 10px" }}
            >
              <span className="section-header" style={{ padding: "10px" }}>
                Documents
              </span>

              {workDocuments.map((document) => (
                <ReadOnlyDocumentCard
                  doc={document}
                  facilityId={facilityId}
                  jobId={jobId}
                  professionalId={professionalId}
                />
              ))}
              <div
                style={{
                  marginTop: "auto",
                  margin: "0px 10px",
                }}
              >
                <CustomPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageSizeChange}
                  onPageSizeChange={setSize}
                  entriesPerPage={size}
                  totalRows={totalRows}
                  setPage={setPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GigProfileDetailsAndDocuments;
