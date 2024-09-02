import { useCallback, useEffect, useState } from "react";
import { WorkHistoryType } from "../../../../../../types/ProfessionalDetails";
import { WorkReferenceType } from "../../../../../../types/WorkReferenceTypes";
import {
  CertificationList,
  EducationList,
  LicenseList,
} from "../../../../../../types/StoreInitialTypes";
import FacilityGigHistoryServices from "../../../../../../services/FacilityGigHistoryServices";
import { showToast } from "../../../../../../helpers";
import Loader from "../../../../../../components/custom/CustomSpinner";
import WorkHistoryCard from "../../../../../professionals/WorkHistoryCard";
import ReadOnlyReferenceCard from "../../../jobs/Submissions/ReadOnlyReferenceCard";
import ReadOnlyEducationCard from "../../../jobs/Submissions/ReadOnlyEducationCard";
import ReadOnlyLicensesCard from "../../../jobs/Submissions/ReadOnlyLicensesCard";
import ReadOnlyCertificateCard from "../../../jobs/Submissions/ReadOnlyCertificateCard";
import ReadOnlyDocumentCard from "../../../jobs/Submissions/ReadOnlyDocumentCard";
import CustomButton from "../../../../../../components/custom/CustomBtn";
import CustomPagination from "../../../../../../components/custom/CustomPagination";
import { ProfessionalDocument } from "../../../../../../types/ProfessionalDocumentType";

type FacilityCandidateInfoTypes = {
  professionalId: number;
  jobId: number;
  facilityId: number;
  toggle: () => void;
  toggleTab: (categotyId: number) => void;
};

const FacilityCandidateInfo = ({
  professionalId,
  jobId,
  facilityId,
  toggle,
  toggleTab,
}: FacilityCandidateInfoTypes) => {
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

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    setPage(selectedPage);
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <div className="facility-header-wrap">
          {workHistory.length > 0 && (
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
                style={{ padding: "10px 0px" }}
              >
                <span className="section-header" style={{ marginLeft: "20px" }}>
                  Work History
                </span>
                <div
                  style={{
                    padding: "0px 20px",
                  }}
                >
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
              </div>
            </div>
          )}

          {workReference.length > 0 && (
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
                style={{ padding: "10px 0px" }}
              >
                <span className="section-header" style={{ marginLeft: "20px" }}>
                  References
                </span>
                {workReference.map((reference) => (
                  <ReadOnlyReferenceCard reference={reference} />
                ))}
              </div>
            </div>
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
              style={{ padding: "0px 0px" }}
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
              style={{ padding: "10px 0px" }}
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
                    <ReadOnlyLicensesCard license={license} />
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
                    <ReadOnlyCertificateCard certificate={certification} />
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

      <div className="mt-4 mb-4">
        <CustomButton
          className="primary-btn ms-0"
          onClick={() => {
            toggleTab(2);
          }}
        >
          Next
        </CustomButton>
        <CustomButton className="secondary-btn" onClick={toggle}>
          Cancel
        </CustomButton>
      </div>
    </>
  );
};

export default FacilityCandidateInfo;
