import { Button, PopoverBody, UncontrolledPopover } from "reactstrap";

import { useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import ProfessionalGigHistoryServices from "../../../services/ProfessionalGigHistoryServices";

type GigHistoryModalProps = {
  jobId: number;
  professionalId: number;
  facilityId: number;
  jobApplicationId: number;
  slotId: number;
};

type JobApplication = {
  Id: number;
  UpdatedOn: string;
  JobApplicationStatus: {
    Id: number;
    Status: string;
  };
};

const GigHistoryModal = ({
  jobId,
  professionalId,
  facilityId,
  jobApplicationId,
  slotId,
}: GigHistoryModalProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [data, setData] = useState<JobApplication[]>([]);

  const fetch = async () => {
    setLoading("loading");
    try {
      const res = await ProfessionalGigHistoryServices.fetchApplicationHistory({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
      });
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
        className="text-nowrap history-btn"
        onClick={fetch}
        id={`history-${slotId}`}
      >
        <span className="material-symbols-outlined">history</span>
      </Button>
      <UncontrolledPopover
        placement="left"
        target={`history-${slotId}`}
        trigger="focus"
      >
        <PopoverBody>
          <div className="application-history-stepper">
            <div className="stepper-btn-wrapper">
              <h6 className="popover-title">Application History</h6>
              <button type="button" onClick={() => {}} className="close">
                <span aria-hidden="true" className="material-symbols-outlined ">
                  close
                </span>
              </button>
            </div>
            <div className="container-master">
              {data.map((item) => (
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
              ))}
            </div>
          </div>
        </PopoverBody>
      </UncontrolledPopover>
    </>
  );
};

export default GigHistoryModal;
