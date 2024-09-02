import { TableColumn } from "react-data-table-component";
import Search from "../../../../../assets/images/search.svg";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomInput from "../../../../../components/custom/CustomInput";
// import SearchIcon from "../../../../../components/icons/Search";
import { CSSProperties, Key, useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../../../assets/images/calendar.svg";
import AdditionIcon from "../../../../../assets/images/cr5-addition-btn-icon.png";
import ExtensionModal from "./ExtensionModal";
// import { ExpandedComponent } from "./ExpandedComponent";
import RosterServices from "../../../../../services/RosterServices";
import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import ArticleBtn from "../../../../../components/custom/ArticleBtn";
import { RosterType } from "../../../../../types/RosterTypes";
import {
  capitalize,
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../../helpers";
import RosterProfileModal from "./Profile/RosterProfileModal";
import RosterTerminate from "./RosterTerminate";
import AddRowIcon from "../../../../../components/icons/CollapseRowBtn";
import ExpandRowIcon from "../../../../../components/icons/ExpandRowBtn";
import Loader from "../../../../../components/custom/CustomSpinner";
import { getStatusColor } from "../../../../../constant/StatusColors";
import SearchIcon from "../../../../../components/icons/Search";
import RosterViewAssignment from "./RosterViewAssignment";
import ApproveExtensionModal from "./ApproveExtensionModal";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const Roster = () => {
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
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [terminateModal, setTerminateModal] = useState<boolean>(false);
  const [approveExtensionModal, setApproveExtensionModal] =
    useState<boolean>(false);
  const [extensionModal, setExtensionModal] = useState<boolean>(false);
  const [isDocumentHovered, setIsDocumentHovered] = useState<boolean>(false);
  const params = useParams<{ Id: string }>();
  const [data, setData] = useState<RosterType[]>([]);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [currentProfessionalId, setCurrentProfessionalId] = useState<
    number | null
  >(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<number | null>(
    null
  );
  const [currentApplicationId, setCurrentApplicationId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [assignmentOpen, setAssignmentOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<RosterType | null>(null);
  const [isDownloadHovered, setIsDownloadHovered] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleDownloadMouseEnter = () => setIsDownloadHovered(true);

  const handleDownloadMouseLeave = () => setIsDownloadHovered(false);

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

  const menuItems = [
    {
      label: "Terminate",
      style: { color: "red" },
      onClick: ({
        professionalId,
        jobApplicationId,
        jobId,
        jobAssignmentId,
      }: {
        professionalId?: number;
        jobApplicationId?: number;
        jobId?: number;
        jobAssignmentId?: number;
      }) => {
        if (jobApplicationId && professionalId && jobId && jobAssignmentId) {
          setCurrentProfessionalId(professionalId);
          setCurrentApplicationId(jobApplicationId);
          setCurrentJobId(jobId);
          setCurrentAssignmentId(jobAssignmentId);
          setTerminateModal(true);
        }
      },
    },
  ];

  type MenuItem = {
    [status: string]: {
      label: string;
      style?: CSSProperties;

      onClick: (params: {
        facilityId?: number;
        professionalId?: number;
        jobApplicationId?: number;
        jobId?: number;
        currentAssignmentId?: number;
        currentStatus?: string;
        currentRow?: RosterType;
      }) => void;
    }[];
  }[];

  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
  };

  const decline = async ({
    value,
    professionalId,
    jobApplicationId,
    jobId,
    jobAssignmentId,
  }: {
    value:
    | "Declined by Gig"
    | "Declined by Facility"
    | "Declined by Professional";
    professionalId: number;
    jobApplicationId: number;
    jobId: number;
    jobAssignmentId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await RosterServices.declineApplication({
        facilityId: Number(params.Id),
        jobId: jobId,
        professionalId: professionalId,
        currentApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
        value: value,
      });

      if (res.status === 200) {
        fetchRoster();
        setLoading("idle");
      }
    } catch (error: any) {
      console.error("error", error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const placement = async ({
    professionalId,
    jobApplicationId,
    jobId,
    jobAssignmentId,
  }: {
    professionalId: number;
    jobApplicationId: number;
    jobId: number;
    jobAssignmentId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await RosterServices.placement({
        facilityId: Number(params.Id),
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobId: jobId,
        jobAssignmentId: jobAssignmentId,
      });

      if (res.status === 200) {
        fetchRoster();
        setLoading("idle");
      }
    } catch (error: any) {
      console.error("error", error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const extensionPlacement = async ({
    facilityId,
    professionalId,
    jobApplicationId,
    jobId,
    jobAssignmentId,
  }: {
    facilityId: number;
    professionalId: number;
    jobApplicationId: number;
    jobId: number;
    jobAssignmentId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await RosterServices.extensionPlacement({
        facilityId: facilityId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobId: jobId,
        jobAssignmentId: jobAssignmentId,
      });

      if (res.status === 200) {
        fetchRoster();
        setLoading("idle");
      }
    } catch (error: any) {
      console.error("error", error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const secondMenuItems: MenuItem = [
    {
      "Extension Placement": [
        {
          label: "Terminate",
          style: { color: "red" },
          onClick: ({
            jobAssignmentId,
            professionalId,
            jobApplicationId,
            jobId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
            currentStatus?: string;
          }) => {
            if (
              jobAssignmentId &&
              professionalId &&
              jobApplicationId &&
              jobId
            ) {
              setCurrentJobId(jobId);
              setCurrentProfessionalId(professionalId);
              setCurrentApplicationId(jobApplicationId);
              setCurrentAssignmentId(jobAssignmentId);

              setTerminateModal(true);
            }
          },
        },
      ],
    },
    {
      "Pending Extension Placement": [
        {
          label: "Extension Placement",
          style: {
            color: "#5E9B2D",
          },
          onClick: ({
            facilityId,
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            facilityId?: number;
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              facilityId &&
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              extensionPlacement({
                facilityId: facilityId,
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Gig",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;

            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Gig",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Client",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Facility",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Professional",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Professional",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
      ],
    },
    {
      "Extension Requested": [
        {
          label: "Approve",
          style: { color: "#5E9B2D" },
          onClick: ({
            jobAssignmentId,
            currentStatus,
            currentRow,
          }: {
            jobAssignmentId?: number;
            currentStatus?: string;
            currentRow?: RosterType;
          }) => {
            if (jobAssignmentId && currentStatus && currentRow) {
              setCurrentAssignmentId(jobAssignmentId);
              setCurrentStatus(currentStatus);
              setCurrentRow(currentRow);
              setApproveExtensionModal(true);
            }
          },
        },
        {
          label: "Decline By Gig",
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Gig",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Client",
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Facility",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Professional",
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Professional",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
      ],
    },
    {
      "Extension Offered": [
        {
          label: "Extension Placement",
          style: { color: "#5E9B2D" },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              extensionPlacement({
                facilityId: Number(params.Id),
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Gig",
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Gig",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Client",
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Facility",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Professional",
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Professional",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
      ],
    },
    {
      "Pending Updated Extension Placement": [
        {
          label: "Extension Placement",
          style: { color: "#5E9B2D" },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              extensionPlacement({
                facilityId: Number(params.Id),
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Terminate",
          style: { color: "red" },
          onClick: ({
            jobAssignmentId,
            professionalId,
            jobApplicationId,
            jobId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
            currentStatus?: string;
          }) => {
            if (
              jobAssignmentId &&
              professionalId &&
              jobApplicationId &&
              jobId
            ) {
              setCurrentJobId(jobId);
              setCurrentProfessionalId(professionalId);
              setCurrentApplicationId(jobApplicationId);
              setCurrentAssignmentId(jobAssignmentId);

              setTerminateModal(true);
            }
          },
        },
      ],
    },
    {
      "Pending Declination": [
        {
          label: "Placement",
          style: { color: "#5E9B2D" },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              placement({
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Gig",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Gig",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Client",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Facility",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Professional",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Professional",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
      ],
    },
    {
      "Pending Extension Declination": [
        {
          label: "Extension Placement",
          style: {
            color: "#5E9B2D",
          },
          onClick: ({
            facilityId,
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            facilityId?: number;
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              facilityId &&
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              extensionPlacement({
                facilityId: facilityId,
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Gig",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Gig",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Client",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Facility",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
        {
          label: "Decline By Professional",
          style: {
            color: "#717B9E",
          },
          onClick: ({
            professionalId,
            jobApplicationId,
            jobId,
            jobAssignmentId,
          }: {
            professionalId?: number;
            jobApplicationId?: number;
            jobId?: number;
            jobAssignmentId?: number;
          }) => {
            if (
              professionalId &&
              jobApplicationId &&
              jobId &&
              jobAssignmentId
            ) {
              decline({
                value: "Declined by Professional",
                professionalId: professionalId,
                jobApplicationId: jobApplicationId,
                jobId: jobId,
                jobAssignmentId: jobAssignmentId,
              });
            }
          },
        },
      ],
    },
  ];

  const fetchRoster = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await RosterServices.getRoster({
        facilityId: Number(params.Id),
        search: search.length > 0 ? search : undefined,
        startDate: startDate ? formatDate(startDate.toString()) : undefined,
        endDate: endDate ? formatDate(endDate.toString()) : undefined,
        // abortController,
      });
      if (res.status === 200) {
        setData(res?.data.data);
        setLoading("idle");
        setExpanded(null);
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [endDate, params.Id, search, startDate]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const handleDocumentMouseEnter = () => {
    setIsDocumentHovered(true);
  };

  const handleDocumentMouseLeave = () => {
    setIsDocumentHovered(false);
  };

  const handleExpandClick = (row: RosterType) => {
    setExpanded((prev) => (prev === row.Id ? null : row.Id));
  };

  const Column: TableColumn<RosterType>[] = [
    {
      name: "",
      cell: (row: RosterType) => (
        <div className="d-flex">
          {row.UpcomingAssignments.length > 0 && (
            <div
              className="d-flex align-items-center"
              onClick={() => handleExpandClick(row)}
            >
              {expanded === row.Id ? <ExpandRowIcon /> : <AddRowIcon />}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Job ID",
      cell: (row: RosterType) => (
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
      // width: "8%",
    },
    {
      name: "Client Req ID",
      cell: (row: RosterType) => (
        <span>
          {row.JobApplication.JobAssignments[0].ReqId
            ? row.JobApplication.JobAssignments[0].ReqId?.toUpperCase()
            : "-"}
        </span>
      ),
      // width: "7%",
    },
    {
      name: "Professional Name",
      // width: "20%",
      cell: (row: RosterType) => (
        <div
          className="table-username justify-content-start"
          onClick={() => {
            setCurrentProfessionalId(row?.JobApplication.Professional.Id);
            setCurrentJobId(row.JobId);
            setCurrentStatus(
              row?.JobApplication.JobAssignments[0].JobApplicationStatus.Status
            );
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
      // width: "16%",
      cell: (row: RosterType) => (
        <div className="center-align">
          {row?.JobApplication?.JobAssignments
            ? formatDateInDayMonthYear(
              row?.JobApplication.JobAssignments[0].StartDate
            ).replace(/-/g, "/")
            : "-"}
          -
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
      // width: "6%",
      cell: (row: RosterType) => (
        <div className="center-align align-self-center">
          {row?.JobApplication.JobAssignments[0].JobProfession.Profession}
        </div>
      ),
    },
    {
      name: "Unit",
      // width: "8%",
      cell: (row: RosterType) => (
        <div className="center-align text-capitalize">
          {row?.JobApplication.JobAssignments[0].Unit}
        </div>
      ),
    },
    {
      name: "Application Status",
      // width: "17%",
      cell: (cell: RosterType) => {
        return (
          <div className="opening-assignment-select ms-2">
            <UncontrolledDropdown>
              <DropdownToggle
                caret
                style={{
                  color: getStatusColor(
                    cell.JobApplication.JobAssignments[0].JobApplicationStatus
                      .Status
                  ),
                }}
              >
                {cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status
                  ? cell.JobApplication.JobAssignments[0].JobApplicationStatus
                    .Status
                  : cell.UpcomingAssignments[0]?.JobApplicationStatus
                    ?.Status === "Placement"
                    ? "Placement"
                    : "Submitted"}
              </DropdownToggle>
              <DropdownMenu>
                {menuItems.map((item, index) => (
                  <DropdownItem
                    key={index}
                    style={item.style}
                    onClick={() => {
                      item.onClick({
                        professionalId: cell.JobApplication.Professional.Id,
                        jobApplicationId: cell.JobApplicationId,
                        jobId: cell.JobId,
                        jobAssignmentId:
                          cell.JobApplication.JobAssignments[0].Id,
                      });
                    }}
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        );
      },
    },
    {
      name: "",
      // width: "14%",
      cell: (cell: RosterType) => (
        <div className="d-flex center-align custom-article-btn justify-content-center">
          <div>
            <ArticleBtn
              onEye={() => {
                setCurrentAssignmentId(
                  cell.JobApplication.JobAssignments[0].Id
                );
                setCurrentApplicationId(cell.JobApplication.Id);
                setCurrentJobId(cell.JobId);
                setCurrentProfessionalId(cell.JobApplication.Professional.Id);
                setCurrentRow(cell);
                setCurrentRequestId(cell.ReqId ? cell.ReqId : null);
                setAssignmentOpen(true);
              }}
            />
          </div>
          <div className=" note-wrapper ms-1">
            <button
              className="note-right-button  document-btn roster-btn"
              onMouseEnter={handleDocumentMouseEnter}
              onMouseLeave={handleDocumentMouseLeave}
              color={isDocumentHovered ? "#FFF" : ""}
              onClick={() => {
                setExtensionModal(true);
                setCurrentJobId(cell.JobId);
                setCurrentProfessionalId(cell.JobApplication.Professional.Id);
                setCurrentApplicationId(cell.JobApplicationId);
                setCurrentAssignmentId(
                  cell.JobApplication.JobAssignments[0].Id
                );
                setCurrentStatus(
                  cell.JobApplication.JobAssignments[0].JobApplicationStatus
                    .Status
                );
              }}
            >
              Extension Request
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="facility-main-card-section">
        <CustomMainCard>
          <h2 className="page-content-header">Roster</h2>
          <div className="d-flex">
            <div className="search-bar-wrapper w-100 mb-3">
              <CustomInput
                placeholder="Search Here"
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
              />
              <img src={Search} alt="search" />
            </div>
            <div className="facility-header-cus-drp dt-facility-drp" style={{ marginLeft: '10px' }}>
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
            <div className="date-range-input search-date-margin roaster-datepicker">
              <ReactDatePicker
                dateFormat={"dd-MM-yyyy"}
                isClearable={true}
                placeholderText="--"
                onChange={(date) => {
                  setStartDate(date);
                }}
                selected={startDate}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      placeholder={
                        startDate
                          ? formatDateInDayMonthYear(startDate.toDateString())
                          : "Start Date"
                      }
                      value={null}
                    />
                    {!startDate && (
                      <img src={Calendar} className="calendar-icon" />
                    )}
                  </div>
                }
              />
              <ReactDatePicker
                dateFormat={"dd-MM-yyyy"}
                isClearable={true}
                onChange={(date) => {
                  setEndDate(date);
                }}
                placeholderText="----"
                minDate={
                  startDate
                    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                    : new Date()
                }
                selected={endDate}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      placeholder={
                        endDate
                          ? formatDateInDayMonthYear(endDate.toDateString())
                          : "End Date"
                      }
                      value={null}
                    />
                    {!endDate && (
                      <img src={Calendar} className="calendar-icon" />
                    )}
                  </div>
                }
              />
              <div
                onMouseEnter={handleDownloadMouseEnter}
                onMouseLeave={handleDownloadMouseLeave}
                className="header-search-icon"
              >
                <SearchIcon color={isDownloadHovered ? "#FFF" : "#717B9E"} />
              </div>
            </div>
          </div>
          {/* <div className="roaster-main-table w-100">
            {data.length === 0 ? (
              <div className="no-data-found text-center">
                There are no records to display.
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    {Column.map((column, index) => (
                      <th
                        key={index}
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <>
                      <tr key={rowIndex}>
                        {Column.map((column, colIndex) => (
                          <>
                            <td
                              key={colIndex}
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              {column.cell &&
                                column.cell(row, rowIndex, column, colIndex)}
                            </td>
                          </>
                        ))}
                      </tr>
                      {expanded === row.Id && (
                        <>
                          {row.UpcomingAssignments.map((assignment) => (
                            <tr>
                              <td></td>
                              <td></td>
                              <td>
                                {assignment.ReqId
                                  ? capitalize(assignment.ReqId)
                                  : "-"}
                              </td>
                              <td></td>
                              <td>
                                <div className="center-align">
                                  {assignment.StartDate
                                    ? formatDateInDayMonthYear(
                                      assignment.StartDate
                                    ).replace(/-/g, "/")
                                    : "-"}
                                  -
                                  {assignment.EndDate
                                    ? formatDateInDayMonthYear(
                                      assignment.EndDate
                                    ).replace(/-/g, "/")
                                    : "-"}
                                </div>
                              </td>
                              <td>
                                <div className="center-align align-self-center">
                                  {row?.JobApplication.JobAssignments[0]
                                    .JobProfession.Profession
                                    ? row?.JobApplication.JobAssignments[0]
                                      .JobProfession.Profession
                                    : "-"}
                                </div>
                              </td>
                              <td>
                                <div className="center-align align-self-center">
                                  {assignment.Unit
                                    ? assignment.Unit.toUpperCase()
                                    : "-"}
                                </div>
                              </td>
                              <td>
                                <div className="opening-assignment-select">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      caret
                                      style={{
                                        color: getStatusColor(
                                          assignment.JobApplicationStatus.Status
                                        ),
                                      }}
                                    >
                                      {assignment.JobApplicationStatus.Status
                                        ? assignment.JobApplicationStatus.Status
                                        : "Submitted"}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      {secondMenuItems
                                        .find(
                                          (item) =>
                                            item[
                                            assignment.JobApplicationStatus
                                              .Status
                                            ]
                                        )
                                        ?.[
                                        assignment.JobApplicationStatus.Status
                                      ]?.map(
                                        (
                                          item: {
                                            label: string;
                                            style?: CSSProperties;
                                            onClick: (params: {
                                              facilityId: number;
                                              professionalId: number;
                                              jobApplicationId: number;
                                              jobId: number;
                                              jobAssignmentId: number;
                                              currentStatus: string;
                                            }) => void;
                                          },
                                          index: Key | null | undefined
                                        ) => (
                                          <DropdownItem
                                            key={index}
                                            style={item.style}
                                            onClick={() => {
                                              item.onClick({
                                                facilityId: row.FacilityId,
                                                professionalId:
                                                  row.JobApplication
                                                    .Professional.Id,
                                                jobApplicationId:
                                                  row.JobApplicationId,
                                                jobId: row.JobId,
                                                jobAssignmentId:
                                                  assignment.Id,
                                                currentStatus:
                                                  assignment
                                                    .JobApplicationStatus
                                                    .Status,
                                              });
                                            }}
                                          >
                                            {item.label}
                                          </DropdownItem>
                                        )
                                      )}
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </div>
                              </td>
                              <td>
                                <div
                                  className="d-flex center-align custom-article-btn justify-content-center py-3"
                                  style={{ gap: "3px" }}
                                >
                                  <ArticleBtn
                                    onEye={() => {
                                      setCurrentAssignmentId(assignment.Id);
                                      setCurrentApplicationId(
                                        row.JobApplicationId
                                      );
                                      setCurrentJobId(row.JobId);
                                      setCurrentProfessionalId(
                                        row.JobApplication.Professional.Id
                                      );
                                      setCurrentRow(row);
                                      setCurrentStatus(
                                        assignment.JobApplicationStatus.Status
                                      );
                                      setCurrentRequestId(
                                        assignment.ReqId
                                          ? assignment.ReqId
                                          : null
                                      );
                                      setAssignmentOpen(true);
                                    }}
                                  />

                                  <div className=" note-wrapper">
                                    <button
                                      className={`note-right-button  document-btn roster-btn`}
                                      onMouseEnter={handleDocumentMouseEnter}
                                      onMouseLeave={handleDocumentMouseLeave}
                                      color={isDocumentHovered ? "#FFF" : ""}
                                      onClick={() => {
                                        setCurrentAssignmentId(assignment.Id);
                                        setCurrentStatus(
                                          assignment.JobApplicationStatus.Status
                                        );
                                        setApproveExtensionModal(true);
                                      }}
                                      style={{
                                        pointerEvents:
                                          assignment.JobApplicationStatus
                                            .Status === "Extension Requested" ||
                                            assignment.JobApplicationStatus
                                              .Status === "Extension Offered" ||
                                            assignment.JobApplicationStatus
                                              .Status === "Extension Placement" ||
                                            (new Date(assignment.StartDate) <=
                                              new Date() &&
                                              new Date(assignment.EndDate) >=
                                              new Date())
                                            ? "none"
                                            : "auto",
                                        opacity:
                                          assignment.JobApplicationStatus
                                            .Status === "Extension Requested" ||
                                            assignment.JobApplicationStatus
                                              .Status === "Extension Offered" ||
                                            assignment.JobApplicationStatus
                                              .Status === "Extension Placement" ||
                                            (new Date(assignment.StartDate) <=
                                              new Date() &&
                                              new Date(assignment.EndDate) >=
                                              new Date())
                                            ? 0.5
                                            : 1,
                                      }}
                                      disabled={
                                        assignment.JobApplicationStatus
                                          .Status === "Extension Requested" ||
                                          assignment.JobApplicationStatus
                                            .Status === "Extension Offered" ||
                                          assignment.JobApplicationStatus
                                            .Status === "Extension Placement" ||
                                          (new Date(assignment.StartDate) <=
                                            new Date() &&
                                            new Date(assignment.EndDate) >=
                                            new Date())
                                          ? false
                                          : true
                                      }
                                    >
                                      Extension Request
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </div> */}

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
              <div className="d-flex">
                <p className="mb-0 key">Document Status:</p>
                <div className="opening-assignment-select ms-2">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                    // style={{
                    //   color: getStatusColor(
                    //     cell.JobApplication.JobAssignments[0].JobApplicationStatus
                    //       .Status
                    //   ),
                    // }}
                    >
                      Placement
                    </DropdownToggle>
                    <DropdownMenu>
                      {menuItems.map((item, index) => (
                        <DropdownItem
                          key={index}
                          style={item.style}
                          onClick={() => {
                            item.onClick({
                              professionalId: cell.JobApplication.Professional.Id,
                              jobApplicationId: cell.JobApplicationId,
                              jobId: cell.JobId,
                              jobAssignmentId:
                                cell.JobApplication.JobAssignments[0].Id,
                            });
                          }}
                        >
                          {item.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <div className="d-flex me-2" style={{ gap: '10px' }}>
                <button
                  className="note-right-button  document-btn roster-btn"
                // onMouseEnter={handleDocumentMouseEnter}
                // onMouseLeave={handleDocumentMouseLeave}
                // color={isDocumentHovered ? "#FFF" : ""}
                // onClick={() => {
                //   setExtensionModal(true);
                //   setCurrentJobId(cell.JobId);
                //   setCurrentProfessionalId(cell.JobApplication.Professional.Id);
                //   setCurrentApplicationId(cell.JobApplicationId);
                //   setCurrentAssignmentId(
                //     cell.JobApplication.JobAssignments[0].Id
                //   );
                //   setCurrentStatus(
                //     cell.JobApplication.JobAssignments[0].JobApplicationStatus
                //       .Status
                //   );
                // }}
                >
                  Extension Request
                </button>
                <ArticleBtn onEye={function (data?: any): void {
                  throw new Error("Function not implemented.");
                }}                // onEye={() => {
                //   setCurrentAssignmentId(
                //     cell.JobApplication.JobAssignments[0].Id
                //   );
                //   setCurrentApplicationId(cell.JobApplication.Id);
                //   setCurrentJobId(cell.JobId);
                //   setCurrentProfessionalId(cell.JobApplication.Professional.Id);
                //   setCurrentRow(cell);
                //   setCurrentRequestId(cell.ReqId ? cell.ReqId : null);
                //   setAssignmentOpen(true);
                // }}
                />
              </div>
              <button
                className="transparent-cr-btn blue-cr-color-btn"
              // onMouseEnter={handleDocumentMouseEnter}
              // onMouseLeave={handleDocumentMouseLeave}
              // color={isDocumentHovered ? "#FFF" : ""}
              // onClick={() => {
              //   setExtensionModal(true);
              //   setCurrentJobId(cell.JobId);
              //   setCurrentProfessionalId(cell.JobApplication.Professional.Id);
              //   setCurrentApplicationId(cell.JobApplicationId);
              //   setCurrentAssignmentId(
              //     cell.JobApplication.JobAssignments[0].Id
              //   );
              //   setCurrentStatus(
              //     cell.JobApplication.JobAssignments[0].JobApplicationStatus
              //       .Status
              //   );
              // }}
              >
                <img src={AdditionIcon} alt="icon" />
                <span>Extension Request</span>
              </button>
            </div>
            <div className="hidden-cr-info">
              <div className="d-flex flex-wrap" style={{ gap: '8px 20px' }}>
                <p className="mb-0 key">Start Date & End Date: <span className="value">04/12/2023 - 04/12/2023</span></p>
                <p className="mb-0 key">Profession: <span className="value">CNA</span></p>
                <p className="mb-0 key">Unit: <span className="value">General</span></p>
                <p className="mb-0 key">Compliance Due: <span className="value">04/12/2024</span></p>
                <div className="d-flex">
                  <p className="mb-0 key">Document Status:</p>
                  <div className="opening-assignment-select ms-2">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                      // style={{
                      //   color: getStatusColor(
                      //     cell.JobApplication.JobAssignments[0].JobApplicationStatus
                      //       .Status
                      //   ),
                      // }}
                      >
                        Placement
                      </DropdownToggle>
                      <DropdownMenu>
                        {menuItems.map((item, index) => (
                          <DropdownItem
                            key={index}
                            style={item.style}
                            onClick={() => {
                              item.onClick({
                                professionalId: cell.JobApplication.Professional.Id,
                                jobApplicationId: cell.JobApplicationId,
                                jobId: cell.JobId,
                                jobAssignmentId:
                                  cell.JobApplication.JobAssignments[0].Id,
                              });
                            }}
                          >
                            {item.label}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
              </div>
              <div className="d-flex me-2 mt-1" style={{ gap: '10px' }}>
                <button
                  className="note-right-button  document-btn roster-btn cr-disabled-btn"
                // onMouseEnter={handleDocumentMouseEnter}
                // onMouseLeave={handleDocumentMouseLeave}
                // color={isDocumentHovered ? "#FFF" : ""}
                // onClick={() => {
                //   setExtensionModal(true);
                //   setCurrentJobId(cell.JobId);
                //   setCurrentProfessionalId(cell.JobApplication.Professional.Id);
                //   setCurrentApplicationId(cell.JobApplicationId);
                //   setCurrentAssignmentId(
                //     cell.JobApplication.JobAssignments[0].Id
                //   );
                //   setCurrentStatus(
                //     cell.JobApplication.JobAssignments[0].JobApplicationStatus
                //       .Status
                //   );
                // }}
                >
                  Extension Request
                </button>
                <ArticleBtn onEye={function (data?: any): void {
                  throw new Error("Function not implemented.");
                }}                // onEye={() => {
                //   setCurrentAssignmentId(
                //     cell.JobApplication.JobAssignments[0].Id
                //   );
                //   setCurrentApplicationId(cell.JobApplication.Id);
                //   setCurrentJobId(cell.JobId);
                //   setCurrentProfessionalId(cell.JobApplication.Professional.Id);
                //   setCurrentRow(cell);
                //   setCurrentRequestId(cell.ReqId ? cell.ReqId : null);
                //   setAssignmentOpen(true);
                // }}
                />
              </div>
            </div>
          </div>
        </CustomMainCard>
      </div>
      {terminateModal &&
        currentProfessionalId &&
        currentJobId &&
        currentApplicationId &&
        currentAssignmentId && (
          <RosterTerminate
            jobId={currentJobId}
            professionalId={currentProfessionalId}
            facilityId={Number(params.Id)}
            jobApplicationId={currentApplicationId}
            jobAssignmentId={currentAssignmentId}
            isOpen={terminateModal}
            toggle={() => setTerminateModal(false)}
            fetchRoster={fetchRoster}
          />
        )}
      {assignmentOpen &&
        currentRow &&
        currentApplicationId &&
        currentAssignmentId &&
        currentProfessionalId && (
          <RosterViewAssignment
            fetchRoster={fetchRoster}
            isOpen={assignmentOpen}
            toggle={() => {
              setAssignmentOpen(false);
              setCurrentApplicationId(null);
              setCurrentAssignmentId(null);
              setCurrentProfessionalId(null);
              setCurrentRequestId(null);
              setCurrentRow(null);
              setCurrentStatus(null);
            }}
            row={currentRow}
            jobApplicationId={currentApplicationId}
            professionalId={currentProfessionalId}
            jobAssignmentId={currentAssignmentId}
            reqId={currentRequestId}
          />
        )}

      {extensionModal &&
        currentProfessionalId &&
        currentJobId &&
        currentApplicationId &&
        currentAssignmentId &&
        currentStatus && (
          <ExtensionModal
            isOpen={extensionModal}
            facilityId={Number(params.Id)}
            professionalId={currentProfessionalId}
            jobId={currentJobId}
            jobApplicationId={currentApplicationId}
            jobAssignmentId={currentAssignmentId}
            currentStatus={currentStatus}
            toggle={() => setExtensionModal(false)}
            fetchRosterData={fetchRoster}
          />
        )}

      {isProfileModalOpen &&
        currentProfessionalId &&
        currentJobId &&
        currentStatus && (
          <RosterProfileModal
            isOpen={isProfileModalOpen}
            toggle={toggleProfileModal}
            currentJobId={currentJobId}
            currentProfessionalId={currentProfessionalId}
            currentStatus={currentStatus}
          />
        )}

      {approveExtensionModal &&
        currentAssignmentId &&
        currentStatus &&
        currentRow && (
          <ApproveExtensionModal
            row={currentRow}
            fetchRosterData={fetchRoster}
            isOpen={approveExtensionModal}
            toggle={() => {
              setApproveExtensionModal(false);
            }}
            facilityId={Number(params.Id)}
            professionalId={currentRow.JobApplication.Professional.Id}
            jobId={currentRow.JobId}
            jobApplicationId={currentRow.JobApplicationId}
            jobAssignmentId={currentAssignmentId}
            currentStatus={currentStatus}
            isReadOnly={false}
          />
        )}
    </>
  );
};
export default Roster;
