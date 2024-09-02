// import { useState } from "react";
import { useEffect, useState } from "react";
import EducationModal from "./ProfessionalsModals/EducationModal";
import EducationCard from "./EducationCard";
import { EducationList } from "../../types/StoreInitialTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  getEducationList,
  setEducationList,
} from "../../store/ProfessionalDetailsSlice";
import { showToast } from "../../helpers";
import Loader from "../../components/custom/CustomSpinner";
import { useParams } from "react-router-dom";
import { getEducationLists } from "../../services/ProfessionalDetails";
import CustomButton from "../../components/custom/CustomBtn";
import ACL from "../../components/custom/ACL";

const ProfessionalEducation = () => {
  const [educationModal, setEducationModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const educationDetails: EducationList[] = useSelector(getEducationList);
  const params = useParams();
  const [fetchData, setFetchData] = useState<boolean>(false);

  const toggleEducationModal = () =>
    setEducationModal((prevModal) => !prevModal);

  const fetchEducationDetails = async () => {
    try {
      setLoading(true);
      const response = await getEducationLists(Number(params?.Id));
      dispatch(setEducationList(response.data?.data));
      setLoading(false);
      return response;
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchEducationDetails();
  }, [fetchData]);

  return (
    <>
      {loading && <Loader />}
      <div
        style={{
          borderRadius: "4px",
          background: "#fff",
          boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <div className="facility-header-wrap" style={{ padding: "10px 10px" }}>
          <span className="section-header" style={{ marginLeft: "20px" }}>
            Education
          </span>
          {educationDetails?.length > 0 &&
            educationDetails?.map((item: EducationList) => (
              <EducationCard
                key={item.Id}
                {...item}
                setFetchData={setFetchData}
              />
            ))}
          <div className="right-buttons text-start justify-content-start ms-3 mb-2">
            <ACL
              submodule="details"
              module="professionals"
              action={["GET", "POST"]}
            >
              <CustomButton
                className="professional-button add-more"
                onClick={toggleEducationModal}
              >
                Add More
              </CustomButton>
            </ACL>
          </div>
        </div>
      </div>
      <EducationModal
        isOpen={educationModal}
        toggle={() => setEducationModal(false)}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default ProfessionalEducation;
