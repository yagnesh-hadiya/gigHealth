import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ApproveExtensionHeader from "../../../facilitycomponent/roster/ApproveExtensionHeader";
import { showToast } from "../../../../../../helpers";
import { useCallback, useEffect, useState } from "react";
import { JobAssignmentType } from "../../../facilitycomponent/roster/ServiceExtensionReqModal";
import { ProfessionalDetails } from "../../../../../../types/StoreInitialTypes";
import { RightJobContentData } from "../../../../../../types/JobsTypes";
import Loader from "../../../../../../components/custom/CustomSpinner";
import { getJobDetails } from "../../../../../../services/JobsServices";
import { fetchProfessionalHeaderDetails } from "../../../../../../services/ProfessionalDetails";
import RosterServices from "../../../../../../services/RosterServices";
import { RejectedJobAssignmentInfo } from "./RejectedTab";
import RejectedCandidateInfo from "./RejectedCandidateInfo";

type SubmissionOfferDetailsProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  currentStatus: string;
  row: RejectedJobAssignmentInfo;
};

const SubmissionOfferDetails = ({
  isOpen,
  toggle,
  jobApplicationId,
  jobAssignmentId,
  jobId,
  professionalId,
  facilityId,
  currentStatus,
  row,
}: SubmissionOfferDetailsProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [jobAssignment, setJobAssignment] = useState<JobAssignmentType | null>(
    null
  );
  const [professional, setProfessional] = useState<ProfessionalDetails | null>(
    null
  );
  const [jobDetails, setJobDetails] = useState<RightJobContentData | null>(
    null
  );

  const fetch = useCallback(async () => {
    setLoading("loading");
    const fetchData = async (
      apiFunction: () => Promise<any>,
      setter: (data: any) => void,
      useFirstItem: boolean = false
    ) => {
      try {
        const result = await apiFunction();
        setter(useFirstItem ? result.data.data[0] : result.data.data);
      } catch (error: any) {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        showToast("Error fetching data", errorMessage);
        console.error("Error fetching data:", error);
      }
    };

    const apiCalls = [
      () => getJobDetails(facilityId, jobId),
      () => fetchProfessionalHeaderDetails(professionalId),
      () =>
        RosterServices.fetchJobAssignment({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }),
    ];

    const setters = [setJobDetails, setProfessional, setJobAssignment];
    const useFirstItemFlags = [true, true, true];

    (async () => {
      await Promise.allSettled(
        apiCalls.map((apiFunction, index) =>
          fetchData(apiFunction, setters[index], useFirstItemFlags[index])
        )
      );
      setLoading("idle");
    })().catch((error) => {
      showToast("error", "Error fetching data");
      console.error("Error fetching data:", error);
      setLoading("error");
    });
  }, [facilityId, jobId, jobApplicationId, jobAssignmentId, professionalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        className="onboard-modal"
      >
        <ModalHeader
          toggle={toggle}
          style={{
            position: "sticky",
            top: "0px",
            zIndex: "9999",
            background: "#FFF",
          }}
        >
          Service Extension Details
        </ModalHeader>
        <ModalBody>
          <div className="view-file-wrapper">
            {professional && jobAssignment && jobDetails && (
              <ApproveExtensionHeader
                professional={professional}
                professionalId={professionalId}
                jobDetails={jobDetails}
                currentStatus={currentStatus}
              />
            )}
            {professional && jobDetails && jobAssignment && (
              <RejectedCandidateInfo
                row={row}
                professional={professional}
                jobDetails={jobDetails}
                jobAssignment={jobAssignment}
              />
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SubmissionOfferDetails;
