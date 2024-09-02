import {
  checkAclPermission,
  debounce,
  formatPhoneNumber,
  getFileExtension,
  maxFileSize,
  showToast,
  validFileExtensions,
} from "../../helpers";
import CustomInput from "../../components/custom/CustomInput";
// import SmsIcon from "../../components/icons/Sms";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import { useNavigate, useParams } from "react-router-dom";
import { memo, useEffect, useMemo, useState } from "react";
import Loader from "../../components/custom/CustomSpinner";
import {
  toggleActivation,
  uploadImageToProfessionals,
} from "../../services/ProfessionalDetails";
import { getHeaderDetails } from "../../store/ProfessionalDetailsSlice";
import { useSelector } from "react-redux";
import {
  PreferredLocation,
  ProfessionalDetails,
} from "../../types/StoreInitialTypes";
import ProgramManagerModal from "./ProfessionalsModals/ProgramManagerModal";
import EmploymentExpertModal from "./ProfessionalsModals/EmploymentExpertModal";
import Camera from "../../assets/images/camera.svg";
import ProfessionalToggleSwitch from "./ProfessionalToggleSwtch";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ACL from "../../components/custom/ACL";
import { ProfessionalHeaderDataProps } from "../../types/ProfessionalDetails";
import { ProfessionalProfilePercentType } from "../../types/ProfessionalAuth";

const ProfessionalHeader = ({
  imageLoading,
  imageURL,
  selectedProgramManager,
  setSelectedProgramManager,
  selectedEmploymentType,
  setSelectedEmploymentType,
}: ProfessionalHeaderDataProps) => {
  const params = useParams();
  const headerDetails: ProfessionalDetails[] = useSelector(getHeaderDetails);
  const [programManagerModal, setProgramManagerModal] =
    useState<boolean>(false);
  const [employmentExpertModal, setEmploymentExpertModal] =
    useState<boolean>(false);
  const [image, setImage] = useState<File | undefined>();
  const allow = checkAclPermission("professionals", "details", ["GET", "PUT"]);

  const navigate = useNavigate();

  const toggleProgramManager = () =>
    setProgramManagerModal((prevModal: boolean) => !prevModal);
  const toggleEmploymentExpert = () =>
    setEmploymentExpertModal((prevModal: boolean) => !prevModal);

  const calculatePercentage = (
    profilePercentage: ProfessionalProfilePercentType | null
  ) => {
    let totalSum = 0;
    let numberOfRatings = 0;

    if (profilePercentage) {
      for (const rating of Object.values(profilePercentage)) {
        if (rating && rating !== 0) {
          totalSum += rating;
          numberOfRatings = Object.keys(profilePercentage)?.length;
        }
      }
    }

    const averageRating = Math.floor(
      numberOfRatings > 0 ? totalSum / numberOfRatings : 0
    );

    return averageRating;
  };

  const averageRating = useMemo(
    () =>
      calculatePercentage(
        headerDetails ? headerDetails[0]?.profilePercentage : null
      ),
    [headerDetails[0]?.profilePercentage]
  );

  const handleToggleActivation = debounce(async (activation: boolean) => {
    try {
      const response = await toggleActivation(Number(params?.Id), activation);
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
  }, 200);

  const handleEdit = () => {
    navigate(`/professionals/edit/${params?.Id}`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage: File | undefined = e.target?.files?.[0];
    if (selectedImage) {
      const fileExtension = getFileExtension(selectedImage);
      if (fileExtension !== undefined) {
        if (
          !fileExtension ||
          !validFileExtensions.facilityPicture.includes(fileExtension)
        ) {
          showToast("error", "Supported formats are only .jpg, .jpeg, .png");
          return;
        }
      }
      const fileSizeMb: number = selectedImage.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
        return;
      }
      setImage(selectedImage);
    }
  };

  const uploadImage = async () => {
    if (image) {
      try {
        const upload = await uploadImageToProfessionals(
          Number(params?.Id),
          image
        );
        if (upload?.status === 200) {
          showToast(
            "success",
            "Profile image uploaded successfully" || upload.data?.message
          );
          return true;
        } else {
          console.error(upload);
          return showToast("error", "Failed to upload facility image");
        }
      } catch (error: any) {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  useEffect(() => {
    uploadImage();
  }, [image]);

  return (
    <>
      {headerDetails && headerDetails.length > 0 && (
        <>
          <div>
            <div
              className="facility-header-wrap d-flex align-items-center professional-header border-bottom"
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
            >
              <div className="content-wrapper">
                <div className="progress-bar-section">
                  <div className="position-relative ">
                    <CircularProgressbar
                      value={averageRating}
                      strokeWidth={6}
                      counterClockwise={true}
                      styles={buildStyles({
                        pathColor: `${
                          averageRating === 100 ? `#47B749` : `#FBAE17`
                        }`,
                      })}
                    />

                    <div
                      className="profile-wrapper p-2"
                      style={{
                        marginTop: "7px",
                        marginLeft: "7px",
                        // position: "absolute",
                        // top: "0",
                      }}
                    >
                      {imageLoading && (
                        <div>
                          <Loader />
                        </div>
                      )}
                      {image && (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="camera-img"
                          style={{ borderRadius: "50%" }}
                          className="file-camera-img backend-profile-imgurl"
                        />
                      )}
                      {/* {imageLoading && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Loader />
                      </div>
                    )} */}

                      {!imageLoading && imageURL && !image && (
                        <img
                          src={imageURL}
                          alt="facilityPicture"
                          className="file-camera-img backend-profile-imgurl"
                          style={{ borderRadius: "50%" }}
                        />
                      )}

                      {!imageLoading && !imageURL && !image && (
                        <img
                          src={Camera}
                          alt="camera-img"
                          // className="file-camera-img"
                          // width={"54"}
                          // height={"54"}
                          style={{ borderRadius: "50%", width: "110px" }}
                        />
                      )}

                      <CustomInput
                        id="facilityPicture"
                        type="file"
                        className="backend-profile-imgurl"
                        title="Click here to upload"
                        disabled={!allow}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleImageUpload(e)
                        }
                      />
                    </div>
                    <span
                      className="percentage"
                      style={{
                        backgroundColor:
                          averageRating === 100 ? `#47B749` : `#FBAE17`,
                      }}
                    >
                      {averageRating}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="details-wrapper">
                <div className="header-wrapper ">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="first-section-content flex-wrap">
                      <h1 className="hospital-name">
                        <span className="text-capitalize">
                          {headerDetails.length > 0 &&
                            `${headerDetails[0]?.FirstName} ${headerDetails[0]?.LastName}`}
                        </span>
                      </h1>
                      {headerDetails.length > 0 && (
                        <CustomInput
                          placeholder=""
                          disabled
                          value={
                            params?.Id ? `PID-${Number(params?.Id)}` : "--"
                          }
                          className="in-width"
                          style={{ marginRight: "10px" }}
                        />
                      )}
                      {/*
                      <div
                        className=" note-wrapper button-width"
                        style={{ marginRight: "13px" }}
                      >
                        <button className=" msg-btn btn-style">
                          <SmsIcon color="#FFF" /> Messages
                        </button>
                      </div> */}
                      <div className="d-flex align-items-center">
                        <span className="text-nowrap">Account Status:</span>
                        <span
                          className="toggle-position"
                          style={{ marginLeft: "5px" }}
                        >
                          {headerDetails.length > 0 && (
                            <ACL
                              submodule={"details"}
                              module={"professionals"}
                              action={["GET", "PUT"]}
                            >
                              <ProfessionalToggleSwitch
                                onStateChange={(activation: boolean) =>
                                  handleToggleActivation(activation)
                                }
                                checked={headerDetails[0]?.ActivationStatus}
                                allow={true}
                              />
                            </ACL>
                          )}
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                          <ACL
                            submodule={""}
                            module={"professionals"}
                            action={["GET", "PUT"]}
                          >
                            <CustomEditBtn onEdit={() => handleEdit()} />
                          </ACL>
                        </span>
                      </div>
                    </div>
                    <div className="application-wrapper d-flex align-items-center me-4">
                      <span
                        className="text-nowrap"
                        style={{ marginRight: "5px" }}
                      >
                        Professional Status:
                      </span>
                      <span
                        style={{
                          padding: "0.75rem 0.9rem",
                          borderRadius: "5px",
                          backgroundColor: "#F7F8F3",
                          color: "#474D6A",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {headerDetails.length > 0 &&
                          `${headerDetails[0]?.ProfessionalStatus?.Status}`}
                      </span>
                      {/* <CustomSelect
                        id="status"
                        styles={headerRosterDropdown}
                        name="status"
                        value={
                          selectedStatus
                            ? {
                                value: selectedStatus?.Id,
                                label: selectedStatus?.Status,
                              }
                            : null
                        }
                        placeholder="Select Status"
                        noOptionsMessage={(): string => "No Status Found"}
                        isClearable={true}
                        isSearchable={false}
                        options={professionalStatus?.map(
                          (status: ProfessionalStatus): SelectOption => ({
                            value: status?.Id,
                            label: status?.Status,
                          })
                        )}
                        onChange={(data) => handleProfessionalStatus(data)}
                      /> */}
                    </div>
                  </div>
                  <div className="second-section-content header-space-text">
                    <span>
                      <span className="main-text">Phone: </span>
                      {headerDetails.length > 0 &&
                        `${formatPhoneNumber(headerDetails[0]?.Phone)}`}
                    </span>
                    <span>
                      <span className="main-text">Email: </span>
                      {headerDetails.length > 0 && `${headerDetails[0]?.Email}`}
                    </span>
                    <span>
                      <span className="main-text">Program Manager: </span>
                      <span className="text-capitalize me-2">
                        {headerDetails?.[0]?.ProgramManager
                          ? `${headerDetails[0]?.ProgramManager.FirstName} ${headerDetails[0]?.ProgramManager.LastName}`
                          : ""}
                      </span>
                      <span
                        className="text-blue fw-500"
                        onClick={toggleProgramManager}
                        style={{ cursor: "pointer" }}
                      >
                        Change
                      </span>
                      <ProgramManagerModal
                        isOpen={programManagerModal}
                        toggle={() => setProgramManagerModal(false)}
                        professionalId={Number(params?.Id)}
                        selectedProgramManager={selectedProgramManager}
                        setSelectedProgramManager={setSelectedProgramManager}
                      />
                    </span>
                    <span>
                      <span className="main-text">Employment Expert: </span>
                      <span className="text-capitalize me-2">
                        {headerDetails?.[0]?.EmploymentExpert
                          ? `${headerDetails[0]?.EmploymentExpert.FirstName} ${headerDetails[0]?.EmploymentExpert.LastName}`
                          : ""}
                      </span>
                      <span
                        className="text-blue fw-500"
                        onClick={toggleEmploymentExpert}
                        style={{ cursor: "pointer" }}
                      >
                        Change
                      </span>
                      <EmploymentExpertModal
                        isOpen={employmentExpertModal}
                        toggle={() => setEmploymentExpertModal(false)}
                        professionalId={Number(params?.Id)}
                        selectedEmploymentType={selectedEmploymentType}
                        setSelectedEmploymentType={setSelectedEmploymentType}
                      />
                    </span>
                  </div>
                  <div className="second-section-content header-space-text">
                    <span>
                      <span className="main-text">Address: </span>
                      {headerDetails.length > 0 &&
                        `${headerDetails[0]?.Address}, ${headerDetails[0]?.State?.State} ${headerDetails[0]?.ZipCode?.ZipCode}`}
                    </span>
                    <div className="d-flex flex-wrap align-items-center">
                      <span className="main-text">
                        Preferred Job Location:{" "}
                      </span>
                      <span className="d-flex flex-wrap align-items-center">
                        {headerDetails.length > 0 &&
                          headerDetails[0]?.PreferredLocations?.map(
                            (location: PreferredLocation, index) => (
                              <span className="me-1">{`${location.State?.State}
                              ${
                                index <
                                headerDetails[0]?.PreferredLocations.length - 1
                                  ? ","
                                  : ""
                              }`}</span>
                            )
                          )}
                      </span>
                    </div>
                  </div>
                  <div className="second-section-content header-space-text">
                    <div>
                      <span className="main-text">Profession: </span>
                      <span>
                        {headerDetails.length > 0 &&
                          `${headerDetails[0]?.JobProfession?.Profession}`}
                      </span>
                    </div>
                    <div>
                      <span className="main-text">Speciality: </span>
                      <span>
                        {headerDetails.length > 0 &&
                          `${headerDetails[0]?.JobSpeciality?.Speciality}`}
                      </span>
                    </div>
                    <div>
                      <span className="main-text">Experience: </span>
                      <span>
                        {headerDetails.length > 0 &&
                          `${headerDetails[0]?.Experience}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {headerDetails[0]?.QuickNotes && (
              <div
                className="bg-white border-2 quick-note"
                style={{
                  boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
                  borderRadius: "5px",
                }}
              >
                <p>
                  Quick Notes:<span>{headerDetails[0]?.QuickNotes}</span>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default memo(ProfessionalHeader);
