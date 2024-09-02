import CustomButton from "../../../../../components/custom/CustomBtn";
import { useCallback, useEffect, useState } from "react";
import { WorkHistoryType } from "../../../../../types/ProfessionalDetails";
import WorkHistoryCard from "../../../../professionals/WorkHistoryCard";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  fetchApplicantProfessionalCertifications,
  fetchApplicantProfessionalDocuments,
  fetchApplicantProfessionalEducation,
  fetchApplicantProfessionalLicenses,
  fetchApplicantProfessionalReferences,
  fetchApplicantProfessionalWorkHistory,
} from "../../../../../services/ApplicantsServices";
import { WorkReferenceType } from "../../../../../types/WorkReferenceTypes";
import {
  CertificationList,
  EducationList,
  LicenseList,
} from "../../../../../types/StoreInitialTypes";
import { showToast } from "../../../../../helpers";
import ReadOnlyReferenceCard from "./ReadOnlyReferenceCard";
import ReadOnlyEducationCard from "./ReadOnlyEducationCard";
import ReadOnlyLicensesCard from "./ReadOnlyLicensesCard";
import ReadOnlyCertificateCard from "./ReadOnlyCertificateCard";
import ReadOnlyDocumentCard from "./ReadOnlyDocumentCard";
import CustomPagination from "../../../../../components/custom/CustomPagination";
import { ProfessionalDocument } from "../../../../../types/ProfessionalDocumentType";

type ProfileDetailsSubmissionTypes = {
  professionalId: number;
  jobId: number;
  facilityId: number;
  toggle: () => void;
  toggleTab: (categotyId: number) => void;
};

const ProfileDetailsSubmission = ({
  professionalId,
  jobId,
  facilityId,
  toggle,
  toggleTab,
}: ProfileDetailsSubmissionTypes) => {
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
      const res = await fetchApplicantProfessionalDocuments({
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
      fetchApplicantProfessionalWorkHistory,
      fetchApplicantProfessionalReferences,
      fetchApplicantProfessionalEducation,
      fetchApplicantProfessionalLicenses,
      fetchApplicantProfessionalCertifications,
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
          () =>
            apiFunction({
              jobId,
              professionalId,
              facilityId,
            }),
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
              <>
                <div className="pt-3">
                  <span
                    className="section-header"
                    style={{ padding: "10px 21px" }}
                  >
                    Work History
                  </span>
                </div>

                <div
                  style={{
                    padding: "1rem 1.25rem",
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
              </>
            )}

            {workReference.length > 0 && (
              <>
                <div
                  className="details-header section-header"
                  style={{ padding: "10px 21px 0 21px" }}
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
                <span className="section-header" style={{ padding: "10px 15px" }}>
                  Professional Information
                </span>
                <div className="wrapper px-2">
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
            }}>
            <div
              className="facility-header-wrap"
              style={{ padding: "10px 10px" }}>
              <span className="section-header" style={{ padding: "10px 21px" }}>
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

        <div className="btn-wrapper mt-4" style={{ marginLeft: "0px" }}>
          <CustomButton
            className="primary-btn"
            style={{ marginLeft: "0px" }}
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
      </div>
    </>
  );
};

export default ProfileDetailsSubmission;
