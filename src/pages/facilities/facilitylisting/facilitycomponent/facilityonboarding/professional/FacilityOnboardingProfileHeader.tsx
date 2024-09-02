import Camera from "../../../../../../assets/images/camera.svg";
import { ProfessionalDetails } from "../../../../../../types/StoreInitialTypes";
import Loader from "../../../../../../components/custom/CustomSpinner";
import {
  capitalize,
  debounce,
  formatPhoneNumber,
  showToast,
} from "../../../../../../helpers";
// import SmsIcon from "../../../../../../components/icons/Sms";
import CustomInput from "../../../../../../components/custom/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { getStatusColor } from "../../../../../../constant/StatusColors";
import ProfessionalToggleSwitch from "../../../../../professionals/ProfessionalToggleSwtch";
import CustomEditBtn from "../../../../../../components/custom/CustomEditBtn";
import { toggleActivation } from "../../../../../../services/ProfessionalDetails";

type FacilityOnboardingProfileHeaderProps = {
  professionalId: number;
  currentProfessional: ProfessionalDetails | null;
  status?: string;
};

const FacilityOnboardingProfileHeader = ({
  professionalId,
  currentProfessional,
  status,
}: FacilityOnboardingProfileHeaderProps) => {
  const navigate = useNavigate();
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
      <div className="details-wrapper">
        <div className="header-wrapper">
          <div className="d-flex justify-content-between align-items-center">
            <div className="first-section-content">
              <Link to={`/professionals/${professionalId}`}>
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
              </Link>
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
            {status && (
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
                    color: getStatusColor(status),
                    borderColor: getStatusColor(status),
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
export default FacilityOnboardingProfileHeader;
