import { Button } from "reactstrap";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import Loader from "../../../components/custom/CustomSpinner";
import { getAppliedJobHistory } from "../../../services/GigHistoryServices";

type AppliedJobHistoryModalProps = {
  slotId: number;
  jobId: number;
  jobApplicationId: number;
  history?: boolean;
};

type JobApplication = {
  Id: number;
  UpdatedOn: string;
  JobApplicationStatus: {
    Id: number;
    Status: string;
  };
};

const AssignmentJobHistoryMobileModal = ({
  slotId,
  jobId,
  jobApplicationId,
  history = false,
}: AppliedJobHistoryModalProps) => {
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [data, setData] = useState<JobApplication[]>([]);

  const fetch = async () => {
    setLoading("loading");
    try {
      const res = await getAppliedJobHistory(jobId, jobApplicationId);
      setData(res.data.data);
      setLoading("idle");
    } catch (error) {
      setLoading("error");
      console.error(error);
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Button
        type="button"
        className={`text-nowrap ${
          history ? "history-btn" : "gig-history-btn"
        } `}
        style={{ height: history ? "30px" : "", width: history ? "30px" : "" }}
        onClick={() => {
          setStatusModal((prev) => !prev);
          fetch();
        }}
        id={`history-${slotId}`}
      >
        <span className="material-symbols-outlined">history</span>
      </Button>

      <Modal
        show={statusModal}
        onHide={() => setStatusModal((prev) => !prev)}
        centered
        size="lg"
        className="modal-talent-onboarding"
      >
        <ModalHeader closeButton>
          <Modal.Title>Application History</Modal.Title>
        </ModalHeader>
        <ModalBody
          className="viewAssignmentViewAssignment"
          style={{
            overflow: "auto",
            padding: "5px",
          }}
        >
          <div className="application-history-stepper">
            {data.map(
              (item: {
                Id: Key | null | undefined;
                JobApplicationStatus: {
                  Status:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | null
                    | undefined;
                };
                UpdatedOn: string | number | Date;
              }) => (
                <div className="step" key={item.Id}>
                  <div className="v-stepper">
                    <div>
                      <div className="circle"></div>
                      <div className="line"></div>
                    </div>
                    <div className="text text-nowrap">
                      {item.JobApplicationStatus.Status
                        ? item.JobApplicationStatus.Status
                        : ""}
                    </div>
                    <div className="border-line"></div>
                  </div>

                  <div className="content text-nowrap">
                    {item.UpdatedOn
                      ? new Date(item.UpdatedOn).toLocaleString()
                      : ""}
                  </div>
                </div>
              )
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AssignmentJobHistoryMobileModal;
