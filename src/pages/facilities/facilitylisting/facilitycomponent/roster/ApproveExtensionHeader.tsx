import CustomInput from "../../../../../components/custom/CustomInput";
import { capitalize } from "../../../../../helpers";
import profile from "./../../../../../assets/images/camera.svg";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import { getStatusColor } from "../../../../../constant/StatusColors";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import CustomCloseButton from "../../../../../components/custom/CustomCloseButton";

type ApproveExtensionHeaderProps = {
  professional: ProfessionalDetails;
  professionalId: number;
  jobDetails: RightJobContentData;
  currentStatus: string;
  edit?: boolean;
  setEdit?: (edit: boolean) => void;
};

const ApproveExtensionHeader = ({
  professional,
  professionalId,
  jobDetails,
  currentStatus,
  edit,
  setEdit,
}: ApproveExtensionHeaderProps) => {
  return (
    <div className="facility-header-wrap p-2 mb-3 mt-3">
      <div className="">
        <div className="View-profile-section">
          <div className="d-flex">
            <img
              src={
                professional?.ProfileImage ? professional.ProfileImage : profile
              }
              style={{
                borderRadius: "50%",
                height: "4rem",
                width: "4rem",
                backgroundColor: "#f4f4f4",
              }}
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
                value={`Job ID: ${jobDetails.Id}`}
                className="in-width input"
                style={{
                  marginRight: "10px",
                }}
              />
              <CustomEditBtn
                onEdit={() => {
                  setEdit && setEdit(true);
                }}
                disabled={
                  currentStatus === "Declined by Professional" ||
                  currentStatus === "Declined by Facility" ||
                  currentStatus === "Declined by Gig" ||
                  currentStatus === "Facility Termination" ||
                  currentStatus === "Professional Termination" ||
                  currentStatus === "Gig Termination" ||
                  currentStatus === "Past Placement"
                    ? true
                    : false
                }
              />
              {edit && (
                <CustomCloseButton
                  onEdit={() => {
                    setEdit && setEdit(true);
                  }}
                />
              )}
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
                padding: "0.5rem 0.5rem",
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
export default ApproveExtensionHeader;
