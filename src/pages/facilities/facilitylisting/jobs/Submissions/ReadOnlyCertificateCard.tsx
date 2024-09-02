import { capitalize, formatDateInDayMonthYear } from "../../../../../helpers";
import { CertificationList } from "../../../../../types/StoreInitialTypes";

const ReadOnlyCertificateCard = ({
  certificate,
}: {
  certificate: CertificationList;
}) => {
  return (
    <div className="prof-wrapper">
      <div
        className="prof-card-subheading"
        style={{
          marginTop: "10px",
          marginBottom: "0px",
        }}
      >
        {capitalize(certificate.Name) || "--"}
      </div>
      <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
        <div className="d-flex align-items-center">
          <div className="file-content">
            {/* <p style={{ marginBottom: "0px" }}>
              <span className="info-title">Certificate Number: </span>
              <span className="info-content">{certificate.Name}</span>
            </p> */}
            {/* <span className="info-title">State: </span>
            <span className="info-content">{certificate.}</span> */}
            <span className="info-title">Expiration Date:</span>{" "}
            <span className="info-content">
              {certificate.Expiry
                ? formatDateInDayMonthYear(certificate.Expiry?.toString())
                : "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyCertificateCard;
