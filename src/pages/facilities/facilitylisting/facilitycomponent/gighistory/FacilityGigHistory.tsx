import { TableColumn } from "react-data-table-component";
import Search from "../../../../../assets/images/search.svg";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomInput from "../../../../../components/custom/CustomInput";
// import SearchIcon from "../../../../../components/icons/Search";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../../../assets/images/calendar.svg";
import FacilityGigHistoryExtensionModal from "./FacilityGigHistoryExtensionModal";
import { useNavigate, useParams } from "react-router-dom";
import AdditionIcon from "../../../../../assets/images/cr5-addition-btn-icon.png";

import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import ArticleBtn from "../../../../../components/custom/ArticleBtn";
import {
  capitalize,
  debounce,
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../../helpers";
import FacilityGigHistoryProfileModal from "./Profile/FacilityGigHistoryProfileModal";
import FacilityGigHistoryTerminate from "./FacilityGigHistoryTerminate";
import AddRowIcon from "../../../../../components/icons/CollapseRowBtn";
import ExpandRowIcon from "../../../../../components/icons/ExpandRowBtn";
import Loader from "../../../../../components/custom/CustomSpinner";
import { getStatusColor } from "../../../../../constant/StatusColors";
import FacilityGigHistoryServices from "../../../../../services/FacilityGigHistoryServices";
import {
  FacilityGigHistoryJobAssignment,
  FacilityGigHistoryType,
} from "../../../../../types/FacilityGigHistoryType";
import FacilityGigHistoryApproveExtension from "./FacilityGigHistoryApproveExtension";
import FacilityGigHistoryFinalizeOffer from "./FacilityGigHistoryFinalizeOffer";
import CustomPagination from "../../../../../components/custom/CustomPagination";
import GigProfileModal from "./Profile/GigProfileModal";
import CustomActionDownloadBtn from "../../../../../components/custom/CustomDownloadBtn";
import FacilityGigHistoryViewAssignment from "./FacilityGigHistoryViewAssignment";
import SearchIcon from "../../../../../components/icons/Search";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const FacilityGigHistory = () => {
  const navigate = useNavigate();
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
  const handleViewJob = ({
    facilityId,
    jobId,
  }: {
    facilityId: number;
    jobId: number;
  }): void => {
    navigate(`/view/facility/${facilityId}/job/${jobId}`);
  };
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isHeadingInfoModalOpen, setHeadingInfoModalOpen] = useState(false);
  const [terminateModal, setTerminateModal] = useState<boolean>(false);
  const [extensionModal, setExtensionModal] = useState<boolean>(false);
  const [isDocumentHovered, setIsDocumentHovered] = useState<boolean>(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState<boolean>(false);
  const params = useParams<{ Id: string }>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [data, setData] = useState<FacilityGigHistoryType[]>([]);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [search, setSearch] = useState("");
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [assignmentOpen, setAssignmentOpen] = useState<boolean>(false);
  const [currentSlot, setCurrentSlot] = useState<FacilityGigHistoryType | null>(
    null
  );
  const [abort, setAbort] = useState<boolean>(false);

  const [currentJobAssignmentRow, setCurrentJobAssignmentRow] =
    useState<FacilityGigHistoryJobAssignment | null>(null);
  const [isViewFinalizeModal, setIsFinalizeModal] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [approveExtensionModal, setApproveExtensionModal] =
    useState<boolean>(false);

  const abortController = new AbortController();
  const fetchRoster = useCallback(
    debounce(async () => {
      setLoading("loading");
      try {
        const res = await FacilityGigHistoryServices.getFacilityGigHistory({
          facilityId: Number(params.Id),
          size: size,
          page: page,
          search: search.length > 0 ? search : undefined,
          startDate: startDate ? formatDate(startDate.toString()) : undefined,
          endDate: endDate ? formatDate(endDate.toString()) : undefined,
          abortController,
        });
        if (res.status === 200) {
          setTotalRows(res.data.data[0]?.count);
          setTotalPages(Math.ceil(res.data.data[0]?.count / size));
          setData(res?.data.data[0].rows);
          setLoading("idle");
          setExpanded(null);
        }
      } catch (error: any) {
        if (abortController.signal.aborted) {
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
    }, 300),
    [endDate, page, params.Id, search, size, startDate, abort]
  );

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(1);
  };

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    if (search) {
      setCurrentPageSearch(selectedPage);
    } else {
      setPage(selectedPage);
    }
  };

  useEffect(() => {
    fetchRoster();

    return () => abortController.abort();
  }, [fetchRoster, page, abort]);

  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
  };

  const toggleHeadingInfoModal = () => {
    setHeadingInfoModalOpen(!isHeadingInfoModalOpen);
  };

  const handleDocumentMouseEnter = () => {
    setIsDocumentHovered(true);
  };

  const handleDocumentMouseLeave = () => {
    setIsDocumentHovered(false);
  };

  const handleExpandClick = (row: FacilityGigHistoryType) => {
    setExpanded((prev) => (prev === row.Id ? null : row.Id));
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
      const res = await FacilityGigHistoryServices.declineAssignment({
        facilityId: Number(params.Id),
        jobId: jobId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
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
  const declineApplication = async ({
    value,
    professionalId,
    jobApplicationId,
    jobId,
  }: {
    value:
    | "Declined by Gig"
    | "Declined by Facility"
    | "Declined by Professional";
    professionalId: number;
    jobApplicationId: number;
    jobId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await FacilityGigHistoryServices.declineApplication({
        facilityId: Number(params.Id),
        jobId: jobId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
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
      const res = await FacilityGigHistoryServices.extensionPlacement({
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

  const secondMenuItems: {
    [key: string]: {
      label: string;
      style?: {
        color: string;
      };
      onClick: ({
        slot,
        jobAssignmentRow,
      }: {
        slot?: FacilityGigHistoryType;
        jobAssignmentRow?: FacilityGigHistoryJobAssignment;
      }) => void;
    }[];
  } = {
    Offered: [
      {
        label: "Placement",
        style: {
          color: "#5E9B2D",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setIsFinalizeModal(true);
          }
        },
      },
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
            });
          }
        },
      },
    ],

    Placement: [
      {
        label: "Terminate",
        style: {
          color: "red",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setTerminateModal(true);
          }
        },
      },
    ],

    Submitted: [
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({ slot }: { slot?: FacilityGigHistoryType }) => {
          if (slot) {
            declineApplication({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
            });
          }
        },
      },
      {
        label: "Decline By Client",
        style: {
          color: "#717B9E",
        },
        onClick: ({ slot }: { slot?: FacilityGigHistoryType }) => {
          if (slot) {
            declineApplication({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
            });
          }
        },
      },
      {
        label: "Decline By Professional",
        style: {
          color: "#717B9E",
        },
        onClick: ({ slot }: { slot?: FacilityGigHistoryType }) => {
          if (slot) {
            declineApplication({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
            });
          }
        },
      },
    ],

    "Extension Placement": [
      {
        label: "Terminate",
        style: {
          color: "red",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setTerminateModal(true);
          }
        },
      },
    ],

    "Extension Requested": [
      {
        label: "Approve",
        style: { color: "#5E9B2D" },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setApproveExtensionModal(true);
          }
        },
      },
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
            });
          }
        },
      },
    ],

    "Extension Offered": [
      {
        label: "Extension Placement",
        style: { color: "#5E9B2D" },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            extensionPlacement({
              facilityId: Number(params.Id),
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobAssignmentId: jobAssignmentRow.Id,
              jobId: slot.JobId,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
            });
          }
        },
      },
    ],

    Applied: [
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({ slot }: { slot?: FacilityGigHistoryType }) => {
          if (slot) {
            declineApplication({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
            });
          }
        },
      },
      {
        label: "Decline By Client",
        style: {
          color: "#717B9E",
        },
        onClick: ({ slot }: { slot?: FacilityGigHistoryType }) => {
          if (slot) {
            declineApplication({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
            });
          }
        },
      },
      {
        label: "Decline By Professional",
        style: {
          color: "#717B9E",
        },
        onClick: ({ slot }: { slot?: FacilityGigHistoryType }) => {
          if (slot) {
            declineApplication({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
            });
          }
        },
      },
    ],

    "Pending Placement": [
      {
        label: "Placement",
        style: {
          color: "#5E9B2D",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setIsFinalizeModal(true);
          }
        },
      },
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
            });
          }
        },
      },
    ],

    "Pending Extension Placement": [
      {
        label: "Extension Placement",
        style: {
          color: "#5E9B2D",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            extensionPlacement({
              facilityId: Number(params.Id),
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobAssignmentId: jobAssignmentRow.Id,
              jobId: slot.JobId,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
            });
          }
        },
      },
    ],

    "Pending Declination": [
      {
        label: "Placement",
        style: {
          color: "#5E9B2D",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setIsFinalizeModal(true);
          }
        },
      },
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
            });
          }
        },
      },
    ],

    "Pending Extension Declination": [
      {
        label: "Extension Placement",
        style: {
          color: "#5E9B2D",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            extensionPlacement({
              facilityId: Number(params.Id),
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobAssignmentId: jobAssignmentRow.Id,
              jobId: slot.JobId,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Gig",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Facility",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
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
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            decline({
              value: "Declined by Professional",
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobId: slot.JobId,
              jobAssignmentId: jobAssignmentRow.Id,
            });
          }
        },
      },
    ],

    "Pending Updated Placement": [
      {
        label: "Placement",
        style: {
          color: "#5E9B2D",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setIsFinalizeModal(true);
          }
        },
      },
      {
        label: "Terminate",
        style: {
          color: "red",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setTerminateModal(true);
          }
        },
      },
    ],

    "Pending Updated Extension Placement": [
      {
        label: "Extension Placement",
        style: { color: "#5E9B2D" },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            extensionPlacement({
              facilityId: Number(params.Id),
              professionalId: slot.Professional.Id,
              jobApplicationId: slot.Id,
              jobAssignmentId: jobAssignmentRow.Id,
              jobId: slot.JobId,
            });
          }
        },
      },
      {
        label: "Terminate",
        style: {
          color: "red",
        },
        onClick: ({
          slot,
          jobAssignmentRow,
        }: {
          slot?: FacilityGigHistoryType;
          jobAssignmentRow?: FacilityGigHistoryJobAssignment;
        }) => {
          if (slot && jobAssignmentRow) {
            setCurrentSlot(slot);
            setCurrentJobAssignmentRow(jobAssignmentRow);
            setTerminateModal(true);
          }
        },
      },
    ],
  };

  const fetchJobSubmissionPdf = useCallback(
    async ({
      professionalId,
      currentApplicantId,
      jobId,
    }: {
      professionalId: number;
      currentApplicantId: number;
      jobId: number;
    }) => {
      setLoading("loading");
      try {
        if (professionalId && currentApplicantId) {
          const response = await FacilityGigHistoryServices.fetchSubmissionPdf({
            facilityId: Number(params?.Id),
            jobId: jobId,
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
    [params?.Id]
  );

  const handleDownloadMouseEnter = () => setIsDownloadHovered(true);

  const handleDownloadMouseLeave = () => setIsDownloadHovered(false);

  const Column: TableColumn<FacilityGigHistoryType>[] = [
    {
      name: "",
      cell: (row: FacilityGigHistoryType) => (
        <div className="d-flex">
          {row.JobAssignments.length > 0 && (
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
      cell: (row: FacilityGigHistoryType) => (
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
      cell: () => <span>-</span>,
      // width: "7%",
    },
    {
      name: "Professional Name",
      // width: "20%",
      cell: (row: FacilityGigHistoryType) => (
        <div
          className="table-username justify-content-start"
          onClick={() => {
            if (row.JobApplicationStatus.Status === "Applied") {
              setCurrentSlot(row);
              toggleHeadingInfoModal();
            } else {
              setCurrentSlot(row);
              setCurrentJobAssignmentRow(row?.JobAssignments[0]);
              setProfileModalOpen(true);
            }
          }}
        >
          <p style={{ marginRight: "5px" }} className="name-logo">
            {capitalize(row?.Professional.FirstName[0])}
            {capitalize(row?.Professional.LastName[0])}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span className="center-align text-align">
              {capitalize(row?.Professional.FirstName)}{" "}
              {capitalize(row?.Professional.LastName)}
            </span>
            <span className="text-color">{row?.Professional.Email}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Start Date & End Date",
      // width: "16%",
      cell: (row: FacilityGigHistoryType) => (
        <>
          {row.JobAssignments.length !== 0 ? (
            <div>
              {row.JobSubmission && row.JobSubmission.AvailableStartDate
                ? formatDateInDayMonthYear(
                  row.JobSubmission.AvailableStartDate
                ).replace(/-/g, "/")
                : row.AvailableStartDate
                  ? formatDateInDayMonthYear(row.AvailableStartDate).replace(
                    /-/g,
                    "/"
                  )
                  : "-"}
            </div>
          ) : (
            <div className="center-align">
              {row.JobSubmission && row.JobSubmission.AvailableStartDate
                ? formatDateInDayMonthYear(
                  row.JobSubmission.AvailableStartDate
                ).replace(/-/g, "/")
                : row.AvailableStartDate
                  ? formatDateInDayMonthYear(row.AvailableStartDate).replace(
                    /-/g,
                    "/"
                  )
                  : "-"}
            </div>
          )}
        </>
      ),
    },
    {
      name: "Profession",
      // width: "6%",
      cell: (row: FacilityGigHistoryType) => (
        <>
          {row.JobAssignments.length !== 0 ? (
            <div className="center-align align-self-center">
              {row.Job.JobProfession ? row.Job.JobProfession.Profession : "-"}
            </div>
          ) : (
            <div className="center-align align-self-center">
              {row.Job.JobProfession ? row.Job.JobProfession.Profession : "-"}
            </div>
          )}
        </>
      ),
    },
    {
      name: "Unit",
      // width: "8%",
      cell: (row: FacilityGigHistoryType) => (
        <div className="center-align">
          {row.JobAssignments.length !== 0 ? (
            <div className="center-align align-self-center">
              {row.JobSubmission && row?.JobSubmission.Unit
                ? row?.JobSubmission.Unit.toUpperCase()
                : row.Job && row.Job.DeptUnit
                  ? row.Job.DeptUnit.toUpperCase()
                  : "-"}
            </div>
          ) : (
            <div className="center-align align-self-center">
              {row.JobSubmission && row?.JobSubmission.Unit
                ? row?.JobSubmission.Unit.toUpperCase()
                : row.Job && row.Job.DeptUnit
                  ? row.Job.DeptUnit.toUpperCase()
                  : "-"}
            </div>
          )}
        </div>
      ),
    },

    {
      name: "Application Status",
      // width: "17%",
      cell: (cell: FacilityGigHistoryType) => (
        <div className="opening-assignment-select">
          {cell.JobApplicationStatus.Status === "Declined by Professional" ||
            cell.JobApplicationStatus.Status === "Declined by Facility" ||
            cell.JobApplicationStatus.Status === "Declined by Gig" ||
            cell.JobApplicationStatus.Status === "Facility Termination" ||
            cell.JobApplicationStatus.Status === "Professional Termination" ||
            cell.JobApplicationStatus.Status === "Gig Termination" ||
            cell.JobAssignments.length !== 0 ? (
            <>
              {cell.JobAssignments.length > 0 ? (
                "-"
              ) : (
                <span
                  style={{
                    fontWeight: "600",
                    color: getStatusColor(cell.JobApplicationStatus.Status),
                  }}
                >
                  {cell.JobApplicationStatus.Status}
                </span>
              )}
            </>
          ) : (
            <UncontrolledDropdown>
              {secondMenuItems[cell.JobApplicationStatus.Status] ? (
                <>
                  <DropdownToggle
                    caret
                    style={{
                      color: getStatusColor(cell.JobApplicationStatus.Status),
                    }}
                  >
                    {cell.JobApplicationStatus.Status}
                  </DropdownToggle>
                  <DropdownMenu>
                    {secondMenuItems[cell.JobApplicationStatus.Status]?.map(
                      (item, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => {
                            item.onClick({
                              slot: cell,
                            });
                          }}
                          style={item.style}
                        >
                          {item.label}
                        </DropdownItem>
                      )
                    )}
                  </DropdownMenu>
                </>
              ) : (
                <span
                  style={{
                    fontWeight: "600",
                    color: getStatusColor(cell.JobApplicationStatus.Status),
                  }}
                >
                  {cell.JobApplicationStatus.Status}
                </span>
              )}
            </UncontrolledDropdown>
          )}
        </div>
      ),
    },
    {
      name: "",
      // width: "14%",
      cell: (row: FacilityGigHistoryType) => (
        <div className="d-flex center-align custom-article-btn justify-content-center">
          <div className="d-flex justify-content-center">
            {row.JobAssignments.length !== 0 ||
              row.JobApplicationStatus.Status === "Submitted" ? (
              <CustomActionDownloadBtn
                title={"Download PDF"}
                id={`pdf-${row.Id}`}
                onDownload={() => {
                  fetchJobSubmissionPdf({
                    professionalId: row.Professional.Id,
                    currentApplicantId: row.Id,
                    jobId: row.JobId,
                  });
                }}
              />
            ) : (
              <div
                style={{
                  marginRight: "40px",
                }}
              />
            )}
          </div>
          <div className=" note-wrapper ms-1">
            <button
              className="note-right-button  document-btn roster-btn"
              onMouseEnter={handleDocumentMouseEnter}
              onMouseLeave={handleDocumentMouseLeave}
              color={isDocumentHovered ? "#FFF" : ""}
              onClick={() => {
                if (row.JobApplicationStatus.Status === "Applied") {
                  setCurrentSlot(row);
                  toggleHeadingInfoModal();
                } else {
                  setCurrentSlot(row);
                  setCurrentJobAssignmentRow(row?.JobAssignments[0]);
                  setProfileModalOpen(true);
                }
              }}
            >
              View Profile
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading === "loading" && <Loader />}
      <CustomMainCard
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <div>
          <h2 className="page-content-header">Gig History</h2>
          <div className="d-flex">
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
        </div>
        <div>
          {/* {data.length === 0 ? (
            <div className="no-data-found text-center">
              There are no records to display.
            </div>
          ) : (
            <div className="roaster-main-table w-100">
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
                          {row.JobAssignments.map((assignment) => (
                            <tr>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              ></td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              ></td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              >
                                {assignment.ReqId ? (
                                  <span>{assignment.ReqId.toUpperCase()}</span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              ></td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              >
                                {assignment.StartDate
                                  ? formatDateInDayMonthYear(
                                      assignment.StartDate
                                    ).replace(/-/g, "/")
                                  : "-"}
                                -
                                {assignment
                                  ? formatDateInDayMonthYear(
                                      assignment.EndDate
                                    ).replace(/-/g, "/")
                                  : "-"}
                              </td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              >
                                {assignment.JobProfession?.Profession
                                  ? assignment.JobProfession?.Profession
                                  : "-"}
                              </td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              >
                                {assignment.Unit
                                  ? assignment.Unit.toUpperCase()
                                  : "-"}
                              </td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              >
                                <div className="opening-assignment-select">
                                  {assignment.JobApplicationStatus.Status ===
                                    "Declined by Professional" ||
                                  assignment.JobApplicationStatus.Status ===
                                    "Declined by Facility" ||
                                  assignment.JobApplicationStatus.Status ===
                                    "Declined by Gig" ||
                                  assignment.JobApplicationStatus.Status ===
                                    "Facility Termination" ||
                                  assignment.JobApplicationStatus.Status ===
                                    "Professional Termination" ||
                                  assignment.JobApplicationStatus.Status ===
                                    "Gig Termination" ? (
                                    <span
                                      style={{
                                        fontWeight: "600",
                                        color: getStatusColor(
                                          assignment.JobApplicationStatus.Status
                                        ),
                                      }}
                                    >
                                      {assignment.JobApplicationStatus.Status}
                                    </span>
                                  ) : (
                                    <UncontrolledDropdown>
                                      {secondMenuItems[
                                        assignment.JobApplicationStatus.Status
                                      ] ? (
                                        <>
                                          <DropdownToggle
                                            caret
                                            style={{
                                              color: getStatusColor(
                                                assignment.JobApplicationStatus
                                                  .Status
                                              ),
                                            }}
                                          >
                                            {
                                              assignment.JobApplicationStatus
                                                .Status
                                            }
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            {secondMenuItems[
                                              assignment.JobApplicationStatus
                                                .Status
                                            ]?.map((item, index) => (
                                              <DropdownItem
                                                key={index}
                                                onClick={() => {
                                                  item.onClick({
                                                    slot: row,
                                                    jobAssignmentRow:
                                                      assignment,
                                                  });
                                                }}
                                                style={item.style}
                                              >
                                                {item.label}
                                              </DropdownItem>
                                            ))}
                                          </DropdownMenu>
                                        </>
                                      ) : (
                                        <span
                                          style={{
                                            fontWeight: "600",
                                            color: getStatusColor(
                                              assignment.JobApplicationStatus
                                                .Status
                                            ),
                                          }}
                                        >
                                          {
                                            assignment.JobApplicationStatus
                                              .Status
                                          }
                                        </span>
                                      )}
                                    </UncontrolledDropdown>
                                  )}
                                </div>
                              </td>
                              <td
                                style={{
                                  padding: "25px 10px",
                                }}
                              >
                                <div className="d-flex center-align custom-article-btn justify-content-center">
                                  <div>
                                    <ArticleBtn
                                      onEye={() => {
                                        setCurrentSlot(row);
                                        setCurrentJobAssignmentRow(assignment);
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
                                        setCurrentSlot(row);
                                        setCurrentJobAssignmentRow(assignment);
                                        setProfileModalOpen(true);
                                      }}
                                    >
                                      View Profile
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
            </div>
          )} */}
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
              <p className="mb-0 key">Application Status: <span className="status-text red-text">Declined By Professional</span></p>
            </div>
            <div className="d-flex me-2 mt-2" style={{ gap: '10px' }}>
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
              <p className="mb-0 key">Application Status: <span className="status-text yellow-text">Submitted</span></p>
            </div>
            <div className="d-flex me-2 mt-2" style={{ gap: '10px' }}>
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
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <CustomPagination
            currentPage={search ? currentPageSearch : page}
            totalPages={totalPages}
            onPageChange={handlePageSizeChange}
            onPageSizeChange={setSize}
            entriesPerPage={size}
            totalRows={totalRows}
            setPage={setPage}
          />
        </div>
      </CustomMainCard>

      {terminateModal && currentSlot && currentJobAssignmentRow && (
        <FacilityGigHistoryTerminate
          jobId={currentSlot.JobId}
          professionalId={currentSlot.Professional.Id}
          facilityId={Number(params.Id)}
          jobApplicationId={currentSlot.Id}
          jobAssignmentId={currentJobAssignmentRow.Id}
          isOpen={terminateModal}
          toggle={() => setTerminateModal(false)}
          fetchRoster={fetchRoster}
        />
      )}
      {assignmentOpen && currentSlot && currentJobAssignmentRow && (
        <FacilityGigHistoryViewAssignment
          row={currentSlot}
          fetchRosterData={fetchRoster}
          isOpen={assignmentOpen}
          toggle={() => {
            setAssignmentOpen(false);
          }}
          currentAssignmentRow={currentJobAssignmentRow}
          facilityId={Number(params.Id)}
          professionalId={currentSlot.Professional.Id}
          jobId={currentSlot.JobId}
          jobApplicationId={currentSlot.Id}
          jobAssignmentId={currentJobAssignmentRow.Id}
          currentStatus={currentJobAssignmentRow.JobApplicationStatus.Status}
        />
      )}

      {extensionModal && currentSlot && currentJobAssignmentRow && (
        <FacilityGigHistoryExtensionModal
          isOpen={extensionModal}
          facilityId={Number(params.Id)}
          professionalId={currentSlot.Professional.Id}
          jobId={currentSlot.JobId}
          jobApplicationId={currentSlot.Id}
          jobAssignmentId={currentJobAssignmentRow.Id}
          currentStatus={currentSlot.JobApplicationStatus.Status}
          toggle={() => setExtensionModal(false)}
          fetchRosterData={fetchRoster}
        />
      )}

      {approveExtensionModal && currentSlot && currentJobAssignmentRow && (
        <FacilityGigHistoryApproveExtension
          row={currentSlot}
          fetchRosterData={fetchRoster}
          isOpen={approveExtensionModal}
          toggle={() => {
            setApproveExtensionModal(false);
          }}
          facilityId={Number(params.Id)}
          professionalId={currentSlot.Professional.Id}
          jobId={currentSlot.JobId}
          jobApplicationId={currentSlot.Id}
          jobAssignmentId={currentJobAssignmentRow.Id}
          currentStatus={currentJobAssignmentRow.JobApplicationStatus.Status}
          isReadOnly={false}
        />
      )}

      {isProfileModalOpen && currentSlot && (
        <FacilityGigHistoryProfileModal
          isOpen={isProfileModalOpen}
          toggle={toggleProfileModal}
          professionalId={currentSlot.Professional.Id}
          jobId={currentSlot.JobId}
          jobApplicationId={currentSlot.Id}
          fetchList={fetchRoster}
        />
      )}

      {isHeadingInfoModalOpen && currentSlot && (
        <GigProfileModal
          isOpen={isHeadingInfoModalOpen}
          toggle={toggleHeadingInfoModal}
          currentProfessionalId={currentSlot?.Professional.Id}
          currentJobId={currentSlot?.JobId}
          currentStatus={currentSlot?.JobApplicationStatus.Status}
        />
      )}

      {isViewFinalizeModal && currentSlot && currentJobAssignmentRow && (
        <FacilityGigHistoryFinalizeOffer
          facilityId={Number(params.Id)}
          jobId={currentSlot.JobId}
          jobApplicationId={currentSlot.Id}
          jobAssignmentId={currentJobAssignmentRow.Id}
          professionalId={currentSlot.Professional.Id}
          isOpen={isViewFinalizeModal}
          slot={currentJobAssignmentRow}
          toggle={() => setIsFinalizeModal(false)}
          fetchJobAssignments={fetchRoster}
        />
      )}
    </>
  );
};
export default FacilityGigHistory;
