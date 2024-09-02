import { useCallback, useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, TabContent, TabPane } from "reactstrap";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import Loader from "../../../../../components/custom/CustomSpinner";
import { fetchApplicantProfessionalDetails } from "../../../../../services/ApplicantsServices";
import { capitalize } from "../../../../../helpers";
import { useParams } from "react-router-dom";
import FacilityOnboardingProfileHeader from "./professional/FacilityOnboardingProfileHeader";
import FacilityOnboardingProfileDocuments from "./professional/FacilityOnboardingProfileDocuments";
import FacilityOnboardingReadOnlyDetails from "./professional/FacilityOnboardingReadOnlyDetails";
import FacilityOnboardingProfileSubmissionDocuments from "./FacilityOnboardingProfileSubmissionDocuments";
import { FacilityOnboardingType } from "../../../../../types/FacilityOnboardingTypes";
import FacilityOnboardingTabHeader from "./FacilityOnboardingTabHeader";

type FacilityOnboardingProfileModalProps = {
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
  currentAssignmentId: number;
  isOpen: boolean;
  toggle: () => void;
  status: string;
  fetchList: () => void;
  row: FacilityOnboardingType;
};

const FacilityOnboardingProfileModal = ({
  jobId,
  professionalId,
  isOpen,
  toggle,
  currentApplicantId,
  currentAssignmentId,
  status,
  fetchList,
  row,
}: FacilityOnboardingProfileModalProps) => {
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
      const professional = await fetchApplicantProfessionalDetails({
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
                <FacilityOnboardingTabHeader
                  activeTab={activeTab}
                  toggleTab={toggleTab}
                />
              </div>

              <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                  <div>
                    <FacilityOnboardingProfileHeader
                      status={status}
                      professionalId={professionalId}
                      currentProfessional={currentProfessional}
                    />
                  </div>
                  <FacilityOnboardingProfileDocuments
                    jobId={jobId}
                    facilityId={Number(params.Id)}
                    professionalId={professionalId}
                    toggle={toggle}
                    toggleTab={toggleTab}
                  />
                </TabPane>
                <TabPane tabId={2}>
                  <div>
                    <FacilityOnboardingProfileHeader
                      status={status}
                      professionalId={professionalId}
                      currentProfessional={currentProfessional}
                    />
                  </div>
                  <FacilityOnboardingProfileSubmissionDocuments
                    facilityId={Number(params.Id)}
                    jobId={jobId}
                    professionalId={professionalId}
                    jobApplicationId={currentApplicantId}
                    fetchList={fetchList}
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
                    <FacilityOnboardingReadOnlyDetails
                      reqId={row.JobApplication.JobAssignments[0].ReqId}
                      professionalId={professionalId}
                      jobId={jobId}
                      facilityId={Number(params.Id)}
                      jobApplicationId={currentApplicantId}
                      jobAssignmentId={currentAssignmentId}
                      currentProfessional={currentProfessional}
                      toggle={toggle}
                      fetchList={fetchList}
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

export default FacilityOnboardingProfileModal;
