import DataTable, { TableColumn } from "react-data-table-component";
import Search from "../../../../../assets/images/search.svg";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomInput from "../../../../../components/custom/CustomInput";
import { useCallback, useEffect, useState } from "react";
import DownloadIcon from "../../../../../components/icons/Download";

import FacilityOnboardingServices from "../../../../../services/FacilityOnboardingServices";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../../components/custom/CustomSpinner";
import { FacilityOnboardingType } from "../../../../../types/FacilityOnboardingTypes";
import FacilityOnboardingProfileModal from "./FacilityOnboardingProfileModal";
import FacilityOnboardingDocumentStatus from "./documentstatuspdf/FacilityOnboardingDocumentStatus";
import {
  capitalize,
  debounce,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../../helpers";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const FacilityOnboarding = () => {
  const navigate = useNavigate();

  const handleViewJob = ({
    facilityId,
    jobId,
  }: {
    facilityId: number;
    jobId: number;
  }): void => {
    navigate(`/view/facility/${facilityId}/job/${jobId}`);
  };
  const [isDocumentHovered, setIsDocumentHovered] = useState<boolean>(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const params = useParams<{ Id: string }>();
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [data, setData] = useState<FacilityOnboardingType[]>([]);
  const [currentProfessionalId, setCurrentProfessionalId] = useState<
    number | null
  >(null);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [currentApplicantId, setCurrentApplicantId] = useState<number | null>(
    null
  );
  const [currentAssignmentId, setCurrentAssignmentId] = useState<number | null>(
    null
  );
  const [currentRow, setCurrentRow] = useState<FacilityOnboardingType | null>(
    null
  );
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);

  const abortController = new AbortController();
  const fetchList = useCallback(
    debounce(async () => {
      setLoading("loading");
      try {
        const res = await FacilityOnboardingServices.getFacilityOnboarding({
          id: Number(params.Id),
          search: search.length > 0 ? search : undefined,
          abortController,
        });
        if (res.status === 200) {
          setLoading("idle");
          setData(res.data.data);
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          setAbort(true);
          return;
        }
        setLoading("error");
        console.error(error);
      }
    }, 300),
    [params.Id, search, abort]
  );
  const [dataDrp] = useState([
    {
      label: <>American Hospital Association <span className="span-brd">Parent</span></>,
      value: 1,
    },
    {
      label: <>American Hospital Association 2 <span className="span-brd">Parent</span></>,
      value: 2,
    },
    {
      label: <>American Hospital Association 3 <span className="span-brd">Parent</span></>,
      value: 3,
    },
  ]);
  const sendPdfRequest = debounce(async () => {
    setLoading("loading");
    try {
      const response =
        await FacilityOnboardingServices.getFacilityOnboardingPdf(
          Number(params.Id)
        );
      if (response.status === 200) {
        showToast(
          "success",
          response.data.message ||
          "Facility onboarding PDF request sent succesfully"
        );
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "An error occurred");
    }
  }, 1000);

  useEffect(() => {
    fetchList();

    return () => abortController.abort();
  }, [fetchList, abort]);

  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
  };

  const handleDocumentMouseEnter = () => {
    setIsDocumentHovered(true);
  };

  const handleDocumentMouseLeave = () => {
    setIsDocumentHovered(false);
  };


  const Column: TableColumn<FacilityOnboardingType>[] = [
    {
      name: "Job ID",
      cell: (row: FacilityOnboardingType) => (
        <div
          className="center-align roster-jobid"
          onClick={() => {
            handleViewJob({
              facilityId: Number(params.Id),
              jobId: row.JobId,
            });
          }}
        >
          JID-{row.JobId}
        </div>
      ),
      minWidth: "100px",

    },
    {
      name: "Client Req ID",
      cell: (row: FacilityOnboardingType) => (
        <span className="row-user-name">
          {row?.JobApplication.JobAssignments[0].ReqId
            ? row?.JobApplication.JobAssignments[0].ReqId.toUpperCase()
            : "-"}
        </span>
      ),
      minWidth: "120px",
    },
    {
      name: "Professional Name",
      minWidth: "250px",
      cell: (row: FacilityOnboardingType) => (
        <div
          className="table-username"
          onClick={() => {
            setCurrentProfessionalId(row?.JobApplication.Professional.Id);
            setCurrentApplicantId(row?.JobApplication.Id);
            setCurrentAssignmentId(row?.JobApplication.JobAssignments[0].Id);
            setCurrentJobId(row.JobId);
            setCurrentStatus(
              row?.JobApplication.JobAssignments[0].JobApplicationStatus.Status
            );
            setCurrentRow(row);
            setProfileModalOpen(true);
          }}
        >
          <p style={{ marginRight: "5px" }} className="name-logo">
            {capitalize(row?.JobApplication.Professional.FirstName[0])}
            {capitalize(row?.JobApplication.Professional.LastName[0])}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span className="center-align text-align">
              {capitalize(row?.JobApplication.Professional.FirstName)}{" "}
              {capitalize(row?.JobApplication.Professional.LastName)}
            </span>
            <span className="text-color">
              {row?.JobApplication.Professional.Email}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Start Date & End Date",
      minWidth: "200px",
      cell: (row: FacilityOnboardingType) => (
        <div className="center-align">
          {row?.JobApplication?.JobAssignments
            ? formatDateInDayMonthYear(
              row?.JobApplication.JobAssignments[0].StartDate
            ).replace(/-/g, "/")
            : "-"}
          -{" "}
          {row?.JobApplication?.JobAssignments
            ? formatDateInDayMonthYear(
              row?.JobApplication.JobAssignments[0].EndDate
            ).replace(/-/g, "/")
            : "-"}
        </div>
      ),
    },
    {
      name: "Profession",
      minWidth: "150px",
      cell: (row: FacilityOnboardingType) => (
        <div className="center-align">
          {row?.JobApplication.JobAssignments[0].JobProfession.Profession}
        </div>
      ),
    },
    {
      name: "Unit",
      minWidth: "100px",
      cell: (row: FacilityOnboardingType) => (
        <div className="center-align">
          {row?.JobApplication.JobAssignments[0].Unit}
        </div>
      ),
    },
    {
      name: "Compliance Due",
      minWidth: "150px",
      cell: (row: FacilityOnboardingType) => (
        <div className="center-align">
          {row?.JobApplication.JobAssignments[0].ComplianceDueDate}
        </div>
      ),
    },
    {
      name: "Document Status",
      minWidth: "180px",
      cell: (row: FacilityOnboardingType) => {
        return (
          <>
            <FacilityOnboardingDocumentStatus
              professionalId={row?.JobApplication.Professional.Id}
              jobId={row.JobId}
              jobApplicationId={row?.JobApplication.Id}
              facilityId={Number(params.Id)}
              row={row}
              documentStatusData={data}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      {loading === "loading" && <Loader />}
      <CustomMainCard>
        <h2 className="page-content-header">Onboarding Professionals</h2>
        <div className="d-flex justify-content-space-between align-items-center mb-3 gap-2">
          <div className="search-bar-wrapper flex-grow-1 me-0">
            <CustomInput
              placeholder="Search Here"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <img src={Search} alt="search" />
          </div>
          <div className="facility-header-cus-drp dt-facility-drp">
            <CustomSelect
              value={dataDrp[0]}
              id="select_profession"
              isSearchable={false}
              placeholder={"Select Profession"}
              onChange={() => { }}
              name=""
              noOptionsMessage={() => ""}
              options={dataDrp}
            ></CustomSelect>
          </div>
          <button
            className="note-right-button button-text-color document-btn"
            onMouseEnter={handleDocumentMouseEnter}
            onMouseLeave={handleDocumentMouseLeave}
            color={isDocumentHovered ? "#FFF" : ""}
            disabled={data.length === 0}
            onClick={sendPdfRequest}
          >
            <DownloadIcon color={isDocumentHovered ? "#fff" : "#7F47DD"} />{" "}
            Document Status
          </button>
        </div>
        {/* facility-datatable-wrapper onboarding-wrapper */}
        <div className="datatable-wrapper facility-onboarding-datatable">
          {data.length !== 0 && (
            <DataTable
              columns={Column}
              data={data}
            // pagination
            // selectableRows={false}
            />
          )}
        </div>

        <div className="onBoarding-cr-card">
          <div className="d-flex align-items-center flex-wrap" style={{ gap: '12px' }}>
            <div className="on-boarding-circle mb-2">
              DK
            </div>
            <div className="boarding-right-brd">
              <p className="mb-0 name-text">Dona Kopecky</p>
              <p className="mb-0 email-text">salvatorelcasey@rhyta.com</p>
            </div>

            <div className="boarding-right-brd">
              <p className="mb-0 key">Facility: <span className="value">American Hospital Association</span></p>
            </div>

            <div className="boarding-right-brd">
              <div className="d-flex" style={{ gap: '20px', marginBottom: '8px' }}>
                <p className="mb-0 key">Facility: <span className="grey-span-box">GREG001-01</span></p>
                <p className="mb-0 key">Client Req ID: <span className="grey-span-box">AHC68</span></p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap" style={{ gap: '8px 20px' }}>
            <p className="mb-0 key">Start Date & End Date: <span className="value">04/12/2023 - 04/12/2023</span></p>
            <p className="mb-0 key">Profession: <span className="value">CNA</span></p>
            <p className="mb-0 key">Unit: <span className="value">General</span></p>
            <p className="mb-0 key">Compliance Due: <span className="value">04/12/2024</span></p>
            <p className="mb-0 key">Document Status:<span className="status-badge green-bg">75%</span>9/12</p>
          </div>
        </div>

        <div className="onBoarding-cr-card">
          <div className="d-flex align-items-center flex-wrap" style={{ gap: '12px' }}>
            <div className="on-boarding-circle mb-2">
              DK
            </div>
            <div className="boarding-right-brd">
              <p className="mb-0 name-text">Dona Kopecky</p>
              <p className="mb-0 email-text">salvatorelcasey@rhyta.com</p>
            </div>

            <div className="boarding-right-brd">
              <p className="mb-0 key">Facility: <span className="value">American Hospital Association</span></p>
            </div>

            <div className="boarding-right-brd">
              <div className="d-flex" style={{ gap: '20px', marginBottom: '8px' }}>
                <p className="mb-0 key">Facility: <span className="grey-span-box">GREG001-01</span></p>
                <p className="mb-0 key">Client Req ID: <span className="grey-span-box">AHC68</span></p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap" style={{ gap: '8px 20px' }}>
            <p className="mb-0 key">Start Date & End Date: <span className="value">04/12/2023 - 04/12/2023</span></p>
            <p className="mb-0 key">Profession: <span className="value">CNA</span></p>
            <p className="mb-0 key">Unit: <span className="value">General</span></p>
            <p className="mb-0 key">Compliance Due: <span className="value">04/12/2024</span></p>
            <p className="mb-0 key">Document Status:<span className="status-badge yellow-bg">75%</span>9/12</p>
          </div>
        </div>

      </CustomMainCard>
      {isProfileModalOpen &&
        currentRow &&
        currentProfessionalId &&
        currentJobId &&
        currentApplicantId &&
        currentAssignmentId &&
        currentStatus && (
          <FacilityOnboardingProfileModal
            row={currentRow}
            professionalId={currentProfessionalId}
            jobId={currentJobId}
            status={currentStatus}
            isOpen={isProfileModalOpen}
            toggle={toggleProfileModal}
            currentApplicantId={currentApplicantId}
            currentAssignmentId={currentAssignmentId}
            fetchList={fetchList}
          />
        )}
    </>
  );
};
export default FacilityOnboarding;
