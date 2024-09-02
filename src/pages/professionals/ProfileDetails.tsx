import ProfessionalLicenses from "./ProfessionalLicenses";
import ProfessionalEducation from "./ProfessionalEductaion";
import ProfessionalReference from "./ProfessionalReference";
import ProfessionalWorkHistory from "./ProfessionalWorkHistory";

const ProfProfileDetails = () => {
  return (
    <>
      <ProfessionalWorkHistory />
      <ProfessionalReference />
      <ProfessionalEducation />
      <ProfessionalLicenses />
    </>
  );
};

export default ProfProfileDetails;
