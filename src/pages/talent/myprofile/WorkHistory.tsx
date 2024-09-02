import { Button } from "reactstrap";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  getWorkHistoryList,
  setWorkHistoryList,
} from "../../../store/ProfessionalDetailsSlice";
import ProfessionalWorkHistoryModal from "./modals/ProfessionalWorkHistoryModal";
import { showToast } from "../../../helpers";
import { getProfessionalWorkHistory } from "../../../services/ProfessionalMyProfile";
import Loader from "../../../components/custom/CustomSpinner";
import ProfessionalWorkHistoryCard from "./Cards/ProfessionalWorkHistoryCard";
import { ProfileInformationCardProps } from "../../../types/ProfessionalDetails";

const WorkHistory = ({ setFetchDetails }: ProfileInformationCardProps) => {
  const dispatch = useDispatch();
  const [workHistoryModal, setWorkHistoryModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const workHistory = useSelector(getWorkHistoryList);

  const toggleWorkHistoryModal = () =>
    setWorkHistoryModal((prevModal) => !prevModal);

  const fetchWorkHistory = async () => {
    try {
      setLoading("loading");
      const response = await getProfessionalWorkHistory();
      dispatch(setWorkHistoryList(response.data?.data));
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchWorkHistory();
  }, [workHistory.length < 0]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <h3 className="scroll-title mb-2">Work History</h3>
        <Button
          outline
          className="purple-outline-btn mb-2 min-width-146"
          onClick={toggleWorkHistoryModal}
        >
          Add Work History
        </Button>
      </div>
      {workHistory &&
        workHistory.length > 0 &&
        workHistory?.map((item, index) => {
          return (
            <ProfessionalWorkHistoryCard
              {...item}
              key={item.Id}
              index={index + 1}
              fetch={fetchWorkHistory}
              setFetchDetails={setFetchDetails}
            />
          );
        })}
      {workHistoryModal && (
        <ProfessionalWorkHistoryModal
          isOpen={workHistoryModal}
          toggle={() => setWorkHistoryModal(false)}
          fetch={fetchWorkHistory}
          setFetchDetails={setFetchDetails}
        />
      )}
    </>
  );
};

export default WorkHistory;
