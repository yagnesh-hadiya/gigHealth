import { capitalize, formatPhoneNumber } from "../../../../../helpers";
import { WorkReferenceType } from "../../../../../types/WorkReferenceTypes";

const ReadOnlyReferenceCard = ({
  reference,
}: {
  reference: WorkReferenceType;
}) => {
  return (
    <div className="content-wrapper pb-3" style={{width:'380px'}}>
      <div className="ref-wrapper rounded">
        <div className="details-wrapper" style={{ padding: "10px 10px" }}>
          <p
            className="edu-card-title"
            style={{ marginBottom: "8px", marginLeft: "10px" }}
          >
            {capitalize(reference.FacilityName) || "-"}
          </p>
          <p
            className="prof-card-subheading"
            style={{ marginBottom: "8px", marginLeft: "10px" }}
          >
            {capitalize(reference.ReferenceName) || "-"}
          </p>
          <div className="section-content" style={{ marginBottom: "0px" }}>
            <span>
              <span className="main-text">Title: </span>
              {capitalize(reference.Title) || "-"}
            </span>
          </div>
          <div className="section-content" style={{ marginBottom: "0px" }}>
            <span>
              <span className="main-text">Phone: </span>
              {formatPhoneNumber(reference.Phone) || "-"}
            </span>
          </div>
          <div className="section-content" style={{ marginBottom: "0px" }}>
            <span>
              <span className="main-text">Email:</span>
              {reference.Email || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyReferenceCard;
