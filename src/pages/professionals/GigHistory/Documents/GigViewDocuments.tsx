import { useState } from "react";
import { Modal, ModalHeader, ModalBody, TabContent, TabPane } from "reactstrap";
import ViewDocHeader from "../ViewDocHeaderInfo";
import CustomMainCard from "../../../../components/custom/CustomCard";
import RequiredtoSubmit from "./RequiredToSubmit";
import OnboardingDocuments from "./OnboardingDocuments";
import RequiredToApply from "./RequiredToApply";

type SubmissionProfileModalProps = {
  isOpen: boolean;
  toggle: () => void;
  professionalId: number;
  facilityId: number;
  jobApplicationId: number;
  jobId: number;
};

const GigViewDocuments = ({
  isOpen,
  toggle,
  professionalId,
  facilityId,
  jobApplicationId,
  jobId,
}: SubmissionProfileModalProps) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        className="onboard-modal"
      >
        <ModalHeader toggle={toggle}>
          Uploaded Documents - PID-0{professionalId}
        </ModalHeader>
        <ModalBody style={{ height: "600px", overflow: "auto" }}>
          <div className="view-file-wrapper py-3 modal-main-wrapper-section">
            <CustomMainCard>
              <div className="header-wrap">
                <ViewDocHeader activeTab={activeTab} toggleTab={toggleTab} />
              </div>

              <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                  <RequiredToApply
                    facilityId={facilityId}
                    jobApplicationId={jobApplicationId}
                    jobId={jobId}
                    professionalId={professionalId}
                  />
                </TabPane>
                <TabPane tabId={2}>
                  <RequiredtoSubmit
                    facilityId={facilityId}
                    jobApplicationId={jobApplicationId}
                    jobId={jobId}
                    professionalId={professionalId}
                  />
                </TabPane>
                <TabPane tabId={3}>
                  <OnboardingDocuments
                    facilityId={facilityId}
                    jobApplicationId={jobApplicationId}
                    jobId={jobId}
                    professionalId={professionalId}
                  />
                </TabPane>
              </TabContent>
            </CustomMainCard>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default GigViewDocuments;
