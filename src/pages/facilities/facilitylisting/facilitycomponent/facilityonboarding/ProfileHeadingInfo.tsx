import { useState } from "react";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import ToggleSwitch from "../../../../../components/custom/CustomToggle";
// import SmsIcon from "../../../../../components/icons/Sms";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { headerDropdown } from "../../../../../helpers";
import profile from "./../../../../../assets/images/profile.png";

const ProfileHeadingInfo = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const roleOption = [
    { value: 1, label: "Approve Extension" },
    { value: 2, label: "Resend" },
    { value: 3, label: "Cancel Request" },
  ];
  const handleStatusChanged = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
  };
  return (
    <div
      className="facility-header-wrap professional-header"
      style={{
        paddingTop: "12px",
        paddingBottom: "12px",
      }}
    >
      <div className="content-wrapper">
        <div className="facility-camera-wrapper round-image position-relative header-hospital-img-wrap">
          <div className="facility-camera-wrapper round-image  position-relative header-hospital-img-wrap">
            <img
              src={profile}
              alt="facilityPicture"
              style={{ borderRadius: "50%" }}
            />
          </div>
        </div>
      </div>
      <div className="details-wrapper">
        <div className="header-wrapper">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="first-section-content flex-wrap">
              <h1 className="hospital-name">Dona Horrison </h1>
              <CustomInput
                placeholder=""
                disabled
                value="HRN458587"
                className="in-width"
                style={{
                  marginRight: "10px",
                }}
              />
              {/* <div className=" note-wrapper button-width" style={{ marginRight: '13px' }}>
                <button
                  className=" msg-btn btn-style">
                  <SmsIcon color="#FFF" /> Messages
                </button>
              </div> */}
              <div className="d-flex flex-wrap align-items-center">
                <div className="d-flex align-items-center">
                  <span>Account Status:</span>
                  <span
                    className="toggle-position"
                    style={{ marginLeft: "px" }}
                  >
                    <ToggleSwitch
                      onStateChange={() => {}}
                      checked={true}
                      allow={true}
                    />
                  </span>
                </div>
                <span style={{ marginLeft: "10px" }}>
                  <CustomEditBtn onEdit={() => {}} />
                </span>
              </div>
            </div>
            <div className="application-wrapper d-flex align-items-center">
              <span style={{ marginRight: "5px" }} className="text-nowrap">
                {" "}
                Application Status:
              </span>
              <CustomSelect
                id="category"
                styles={headerDropdown}
                name="category"
                placeholder=""
                noOptionsMessage={() => "No Category Found"}
                isClearable={true}
                isSearchable={false}
                options={roleOption}
                onChange={handleStatusChanged}
                value={selectedStatus}
              />
            </div>
          </div>
          <div className="second-section-content">
            <span>
              <span className="main-text">Phone: </span>
              Phone: 386-271-5477
            </span>
            <span>
              <span className="main-text">Email: </span>
              charlestwest@jourrapide.com
            </span>
          </div>
          <div className="second-section-content">
            <span>
              <span className="main-text">Address: </span>
              155 Willis Avenue Mac Holly Hill, FL 32117
            </span>
          </div>
          <div className="second-section-content">
            <span>
              <span className="main-text">Profession: </span>
              Registered Nurse
            </span>
            <span>
              <span className="main-text">Speciality: </span>
              ICU Care Unit Nurse
            </span>
            <span>
              <span className="main-text">Experience: </span>4 Years
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeadingInfo;
