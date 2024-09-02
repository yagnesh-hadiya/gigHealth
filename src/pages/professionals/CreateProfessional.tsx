import { Link } from "react-router-dom";
import CustomMainCard from "../../components/custom/CustomCard";
import ProfessionalForm from "./ProfessionalForm";

const CreateProfessional = () => {
  return (
    <>
      <div className="navigate-wrapper">
        <Link to="/professionals" className="link-btn">
          Manage Professionals
        </Link>
        <span> / </span>
        <span>Add New Prefessional</span>
      </div>
      <CustomMainCard>
        <ProfessionalForm />
      </CustomMainCard>
    </>
  );
};

export default CreateProfessional;
