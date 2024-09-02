import { useContext, useEffect, useState } from "react";
import FacilityHeader from "./FacilityHeader";
import FacilitySidebar from "./FacilitySidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import FacilityDetails from "./facilitycomponent/facilitydetail/FacilityDetails";
import ContractTerms from "./facilitycomponent/contract/ContractTerms";
import Compliance from "./facilitycomponent/compliance/Compliance";
import Roster from "./facilitycomponent/roster/Roster";
import FacilityLocation from "./facilitycomponent/location/Location";
import FacilityContacts from "./facilitycomponent/contacts/Contacts";
import FacilityDocuments from "./facilitycomponent/documents/Documents";
import { getFacilityListData } from "../../../services/facility";
import { capitalize, showToast } from "../../../helpers";
import { EditFacilityList } from "../../../types/FacilityTypes";
import FAQs from "./facilitycomponent/faq/Faqs";
import JobTemplate from "./facilitycomponent/jobtemplate/JobTemplate";
import Camera from "../../../assets/images/camera.svg";
import Jobs from "../facilitylisting/facilitycomponent/jobs/Jobs";
import { FacilityActiveComponentProps } from "../../../types";
import { FacilityActiveComponentContext } from "../../../helpers/context/FacilityActiveComponent";
import Notes from "./facilitycomponent/notes/NotesandActivity";
import FacilityOnboarding from "./facilitycomponent/facilityonboarding/FacilityOnboarding";
import FacilityGigHistory from "./facilitycomponent/gighistory/FacilityGigHistory";
import { removeActiveMenu } from "../../../helpers/tokens";
import CustomSelect from "../../../components/custom/CustomSelect";

const FacilityLayout = () => {
  const { activeComponent, setActiveComponent } =
    useContext<FacilityActiveComponentProps>(FacilityActiveComponentContext);
  const facilityDataId = useParams();
  const [data, setData] = useState<EditFacilityList>();
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageURL, setImageURL] = useState<string>("");
  const navigate = useNavigate();

  const componentMapping: { [key: string]: React.ReactNode } = {
    "Facility Details": <FacilityDetails />,
    "Facility Locations": <FacilityLocation />,
    Contacts: <FacilityContacts />,
    "Job Templates": <JobTemplate />,
    Jobs: <Jobs />,
    Compliance: <Compliance />,
    Onboarding: <FacilityOnboarding />,
    Roster: <Roster />,
    "Contract Terms": <ContractTerms />,
    "Notes & Activity": <Notes />,
    "Facility Documents": <FacilityDocuments />,
    "FAQ's": <FAQs />,
    "Gig History": <FacilityGigHistory />,
  };

  const handleNavigate = () => {
    navigate("/facility");
    removeActiveMenu();
  };
  const [dataDrp] = useState([
    {
      label: <>American Hospital Association <span className="span-brd">Parent</span></>,
      value: 1,
    },
    {
      label: <>American Hospital Association 2 <span className="span-brd">Parent</span></>,
      value: 2,
    },
    {
      label: <>American Hospital Association 3 <span className="span-brd">Parent</span></>,
      value: 3,
    },
  ]);
  const getFacilityData = async () => {
    try {
      const facilityData = await getFacilityListData(
        Number(facilityDataId?.Id)
      );
      setData(facilityData?.data?.data[0]);

      const imageUrlFromApi = facilityData?.data?.data[0].ImageUrl;
      if (imageUrlFromApi) {
        setImageURL(imageUrlFromApi);
        setImageLoading(false);
      } else {
        setImageURL(Camera);
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
    getFacilityData();
  }, [facilityDataId?.Id]);

  return (
    <div>
      <div className="navigate-wrapper drp-main-padding">
        <div className="d-flex justify-content-between align-items-center" style={{ gap: '20px' }}>
          <div>
            <Link to="" onClick={handleNavigate} className="link-btn">
              Facilities
            </Link>
            <span> / </span>
            <span>{capitalize(data?.Name ?? "--")}</span>
          </div>
          <div className="facility-header-cus-drp">
            <CustomSelect
              value={dataDrp[0]}
              id="select_profession"
              isSearchable={false}
              placeholder={"Select Profession"}
              onChange={() => { }}
              name=""
              noOptionsMessage={() => ""}
              options={dataDrp}
            ></CustomSelect>
          </div>

        </div>
      </div>
      <div className="sidebar-section-wrapper template-sidebar">
        {/* <Row> */}
        <div className="leftside">
          <FacilitySidebar
            setActiveComponent={setActiveComponent}
            activeComponent={activeComponent}
          />
        </div>
        <div className="rightside">
          <FacilityHeader
            data={data}
            imageLoading={imageLoading}
            imageURL={imageURL}
          />
          <div className="facility-listing-wrapper main-section">
            {componentMapping[activeComponent]}
          </div>
        </div>
        {/* </Row> */}
      </div>
    </div>
  );
};

export default FacilityLayout;
