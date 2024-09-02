import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEducationList,
  setEducationList,
} from "../../../store/ProfessionalDetailsSlice";
import ProfessionalEducationModal from "./modals/ProfessionalEducationModal";
import { showToast } from "../../../helpers";
import { getProfessionalEducationList } from "../../../services/ProfessionalMyProfile";
import Loader from "../../../components/custom/CustomSpinner";
import { Button } from "reactstrap";
import ProfessionalEducationCard from "./Cards/ProfessionalEducationCard";
import { EducationList } from "../../../types/StoreInitialTypes";
import { ProfileInformationCardProps } from "../../../types/ProfessionalDetails";

const Education = ({ setFetchDetails }: ProfileInformationCardProps) => {
  const dispatch = useDispatch();
  const educationDetails: EducationList[] = useSelector(getEducationList);
  const [educationModal, setEducationModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const fetchEducationDetails = async () => {
    try {
      setLoading("loading");
      const response = await getProfessionalEducationList();
      if (response.status === 200) {
        dispatch(setEducationList(response.data?.data));
        setLoading("idle");
      }
    } catch (error: any) {
      setLoading("error");
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchEducationDetails();
  }, [educationDetails.length < 0]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <h3 className="scroll-title mb-2">Education</h3>
        <Button
          outline
          className="purple-outline-btn mb-2 min-width-146"
          onClick={() => setEducationModal(true)}
        >
          Add Education
        </Button>
      </div>
      {educationDetails &&
        educationDetails.length > 0 &&
        educationDetails?.map((item, index) => {
          return (
            <ProfessionalEducationCard
              {...item}
              key={item.Id}
              index={index + 1}
              fetch={fetchEducationDetails}
              setFetchDetails={setFetchDetails}
            />
          );
        })}
      {educationModal && (
        <ProfessionalEducationModal
          isOpen={educationModal}
          toggle={() => setEducationModal(false)}
          fetch={fetchEducationDetails}
          setFetchDetails={setFetchDetails}
        />
      )}
    </>
  );
};

export default Education;
