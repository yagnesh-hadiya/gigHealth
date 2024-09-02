import moment from "moment";
import { GigQuestionsProps } from "../../../types/ProfessionalDocumentType";

const PersonalDetails = ({ state }: GigQuestionsProps) => {
  return (
    <div className="content-wrapper align-items-center px-2 py-0 mt-3 mb-3">
      <div className="section-content " style={{ marginBottom: "0px" }}>
        <span>
          <span className="main-text">Date Of Birth:</span>
          {state?.gigList?.Dob
            ? moment(state?.gigList?.Dob).format("MM-DD-YYYY")
            : "-"}
        </span>
      </div>
      <div className="section-content" style={{ marginBottom: "0px" }}>
        <span className="text-capitalize">
          <span className="main-text">SSN:</span>
          {state?.gigList?.Ssn ?? "-"}
        </span>
      </div>
    </div>
  );
};

export default PersonalDetails;
