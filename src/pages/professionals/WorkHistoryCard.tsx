import { useState } from "react";
import onboardLocation from "../../assets/images/onboardLocation.svg";
import ACL from "../../components/custom/ACL";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import { capitalize, formatDateInDayMonthYear } from "../../helpers";
import { WorkHistoryType } from "../../types/ProfessionalDetails";
import EditWorkHistoryModal from "./ProfessionalsModals/EditWorkHistoryModal";
import { deleteWorkHistory } from "../../services/ProfessionalDetails";
import { toast } from "react-toastify";
import CustomDisabledYesNoRadio from "../../components/custom/CustomDisabledRadio";
import { useDispatch } from "react-redux";
import { toggleFetchDetails } from "../../store/ProfessionalDetailsSlice";

const WorkHistoryCard = ({
  isReadOnly,
  workHistory,
  professionalId,
  fetch,
}: {
  isReadOnly?: boolean;
  workHistory: WorkHistoryType;
  professionalId: number;
  fetch: () => void;
}) => {
  const [workHistoryModal, setWorkHistoryModal] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onEditHandler = () => {
    setWorkHistoryModal((prevModal) => !prevModal);
  };

  const onDeleteHandler = async () => {
    try {
      const response = await deleteWorkHistory(
        Number(professionalId),
        workHistory.Id
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetch();
        dispatch(toggleFetchDetails());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="details-wrapper mb-2 border rounded"
        style={{ padding: "10px 10px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            marginLeft: "10px",
          }}
        >
          <p
            className="mb-2"
            style={{
              marginTop: "4px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#262638",
            }}
          >
            {formatDateInDayMonthYear(workHistory.StartDate?.toString())} -{" "}
            {workHistory.EndDate
              ? formatDateInDayMonthYear(workHistory.EndDate?.toString())
              : "Present"}
          </p>

          {!isReadOnly && (
            <div className="d-flex">
              <ACL
                submodule={"details"}
                module={"professionals"}
                action={["GET", "PUT"]}
              >
                <CustomEditBtn
                  onEdit={() => workHistory.Id !== undefined && onEditHandler()}
                />
              </ACL>
              <ACL
                submodule={"details"}
                module={"professionals"}
                action={["GET", "DELETE"]}
              >
                <CustomDeleteBtn
                  onDelete={() =>
                    workHistory.Id !== undefined && onDeleteHandler()
                  }
                />
              </ACL>
            </div>
          )}
        </div>
        <p className="edu-card-title mb-2" style={{ marginLeft: "10px" }}>
          {capitalize(workHistory.FacilityName) || "-"}
        </p>
        <div style={{ marginBottom: "10px", marginLeft: "8px" }}>
          {" "}
          <img src={onboardLocation} />
          <span style={{ marginLeft: "10px" }} className="edu-card-content">
            {workHistory.State.State}
          </span>
        </div>
        <div className="section-content">
          <span>
            <span className="main-text">Facility Type: </span>
            {capitalize(workHistory.FacilityType)}
          </span>
          <span>
            <span className="main-text">Profession: </span>
            {workHistory.JobProfession.Profession}
          </span>
          <span>
            <span className="main-text">Specialty:</span>
            {capitalize(workHistory.JobSpeciality.Speciality)}
          </span>
        </div>
        <div className="section-content">
          <span>
            <span className="main-text">Nurse to Patient Ratio: </span>
            {workHistory.NurseToPatientRatio || "-"}
          </span>
          <span>
            <span className="main-text">Facility Beds:</span>
            {workHistory.FacilityBeds || "-"}
          </span>
          <span>
            <span className="main-text">Beds In Unit: </span>
            {workHistory.BedsInUnit || "-"}
          </span>
        </div>
        <div
          className="section-content d-flex justify-content-row mb-2 align-items-center flex-wrap"
          style={{ marginBottom: "0px", marginLeft: "10px" }}
        >
          <p className="main-text mb-0 me-2">Teaching Facility:</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              marginLeft: "10px",
            }}
          >
            <span className="p-0">
              <CustomDisabledYesNoRadio
                value={workHistory.IsTeachingFacility === true ? "Yes" : "No"}
              />
            </span>
          </div>
          <p className="main-text me-2 mb-0">Magnet Facility:</p>
          <span className="p-0">
            <CustomDisabledYesNoRadio
              value={workHistory.IsMagnetFacility === true ? "Yes" : "No"}
            />
          </span>
          <p className="main-text me-2 mb-0">Trauma Facility:</p>
          <span className="p-0">
            <CustomDisabledYesNoRadio
              value={workHistory.IsTraumaFacility === true ? "Yes" : "No"}
            />
          </span>
        </div>
        <div className="section-content mb-2">
          <span className="text-capitalize">
            <span className="main-text text-capitalize">
              Additional Information:{" "}
            </span>
            {workHistory.AdditionalInfo || "-"}
          </span>
        </div>
        <div>
          {" "}
          <p
            className="prof-card-subheading mb-2"
            style={{ paddingLeft: "10px" }}
          >
            Position Details
          </p>
          <p className="edu-card-title mb-2" style={{ marginLeft: "10px" }}>
            {capitalize(workHistory?.JobProfession.Profession) || "-"}
          </p>
          <div className="section-content">
            <span>
              <span className="main-text text-capitalize">Agency:</span>
              {workHistory?.AgencyName || "-"}
            </span>
            <span>
              <span className="main-text">Charge Experience:</span>
              {workHistory?.IsChargeExperience === true
                ? "Yes"
                : workHistory?.IsChargeExperience === null
                ? "-"
                : "No"}
            </span>
            <span>
              <span className="main-text">Charting System:</span>
              {workHistory?.IsChartingSystem === true
                ? "Yes"
                : workHistory?.IsChartingSystem === null
                ? "-"
                : "No"}
            </span>
            <span>
              <span className="main-text">Shift:</span>
              {workHistory?.JobShift ? workHistory.JobShift.Shift : "-"}
            </span>
          </div>
          <div className="section-content text-capitalize">
            <span>
              <span className="main-text">Reason For Leaving: </span>
              {workHistory?.ReasonForLeaving || "-"}
            </span>
          </div>
        </div>
      </div>

      {workHistoryModal && (
        <EditWorkHistoryModal
          fetch={fetch}
          id={professionalId}
          workHistory={workHistory}
          isOpen={workHistoryModal}
          toggle={() => setWorkHistoryModal(false)}
        />
      )}
    </>
  );
};

export default WorkHistoryCard;
