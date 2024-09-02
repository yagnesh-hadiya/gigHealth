import { useEffect, useRef, useState } from "react";
import Building from "../../../assets/images/building.svg";
import Locations from "../../../assets/images/location.svg";
import CustomButton from "../../../components/custom/CustomBtn";
import CustomMainCard from "../../../components/custom/CustomCard";
import CustomInput from "../../../components/custom/CustomInput";
import {
  capitalize,
  facilityjobCustomStyles,
  formatDateInDayMonthYear,
  showToast,
} from "../../../helpers";
import DataTable, { TableColumn } from "react-data-table-component";
import ArticleBtn from "../../../components/custom/ArticleBtn";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import OnboardingLayout from "./OnboardingLayout";
import CustomSelect from "../../../components/custom/CustomSelect";
import OnboardingTerminate from "./ProfessionalOnboardingTerminate";
import { ProfessionalOnboardingType } from "../../../types/ProfessionalOnboardingTypes";
import { useNavigate, useParams } from "react-router-dom";
import ProfessionalAssignmentDetailsModal from "./ProfessionalAssignmentDetailsModal";
import OpeningDocumentStatusModal from "./OnboardingDocument/ProfessionalDocumentStatusModal";
import ProfessionalOnboardingHistoryModal from "./OnboardingDocument/ProfessionalOnboardingHistoryModal";
import ACL from "../../../components/custom/ACL";
import {
  getJobStatuses,
  updateJobStatus,
} from "../../../services/JobsServices";
import Loader from "../../../components/custom/CustomSpinner";
import { getStatusColor } from "../../../constant/StatusColors";
import ProfessionalOnboardingServices from "../../../services/ProfessionalOnboardingServices";
import { removeActiveMenu } from "../../../helpers/tokens";

type ProfessionalOnboardingCardProps = {
  onboarding: ProfessionalOnboardingType;
  fetchOnboarding: () => void;
};

const ProfessionalOnboardingCard = ({
  onboarding,
  fetchOnboarding,
}: ProfessionalOnboardingCardProps) => {
  const params = useParams<{ Id: string }>();
  const navigate = useNavigate();
  const onboardingRef = useRef<{
    facilityId: number | null;
    jobId: number | null;
    professionalId: number | null;
    jobApplicationId: number | null;
    jobAssignmentId: number | null;
  }>({
    facilityId: null,
    jobId: null,
    professionalId: null,
    jobApplicationId: null,
    jobAssignmentId: null,
  });

  const handleViewJob = ({
    facilityId,
    jobId,
  }: {
    facilityId: number;
    jobId: number;
  }): void => {
    navigate(`/view/facility/${facilityId}/job/${jobId}`);
  };

  const [isTerminateModalOpen, setTerminateModalOpen] =
    useState<boolean>(false);
  const [jobStatus, setJobStatus] = useState<{ Id: number; Status: string }[]>(
    []
  );

  const [selectedJobStatus, setSelectedJobStatus] = useState<{
    Id: number;
    Status: string;
  } | null>({
    Id: onboarding.Job?.JobStatus.Id,
    Status: onboarding.Job?.JobStatus.Status,
  });

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const handleJobStatus = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      setSelectedJobStatus(null);
      return;
    }

    if (selectedOption) {
      setSelectedJobStatus({
        Id: selectedOption?.value,
        Status: selectedOption?.label,
      });

      setLoading("loading");
      try {
        const res = await updateJobStatus(
          onboarding.Facility.Id,
          onboarding.Job.Id,
          selectedOption?.value
        );
        if (res.status === 200) {
          setLoading("idle");
          showToast(
            "success",
            res?.data?.message || "JobStatus Updated Successfully"
          );
        }
      } catch (error: any) {
        setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
  const data: ProfessionalOnboardingType[] = [onboarding];

  useEffect(() => {
    getJobStatuses()
      .then((res) => {
        setJobStatus(res.data?.data);
      })
      .catch((error) => {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      });
  }, []);

  const placement = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: {
    facilityId: number;
    jobId: number;
    professionalId: number;
    jobApplicationId: number;
    jobAssignmentId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await ProfessionalOnboardingServices.placement({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
      });

      if (res.status === 200) {
        fetchOnboarding();
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

  const decline = async ({
    value,
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: {
    value:
      | "Declined by Gig"
      | "Declined by Facility"
      | "Declined by Professional";
    facilityId: number;
    jobId: number;
    professionalId: number;
    jobApplicationId: number;
    jobAssignmentId: number;
  }) => {
    try {
      const res = await ProfessionalOnboardingServices.terminateOnboarding({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
        value: value,
      });
      if (res.status === 200) {
        fetchOnboarding();
      }
    } catch (error: any) {
      console.error("error", error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const extensionPlacement = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: {
    facilityId: number;
    jobId: number;
    professionalId: number;
    jobApplicationId: number;
    jobAssignmentId: number;
  }) => {
    try {
      const res =
        await ProfessionalOnboardingServices.onboardingExtensionPlacement({
          facilityId: facilityId,
          jobId: jobId,
          professionalId: professionalId,
          jobApplicationId: jobApplicationId,
          jobAssignmentId: jobAssignmentId,
        });
      if (res.status === 200) {
        fetchOnboarding();
      }
    } catch (error: any) {
      console.error("error", error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const approve = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: {
    facilityId: number;
    jobId: number;
    professionalId: number;
    jobApplicationId: number;
    jobAssignmentId: number;
  }) => {
    try {
      const res =
        await ProfessionalOnboardingServices.onboardingExtensionRequest({
          facilityId: facilityId,
          jobId: jobId,
          professionalId: professionalId,
          jobApplicationId: jobApplicationId,
          jobAssignmentId: jobAssignmentId,
        });
      if (res.status === 200) {
        fetchOnboarding();
      }
    } catch (error: any) {
      console.error("error", error);
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
        facilityId,
        jobId,
        professionalId,
        jobApplicationId,
        jobAssignmentId,
      }: {
        facilityId?: number;
        jobId?: number;
        professionalId?: number;
        jobApplicationId?: number;
        jobAssignmentId?: number;
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            placement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
            });
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
        onClick: ({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
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
        onClick: ({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
            });
          }
        },
      },
    ],

    "Extension Requested": [
      {
        label: "Approve",
        style: { color: "#5E9B2D" },
        onClick: ({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          )
            approve({
              facilityId,
              jobId,
              professionalId,
              jobApplicationId,
              jobAssignmentId,
            });
        },
      },
      {
        label: "Decline By Gig",
        style: {
          color: "#717B9E",
        },
        onClick: ({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            placement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            extensionPlacement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
            });
          }
        },
      },
    ],

    "Extension Offered": [
      {
        label: "Extension Placement",
        style: {
          color: "#5E9B2D",
        },
        onClick: ({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            extensionPlacement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            placement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            extensionPlacement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Gig",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Facility",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            decline({
              value: "Declined by Professional",
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            placement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId === undefined ||
            jobId === undefined ||
            professionalId === undefined ||
            jobApplicationId === undefined ||
            jobAssignmentId === undefined
          )
            return;
          onboardingRef.current.facilityId = facilityId;
          onboardingRef.current.jobId = jobId;
          onboardingRef.current.professionalId = professionalId;
          onboardingRef.current.jobApplicationId = jobApplicationId;
          onboardingRef.current.jobAssignmentId = jobAssignmentId;
          setTerminateModalOpen(true);
        },
      },
    ],

    "Pending Updated Extension Placement": [
      {
        label: "Extension Placement",
        style: { color: "#5E9B2D" },
        onClick: ({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId &&
            jobId &&
            professionalId &&
            jobApplicationId &&
            jobAssignmentId
          ) {
            extensionPlacement({
              facilityId: facilityId,
              jobId: jobId,
              professionalId: professionalId,
              jobApplicationId: jobApplicationId,
              jobAssignmentId: jobAssignmentId,
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
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }: {
          facilityId?: number;
          jobId?: number;
          professionalId?: number;
          jobApplicationId?: number;
          jobAssignmentId?: number;
        }) => {
          if (
            facilityId === undefined ||
            jobId === undefined ||
            professionalId === undefined ||
            jobApplicationId === undefined ||
            jobAssignmentId === undefined
          )
            return;
          (onboardingRef.current.facilityId = facilityId),
            (onboardingRef.current.jobId = jobId),
            (onboardingRef.current.professionalId = professionalId),
            (onboardingRef.current.jobApplicationId = jobApplicationId),
            (onboardingRef.current.jobAssignmentId = jobAssignmentId);
          setTerminateModalOpen(true);
        },
      },
    ],
  };

  const Column: TableColumn<ProfessionalOnboardingType>[] = [
    {
      name: "Job ID",
      minWidth: "70px",
      cell: (row: ProfessionalOnboardingType) => (
        <div
          className="center-align roster-jobid"
          onClick={() =>
            handleViewJob({ facilityId: row.Facility.Id, jobId: row.Job.Id })
          }
        >
          JID-{row.Job.Id}
        </div>
      ),
    },
    {
      name: "Client Req ID",
      minWidth: "100px",
      cell: (row: ProfessionalOnboardingType) => (
        <span className="row-user-name roster-jobid">
          {" "}
          {row.JobApplication.JobAssignments[0].ReqId
            ? row.JobApplication.JobAssignments[0].ReqId.toUpperCase()
            : "-"}
        </span>
      ),
    },
    {
      name: "Profession",
      minWidth: "100px",
      cell: (row: ProfessionalOnboardingType) => (
        <span className="row-user-name roster-jobid">
          {row.JobApplication.JobAssignments[0].JobProfession.Profession}
        </span>
      ),
    },
    {
      name: "Unit",
      minWidth: "70px",
      cell: (row: ProfessionalOnboardingType) => (
        <div className="center-align">
          {row.JobApplication.JobAssignments
            ? row.JobApplication.JobAssignments[0].Unit
            : "-"}
        </div>
      ),
    },
    {
      name: "Compliance Due",
      minWidth: "160px",
      cell: (row: ProfessionalOnboardingType) => (
        <div className="center-align">
          {row.JobApplication.JobAssignments
            ? row.JobApplication.JobAssignments[0].ComplianceDueDate
            : "-"}
        </div>
      ),
    },
    {
      name: "Document Status",
      minWidth: "150px",
      cell: (row: ProfessionalOnboardingType) => {
        return (
          <>
            {row.JobApplication !== null ? (
              <OpeningDocumentStatusModal
                jobId={row.Job.Id}
                professionalId={Number(params.Id)}
                facilityId={row.Facility.Id}
                jobApplicationId={row.JobApplication.Id}
                row={row}
                documentStatusData={data}
              />
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      name: "Start Date & End Date",
      minWidth: "200px",
      cell: (row: ProfessionalOnboardingType) => (
        <div className="center-align">
          {row.JobApplication?.JobAssignments
            ? formatDateInDayMonthYear(
                row.JobApplication.JobAssignments[0].StartDate
              ).replace(/-/g, "/")
            : "-"}
          -{" "}
          {row.JobApplication?.JobAssignments
            ? formatDateInDayMonthYear(
                row.JobApplication.JobAssignments[0].EndDate
              ).replace(/-/g, "/")
            : "-"}
        </div>
      ),
    },
    {
      name: "Application Status",
      minWidth: "180px",
      cell: (cell: ProfessionalOnboardingType) => {
        return (
          <>
            <div className="opening-assignment-select">
              {cell.JobApplication.JobAssignments[0].JobApplicationStatus
                .Status === "Placement" ||
              cell.JobApplication.JobAssignments[0].JobApplicationStatus
                .Status === "Extension Placement" ? (
                <UncontrolledDropdown direction="up">
                  <DropdownToggle
                    caret
                    style={{
                      color: getStatusColor(
                        cell.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                      ),
                    }}
                  >
                    {cell.JobApplication.JobAssignments
                      ? cell.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                      : "Submitted"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      style={{
                        color: "red",
                      }}
                      onClick={() => {
                        setTerminateModalOpen(true);
                      }}
                    >
                      Terminate
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              ) : cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Pending Updated Placement" ? (
                <UncontrolledDropdown direction="up">
                  {secondMenuItems[
                    cell?.JobApplication.JobAssignments[0].JobApplicationStatus
                      .Status
                  ] ? (
                    <>
                      <DropdownToggle
                        caret
                        style={{
                          color: getStatusColor(
                            cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          ),
                        }}
                      >
                        {cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                          ? cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          : "--"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {secondMenuItems[
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ]?.map((item, index) => (
                          <DropdownItem
                            key={index}
                            onClick={() => {
                              item.onClick({
                                facilityId: cell.Facility.Id,
                                jobId: cell.Job.Id,
                                professionalId: Number(params?.Id),
                                jobAssignmentId:
                                  cell.JobApplication.JobAssignments[0].Id,
                                jobApplicationId: cell.JobApplication.Id,
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
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ),
                      }}
                    >
                      {
                        cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                      }
                    </span>
                  )}
                </UncontrolledDropdown>
              ) : cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Pending Updated Extension Placement" ? (
                <UncontrolledDropdown direction="start">
                  {secondMenuItems[
                    cell?.JobApplication.JobAssignments[0].JobApplicationStatus
                      .Status
                  ] ? (
                    <>
                      <DropdownToggle
                        caret
                        style={{
                          color: getStatusColor(
                            cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          ),
                        }}
                      >
                        {cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                          ? cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          : "--"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {secondMenuItems[
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ]?.map((item, index) => (
                          <DropdownItem
                            key={index}
                            onClick={() => {
                              item.onClick({
                                facilityId: cell.Facility.Id,
                                jobId: cell.Job.Id,
                                professionalId: Number(params?.Id),
                                jobApplicationId: cell.JobApplication.Id,
                                jobAssignmentId:
                                  cell.JobApplication.JobAssignments[0].Id,
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
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ),
                      }}
                    >
                      {
                        cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                      }
                    </span>
                  )}
                </UncontrolledDropdown>
              ) : cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Pending Placement" ||
                cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Pending Declination" ? (
                <UncontrolledDropdown direction="start">
                  {secondMenuItems[
                    cell?.JobApplication.JobAssignments[0].JobApplicationStatus
                      .Status
                  ] ? (
                    <>
                      <DropdownToggle
                        caret
                        style={{
                          color: getStatusColor(
                            cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          ),
                        }}
                      >
                        {cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                          ? cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          : "--"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {secondMenuItems[
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ]?.map((item, index) => {
                          return (
                            <DropdownItem
                              key={index}
                              onClick={() => {
                                item.onClick({
                                  facilityId: cell.Facility.Id,
                                  jobId: cell.Job.Id,
                                  professionalId: Number(params?.Id),
                                  jobAssignmentId:
                                    cell.JobApplication.JobAssignments[0].Id,
                                  jobApplicationId: cell.JobApplication.Id,
                                });
                              }}
                              style={item.style}
                            >
                              {item.label}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </>
                  ) : (
                    <span
                      style={{
                        fontWeight: "600",
                        textAlign: "left",
                        color: getStatusColor(
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ),
                      }}
                    >
                      {
                        cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                      }
                    </span>
                  )}
                </UncontrolledDropdown>
              ) : cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Pending Extension Placement" ||
                cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Pending Extension Declination" ||
                cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Extension Offered" ? (
                <UncontrolledDropdown direction="start">
                  {secondMenuItems[
                    cell?.JobApplication.JobAssignments[0].JobApplicationStatus
                      .Status
                  ] ? (
                    <>
                      <DropdownToggle
                        caret
                        style={{
                          color: getStatusColor(
                            cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          ),
                        }}
                      >
                        {cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                          ? cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          : "--"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {secondMenuItems[
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ]?.map((item, index) => (
                          <DropdownItem
                            key={index}
                            onClick={() => {
                              item.onClick({
                                facilityId: cell.Facility.Id,
                                jobId: cell.Job.Id,
                                professionalId: Number(params?.Id),
                                jobApplicationId: cell.JobApplication.Id,
                                jobAssignmentId:
                                  cell.JobApplication.JobAssignments[0].Id,
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
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ),
                      }}
                    >
                      {
                        cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                      }
                    </span>
                  )}
                </UncontrolledDropdown>
              ) : cell.JobApplication.JobAssignments[0].JobApplicationStatus
                  .Status === "Extension Requested" ? (
                <UncontrolledDropdown direction="start">
                  {secondMenuItems[
                    cell?.JobApplication.JobAssignments[0].JobApplicationStatus
                      .Status
                  ] ? (
                    <>
                      <DropdownToggle
                        caret
                        style={{
                          color: getStatusColor(
                            cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          ),
                        }}
                      >
                        {cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                          ? cell?.JobApplication.JobAssignments[0]
                              .JobApplicationStatus.Status
                          : "--"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {secondMenuItems[
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ]?.map((item, index) => (
                          <DropdownItem
                            key={index}
                            onClick={() => {
                              item.onClick({
                                facilityId: cell.Facility.Id,
                                jobId: cell.Job.Id,
                                professionalId: Number(params?.Id),
                                jobApplicationId: cell.JobApplication.Id,
                                jobAssignmentId:
                                  cell.JobApplication.JobAssignments[0].Id,
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
                          cell?.JobApplication.JobAssignments[0]
                            .JobApplicationStatus.Status
                        ),
                      }}
                    >
                      {
                        cell?.JobApplication.JobAssignments[0]
                          .JobApplicationStatus.Status
                      }
                    </span>
                  )}
                </UncontrolledDropdown>
              ) : (
                <span
                  style={{
                    fontWeight: "600",
                    color: getStatusColor(
                      cell.JobApplication.JobAssignments[0].JobApplicationStatus
                        .Status
                    ),
                  }}
                >
                  {
                    cell.JobApplication.JobAssignments[0].JobApplicationStatus
                      .Status
                  }
                </span>
              )}
            </div>
          </>
        );
      },
    },
    {
      name: "",
      minWidth: "100px",
      cell: (row: ProfessionalOnboardingType) => (
        <div className="center-align custom-article-btn d-flex flex-nowrap">
          <ArticleBtn
            onEye={() => {
              setAssignmentModal(true);
            }}
          />

          <ProfessionalOnboardingHistoryModal
            jobId={row.Job.Id}
            professionalId={Number(params.Id)}
            facilityId={row.Facility.Id}
            jobApplicationId={row.JobApplication.Id}
            slotId={row.Id}
          />
        </div>
      ),
    },
  ];

  const navigateViewJob = (facId: number, Id: number) => {
    removeActiveMenu();
    navigate({
      pathname: `/view/facility/${facId}/job/${Id}`,
    });
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="professional-card">
        <CustomMainCard>
          <div className="job-template-wrapper  w-100 bg-white">
            <div className="job-temp-header applied-jobs">
              <div className="d-flex justify-content-between">
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ gap: "8px" }}
                >
                  <>
                    <h3 className="job-title-card-heading text-capitalize mb-0">
                      {onboarding.Job ? capitalize(onboarding.Job.Title) : "-"}
                    </h3>
                    <CustomInput
                      className="header-input facility-job-header-input"
                      disabled={true}
                      value={`JID-${onboarding.Job.Id}`}
                    />
                    <div className="facilityjob-custom-dropdown">
                      <ACL
                        submodule={"jobs"}
                        module={"facilities"}
                        action={["GET", "PUT"]}
                      >
                        <CustomSelect
                          styles={facilityjobCustomStyles}
                          id={"jobStatus"}
                          name={"jobStatus"}
                          className="custom-select-placeholder custom-select-job"
                          options={jobStatus.map(
                            (job: {
                              Id: number;
                              Status: string;
                            }): { value: number; label: string } => ({
                              value: job?.Id,
                              label: job?.Status,
                            })
                          )}
                          value={
                            selectedJobStatus
                              ? {
                                  value: selectedJobStatus?.Id,
                                  label: selectedJobStatus?.Status,
                                }
                              : null
                          }
                          placeholder="Select Job Status"
                          noOptionsMessage={(): string => ""}
                          onChange={(jobStatus) => handleJobStatus(jobStatus)}
                          isSearchable={false}
                          isClearable={false}
                        />
                      </ACL>
                    </div>
                  </>
                </div>
              </div>
              <div>
                <span className="dollar-amount">
                  {onboarding.Job ? `${onboarding.Job.TotalGrossPay}` : "-"}
                </span>
                <span className="week">/week</span>
              </div>
            </div>
            <div className="d-flex justify-content-between facility-job-wrapper">
              <div className="d-flex">
                <img src={Building} />
                <p className="hospital-text text-capitalize">
                  {onboarding.Facility
                    ? capitalize(onboarding.Facility.Name)
                    : "-"}
                </p>
                <img src={Locations} />
                <p className="hospital-text text-capitalize">
                  {onboarding.Facility
                    ? capitalize(onboarding.Facility.Address)
                    : "-"}
                </p>
              </div>
              <div>
                <span className="bill-rate">Bill Rate.</span>
                <span className="bill-rate-rating">
                  {onboarding.Job ? `${onboarding.Job.BillRate}` : "-"}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex flex-wrap">
                <p>
                  <span className="temp-details">Start Date:</span>
                  <span className="temp-answer">
                    {onboarding.JobApplication?.JobAssignments
                      ? formatDateInDayMonthYear(
                          onboarding.JobApplication.JobAssignments[0].StartDate
                        ).replace(/-/g, "/")
                      : "-"}
                  </span>
                </p>
                <p>
                  <span className="temp-details">End Date:</span>
                  <span className="temp-answer">
                    {onboarding.JobApplication?.JobAssignments
                      ? formatDateInDayMonthYear(
                          onboarding.JobApplication.JobAssignments[0].EndDate
                        ).replace(/-/g, "/")
                      : "-"}
                  </span>
                </p>
              </div>
              <div className="btn-wrapper">
                <CustomButton
                  className="primary-btn"
                  onClick={() =>
                    // navigate(
                    //   `/view/facility/${onboarding.Facility?.Id}/job/${onboarding.Job?.Id}`
                    // )
                    navigateViewJob(onboarding.Facility?.Id, onboarding.Job?.Id)
                  }
                >
                  View Job
                </CustomButton>
              </div>
            </div>
            <div className="datatable-wrapper opening-assignments onboarding-table">
              <DataTable columns={Column} data={data} />
            </div>
          </div>
          <div className="">
            <OnboardingLayout
              professionalId={Number(params.Id)}
              jobId={onboarding.Job?.Id}
              jobApplicationId={onboarding.JobApplication?.Id}
              jobAssignmentId={onboarding.JobApplication?.JobAssignments[0].Id}
              facilityId={onboarding.Facility?.Id}
              fetchOnboardingDocuments={fetchOnboarding}
            />
          </div>
        </CustomMainCard>
      </div>
      {isTerminateModalOpen && (
        <OnboardingTerminate
          professionalId={Number(params.Id)}
          jobId={
            onboardingRef.current.jobId
              ? onboardingRef.current.jobId
              : onboarding.Job?.Id
          }
          jobApplicationId={
            onboardingRef.current.jobApplicationId
              ? onboardingRef.current.jobApplicationId
              : onboarding.JobApplication?.Id
          }
          jobAssignmentId={
            onboardingRef.current.jobAssignmentId
              ? onboardingRef.current.jobAssignmentId
              : onboarding.JobApplication?.JobAssignments[0].Id
          }
          facilityId={
            onboardingRef.current.facilityId
              ? onboardingRef.current.facilityId
              : onboarding.Facility?.Id
          }
          isOpen={isTerminateModalOpen}
          toggle={() => setTerminateModalOpen(false)}
          fetchOnboarding={fetchOnboarding}
        />
      )}

      {assignmentModal && (
        <ProfessionalAssignmentDetailsModal
          facilityId={onboarding.Facility?.Id}
          jobId={onboarding.Job?.Id}
          jobApplicationId={onboarding.JobApplication?.Id}
          jobAssignmentId={onboarding.JobApplication?.JobAssignments[0].Id}
          clientReqId={onboarding.JobApplication?.JobAssignments[0].ReqId}
          isOpen={assignmentModal}
          toggle={() => setAssignmentModal(false)}
          fetchOnboarding={fetchOnboarding}
        />
      )}
    </>
  );
};

export default ProfessionalOnboardingCard;
