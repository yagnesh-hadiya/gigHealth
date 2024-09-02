import { capitalize, formatDateInDayMonthYear } from "../../../../../helpers";
import onboardLocation from "../../../../../assets/images/onboardLocation.svg";
import { EducationList } from "../../../../../types/StoreInitialTypes";

const ReadOnlyEducationCard = ({ education }: { education: EducationList }) => {
  return (
    <div className="content-wrapper pb-3">
      <div className="box-wrapper">
        <div className="details-wrapper" style={{ padding: "10px 10px" }}>
          <div className="d-flex " style={{ marginLeft: "8px" }}>
            <p>
              <span className="prof-card-subheading">
                {capitalize(education.Degree) || "-"}
              </span>
              <br />
              <span className="edu-card-title">
                {" "}
                {capitalize(education.School) || "-"}
              </span>
              <br />
              <img src={onboardLocation} />
              <span className="edu-card-content">
                {capitalize(education.Location) || "-"}
              </span>
              <br />
              <span className="edu-card-subheading edu-divider">
                {education.DateStarted
                  ? formatDateInDayMonthYear(education.DateStarted?.toString())
                  : "--"}
              </span>

              <span className="edu-card-subheading">
                {education.GraduationDate
                  ? formatDateInDayMonthYear(
                      education.GraduationDate?.toString()
                    )
                  : "--"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyEducationCard;
