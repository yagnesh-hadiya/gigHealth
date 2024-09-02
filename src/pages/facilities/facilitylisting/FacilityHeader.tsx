import CustomInput from "../../../components/custom/CustomInput";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import { FacilityDetailsList } from "../../../types/FacilityTypes";
import { useNavigate } from "react-router-dom";
import { capitalize, formatPhoneNumber } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import Camera from "../../../assets/images/camera.svg";
import ACL from "../../../components/custom/ACL";
import { memo } from "react";

const FacilityHeader = ({
  data,
  imageLoading,
  imageURL,
}: FacilityDetailsList) => {
  const navigate = useNavigate();

  const onEditHandler = (facilityId: number) => {
    navigate(`/facility/edit/${facilityId}`);
  };

  return (
    <div className="facility-header-wrap mb-3">
      <div
        className="content-wrapper align-items-center py-1"
        style={{ padding: "5px 20px !Important;" }}
      >
        <div className="facility-camera-wrapper position-relative header-hospital-img-wrap">
          {imageLoading && (
            <div className="facility-camera-wrapper position-relative header-hospital-img-wrap">
              <Loader />
            </div>
          )}
          {!imageLoading && imageURL && (
            <img
              src={`${imageURL}`}
              alt="facilityPicturedd"
              className={`file-camera-img ${
                imageURL ? "header-file-camera-img" : "header-camera"
              }`}
            />
          )}
          {!imageLoading && !imageURL && (
            <img
              src={Camera}
              alt="facilityPicturess"
              className="header-camera"
            />
          )}
        </div>
        <div className="details-wrapper ms-3">
          <div className="first-section-content">
            <h1 className="hospital-name">{capitalize(data?.Name ?? "--")}</h1>
            <CustomInput
              placeholder=""
              value={data?.Id ? `FID-${data?.Id}` : ""}
              disabled
            />
            {/* <CustomSelect
              className="custom-select-placeholder"
              value={data?.FacilityStatus}
              options={[]}
              placeholder={"Select Status"} id={""} name={""}
              noOptionsMessage={(): string => "No Facility Status"}
            /> */}
            <ACL submodule={""} module={"facilities"} action={["GET", "PUT"]}>
              <CustomEditBtn onEdit={() => onEditHandler(data?.Id ?? 0)} />
            </ACL>
            {/* <CustomDeleteBtn onDelete={function (): void {
              throw new Error("Function not implemented.");
            }} /> */}
          </div>
          <div className="second-section-content header-space-text">
            <span>
              <span className="main-text">Phone: </span>
              {formatPhoneNumber(data?.HospitalPhone ?? "")}
            </span>
            <span>
              <span className="main-text">Address: </span>
              {data?.Address ?? ""} {data?.City?.City ?? ""}{" "}
              {data?.State?.State ?? ""} {data?.ZipCode?.ZipCode ?? ""}
            </span>
            <span>
              <span className="main-text">Health System: </span>
              {data?.ParentHealthSystem
                ? capitalize(data?.ParentHealthSystem?.Name ?? "--")
                : capitalize(data?.FacilityHealthSystem?.Name ?? "--")}
            </span>
          </div>
          <div className="second-section-content header-space-text">
            <span>
              <span className="main-text">Trauma Level: </span>
              {data?.TraumaLevel?.Level}
            </span>
            <span>
              <span className="main-text">Contract Type: </span>
              {data?.ContractType?.Type}
            </span>
            <span>
              <span className="main-text">Service Type: </span>
              {data?.ServiceType?.Type}
            </span>
            <span>
              <span className="main-text">Program Manager: </span>
              {`${capitalize(
                data?.ProgramManager?.FirstName ?? "-"
              )} ${capitalize(data?.ProgramManager?.LastName ?? "-")}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FacilityHeader);
