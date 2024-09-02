import CustomButton from "../../../../../components/custom/CustomBtn";
import Building from "../../../../../assets/images/building.svg";
import Locations from "../../../../../assets/images/location.svg";
import { JobTemplate } from "../../../../../types/JobTemplateTypes";
import { capitalize, formatDateString } from "../../../../../helpers";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ACL from "../../../../../components/custom/ACL";

const JobCard = ({
  Id,
  Title,
  CreatedOn,
  JobType,
  TotalGrossPay,
  MinYearsExperience,
  ContractLength,
  Location,
  JobProfession,
  JobSpeciality,
  Facility,
  DeleteHandler,
}: JobTemplate) => {
  const [modal, setModal] = useState(false);
  const facilityDataId = useParams();
  const navigate = useNavigate();
  const paramsId = useParams();

  const toggle = () => setModal(!modal);
  const handleDelete = () => {
    toggle();
    DeleteHandler();
  };

  const handleUseTemplate = () => {
    navigate("/jobs/create", {
      state: {
        templateId: Id,
        facilityId: paramsId?.Id,
      },
    });
  };

  return (
    <>
      <div className="job-template-wrapper w-100">
        <div className="job-temp-header">
          <h3>{Title}</h3>
          <p>
            <span className="dollar-amount">${TotalGrossPay?.toFixed(2)}</span>
            <span className="week">/week</span>
          </p>
        </div>
        <div className="d-flex">
          <img src={Building} />
          <p className="hospital-detail-text">{capitalize(Facility.Name)}</p>
          <img src={Locations} />
          <p className="hospital-detail-text">{Location}</p>
        </div>
        <div className="d-flex flex-wrap">
          <p>
            <span className="temp-details">Job Type:</span>
            <span className="temp-answer text-nowrap"> {JobType}</span>
          </p>
          <p>
            <span className="temp-details">Profession:</span>
            <span className="temp-answer text-nowrap">
              {JobProfession.Profession}
            </span>
          </p>
          <p>
            <span className="temp-details">Specialty:</span>
            <span className="temp-answer text-nowrap">
              {JobSpeciality.Speciality}
            </span>
          </p>
          <p>
            <span className="temp-details">Contract:</span>
            <span className="temp-answer text-nowrap">
              {" "}
              {ContractLength} Weeks
            </span>
          </p>
          <p>
            <span className="temp-details">Experience:</span>
            <span className="temp-answer text-nowrap">
              {MinYearsExperience} Years
            </span>
          </p>
          <p>
            <span className="temp-details">Created On:</span>
            <span className="temp-answer text-nowrap">
              {" "}
              {formatDateString(CreatedOn)}
            </span>
          </p>
        </div>
        <div className="btn-wrapper right-buttons d-flex justify-content-end flex-wrap align-items-center">
          <ACL
            submodule={"jobtemplates"}
            module={"facilities"}
            action={["GET", "DELETE"]}
          >
            <CustomButton onClick={toggle} className="professional-button  delete-btn me-2">
              Delete
            </CustomButton>
          </ACL> 
          <Link
            to={`/facility/${Number(
              facilityDataId?.Id
            )}/job-template/edit/${Id}`}
          >
            <ACL
              submodule={"jobtemplates"}
              module={"facilities"}
              action={["GET", "PUT"]}
            >
              <CustomButton className="professional-button  delete-btn me-2">
                Edit template
              </CustomButton>
            </ACL>
          </Link>
          <ACL submodule={""} module={"jobs"} action={["GET", "GET", "POST"]}>
            <CustomButton
              className="primary-btn template-btn ms-0"
              onClick={handleUseTemplate}
            >
              Use Job template
            </CustomButton>
          </ACL>
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Deleting the entry?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this entry? You CAN NOT view this
          entry in list anymore if you delete?
        </ModalBody>
        <ModalFooter>
          <div className="btn-wrapper">
            <ACL submodule={""} module={"jobs"} action={["GET", "DELETE"]}>
              <CustomButton className="primary-btn" onClick={handleDelete}>
                Delete
              </CustomButton>
            </ACL>
            <CustomButton className="secondary-btn" onClick={toggle}>
              Cancel
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default JobCard;
