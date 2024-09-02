import { capitalize, debounce } from "../../../../../../helpers";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomInput from "../../../../../../components/custom/CustomInput";
import Search from "../../../../../../assets/images/search.svg";
import { useCallback, useEffect, useState } from "react";
import SubmissionProfileModal from "../SubmissionProfileModal";
import {
  fetchRejectedSubmissions,
  fetchSubmissionPdf,
} from "../../../../../../services/SubmissionServices";
import { useParams } from "react-router-dom";
import { RightJobContentData } from "../../../../../../types/JobsTypes";
import Loader from "../../../../../../components/custom/CustomSpinner";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { getStatusColor } from "../../../../../../constant/StatusColors";

import CustomPagination from "../../../../../../components/custom/CustomPagination";
import CustomButton from "../../../../../../components/custom/CustomBtn";
import CustomActionDownloadBtn from "../../../../../../components/custom/CustomDownloadBtn";
import SubmissionOfferDetails from "./SubmissionOfferDetails";

type RejectedTabProps = {
  job: RightJobContentData;
  activeTab: number;
};

export type RejectedJobAssignmentInfo = {
  JobSubmissionId: number;
  AppliedOn: string;
  StatusUpdatedOn: string | null;
  JobSubmission: number;
  JobApplicationId: number;
  JobApplicationStatus: string;
  ProfessionalId: number;
  ProfessionalFirstName: string;
  ProfessionalLastName: string;
  ProfessionalEmail: string;
  ProfessionalPhone: string;
  ProfessionalExperience: number;
  JobAssignmentId: number | null;
  JobAssignmentStatusUpdatedOn: string | null;
  JobAssignmentStartDate: string | null;
  JobAssignmentEndDate: string | null;
};

const RejectedTab = ({ job, activeTab }: RejectedTabProps) => {
  const params = useParams();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const [data, setData] = useState<RejectedJobAssignmentInfo[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [currentApplicantId, setCurrentApplicantId] = useState<number | null>(
    null
  );
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isOfferOpen, setIsOfferOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] =
    useState<RejectedJobAssignmentInfo | null>(null);
  const [abort, setAbort] = useState<boolean>(false);

  const abortController = new AbortController();
  const fetchData = useCallback(
    debounce(async () => {
      setLoading("loading");
      if (activeTab === 2) {
        try {
          const res = await fetchRejectedSubmissions({
            facilityId: Number(params?.fId),
            jobId: Number(params?.jId),
            search: search.length > 0 ? search : undefined,
            page: search ? currentPageSearch : page,
            size: size,
            abortController,
          });
          if (res.status === 200) {
            setTotalRows(res.data.data[0]?.count);
            setTotalPages(Math.ceil(res.data.data[0]?.count / size));

            const fetchedRejectedSubmissions = res.data.data[0]?.rows;

            const jobAssignmentsArray = fetchedRejectedSubmissions.reduce(
              (
                acc: {
                  JobSubmissionId: any;
                  AppliedOn: any;
                  StatusUpdatedOn: any;
                  JobSubmission: any;
                  JobApplicationId: any;
                  JobApplicationStatus: any;
                  ProfessionalId: any;
                  ProfessionalFirstName: any;
                  ProfessionalLastName: any;
                  ProfessionalEmail: any;
                  ProfessionalPhone: any;
                  ProfessionalExperience: any;
                  JobAssignmentId: any;
                  JobAssignmentStatusUpdatedOn: any;
                  JobAssignmentStartDate: any;
                  JobAssignmentEndDate: any;
                }[],
                rejectedSubmission: {
                  JobAssignments: any[];
                  Id: any;
                  AppliedOn: any;
                  StatusUpdatedOn: any;
                  JobSubmission: { Id: any };
                  JobApplicationStatus: { Id: any; Status: any };
                  Professional: {
                    Id: any;
                    FirstName: any;
                    LastName: any;
                    Email: any;
                    Phone: any;
                    Experience: any;
                  };
                }
              ) => {
                if (rejectedSubmission.JobAssignments.length > 0) {
                  rejectedSubmission.JobAssignments.forEach((jobAssignment) => {
                    acc.push({
                      JobSubmissionId: rejectedSubmission.Id,
                      AppliedOn: rejectedSubmission.AppliedOn,
                      StatusUpdatedOn: rejectedSubmission.StatusUpdatedOn,
                      JobSubmission: rejectedSubmission.JobSubmission.Id,
                      JobApplicationId:
                        rejectedSubmission.JobApplicationStatus.Id,
                      JobApplicationStatus:
                        jobAssignment.JobApplicationStatus.Status,
                      ProfessionalId: rejectedSubmission.Professional.Id,
                      ProfessionalFirstName:
                        rejectedSubmission.Professional.FirstName,
                      ProfessionalLastName:
                        rejectedSubmission.Professional.LastName,
                      ProfessionalEmail: rejectedSubmission.Professional.Email,
                      ProfessionalPhone: rejectedSubmission.Professional.Phone,
                      ProfessionalExperience:
                        rejectedSubmission.Professional.Experience,
                      JobAssignmentId: jobAssignment.Id,
                      JobAssignmentStatusUpdatedOn:
                        jobAssignment.StatusUpdatedOn,
                      JobAssignmentStartDate: jobAssignment.StartDate,
                      JobAssignmentEndDate: jobAssignment.EndDate,
                    });
                  });
                } else {
                  acc.push({
                    JobSubmissionId: rejectedSubmission.Id,
                    AppliedOn: rejectedSubmission.AppliedOn,
                    StatusUpdatedOn: rejectedSubmission.StatusUpdatedOn,
                    JobSubmission: rejectedSubmission.JobSubmission.Id,
                    JobApplicationId: rejectedSubmission.Id,
                    JobApplicationStatus:
                      rejectedSubmission.JobApplicationStatus.Status,
                    ProfessionalId: rejectedSubmission.Professional.Id,
                    ProfessionalFirstName:
                      rejectedSubmission.Professional.FirstName,
                    ProfessionalLastName:
                      rejectedSubmission.Professional.LastName,
                    ProfessionalEmail: rejectedSubmission.Professional.Email,
                    ProfessionalPhone: rejectedSubmission.Professional.Phone,
                    ProfessionalExperience:
                      rejectedSubmission.Professional.Experience,
                    JobAssignmentId: null,
                    JobAssignmentStatusUpdatedOn: null,
                    JobAssignmentStartDate: null,
                    JobAssignmentEndDate: null,
                  });
                }
                return acc;
              },
              []
            );

            setData(jobAssignmentsArray);

            if (fetchedRejectedSubmissions.length > 0) {
              const firstRejectedSubmission = fetchedRejectedSubmissions[0];
              setProfessionalId(firstRejectedSubmission.Professional.Id);
              setCurrentStatus(
                firstRejectedSubmission.JobApplicationStatus.Status
              );
              setCurrentApplicantId(firstRejectedSubmission.Id);
            }

            setLoading("idle");
          }
        } catch (error) {
          if (abortController.signal.aborted) {
            setAbort(true);
            return;
          }
          console.error(error);
          setLoading("error");
        }
      }
    }, 300),
    [
      activeTab,
      currentPageSearch,
      page,
      params?.fId,
      params?.jId,
      search,
      size,
      abort,
    ]
  );

  const fetchJobSubmissionPdf = useCallback(
    async ({
      professionalId,
      currentApplicantId,
    }: {
      professionalId: number;
      currentApplicantId: number;
    }) => {
      setLoading("loading");
      try {
        if (professionalId && currentApplicantId) {
          const response = await fetchSubmissionPdf({
            facilityId: Number(params?.fId),
            jobId: Number(params?.jId),
            professionalId: professionalId,
            jobApplicationId: currentApplicantId,
          });

          if (response.status === 200) {
            const blob = new Blob([response.data], {
              type: response.headers["content-type"],
            });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
          }
          setLoading("idle");
        }
      } catch (error) {
        console.error(error);
        setLoading("error");
      }
    },
    [params?.fId, params?.jId]
  );

  useEffect(() => {
    fetchData();

    return () => abortController.abort();
  }, [fetchData, abort]);

  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
  };
  const toggleOfferModal = () => {
    setIsOfferOpen(!isOfferOpen);
  };

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    if (search) {
      setCurrentPageSearch(selectedPage);
    } else {
      setPage(selectedPage);
    }
  };

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(1);
  };

  const Column: TableColumn<RejectedJobAssignmentInfo>[] = [
    {
      name: "Sr No",
      width:'50px',
      cell: (row: RejectedJobAssignmentInfo) => {
        return row.JobSubmissionId;
      },
    },
    {
      name: "Professional Name",
      minWidth: "250px",
      cell: (row: RejectedJobAssignmentInfo) => (
        <div className="table-username">
          <p style={{ marginRight: "5px" }} className="name-logo">
            {capitalize(row.ProfessionalFirstName[0])}
            {capitalize(row.ProfessionalLastName[0])}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span className="center-align text-align user-name">
              {capitalize(row.ProfessionalFirstName)}{" "}
              {capitalize(row.ProfessionalLastName)}
            </span>
            <span className="text-color email">{row.ProfessionalEmail}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Phone",
      minWidth: "140px",
      selector: (row: RejectedJobAssignmentInfo): string =>
        row.ProfessionalPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
      wrap: true,
    },
    {
      name: "Experience",
      minWidth: "90px",
      cell: (row: RejectedJobAssignmentInfo) => (
        <div className="center-align">
          {row.ProfessionalExperience
            ? `${row.ProfessionalExperience} Years`
            : "-"}
        </div>
      ),
    },
    {
      name: "Declined/Terminated On",
      minWidth: "180px",
      cell: (row: RejectedJobAssignmentInfo) => (
        <div className="center-align">
          {row.StatusUpdatedOn
            ? new Date(row.StatusUpdatedOn).toLocaleString()
            : "-"}
        </div>
      ),
    },
    {
      name: "Application Status",
      minWidth: "150px",
      cell: (cell: RejectedJobAssignmentInfo) => (
        <>
          <span
            style={{
              color: getStatusColor(cell.JobApplicationStatus),
            }}
          >
            {cell.JobApplicationStatus
              ? cell.JobApplicationStatus
              : "Submitted"}
          </span>
        </>
      ),
    },
    {
      name: "",
      minWidth: "190px",
      cell: (row: RejectedJobAssignmentInfo) => (
        <div className="right-buttons mt-0 gap-2">
          {row.JobAssignmentId ? (
            <UncontrolledDropdown>
              <DropdownToggle
                color="#fff"
                style={{
                  background: "#fff",
                  border: "1px solid #DDDDEA",
                  padding: "0.25rem 0.85rem",
                }}
              >
                <i className="fas fa-ellipsis-v"></i>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    fetchJobSubmissionPdf({
                      currentApplicantId: row.JobSubmissionId,
                      professionalId: row.ProfessionalId,
                    });
                  }}
                >
                  View Submission
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setCurrentApplicantId(row.JobSubmissionId);
                    setProfessionalId(row.ProfessionalId);
                    setCurrentStatus(row.JobApplicationStatus);
                    setCurrentRow(row);
                    toggleOfferModal();
                  }}
                >
                  View Offer Details
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ) : (
            <CustomActionDownloadBtn
              title={"View Submission"}
              id={`pdf-${row.JobSubmissionId}`}
              onDownload={() => {
                fetchJobSubmissionPdf({
                  currentApplicantId: row.JobSubmissionId,
                  professionalId: row.ProfessionalId,
                });
              }}
            />
          )}
          <CustomButton
            id="view-profile"
            className="professional-button view"
            onClick={() => {
              setCurrentApplicantId(row.JobSubmissionId);
              setProfessionalId(row.ProfessionalId);
              setCurrentStatus(row.JobApplicationStatus);
              toggleProfileModal();
            }}
          >
            View Profile
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="mt-3">
        <div className="search-bar-wrapper w-100 mb-3">
          <CustomInput
            placeholder="Search Here"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              handleSearch(e.target.value)
            }
          />
          <img src={Search} alt="search" />
        </div>
        <div className="datatable-wrapper">
          <DataTable columns={Column} data={data} />

          {data.length > 0 && (
            <CustomPagination
              currentPage={search ? currentPageSearch : page}
              totalPages={totalPages}
              onPageChange={handlePageSizeChange}
              onPageSizeChange={setSize}
              entriesPerPage={size}
              totalRows={totalRows}
              setPage={setPage}
            />
          )}
        </div>
      </div>

      {isProfileModalOpen &&
        currentApplicantId &&
        professionalId &&
        currentStatus && (
          <SubmissionProfileModal
            status={currentStatus}
            isOpen={isProfileModalOpen}
            toggle={toggleProfileModal}
            facilityId={Number(params?.fId)}
            jobId={Number(params?.jId)}
            currentApplicantId={currentApplicantId}
            professionalId={professionalId}
            job={job}
            fetchApplicants={fetchData}
          />
        )}

      {isOfferOpen &&
        currentApplicantId &&
        professionalId &&
        currentRow &&
        currentRow.JobAssignmentId &&
        currentStatus && (
          <SubmissionOfferDetails
            isOpen={isOfferOpen}
            toggle={toggleOfferModal}
            professionalId={professionalId}
            facilityId={Number(params?.fId)}
            jobId={Number(params?.jId)}
            jobApplicationId={currentApplicantId}
            jobAssignmentId={currentRow.JobAssignmentId}
            currentStatus={currentStatus}
            row={currentRow}
          />
        )}
    </>
  );
};

export default RejectedTab;
