// import CustomButton from "../../components/custom/CustomBtn";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import onboardLocation from "../../assets/images/onboardLocation.svg";
import { EducationCardProps } from "../../types/EducationCardProps";
import { formatDateInDayMonthYear, showToast } from "../../helpers";
import { useState } from "react";
import { deleteEducationCard } from "../../services/ProfessionalDetails";
import { useParams } from "react-router-dom";
import Loader from "../../components/custom/CustomSpinner";
import { EducationList } from "../../types/StoreInitialTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  getEducationList,
  toggleFetchDetails,
} from "../../store/ProfessionalDetailsSlice";
import EducationEditModal from "./ProfessionalsModals/EducationEditModal";
import ACL from "../../components/custom/ACL";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";

const EducationCard = ({
  Id,
  Degree,
  School,
  Location,
  DateStarted,
  GraduationDate,
  setFetchData,
}: EducationCardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const educationDetails: EducationList[] = useSelector(getEducationList);
  const [editEducationModal, setEditEducationModal] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [editData, setEditData] = useState<EducationList | null>(null);
  const dispatch = useDispatch();
  const params = useParams();

  const handleDelete = async (educationId: number) => {
    try {
      setLoading(true);
      const response = await deleteEducationCard(
        Number(params?.Id),
        educationId
      );
      showToast(
        "success",
        "Education deleted successfully" || response.data?.message
      );
      setFetchData((prevState) => !prevState);
      dispatch(toggleFetchDetails());
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleEdit = (educationId: number) => {
    const data: EducationList | undefined = educationDetails?.find(
      (item: EducationList): boolean => item?.Id === educationId
    );
    if (data) {
      setEditEducationModal(true);
      setReadOnly(false);
      setEditData(data);
    }
  };

  const hanleReadEducation = (educationId: number) => {
    const data: EducationList | undefined = educationDetails?.find(
      (item: EducationList): boolean => item?.Id === educationId
    );
    if (data) {
      setEditEducationModal(true);
      setReadOnly(true);
      setEditData(data);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="content-wrapper">
        <div className="box-wrapper">
          <div className="details-wrapper" style={{ padding: "10px 10px" }}>
            <div className="d-flex " style={{ marginLeft: "8px" }}>
              <p>
                <div className="d-flex">
                  <span
                    className="prof-card-subheading me-4 text-capitalize"
                    style={{ cursor: "pointer" }}
                    onClick={() => hanleReadEducation(Id)}
                  >
                    {Degree}
                  </span>
                  <ACL
                    submodule="details"
                    module="professionals"
                    action={["GET", "PUT"]}
                  >
                    <CustomEditBtn onEdit={() => handleEdit(Id)} />
                  </ACL>
                  <ACL
                    module="professionals"
                    submodule="details"
                    action={["GET", "DELETE"]}
                  >
                    <CustomDeleteBtn onDelete={() => handleDelete(Id)} />
                  </ACL>
                </div>
                <span className="edu-card-title text-capitalize text-purple">
                  {School}
                </span>
                <br />
                <img src={onboardLocation} />
                <span
                  className="edu-card-content text-capitalize"
                  style={{ marginLeft: "5px" }}
                >
                  {Location}
                </span>
                <br />
                <span className="edu-card-subheading mt-4 me-1">
                  Date Started:
                </span>
                <span className="edu-card-content mt-4 me-4">
                  {formatDateInDayMonthYear(DateStarted?.toString())}
                </span>
                {GraduationDate && (
                  <>
                    <span className="edu-card-subheading mt-4 me-1">
                      Graduated On:
                    </span>
                    <span className="edu-card-content mt-4">
                      {GraduationDate
                        ? formatDateInDayMonthYear(GraduationDate?.toString())
                        : "--"}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      {editData && (
        <EducationEditModal
          isOpen={editEducationModal}
          toggle={() => {
            setEditEducationModal(false);
            setEditData(null);
          }}
          editData={editData}
          setFetchData={setFetchData}
          readOnly={readOnly}
        />
      )}
    </>
  );
};

export default EducationCard;
