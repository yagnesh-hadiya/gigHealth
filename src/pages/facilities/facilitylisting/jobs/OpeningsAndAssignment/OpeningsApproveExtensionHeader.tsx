import CustomInput from "../../../../../components/custom/CustomInput";
import { capitalize } from "../../../../../helpers";
import profile from "./../../../../../assets/images/camera.svg";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import { getStatusColor } from "../../../../../constant/StatusColors";

type OpeningsApproveExtensionHeaderProps = {
  professional: ProfessionalDetails;
  professionalId: number;
  jobId: number;
  currentStatus: string;
};

const OpeningsApproveExtensionHeader = ({
  professional,
  professionalId,
  jobId,
  currentStatus,
}: OpeningsApproveExtensionHeaderProps) => {
  return (
    <div className="facility-header-wrap p-2 mb-3">
      <div className="">
        <div className="View-profile-section">
          <div className="d-flex">
            <img
              src={
                professional?.ProfileImage ? professional.ProfileImage : profile
              }
              style={{ borderRadius: "50%" }}
            />
            <div className="first-section-content">
              <h1 className="hospital-name text-nowrap">
                {capitalize(
                  professional?.FirstName ? professional?.FirstName : ""
                )}{" "}
                {capitalize(
                  professional?.LastName ? professional?.LastName : ""
                )}
              </h1>
              <CustomInput
                placeholder=""
                disabled
                value={`PID-${professionalId}`}
                className="in-width input"
                style={{
                  marginRight: "10px",
                }}
              />
              <CustomInput
                placeholder=""
                disabled
                value={`Job ID: ${jobId}`}
                className="job-width input"
                style={{
                  marginRight: "10px",
                }}
              />
            </div>
          </div>
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
                color: getStatusColor(currentStatus),
                borderColor: getStatusColor(currentStatus),
                marginLeft: "10px",
                border: "1px solid",
                padding: "0.8rem 0.5rem",
                borderRadius: "5px",
                backgroundColor: "#fafafa",
              }}
            >
              {currentStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OpeningsApproveExtensionHeader;
