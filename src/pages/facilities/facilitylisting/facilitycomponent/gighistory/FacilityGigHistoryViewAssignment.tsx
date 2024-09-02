import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ApproveExtensionHeader from "../roster/ApproveExtensionHeader";
import RosterServices from "../../../../../services/RosterServices";
import { showToast } from "../../../../../helpers";
import { useCallback, useEffect, useState } from "react";
import { JobAssignmentType } from "../roster/ServiceExtensionReqModal";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  FacilityGigHistoryJobAssignment,
  FacilityGigHistoryType,
} from "../../../../../types/FacilityGigHistoryType";
import FacilityGigHistoryServices from "../../../../../services/FacilityGigHistoryServices";
import FacilityEditExtension from "./Profile/FacilityEditExtension";

type FacilityGigHistoryViewAssignmentProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  fetchRosterData: () => void;
  currentStatus: string;
  currentAssignmentRow: FacilityGigHistoryJobAssignment;
  row: FacilityGigHistoryType;
};

const FacilityGigHistoryViewAssignment = ({
  row,
  isOpen,
  toggle,
  jobApplicationId,
  jobAssignmentId,
  jobId,
  professionalId,
  facilityId,
  fetchRosterData,
  currentStatus,
  currentAssignmentRow,
}: FacilityGigHistoryViewAssignmentProps) => {
  const [edit, setEdit] = useState(false);
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
      () => RosterServices.getJobDetails({ facilityId, jobId }),
      () =>
        FacilityGigHistoryServices.fetchProfessionalDetails({
          facilityId,
          professionalId,
          jobId,
        }),
      () =>
        FacilityGigHistoryServices.getJobAssignment({
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
            background: "#FFF",
          }}
        >
          Service Extension Details
        </ModalHeader>
        <ModalBody>
          <div className="view-file-wrapper">
            {professional && jobAssignment && jobDetails && (
              <ApproveExtensionHeader
                edit={edit}
                setEdit={setEdit}
                professional={professional}
                professionalId={professionalId}
                jobDetails={jobDetails}
                currentStatus={currentStatus}
              />
            )}
            {professional &&
              jobDetails &&
              jobAssignment &&
              currentAssignmentRow && (
                <FacilityEditExtension
                  edit={edit}
                  row={row}
                  toggle={toggle}
                  professional={professional}
                  professionalId={professionalId}
                  jobDetails={jobDetails}
                  jobAssignment={jobAssignment}
                  jobApplicationId={jobApplicationId}
                  jobAssignmentId={jobAssignmentId}
                  jobId={jobId}
                  facilityId={facilityId}
                  fetchRosterData={fetchRosterData}
                  currentAssignmentRow={currentAssignmentRow}
                />
              )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FacilityGigHistoryViewAssignment;
