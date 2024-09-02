import { useState } from "react";
import CustomInput from "../../../../../components/custom/CustomInput";
// import SmsIcon from "../../../../../components/icons/Sms";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import {
  capitalize,
  debounce,
  formatPhoneNumber,
  submissionHeaderDropdowns,
  showToast,
} from "../../../../../helpers";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import Loader from "../../../../../components/custom/CustomSpinner";
import { declineApplication } from "../../../../../services/ApplicantsServices";
import Camera from "../../../../../assets/images/camera.svg";
import { getStatusColor } from "../../../../../constant/StatusColors";
import { toggleActivation } from "../../../../../services/ProfessionalDetails";
import ProfessionalToggleSwitch from "../../../../professionals/ProfessionalToggleSwtch";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import { useNavigate } from "react-router-dom";

type SubscriptionHeadingInfoProps = {
  professionalId: number;
  jobId: number;
  facilityId: number;
  currentApplicantId: number;
  currentProfessional: ProfessionalDetails | null;
  toggle: () => void;
  fetchApplicants: () => void;
  isReadOnly?: boolean;
  status?: string;
};

const SubmissionHeadingInfo = ({
  professionalId,
  jobId,
  facilityId,
  currentApplicantId,
  currentProfessional,
  fetchApplicants,
  toggle,
  isReadOnly,
  status,
}: SubscriptionHeadingInfoProps) => {
  const [selectedStatus, setSelectedStatus] = useState<{
    value: number;
    label: string;
  } | null>({
    value: 1,
    label: status ? status : "Pending",
  });
  const navigate = useNavigate();
  const roleOption = [{ value: 2, label: "Decline" }];
  const handleStatusChanged = (
    selectedOption: {
      value: number;
      label: string;
    } | null
  ) => {
    if (selectedOption) {
      setSelectedStatus(selectedOption);
      if (selectedOption.value === 2) {
        decline();
      }
    }
  };

  const decline = async () => {
    try {
      const res = await declineApplication({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        currentApplicantId: currentApplicantId,
        value: "Declined by Gig",
      });

      if (res.status === 200) {
        toggle();
        fetchApplicants();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleToggleActivation = debounce(async (activation: boolean) => {
    try {
      const response = await toggleActivation(professionalId, activation);
      showToast(
        "success",
        "Professional activation changed successfully" || response.data?.message
      );
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 300);

  const handleEdit = () => {
    navigate(`/professionals/edit/${professionalId}`);
  };

  return (
    <div
      className="facility-header-wrap professional-header"
      style={{
        paddingTop: "12px",
        paddingBottom: "12px",
        pointerEvents: isReadOnly ? "none" : "auto",
      }}
    >
      {currentProfessional === null && <Loader />}

      <div className="content-wrapper align-items-center">
        <img
          src={
            currentProfessional?.ProfileImage
              ? currentProfessional?.ProfileImage
              : Camera
          }
          style={{
            borderRadius: "50%",
            height: "8rem",
            width: "8rem",
            position: "relative",
            backgroundColor: "#f4f4f4",
          }}
        />
      </div>
      {/* </div>
      </div> */}
      <div className="details-wrapper">
        <div className="header-wrapper">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="first-section-content">
              <h1 className="hospital-name">
                {capitalize(
                  currentProfessional?.FirstName
                    ? currentProfessional?.FirstName
                    : ""
                )}{" "}
                {capitalize(
                  currentProfessional?.LastName
                    ? currentProfessional?.LastName
                    : ""
                )}
              </h1>
              <CustomInput
                placeholder=""
                disabled
                value={`PID-${professionalId}`}
                className="in-width"
                style={{
                  marginRight: "10px",
                }}
              />
              {/* <div
                className=" note-wrapper button-width"
                style={{ marginRight: "13px" }}
              >
                <button className=" msg-btn btn-style">
                  <SmsIcon color="#FFF" /> Messages
                </button>
              </div> */}
              <div className="d-flex align-items-center">
                <span className="text-nowrap">Account Status:</span>
                <span className="toggle-position" style={{ marginLeft: "5px" }}>
                  <ProfessionalToggleSwitch
                    onStateChange={(activation: boolean) =>
                      handleToggleActivation(activation)
                    }
                    checked={currentProfessional?.ActivationStatus}
                    allow={true}
                  />
                </span>
                <span style={{ marginLeft: "10px" }}>
                  <CustomEditBtn onEdit={() => handleEdit()} />
                </span>
              </div>
            </div>

            {status === "Applied" ? (
              <div className="application-wrapper d-flex align-items-center select-view">
                <span style={{ marginRight: "5px" }} className="text-nowrap">
                  Application Status:
                </span>
                <CustomSelect
                  id="category"
                  styles={submissionHeaderDropdowns}
                  name="category"
                  placeholder=""
                  noOptionsMessage={() => "No Category Found"}
                  // isClearable={true}
                  isSearchable={false}
                  options={roleOption}
                  onChange={(option) => handleStatusChanged(option)}
                  value={selectedStatus}
                />
              </div>
            ) : (
              <div className="application-wrapper d-flex align-items-center select-view">
                <span
                  style={{
                    marginRight: "5px",
                  }}
                  className="text-nowrap"
                >
                  Application Status:
                </span>
                <span
                  style={{
                    color: status ? getStatusColor(status) : "#000",
                    borderColor: status ? getStatusColor(status) : "#000",
                    marginLeft: "10px",
                    border: "1px solid",
                    padding: "0.8rem 0.5rem",
                    borderRadius: "5px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  {status}
                </span>
              </div>
            )}
          </div>
          <div className="second-section-content d-flex align-items-center">
            <div>
              <span className="main-text">Phone:</span>
              <span>
                {formatPhoneNumber(
                  currentProfessional?.Phone ? currentProfessional?.Phone : ""
                )}
              </span>
            </div>
            <div>
              <span className="main-text">Email:</span>
              <span>
                {currentProfessional?.Email ? currentProfessional?.Email : ""}
              </span>
            </div>
          </div>
          <div className="second-section-content">
            <span>
              <span className="main-text">Address:</span>
              {currentProfessional?.Address ? currentProfessional?.Address : ""}
            </span>
          </div>
          <div className="second-section-content">
            <span className="main-text">Preferred Job Location:</span>
            {currentProfessional?.PreferredLocations.map((location, index) => {
              return (
                <span key={index}>
                  {location.State.State}
                  {index < currentProfessional?.PreferredLocations.length - 1
                    ? ", "
                    : ""}
                </span>
              );
            })}
          </div>
          <div className="second-section-content">
            <span>
              <span className="main-text">Profession:</span>
              {currentProfessional?.JobProfession.Profession ? (
                currentProfessional?.JobProfession.Profession
              ) : (
                <span>None</span>
              )}
            </span>
            <span className="main-text">Speciality:</span>
            <span>
              {currentProfessional?.JobSpeciality.Speciality ? (
                currentProfessional?.JobSpeciality.Speciality
              ) : (
                <span>None</span>
              )}
            </span>

            <span className="main-text">Experience:</span>
            <span>
              {currentProfessional?.Experience
                ? currentProfessional?.Experience
                : "None"}{" "}
              Years
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubmissionHeadingInfo;
