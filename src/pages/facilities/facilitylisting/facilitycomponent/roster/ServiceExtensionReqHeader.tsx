import CustomInput from "../../../../../components/custom/CustomInput";
import { capitalize } from "../../../../../helpers";
import profile from "./../../../../../assets/images/camera.svg";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import { getStatusColor } from "../../../../../constant/StatusColors";

type ServiceExtensionReqHeaderProps = {
  professional: ProfessionalDetails;
  currentStatus: string;
  professionalId: number;
  jobId: number;
};

const ServiceExtensionReqHeader = ({
  professional,
  currentStatus,
  professionalId,
  jobId,
}: ServiceExtensionReqHeaderProps) => {
  return (
    <div className="facility-header-wrap p-2 mb-3">
      <div className="">
        <div className="View-profile-section">
          <div className="d-flex">
            <img
              src={
                professional.ProfileImage ? professional.ProfileImage : profile
              }
              alt="facilityPicture"
              style={{ borderRadius: "50%" }}
            />
            <div className="first-section-content">
              <h1 className="hospital-name text-nowrap">
                {capitalize(professional?.FirstName)}{" "}
                {capitalize(professional?.LastName)}
              </h1>
              <CustomInput
                placeholder=""
                disabled
                value={`PID: ${professionalId}`}
                className="in-width input"
                style={{
                  marginRight: "10px",
                }}
              />
              <CustomInput
                placeholder=""
                disabled
                value={`Job ID: JID-0${jobId}`}
                className="in-width input"
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
                padding: "0.4rem 0.5rem",
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
export default ServiceExtensionReqHeader;
