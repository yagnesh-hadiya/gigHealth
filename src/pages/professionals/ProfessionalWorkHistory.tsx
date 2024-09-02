import { useCallback, useEffect, useState } from "react";
import CustomButton from "../../components/custom/CustomBtn";
import WorkHistoryCard from "./WorkHistoryCard";
import WorkHistoryModal from "./ProfessionalsModals/WorkHistoryModal";
import { WorkHistoryType } from "../../types/ProfessionalDetails";
import { fetchWorkHistory } from "../../services/ProfessionalDetails";
import { useParams } from "react-router-dom";
import Loader from "../../components/custom/CustomSpinner";
import ACL from "../../components/custom/ACL";
import { showToast } from "../../helpers";

const ProfessionalWorkHistory = () => {
  const params = useParams();
  const [workHistoryModal, setWorkHistoryModal] = useState<boolean>(false);
  const [workHistory, setWorkHistory] = useState<WorkHistoryType[]>([]);
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");

  const fetch = useCallback(async () => {
    setLoading("loading");
    try {
      const response = await fetchWorkHistory(Number(params?.Id));
      setWorkHistory(response.data.data);
      setLoading("idle");
    } catch (error) {
      console.error(error);
      setLoading("error");
      showToast("error", "Something went wrong");
    }
  }, [params]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggleWorkHistoryModal = () =>
    setWorkHistoryModal((prevModal) => !prevModal);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <div className="facility-header-wrap" style={{ padding: "10px 10px" }}>
          <span className="section-header" style={{ padding: "10px 21px" }}>
            Work History
          </span>
          <div className="content-wrapper">
            <div className="box-wrapper border-0">
              {workHistory.map((history) => (
                <WorkHistoryCard
                  fetch={fetch}
                  workHistory={history}
                  professionalId={Number(params?.Id)}
                />
              ))}
            </div>
          </div>
          <div className="right-buttons text-start justify-content-start ms-3 mb-2">
            <ACL
              submodule="details"
              module="professionals"
              action={["GET", "POST"]}
            >
              <CustomButton
                className="professional-button add-more"
                onClick={toggleWorkHistoryModal}
              >
                {workHistory.length === 0 ? "Add Work History" : "Add More"}
              </CustomButton>
            </ACL>
          </div>
        </div>
      </div>
      {workHistoryModal && (
        <WorkHistoryModal
          isOpen={workHistoryModal}
          toggle={() => setWorkHistoryModal(false)}
          fetch={fetch}
        />
      )}
    </>
  );
};

export default ProfessionalWorkHistory;
