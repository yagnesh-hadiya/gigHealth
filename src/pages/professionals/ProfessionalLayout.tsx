import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProfessionalSidebar from "./ProfessionalSidebar";
import ProfessionalData from "./ProfessionalData";
import { useDispatch, useSelector } from "react-redux";
import {
  getFetchDetails,
  getName,
  setHeaderDetails,
  setName,
  setProfessionalStatus,
} from "../../store/ProfessionalDetailsSlice";
import ProfessionalGigHistory from "./GigHistory/ProfessionalGigHistory";
import ProfessionalDocuments from "./Documents/ProfessionalDocuments";
import AdditionalDetails from "./AdditionalDetails/AdditionalDetails";
import ProfessionalNotes from "./ProfessionalNotesAndActivity";
import ProfessionalOnboarding from "./ProfessionalOnboarding/ProfessionalOnboarding";
import ProfessionalHeader from "./ProfessionaHeader";
import {
  fetchProfessionalHeaderDetails,
  getProfessionalStatus,
} from "../../services/ProfessionalDetails";
import Camera from "../../assets/images/camera.svg";
import { showToast } from "../../helpers";
import { removeActiveMenu } from "../../helpers/tokens";

const ProfessionalLayout = () => {
  const [activeComponent, setActiveComponent] = useState<string>("");
  const headerName: string = useSelector(getName);
  const params = useParams();
  const dispatch = useDispatch();
  const [imageURL, setImageURL] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [selectedProgramManager, setSelectedProgramManager] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const fetchDetails = useSelector(getFetchDetails);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/professionals");
    removeActiveMenu();
  };

  useEffect(() => {
    try {
      Promise.all([
        fetchProfessionalHeaderDetails(Number(params.Id)),
        getProfessionalStatus(),
      ])
        .then(([details, status]) => {
          dispatch(setHeaderDetails(details.data?.data));
          dispatch(setProfessionalStatus(status.data?.data));
          dispatch(
            setName(
              `${details.data?.data[0]?.FirstName} ${details.data?.data[0]?.LastName}`
            )
          );

          const imageUrlFromApi: string = details.data?.data[0]?.ProfileImage;
          if (imageUrlFromApi) {
            setImageURL(imageUrlFromApi);
            setImageLoading(false);
          } else {
            setImageURL(Camera);
            setImageLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        });
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [
    dispatch,
    params.Id,
    selectedEmploymentType,
    selectedProgramManager,
    fetchDetails,
  ]);

  const componentMapping: { [key: string]: React.ReactNode } = {
    "Profile Details": <ProfessionalData />,
    "Notes & Activity": <ProfessionalNotes />,
    "Gig History": <ProfessionalGigHistory />,
    Onboarding: <ProfessionalOnboarding />,
    Documents: <ProfessionalDocuments />,
    "Additional Details": <AdditionalDetails />,
  };

  return (
    <>
      <div className="navigate-wrapper">
        <Link to="" onClick={handleNavigate} className="link-btn">
          Professionals
        </Link>
        <span className="text-capitalize">
          {" "}
          / {headerName ? headerName : "--"}{" "}
        </span>
      </div>

      <div className="sidebar-section-wrapper template-sidebar">
        <div className="leftside">
          <ProfessionalSidebar
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
        </div>
        <div className="rightside">
          <ProfessionalHeader
            imageLoading={imageLoading}
            imageURL={imageURL}
            selectedProgramManager={selectedProgramManager}
            setSelectedProgramManager={setSelectedProgramManager}
            selectedEmploymentType={selectedEmploymentType}
            setSelectedEmploymentType={setSelectedEmploymentType}
          />
          <div className="facility-listing-wrapper mt-3 main-section">
            {componentMapping[activeComponent]}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalLayout;
