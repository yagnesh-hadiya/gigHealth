import { useCallback, useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, TabContent, TabPane } from "reactstrap";
import { useParams } from "react-router-dom";
import { capitalize } from "../../../../../../helpers";
import Loader from "../../../../../../components/custom/CustomSpinner";
import FacilityGigHistoryServices from "../../../../../../services/FacilityGigHistoryServices";
import FacilityOnboardingProfileHeader from "../../facilityonboarding/professional/FacilityOnboardingProfileHeader";
import SubmissionProfileHeader from "../../../jobs/Submissions/SubmissionHeader";
import FacilityGigHistoryProfileSubmissionDocuments from "./FacilityGigHistoryProfileSubmissionDocuments";
import { ProfessionalDetails } from "../../../../../../types/StoreInitialTypes";
import FacilityCandidateInfo from "./FacilityCandidateInfo";
import FacilityCoverPageDetails from "./FacilityCoverPageDetails";

type FacilityGigHistoryProfileModalProps = {
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  isOpen: boolean;
  toggle: () => void;
  fetchList: () => void;
};

const FacilityGigHistoryProfileModal = ({
  jobId,
  professionalId,
  isOpen,
  toggle,
  jobApplicationId,
}: FacilityGigHistoryProfileModalProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">(
    "loading"
  );
  const [activeTab, setActiveTab] = useState<number>(1);
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);
  const params = useParams();

  const fetchProfessional = useCallback(async () => {
    setLoading("loading");
    try {
      const professional =
        await FacilityGigHistoryServices.fetchProfessionalDetails({
          jobId: jobId,
          professionalId: professionalId,
          facilityId: Number(params.Id),
        });
      setCurrentProfessional(professional.data.data[0]);
      setLoading("idle");
    } catch (error: any) {
      setLoading("error");
      console.error(error);
    }
  }, [jobId, params.Id, professionalId]);

  useEffect(() => {
    fetchProfessional();
  }, [fetchProfessional]);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      {loading === "loading" && currentProfessional === null && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        className="onboard-modal"
      >
        <ModalHeader toggle={toggle}>
          {currentProfessional
            ? `${capitalize(currentProfessional.FirstName)} ${capitalize(
                currentProfessional.LastName
              )}`
            : ""}
          ’s Profile
        </ModalHeader>
        <ModalBody>
          <div className="view-file-wrapper">
            <div>
              <div
                className="header-wrap"
                style={{ position: "sticky", top: "0px", zIndex: "9999" }}
              >
                <SubmissionProfileHeader
                  activeTab={activeTab}
                  toggleTab={toggleTab}
                />
              </div>

              <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                  <div>
                    <FacilityOnboardingProfileHeader
                      professionalId={professionalId}
                      currentProfessional={currentProfessional}
                    />
                  </div>
                  <FacilityCandidateInfo
                    professionalId={professionalId}
                    jobId={jobId}
                    facilityId={Number(params.Id)}
                    toggle={toggle}
                    toggleTab={toggleTab}
                  />
                </TabPane>
                <TabPane tabId={2}>
                  <div>
                    <FacilityOnboardingProfileHeader
                      professionalId={professionalId}
                      currentProfessional={currentProfessional}
                    />
                  </div>
                  <FacilityGigHistoryProfileSubmissionDocuments
                    jobApplicationId={jobApplicationId}
                    jobId={jobId}
                    facilityId={Number(params.Id)}
                    professionalId={professionalId}
                    toggle={toggle}
                    toggleTab={toggleTab}
                  />
                </TabPane>
                <TabPane tabId={3}>
                  <div className="mb-2">
                    <FacilityOnboardingProfileHeader
                      status={status}
                      professionalId={professionalId}
                      currentProfessional={currentProfessional}
                    />
                  </div>
                  {currentProfessional && (
                    <FacilityCoverPageDetails
                      professionalId={professionalId}
                      jobId={jobId}
                      facilityId={Number(params.Id)}
                      jobApplicationId={jobApplicationId}
                      professionalDetails={currentProfessional}
                      toggle={toggle}
                    />
                  )}
                </TabPane>
              </TabContent>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FacilityGigHistoryProfileModal;
