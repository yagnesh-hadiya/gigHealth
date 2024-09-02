import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { ProfessionalDetails } from "../../../../../../types/StoreInitialTypes";
import FacilityGigHistoryServices from "../../../../../../services/FacilityGigHistoryServices";
import Loader from "../../../../../../components/custom/CustomSpinner";
import { capitalize } from "../../../../../../helpers";
import GigProfileHeadingInfo from "./GigProfileHeadingInfo";
import GigProfileDetailsAndDocuments from "./GigProfileDetailsAndDocuments";

type GigProfileModalProps = {
  isOpen: boolean;
  toggle: () => void;
  currentProfessionalId: number;
  currentJobId: number;
  currentStatus: string;
};

const GigProfileModal = ({
  isOpen,
  toggle,
  currentJobId,
  currentProfessionalId,
  currentStatus,
}: GigProfileModalProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);
  const params = useParams();
  const fetch = useCallback(async () => {
    setLoading("loading");
    const [currentProfessional, workHistory] = await Promise.all([
      FacilityGigHistoryServices.fetchProfessionalDetails({
        facilityId: Number(params.Id),
        jobId: currentJobId,
        professionalId: currentProfessionalId,
      }),
      FacilityGigHistoryServices.fetchProfessionalWorkHistory({
        facilityId: Number(params.Id),
        jobId: currentJobId,
        professionalId: currentProfessionalId,
      }),
    ]);

    if (currentProfessional.status === 200 && workHistory.status === 200) {
      setLoading("idle");
      setCurrentProfessional(currentProfessional.data.data[0]);
    }
  }, [params.Id, currentJobId, currentProfessionalId]);

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
              <div>
                <GigProfileHeadingInfo
                  professionalId={currentProfessionalId}
                  currentProfessional={currentProfessional}
                  status={currentStatus}
                />
              </div>

              <GigProfileDetailsAndDocuments
                facilityId={Number(params.Id)}
                jobId={currentJobId}
                professionalId={currentProfessionalId}
              />
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default GigProfileModal;
