import { Button } from "reactstrap";
import Footer from "../../../components/talentlayout/footer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import PersonIcon from "../../../assets/images/progress-person-img.png";
import CustomInput from "../../../components/custom/CustomInput";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProfessionalProfile } from "../../../services/ProfessionalAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthDetails,
  getProfilePercentage,
  setAuthDetails,
  setProfilePercentage,
} from "../../../store/ProfessionalAuthStore";
import { authDetails } from "../../../types/StoreInitialTypes";
import moment from "moment";
import {
  capitalize,
  getFileExtension,
  maxFileSize,
  showToast,
  validFileExtensions,
} from "../../../helpers";
import { uploadImageProfessionals } from "../../../services/ProfessionalMyProfile";
import Loader from "../../../components/custom/CustomSpinner";
import { ProfessionalProfilePercentType } from "../../../types/ProfessionalAuth";
import {
  getAssignmentList,
  getProfessionalOffered,
  getSuggestedJobsList,
} from "../../../services/HomeServices";
import SuggestedJobs from "./SuggestedJobs";
import UpcomingAssignment from "./UpcomingAssignment";
import OfferDetailsModal from "../gigs/OfferDetailsModal";
import ViewUpcomingAssignment from "./ViewUpcomingAssignment";

const Index = () => {
  const dispatch = useDispatch();
  const perPage = 3;
  const pageRef = useRef<number>(1);
  const [modal, setModal] = useState<boolean>(false);
  const [viewUpcomingAssignmentModal, setViewUpcomingAssignmentModal] =
    useState<boolean>(false);
  const authDetails: authDetails[] = useSelector(getAuthDetails);
  const [image, setImage] = useState<File | undefined>();
  const [imageURL, setImageURL] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const profilePercentage = useSelector(getProfilePercentage);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [offeredList, setOfferedList] = useState<OfferedList[]>([]);
  const [assignmentList, setAssignmentList] = useState<AssignmentList[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [suggestedJobList, setSuggestedJobList] = useState<{
    total: number;
    data: SuggestedJob[];
  }>({
    total: 0,
    data: [],
  });
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

  const currentTime = moment();
  const currentHour = currentTime.hour();

  let greeting;
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 16) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  const fetchMoreSuggestedJobs = async () => {
    try {
      pageRef.current += 1;
      const response = await getSuggestedJobsList(perPage, pageRef.current);

      setSuggestedJobList(
        (prevJobList: { total: number; data: SuggestedJob[] }) => {
          const newJobList = [
            ...prevJobList.data,
            ...response?.rows?.filter(
              (newJob: SuggestedJob) =>
                !prevJobList.data.some(
                  (prevJob: SuggestedJob) => prevJob?.Id === newJob?.Id
                )
            ),
          ];
          return {
            total: response?.count,
            data: newJobList,
          };
        }
      );
    } catch (error: any) {
      showToast("error", error?.response?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("loading");
        const [
          professionalProfile,
          fetchOffered,
          fetchAssignmentList,
          fetchSuggestedJobs,
        ] = await Promise.allSettled([
          getProfessionalProfile(),
          getProfessionalOffered(),
          getAssignmentList(),
          getSuggestedJobsList(perPage, pageRef.current),
        ]);

        if (professionalProfile.status === "fulfilled") {
          dispatch(setAuthDetails(professionalProfile.value.data?.data));
          dispatch(
            setProfilePercentage(
              professionalProfile.value.data?.data[0]?.profilePercentage
            )
          );
          const imageUrlFromApi: string =
            professionalProfile.value.data?.data[0]?.image;

          if (imageUrlFromApi) {
            setImageURL(imageUrlFromApi);
            setImageLoading(false);
          } else {
            setImageURL(PersonIcon);
            setImageLoading(false);
          }
        }
        if (fetchOffered.status === "fulfilled") {
          setOfferedList(fetchOffered.value.data.data);
        }
        if (fetchAssignmentList.status === "fulfilled") {
          setAssignmentList(fetchAssignmentList.value.data.data);
        }
        if (fetchSuggestedJobs.status === "fulfilled") {
          try {
            setSuggestedJobList({
              data: fetchSuggestedJobs.value?.rows || [],
              total: fetchSuggestedJobs.value?.count,
            });
          } catch (error: any) {
            setLoading("error");
            showToast(
              "error",
              error?.response?.message || "Something went wrong"
            );
          }
        }
        setLoading("idle");
      } catch (error: any) {
        setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };

    fetchData();
  }, []);

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
    uploadImage();
  }, [image]);

  const offeredName = (val: string) => {
    if (val === "Offered" || val === "Extension Offered") {
      return `You have an offer with`;
    } else if (val === "Pending Updated Placement") {
      return `You have a pending updated placement with`;
    } else if (val === "Pending Updated Extension Placement") {
      return `You have a pending updated extension placement with`;
    }
  };
  const viewOfferedName = (val: string) => {
    if (val === "Offered" || val === "Extension Offered") {
      return `View Offer`;
    } else if (
      val === "Pending Updated Placement" ||
      val === "Pending Updated Extension Placement"
    ) {
      return `View Details`;
    }
  };

  const toggleOfferDetailsModal = () => {
    setModal((prev) => !prev);
    getProfessionalOffered().then((val) => {
      if (val.status === 200) {
        setOfferedList(val.data.data);
      }
    });
  };
  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="common-layout-margin white-bg calculated-height">
        <div className="home-full-bg">
          <div className="main-home-flex">
            <div className="home-left-side facility-header-wrap professional-header">
              <div className="progress-wr content-wrapper">
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
              <div className="info-wrapper">
                <p>{greeting},</p>
                <h2 className="text-capitalize">
                  {" "}
                  {`${authDetails?.[0]?.FirstName || ""} ${
                    authDetails?.[0]?.LastName || ""
                  }`}
                </h2>
              </div>
            </div>
            {offeredList.length > 0 && (
              <div className="congratulation-box">
                {offeredList[0].JobApplicationStatus.Status === "Offered" && (
                  <p className="fs-16 fw-600">Congratulations..!!</p>
                )}
                <p className="mb-3 fw-500">
                  {offeredName(offeredList[0].JobApplicationStatus.Status)}{" "}
                  {offeredList[0]?.Facility?.Name
                    ? capitalize(offeredList[0].Facility.Name)
                    : ""}
                </p>
                <Button
                  className="yellow-btn me-3 mb-0"
                  onClick={toggleOfferDetailsModal}
                >
                  {viewOfferedName(offeredList[0].JobApplicationStatus.Status)}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="home-jobs-wr">
          <SuggestedJobs
            suggestedJobList={suggestedJobList}
            callBack={fetchMoreSuggestedJobs}
            perPage={perPage}
            pageNo={pageRef.current}
            loading={loading}
          />

          {assignmentList.length > 0 && (
            <UpcomingAssignment
              assignmentList={assignmentList}
              selectedItem={(val: any) => {
                setSelectedItem([val]);
                setViewUpcomingAssignmentModal((prev) => !prev);
              }}
            />
          )}
        </div>
        <Footer />
      </div>
      {modal && (
        <OfferDetailsModal
          isOpen={modal}
          toggle={toggleOfferDetailsModal}
          offeredData={offeredList[0]}
        />
      )}
      {viewUpcomingAssignmentModal && (
        <ViewUpcomingAssignment
          isOpen={viewUpcomingAssignmentModal}
          toggle={() => setViewUpcomingAssignmentModal((prev) => !prev)}
          assignmentList={selectedItem[0]}
        />
      )}
    </>
  );
};

export default Index;
