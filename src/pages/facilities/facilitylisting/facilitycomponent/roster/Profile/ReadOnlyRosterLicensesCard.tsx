import {
  capitalize,
  formatDateInDayMonthYear,
} from "../../../../../../helpers";
import File from "../../../../../../assets/images/file.svg";
import { LicenseList } from "../../../../../../types/StoreInitialTypes";

const ReadOnlyRosterLicensesCard = ({ license }: { license: LicenseList }) => {
  return (
    <div
      className="prof-wrapper"
      style={{ marginBottom: "20px", backgroundColor: "none" }}
    >
      <p
        className="prof-card-subheading"
        style={{
          marginTop: "10px",
          marginBottom: "0px",
        }}
      >
        {capitalize(license.Name) || "--"}
      </p>
      <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
        <div className="d-flex align-items-center">
          <div className="file-img d-flex">
            <img src={File} className="" />
          </div>
          <div className="file-content">
            <p style={{ marginBottom: "0px" }}>
              <span className="info-title">License Number: </span>
              <span className="info-content">{license.LicenseNumber}</span>
            </p>
            <span className="info-title">State: </span>
            <span className="info-content">
              {capitalize(license.State?.State) || "--"}
            </span>
            <span className="info-title">Expiration Date:</span>{" "}
            <span className="info-content">
              {license.Expiry
                ? formatDateInDayMonthYear(license.Expiry?.toString())
                : "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyRosterLicensesCard;
