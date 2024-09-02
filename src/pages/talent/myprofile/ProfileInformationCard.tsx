import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Button, Card, CardBody } from "reactstrap";
import PersonIcon from "../../../assets/images/progress-white-person-img.png";
import CustomInput from "../../../components/custom/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthDetails,
  getProfilePercentage,
  setAuthDetails,
  setIsloggedIn,
  setProfilePercentage,
} from "../../../store/ProfessionalAuthStore";
import { useNavigate } from "react-router-dom";
import {
  clearCookies,
  getLoggedInStatus,
  getProfessionalProfile,
} from "../../../services/ProfessionalAuth";
import { useEffect, useMemo, useState } from "react";
import {
  formatPhoneNumber,
  getFileExtension,
  maxFileSize,
  showToast,
  validFileExtensions,
} from "../../../helpers";
import { uploadImageProfessionals } from "../../../services/ProfessionalMyProfile";
import Loader from "../../../components/custom/CustomSpinner";
import { PreferredLocation } from "../../../types/StoreInitialTypes";
import ProfileInformationModal from "./modals/ProfileInformationModal";
import { ProfessionalProfilePercentType } from "../../../types/ProfessionalAuth";
import { ProfileInformationCardProps } from "../../../types/ProfessionalDetails";

const ProfileInformationCard = ({
  fetchDetails,
}: ProfileInformationCardProps) => {
  const authDetails = useSelector(getAuthDetails);
  const navigate = useNavigate();
  const isLoggedIn = getLoggedInStatus();
  const dispatch = useDispatch();
  const [image, setImage] = useState<File | undefined>();
  const [imageURL, setImageURL] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const profilePercentage = useSelector(getProfilePercentage);

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
    () => calculatePercentage(profilePercentage ? profilePercentage : null),
    [profilePercentage]
  );

  useEffect(() => {
    if (isLoggedIn === "1") {
      navigate("/talent/my-profile");
    } else {
      clearCookies();
      localStorage.removeItem("isLoggedIn");
      dispatch(setIsloggedIn(false));
      navigate("/talent/login");
    }
  }, [isLoggedIn]);

  const fetchValue = async () => {
    try {
      const response = await getProfessionalProfile();
      dispatch(setAuthDetails(response.data?.data));
      dispatch(setProfilePercentage(response.data?.data[0]?.profilePercentage));
      const imageUrlFromApi: string = response.data?.data[0]?.image;

      if (imageUrlFromApi) {
        setImageURL(imageUrlFromApi);
        setImageLoading(false);
      } else {
        setImageURL(PersonIcon);
        setImageLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn === "1") {
      fetchValue();
    }
  }, [authDetails.length < 0, fetchDetails]);

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
        try {
          const upload = await uploadImageProfessionals(image);
          if (upload?.status === 200) {
            showToast(
              "success",
              "Profile image uploaded successfully" || upload.data?.message
            );
            return true;
          } else {
            console.error(upload);
            return showToast("error", "Failed to upload profile image");
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
    uploadImage();
  }, [image]);

  const onEditHandler = () => {
    setEdit((prevEdit) => !prevEdit);
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

  return (
    <>
      <div>
        <Card className="profile-info-card">
          <CardBody className="profile-info-card-body card-flex">
            <div className="facility-header-wrap professional-header profile-progressbar">
              <div className="progress-wr content-wrapper">
                <div className="progress-bar-section">
                  <div className="position-relative ">
                    <CircularProgressbar
                      value={averageRating ? averageRating : 0}
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
                          <div className="file-camera-img backend-profile-imgurl file-camera-flex">
                            <img
                              src={PersonIcon}
                              alt="camera-img"
                              style={{ borderRadius: "50%" }}
                              className=""
                            />
                          </div>
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
                      {!imageLoading && imageURL && !image && (
                        <img
                          src={imageURL}
                          alt="facilityPicture"
                          className="file-camera-img backend-profile-imgurl"
                          style={{ borderRadius: "50%" }}
                        />
                      )}
                      {!imageLoading && !imageURL && !image && (
                        <div className="file-camera-img backend-profile-imgurl file-camera-flex">
                          <img
                            src={imageURL}
                            alt="camera-img"
                            style={{ borderRadius: "50%" }}
                            className=""
                          />
                        </div>
                      )}
                      <CustomInput
                        id="facilityPicture"
                        type="file"
                        className="backend-profile-imgurl"
                        title="Click here to upload"
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
            </div>
            <div className="w-100">
              <div
                className="d-flex align-items-center flex-wrap mb-2"
                style={{ gap: "8px 10px" }}
              >
                <h2 className="user_name mb-0 text-capitalize">
                  {authDetails ? authDetails[0]?.FirstName : "-"}{" "}
                  {authDetails ? authDetails[0]?.LastName : "-"}
                </h2>
                <Button
                  type="button"
                  className="dt-talent-btn"
                  onClick={() => onEditHandler()}
                >
                  <span className="material-symbols-outlined">Edit</span>
                </Button>
                <div className="user-info-badge">
                  <span className="fw-500 me-2">
                    Professional/Referral ID :
                  </span>
                  {`PID-${authDetails ? authDetails[0]?.Id : "-"}`}
                </div>
              </div>
              <div
                className="d-flex align-items-center flex-wrap m-b-12"
                style={{ gap: "8px 20px" }}
              >
                <p className="mb-0">
                  Phone:{" "}
                  <span className="fw-400">
                    {authDetails
                      ? formatPhoneNumber(authDetails[0]?.Phone)
                      : "-"}
                  </span>
                </p>
                <p className="mb-0">
                  Email:{" "}
                  <span className="fw-400">
                    {authDetails ? authDetails[0]?.Email : "-"}
                  </span>
                </p>
                <p className="mb-0">
                  Address:{" "}
                  <span className="fw-400">
                    {authDetails ? authDetails[0]?.Address : "-"},{" "}
                    {authDetails ? authDetails[0]?.State?.State : "-"}{" "}
                    {authDetails ? authDetails[0]?.ZipCode?.ZipCode : "-"}
                  </span>
                </p>
                <p className="mb-0">
                  Profession:{" "}
                  <span className="fw-400">
                    {authDetails
                      ? authDetails[0]?.JobProfession?.Profession
                      : "-"}
                  </span>
                </p>

                <p className="mb-0">
                  Speciality:{" "}
                  <span className="fw-400">
                    {authDetails
                      ? authDetails[0]?.JobSpeciality?.Speciality
                      : "-"}
                  </span>
                </p>
                <p className="mb-0">
                  Experience:{" "}
                  <span className="fw-400">
                    {authDetails ? authDetails[0]?.Experience : "-"}{" "}
                    {authDetails ? "Years" : "-"}
                  </span>
                </p>
                <p className="mb-0">
                  <span style={{ color: "#262638" }}>
                    Preferred Job Location:{" "}
                  </span>
                  <span className="fw-400">
                    {authDetails.length > 0 &&
                      authDetails[0]?.PreferredLocations?.map(
                        (location: PreferredLocation, index) => (
                          <span className="me-1">{`${location?.State?.State}
                              ${
                                index <
                                authDetails[0]?.PreferredLocations?.length - 1
                                  ? ","
                                  : ""
                              }`}</span>
                        )
                      )}
                  </span>
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      {edit && (
        <ProfileInformationModal
          authDetails={authDetails[0]}
          isOpen={edit}
          toggle={() => setEdit(false)}
          fetch={fetchValue}
        />
      )}
    </>
  );
};

export default ProfileInformationCard;
