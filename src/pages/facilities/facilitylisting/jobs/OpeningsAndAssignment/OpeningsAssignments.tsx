import {
  capitalize,
  debounce,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../../helpers";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import DataTable, { TableColumn } from "react-data-table-component";
import Terminate from "../Terminate";
import CustomInput from "../../../../../components/custom/CustomInput";
import Search from "../../../../../assets/images/search.svg";
import { useCallback, useEffect, useState } from "react";
import ViewAssignment from "../ViewAssignment";
import ApplicationHistory from "../ApplicationHistory";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";

import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { SlotType } from "../../../../../types/ApplicantTypes";
import { fetchSlots } from "../../../../../services/SubmissionServices";
import { useParams } from "react-router-dom";
import Loader from "../../../../../components/custom/CustomSpinner";
import JobApplicationHistoryModal from "../Submissions/JobApplicationHistoryModal";
import EditRequestId from "./EditRequestId";
import OpeningDocumentStatusModal from "./OpeningDocumentStatusModal";
import UpdateOpeningModal from "./UpdateOpeningModal";
import {
  declineAssignment,
  openingsExtensionPlacement,
  Openingsplacement,
} from "../../../../../services/OpeningServices";
import ApprovalModal from "../ApprovalModal";
import { getStatusColor } from "../../../../../constant/StatusColors";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import FinalizeOffer from "../FinalizeOffer";

const OpeningsAssignments = () => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [data, setData] = useState<SlotType[]>([]);
  const [search, setSearch] = useState("");
  const [isTerminateModalOpen, setTerminateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateOpeningModalOpen, setUpdateOpeningModalOpen] = useState(false);
  const [isViewHistoryModal, setIsViewHistoryModal] = useState(false);
  const [isViewFinalizeModal, setIsFinalizeModal] = useState(false);
  const params = useParams();
  const facilityId = params.fId;
  const jobId = params.jId;
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [currentJobApplicationId, setCurrentJobApplicationId] = useState<
    number | null
  >(null);
  const [currentJobAssignmentId, setCurrentJobAssignmentId] = useState<
    number | null
  >(null);
  const [currentSlot, setCurrentSlot] = useState<SlotType | null>(null);
  const [approveExtensionModal, setApproveExtensionModal] = useState(false);
  const [abort, setAbort] = useState<boolean>(false);

  const abortController = new AbortController();
  const fetch = useCallback(
    debounce(async () => {
      if (!facilityId || !jobId) return;
      try {
        setLoading("loading");
        const res = await fetchSlots({
          facilityId: Number(facilityId),
          jobId: Number(jobId),
          search: search.length > 0 ? search : undefined,
          abortController,
        });
        if (res.status === 200) {
          setData(res.data.data);
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
    }, 300),
    [facilityId, jobId, search, abort]
  );

  useEffect(() => {
    fetch();
    return () => abortController.abort();
  }, [fetch, abort]);

  const decline = async ({
    value,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: {
    value:
      | "Declined by Gig"
      | "Declined by Facility"
      | "Declined by Professional";
    professionalId: number;
    jobApplicationId: number;
    jobAssignmentId: number;
  }) => {
    try {
      const res = await declineAssignment({
        facilityId: Number(params?.fId),
        jobId: Number(params?.jId),
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
        value: value,
      });

      if (res.status === 200) {
        fetch();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const placement = async ({
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: {
    professionalId: number;
    jobApplicationId: number;
    jobAssignmentId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await Openingsplacement({
        facilityId: Number(facilityId),
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobId: Number(jobId),
        jobAssignmentId: jobAssignmentId,
      });

      if (res.status === 200) {
        fetch();
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
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: {
    professionalId: number;
    jobApplicationId: number;
    jobAssignmentId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await openingsExtensionPlacement({
        facilityId: Number(facilityId),
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobId: Number(jobId),
        jobAssignmentId: jobAssignmentId,
      });

      if (res.status === 200) {
        fetch();
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
        professionalId,
        currentApplicantId,
        jobAssignmentId,
        slot,
      }: {
        professionalId?: number;
        currentApplicantId?: number;
        jobAssignmentId?: number;
        slot?: SlotType;
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
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (
            professionalId === undefined ||
            currentApplicantId === undefined ||
            slot === undefined
          )
            return;
          setProfessionalId(professionalId);
          setCurrentJobApplicationId(currentApplicantId);
          setCurrentSlot(slot);
          setIsFinalizeModal(true);
        },
      },
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({
          professionalId,
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Gig",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Facility",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Professional",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: jobAssignmentId,
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
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (
            professionalId === undefined ||
            currentApplicantId === undefined ||
            slot === undefined
          )
            return;
          setProfessionalId(professionalId);
          setCurrentJobApplicationId(currentApplicantId);
          setCurrentSlot(slot);
          setIsFinalizeModal(true);
        },
      },
      {
        label: "Terminate",
        style: {
          color: "red",
        },
        onClick: ({
          professionalId,
          currentApplicantId,
          jobAssignmentId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
          slot?: SlotType;
        }) => {
          if (
            professionalId === undefined ||
            currentApplicantId === undefined ||
            jobAssignmentId === undefined ||
            slot === undefined
          )
            return;
          setProfessionalId(professionalId);
          setCurrentJobApplicationId(currentApplicantId);
          setCurrentJobAssignmentId(jobAssignmentId);
          setCurrentSlot(slot);
          setTerminateModalOpen(true);
        },
      },
    ],
    "Pending Updated Extension Placement": [
      {
        label: "Extension Placement",
        style: { color: "#5E9B2D" },
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            extensionPlacement({
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot?.JobAssignment.Id,
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
          professionalId,
          currentApplicantId,
          jobAssignmentId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
          slot?: SlotType;
        }) => {
          if (
            professionalId === undefined ||
            currentApplicantId === undefined ||
            jobAssignmentId === undefined ||
            slot === undefined
          )
            return;
          setProfessionalId(professionalId);
          setCurrentJobApplicationId(currentApplicantId);
          setCurrentJobAssignmentId(jobAssignmentId);
          setCurrentSlot(slot);
          setTerminateModalOpen(true);
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
          professionalId,
          currentApplicantId,
          jobAssignmentId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
          slot?: SlotType;
        }) => {
          if (
            professionalId === undefined ||
            currentApplicantId === undefined ||
            jobAssignmentId === undefined ||
            slot === undefined
          )
            return;
          setProfessionalId(professionalId);
          setCurrentJobApplicationId(currentApplicantId);
          setCurrentJobAssignmentId(jobAssignmentId);
          setCurrentSlot(slot);
          setTerminateModalOpen(true);
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
          professionalId,
          currentApplicantId,
          jobAssignmentId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
          slot?: SlotType;
        }) => {
          if (
            professionalId === undefined ||
            currentApplicantId === undefined ||
            jobAssignmentId === undefined ||
            slot === undefined
          )
            return;
          setProfessionalId(professionalId);
          setCurrentJobApplicationId(currentApplicantId);
          setCurrentJobAssignmentId(jobAssignmentId);
          setCurrentSlot(slot);
          setTerminateModalOpen(true);
        },
      },
    ],
    "Extension Requested": [
      {
        label: "Approve",
        style: { color: "#5E9B2D" },
        onClick: ({
          jobAssignmentId,
          slot,
        }: {
          jobAssignmentId?: number;
          slot?: SlotType;
        }) => {
          if (jobAssignmentId && slot) {
            setCurrentJobAssignmentId(jobAssignmentId);
            setCurrentSlot(slot);
            setApproveExtensionModal(true);
          }
        },
      },
      {
        label: "Decline By Gig",
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            decline({
              value: "Declined by Gig",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot.JobAssignment.Id,
            });
          }
        },
      },
      {
        label: "Decline By Client",
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            decline({
              value: "Declined by Facility",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot.JobAssignment.Id,
            });
          }
        },
      },
      {
        label: "Decline By Professional",
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            decline({
              value: "Declined by Professional",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot.JobAssignment.Id,
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
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            extensionPlacement({
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot?.JobAssignment.Id,
            });
          }
        },
      },
      {
        label: "Decline By Gig",
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            decline({
              value: "Declined by Gig",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot.JobAssignment.Id,
            });
          }
        },
      },
      {
        label: "Decline By Client",
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            decline({
              value: "Declined by Facility",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot.JobAssignment.Id,
            });
          }
        },
      },
      {
        label: "Decline By Professional",
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            decline({
              value: "Declined by Professional",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot.JobAssignment.Id,
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
          professionalId,
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            placement({
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Gig",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Facility",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Professional",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: jobAssignmentId,
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
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (
            professionalId === undefined ||
            currentApplicantId === undefined ||
            slot === undefined
          )
            return;
          setProfessionalId(professionalId);
          setCurrentJobApplicationId(currentApplicantId);
          setCurrentSlot(slot);
          setIsFinalizeModal(true);
        },
      },
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({
          professionalId,
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Gig",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Facility",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Professional",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: jobAssignmentId,
            });
          }
        },
      },
    ],
    "Pending Extension Declination": [
      {
        label: "Extension Placement",
        style: { color: "#5E9B2D" },
        onClick: ({
          professionalId,
          currentApplicantId,
          slot,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          slot?: SlotType;
        }) => {
          if (professionalId && currentApplicantId && slot) {
            extensionPlacement({
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: slot?.JobAssignment.Id,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Gig",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Facility",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Professional",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: jobAssignmentId,
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
          professionalId,
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            placement({
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Gig",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Facility",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
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
          currentApplicantId,
          jobAssignmentId,
        }: {
          professionalId?: number;
          currentApplicantId?: number;
          jobAssignmentId?: number;
        }) => {
          if (professionalId && currentApplicantId && jobAssignmentId) {
            decline({
              value: "Declined by Professional",
              professionalId: professionalId,
              jobApplicationId: currentApplicantId,
              jobAssignmentId: jobAssignmentId,
            });
          }
        },
      },
    ],
  };

  const Column: TableColumn<SlotType>[] = [
    {
      name: "Job ID",
      selector: (row: SlotType) => `JID-${row.Job.Id}-${row.SlotNumber}`,
      width: "8%",
    },
    {
      name: "Req ID",
      cell: (row: SlotType) => (
        <>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${row.Id}`}>
                {row.JobAssignment && row.JobAssignment.ReqId
                  ? row.JobAssignment.ReqId.toUpperCase()
                  : row.ReqId
                  ? row.ReqId.toUpperCase()
                  : "-"}
              </Tooltip>
            }
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                width: "100%",
              }}
            >
              {row.JobAssignment && row.JobAssignment.ReqId
                ? row.JobAssignment.ReqId.toUpperCase()
                : row.ReqId
                ? row.ReqId.toUpperCase()
                : "-"}
            </span>
          </OverlayTrigger>
        </>
      ),
      minWidth: "90px",
    },
    {
      name: "Professional Name",
      minWidth: "260px",
      cell: (row: SlotType) => (
        <>
          {row.JobApplication !== null ? (
            <div className="table-username">
              <div className="d-flex align-content-center justify-content-center">
                <p style={{ marginRight: "5px" }} className="name-logo">
                  {capitalize(
                    row.JobApplication?.Professional.FirstName
                      ? row.JobApplication?.Professional.FirstName[0]
                      : ""
                  )}
                  {capitalize(
                    row.JobApplication?.Professional.LastName
                      ? row.JobApplication?.Professional.LastName[0]
                      : ""
                  )}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p className="center-align text-align d-block mb-0">
                    {capitalize(
                      row.JobApplication?.Professional.FirstName
                        ? row.JobApplication?.Professional.FirstName
                        : ""
                    )}{" "}
                    {capitalize(
                      row.JobApplication?.Professional.LastName
                        ? row.JobApplication?.Professional.LastName
                        : ""
                    )}
                  </p>
                  <span className="text-color">
                    {row.JobApplication?.Professional.Email}
                  </span>
                </div>
              </div>
              {/* <div>
            <span className="center-align text-align">Opening is Vacant</span>
          </div> */}
            </div>
          ) : (
            <div className="text-nowrap"></div>
          )}
        </>
      ),
    },
    {
      name: "Job Specialty",
      minWidth: "130px",
      cell: (row: SlotType) => (
        <div>
          {row.JobApplication !== null ? (
            <div
              className="center-align"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "pre-wrap",
                display: "block",
                width: "100%",
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`speciality-${row.Id}`}>
                    {row.JobAssignment ? row.JobAssignment.Speciality : "-"}
                  </Tooltip>
                }
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    display: "block",
                    width: "100%",
                  }}
                >
                  {row.JobAssignment ? row.JobAssignment.Speciality : "-"}
                </span>
              </OverlayTrigger>
            </div>
          ) : (
            <div className="text-nowrap">
              Opening is{" "}
              {row.JobSlotStatus.Status === "Active"
                ? "Vacant"
                : row.JobSlotStatus.Status}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Compliance Due",
      minWidth: "150px",
      cell: (row: SlotType) => (
        <div className="center-align">
          {row.JobApplication !== null ? (
            <span className="text-nowrap">
              {row?.JobAssignment.ComplianceDueDate
                ? formatDateInDayMonthYear(row?.JobAssignment.ComplianceDueDate)
                : "--"}
            </span>
          ) : (
            ""
          )}
        </div>
      ),
    },
    {
      name: "Document Status",
      minWidth: "130px",
      cell: (row: SlotType) => {
        return (
          <>
            {row.JobApplication !== null ? (
              <OpeningDocumentStatusModal row={row} />
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      name: "Application Status",
      minWidth: "160px",
      cell: (row: SlotType) => (
        <>
          {row.JobApplication !== null ? (
            <div className="opening-assignment-select select-opening">
              <UncontrolledDropdown direction="down">
                {secondMenuItems[row?.JobAssignment.AssignmentStatus] ? (
                  <>
                    <DropdownToggle
                      caret
                      style={{
                        color: getStatusColor(
                          row?.JobAssignment.AssignmentStatus
                        ),
                      }}
                    >
                      {row?.JobAssignment.AssignmentStatus
                        ? row?.JobAssignment.AssignmentStatus
                        : "--"}
                    </DropdownToggle>
                    <DropdownMenu dir="down">
                      {secondMenuItems[
                        row?.JobAssignment.AssignmentStatus
                      ]?.map((item, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => {
                            item.onClick({
                              professionalId:
                                row.JobApplication?.Professional.Id,
                              currentApplicantId: row.JobApplication?.Id,
                              jobAssignmentId: row?.JobAssignment.Id,
                              slot: row,
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
                      textAlign: "left",
                      color: getStatusColor(
                        row?.JobAssignment.AssignmentStatus
                      ),
                    }}
                  >
                    {row?.JobAssignment.AssignmentStatus}
                  </span>
                )}
              </UncontrolledDropdown>
            </div>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      name: "",
      minWidth: "150px",
      cell: (row: SlotType) => (
        <>
          {row.JobApplication !== null ? (
            <>
              {/* <div className="d-flex flex-wrap" style={{gap:'2px'}}> */}

              <CustomEditBtn
                onEdit={() => {
                  console.log(row);
                }}
                disabled={row.JobApplication !== null}
              />
              <Button
                type="button"
                className="text-nowrap history-btn"
                onClick={() => {
                  if (row.JobApplication === null) return;
                  setProfessionalId(row.JobApplication?.Professional.Id);
                  setCurrentJobApplicationId(row.JobApplication?.Id);
                  setCurrentJobAssignmentId(row.JobAssignment.Id);
                  setCurrentSlot(row);
                  setIsViewModalOpen(true);
                }}
              >
                <span className="material-symbols-outlined">article</span>
              </Button>

              <JobApplicationHistoryModal
                professionalId={row.JobApplication.Professional.Id}
                jobId={row.Job.Id}
                jobApplicationId={row.JobApplication.Id}
                facilityId={Number(facilityId)}
                slotId={row.Id}
              />

              {/* </div> */}
            </>
          ) : (
            <div
              className="d-flex flex-wrap"
              style={{
                marginLeft: "2rem",
                alignItems: "center",
                minWidth: "100%",
              }}
            >
              {/* <Button
                type="button"
                className="text-nowrap history-btn"
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
             
                onClick={() => {
                  setCurrentSlot(row);
                  setIsEditModalOpen(true);
                }}
                id={`history-${row.Id}`}
              >
             <EditIcon color={isEditHovered ? "#FFF" : "#717B9E"} /> 
              </Button> */}

              <CustomEditBtn
                onEdit={() => {
                  setCurrentSlot(row);
                  setIsEditModalOpen(true);
                }}
                id={`history-${row.Id}`}
              />

              <Button
                type="button"
                className="text-nowrap history-btn"
                onClick={() => {
                  setCurrentSlot(row);
                  setUpdateOpeningModalOpen(true);
                }}
                id={`history-${row.Id}`}
              >
                <span className="material-symbols-outlined">history</span>
              </Button>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="facility-main-card-section">
        <CustomMainCard>
          <div className="facility-listing-loader">
            <h2 className="page-content-header">
              Openings & Assignments
              {data && data.length > 0 && (
                <span>
                  ({data.filter((item) => item.JobApplication !== null).length}/
                  {data.length})
                </span>
              )}
            </h2>
          </div>
          <div className="search-bar-wrapper w-100 mb-3">
            <CustomInput
              placeholder="Search Here"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <img src={Search} alt="search" />
          </div>
          <div className="datatable-wrapper opening-assignments">
            <DataTable
              highlightOnHover
              responsive
              columns={Column}
              data={data}
              conditionalRowStyles={[
                {
                  when: (row: SlotType) =>
                    row.JobSlotStatus.Status !== "Active",
                  style: {
                    backgroundColor: "rgba(247, 248, 243, 1)",
                    border: "1px solid rgba(225, 186, 170, 1)",
                  },
                },
              ]}
            />
          </div>
          {/* <div className="datatable-wrapper">
            <AssignmentList />
          </div> */}
        </CustomMainCard>
      </div>

      {isViewFinalizeModal &&
        professionalId &&
        currentJobApplicationId &&
        currentSlot && (
          <FinalizeOffer
            facilityId={Number(facilityId)}
            jobId={Number(jobId)}
            status={
              currentSlot?.JobAssignment?.AssignmentStatus
                ? currentSlot?.JobAssignment?.AssignmentStatus
                : ""
            }
            jobApplicationId={currentJobApplicationId}
            jobAssignmentId={currentSlot.JobAssignment.Id}
            professionalId={professionalId}
            isOpen={isViewFinalizeModal}
            slot={currentSlot}
            toggle={() => setIsFinalizeModal(false)}
            fetchJobAssignments={fetch}
          />
        )}
      {isTerminateModalOpen &&
        professionalId &&
        currentJobApplicationId &&
        currentJobAssignmentId &&
        currentSlot && (
          <Terminate
            professionalId={professionalId}
            jobApplicationId={currentJobApplicationId}
            jobAssignmentId={currentJobAssignmentId}
            facilityId={Number(facilityId)}
            jobId={Number(jobId)}
            isOpen={isTerminateModalOpen}
            toggle={() => setTerminateModalOpen(false)}
            fetchJobAssignments={fetch}
          />
        )}
      {isEditModalOpen && currentSlot && (
        <EditRequestId
          facilityId={Number(facilityId)}
          jobId={Number(jobId)}
          slotId={currentSlot?.Id}
          isOpen={isEditModalOpen}
          toggle={() => setIsEditModalOpen(false)}
          fetchJobAssignments={fetch}
        />
      )}
      {updateOpeningModalOpen && currentSlot && (
        <UpdateOpeningModal
          currentSlot={currentSlot}
          facilityId={Number(facilityId)}
          jobId={Number(jobId)}
          isOpen={updateOpeningModalOpen}
          toggle={() => setUpdateOpeningModalOpen(false)}
          fetchJobAssignments={fetch}
        />
      )}
      {isViewModalOpen &&
        professionalId &&
        currentJobApplicationId &&
        currentSlot && (
          <ViewAssignment
            jobApplicationId={currentJobApplicationId}
            professionalId={professionalId}
            slot={currentSlot}
            isOpen={isViewModalOpen}
            toggle={() => setIsViewModalOpen(false)}
            fetchJobAssignments={fetch}
          />
        )}
      {isViewHistoryModal && (
        <ApplicationHistory
          isOpen={isViewHistoryModal}
          toggle={() => setIsViewHistoryModal(false)}
        />
      )}
      {approveExtensionModal && currentSlot?.JobApplication && currentSlot && (
        <ApprovalModal
          facilityId={Number(facilityId)}
          jobId={Number(jobId)}
          jobApplicationId={currentSlot.JobApplication?.Id}
          jobAssignmentId={currentSlot.JobAssignment.Id}
          professionalId={currentSlot.JobApplication?.Professional.Id}
          row={currentSlot}
          isOpen={approveExtensionModal}
          toggle={() => setApproveExtensionModal(false)}
          fetchRosterData={fetch}
          isReadOnly={false}
        />
      )}
    </>
  );
};

export default OpeningsAssignments;
