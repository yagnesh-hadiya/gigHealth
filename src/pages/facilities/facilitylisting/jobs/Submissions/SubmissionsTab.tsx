import {
  capitalize,
  debounce,
  formatDateString,
  showToast,
} from "../../../../../helpers";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomInput from "../../../../../components/custom/CustomInput";
import Search from "../../../../../assets/images/search.svg";
import { useCallback, useEffect, useState } from "react";
import SubmissionProfileModal from "./SubmissionProfileModal";
import CustomButton from "../../../../../components/custom/CustomBtn";
import MakeOffer from "./MakeOffer";
import { SubmissionTypes } from "../../../../../types/SubmissionTypes";
import {
  fetchSubmissions,
  fetchSubmissionPdf,
} from "../../../../../services/SubmissionServices";
import { useParams } from "react-router-dom";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import {
  declineApplication,
  fetchApplicantProfessionalDetails,
  fetchGetJobSubmission,
} from "../../../../../services/ApplicantsServices";
import Loader from "../../../../../components/custom/CustomSpinner";
import ComposeEmailModal from "../../facilitycomponent/roster/ComposeMailModal";
import CustomActionDownloadBtn from "../../../../../components/custom/CustomDownloadBtn";
import CustomEmailButton from "../../../../../components/custom/CustomEmailButton";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { JobSubmission } from "./ReadOnlyCoverPageDetails";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import { getStatusColor } from "../../../../../constant/StatusColors";

type SubmissionsTabProps = {
  job: RightJobContentData;
  activeTab: number;
};

const SubmissionsTab = ({ job, activeTab }: SubmissionsTabProps) => {
  const params = useParams();
  const [data, setData] = useState<SubmissionTypes[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [currentApplicantId, setCurrentApplicantId] = useState<number | null>(
    null
  );
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isMakeOfferModalOpen, setMakeOfferModalOpen] = useState(false);
  const [abort, setAbort] = useState<boolean>(false);
  const menuItems = [
    {
      label: "Make Offer",
      style: { color: "#7F47DD" },
      onClick: ({
        professionalId,
        currentApplicantId,
        status,
      }: {
        professionalId?: number;
        currentApplicantId?: number;
        status?: string;
      }) => {
        if (currentApplicantId && professionalId && status) {
          setProfessionalId(professionalId);
          setCurrentApplicantId(currentApplicantId);
          setMakeOfferModalOpen(true);
          setCurrentStatus(status);
        }
      },
    },
    {
      label: "Decline By Gig",
      onClick: ({
        professionalId,
        currentApplicantId,
      }: {
        professionalId?: number;
        currentApplicantId?: number;
      }) => {
        if (professionalId && currentApplicantId) {
          decline({
            value: "Declined by Gig",
            professionalId: professionalId,
            currentApplicantId: currentApplicantId,
          });
        }
      },
    },
    {
      label: "Decline By Client",
      onClick: ({
        professionalId,
        currentApplicantId,
      }: {
        professionalId?: number;
        currentApplicantId?: number;
      }) => {
        if (professionalId && currentApplicantId) {
          decline({
            value: "Declined by Facility",
            professionalId: professionalId,
            currentApplicantId: currentApplicantId,
          });
        }
      },
    },
    {
      label: "Decline By Professional",
      onClick: ({
        professionalId,
        currentApplicantId,
      }: {
        professionalId?: number;
        currentApplicantId?: number;
      }) => {
        if (professionalId && currentApplicantId) {
          decline({
            value: "Declined by Professional",
            professionalId: professionalId,
            currentApplicantId: currentApplicantId,
          });
        }
      },
    },
  ];

  const [submission, setSubmission] = useState<JobSubmission | null>(null);
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);

  const fetch = useCallback(
    async ({
      professionalId,
      currentApplicantId,
    }: {
      professionalId: number;
      currentApplicantId: number;
    }) => {
      if (!professionalId || !currentApplicantId) return;
      setLoading("loading");

      const [professional, jobSubmission] = await Promise.all([
        fetchApplicantProfessionalDetails({
          jobId: Number(params?.jId),
          professionalId: professionalId,
          facilityId: Number(params?.fId),
        }),
        fetchGetJobSubmission({
          facilityId: Number(params?.fId),
          jobId: Number(params?.jId),
          professionalId: professionalId,
          currentApplicantId: currentApplicantId,
        }),
      ]);

      setCurrentProfessional(professional.data.data[0]);
      setSubmission(jobSubmission.data.data[0]);
      setLoading("idle");
    },
    [params?.jId, params?.fId]
  );

  // const abortController = new AbortController();
  // const fetchData = useCallback(
  //   debounce(async () => {
  //     setLoading("loading");
  //     try {
  //       const res = await fetchSubmissions({
  //         facilityId: Number(params?.fId),
  //         jobId: Number(params?.jId),
  //         search: search.length > 0 ? search : undefined,
  //         abortController,
  //       });
  //       if (res.status === 200) {
  //         setData(res.data.data);
  //         setLoading("idle");
  //       }
  //     } catch (error) {
  //       if (abortController.signal.aborted) {
  //         setAbort(true);
  //         return;
  //       }
  //       console.error(error);
  //       setLoading("error");
  //     }
  //   }, 300),
  //   [params?.fId, params?.jId, search, abort]
  // );

  // useEffect(() => {
  //   if (activeTab === 1) {
  //     fetchData();
  //   }

  //   return () => abortController.abort();
  // }, [activeTab, fetchData, abort]);

  const controller = new AbortController();
  const fetchData = debounce(async () => {
    try {
      setLoading("loading");
      const res = await fetchSubmissions({
        facilityId: Number(params?.fId),
        jobId: Number(params?.jId),
        search: search.length > 0 ? search : undefined,
        abortController: controller,
      });
      if (res.status === 200) {
        setData(res.data.data);
      }
      setLoading("idle");
    } catch (error: any) {
      if (controller.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 300);

  useEffect(() => {
    if (activeTab === 1) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [activeTab, params?.fId, params?.jId, search, abort]);

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

  const decline = async ({
    value,
    professionalId,
    currentApplicantId,
  }: {
    value:
      | "Declined by Gig"
      | "Declined by Facility"
      | "Declined by Professional";
    professionalId: number;
    currentApplicantId: number;
  }) => {
    try {
      const res = await declineApplication({
        facilityId: Number(params?.fId),
        jobId: Number(params?.jId),
        professionalId: professionalId,
        currentApplicantId: currentApplicantId,
        value: value,
      });

      if (res.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
  };

  const Column: TableColumn<SubmissionTypes>[] = [
    {
      name: "Sr No",
      selector: (row: SubmissionTypes) => row.Id,
      minWidth: "50px",
    },

    {
      name: "Professional Name",
      minWidth: "260px",
      cell: (row: SubmissionTypes) => (
        <div
          className="table-username"
          onClick={() => {
            setCurrentApplicantId(row.Id);
            setProfessionalId(row.Professional.Id);
            setCurrentStatus(row.JobApplicationStatus.Status);
            toggleProfileModal();
          }}
        >
          <p style={{ marginRight: "5px" }} className="name-logo">
            {capitalize(row.Professional.FirstName[0])}
            {capitalize(row.Professional.LastName[0])}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span className="center-align text-align user-name">
              {capitalize(row.Professional.FirstName)}{" "}
              {capitalize(row.Professional.LastName)}
            </span>
            <span className="text-color email">{row.Professional.Email}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Phone",
      minWidth: "130px",
      selector: (row: SubmissionTypes): string =>
        row.Professional.Phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
    },
    {
      name: "Experience",
      minWidth: "130px",
      cell: (row: SubmissionTypes) => (
        <div className="center-align">
          {" "}
          {row.Professional.Experience
            ? `${row.Professional.Experience} Years`
            : "-"}
        </div>
      ),
    },
    {
      name: "Submitted On",
      minWidth: "130px",
      cell: (row: SubmissionTypes) => (
        <div className="center-align">
          {formatDateString(
            row.JobSubmission.CreatedOn ? row.JobSubmission.CreatedOn : "-"
          )}
        </div>
      ),
    },
    {
      name: "Application Status",
      minWidth: "160px",
      cell: (cell: SubmissionTypes) => (
        <>
          <div className="opening-assignment-select">
            <UncontrolledDropdown>
              <DropdownToggle
                caret
                style={{
                  color: getStatusColor(cell.JobApplicationStatus.Status),
                }}
              >
                {cell.JobApplicationStatus.Status
                  ? cell.JobApplicationStatus.Status
                  : "Submitted"}
              </DropdownToggle>
              <DropdownMenu>
                {menuItems.map((item, index) => (
                  <DropdownItem
                    key={index}
                    style={item.style}
                    onClick={() => {
                      item.onClick({
                        professionalId: cell.Professional.Id,
                        currentApplicantId: cell.Id,
                        status: cell.JobApplicationStatus.Status,
                      });
                    }}
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>

          {/* <div className="opening-assignment-select">
            <UncontrolledDropdown>
              <DropdownToggle
                caret>
                Submitted
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header color="red">
                  <div onClick={handleOption}>
                    Make Offer
                  </div>
                </DropdownItem>
                <DropdownItem header color="red">
                    Decline By Gig
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div> */}
        </>
      ),
    },
    {
      name: "",
      minWidth: "220px",
      cell: (cell: SubmissionTypes) => (
        <>
          <div className="d-flex align-items-center">
            <CustomActionDownloadBtn
              title={
                cell.JobSubmission.IsPdfGenerated === true
                  ? "Download PDF"
                  : cell.JobSubmission.IsPdfGenerationStarted === true
                  ? "PDF is being generated"
                  : "PDF not generated"
              }
              disabled={cell.JobSubmission.IsPdfGenerated === false}
              id={`pdf-${cell.Id}`}
              onDownload={() => {
                if (cell.JobSubmission.IsPdfGenerated === true) {
                  fetchJobSubmissionPdf({
                    currentApplicantId: cell.Id,
                    professionalId: cell.Professional.Id,
                  });
                } else {
                  return;
                }
              }}
            />
            <CustomEmailButton
              title="Send Email"
              disabled={cell.JobSubmission.IsPdfGenerated === false}
              onClick={() => {
                setCurrentProfessional(null);
                setSubmission(null);
                setCurrentApplicantId(cell.Id);
                setProfessionalId(cell.Professional.Id);
                {
                  fetch({
                    currentApplicantId: cell.Id,
                    professionalId: cell.Professional.Id,
                  });

                  setEmailModalOpen(true);
                }
              }}
            />

            <div className="right-buttons mt-0">
              <CustomButton
                id="view-profile"
                className="professional-button view"
                onClick={() => {
                  setCurrentApplicantId(cell.Id);
                  setProfessionalId(cell.Professional.Id);
                  setCurrentStatus(cell.JobApplicationStatus.Status);
                  toggleProfileModal();
                }}
              >
                View Profile
              </CustomButton>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {loading === "loading" ? (
        <Loader />
      ) : (
        <div className="mt-3">
          <div className="search-bar-wrapper w-100 mb-3">
            <CustomInput
              placeholder="Search Here"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <img src={Search} alt="search" />
          </div>
          <div className="datatable-wrapper">
            <DataTable columns={Column} data={data} />
          </div>
        </div>
      )}
      {isMakeOfferModalOpen &&
        professionalId &&
        currentApplicantId &&
        currentStatus && (
          <MakeOffer
            status={currentStatus}
            job={job}
            facilityId={Number(params?.fId)}
            jobId={Number(params?.jId)}
            professionalId={professionalId}
            jobApplicationId={currentApplicantId}
            isOpen={isMakeOfferModalOpen}
            toggle={() => setMakeOfferModalOpen(false)}
            fetchApplicants={fetchData}
          />
        )}
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

      {emailModalOpen &&
        currentApplicantId &&
        professionalId &&
        submission &&
        currentProfessional && (
          <ComposeEmailModal
            isOpen={emailModalOpen}
            toggle={() => setEmailModalOpen(false)}
            currentApplicantId={currentApplicantId}
            professionalId={professionalId}
            facilityId={Number(params?.fId)}
            submission={submission}
            currentProfessional={currentProfessional}
            job={job}
          />
        )}
    </>
  );
};

export default SubmissionsTab;
