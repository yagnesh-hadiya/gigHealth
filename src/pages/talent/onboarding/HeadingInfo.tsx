import { TalentOnboardingListType } from "../../../types/TalentOnboardingTypes";

const HeadingInfo = ({
  Job,
  Facility,
  JobApplication,
}: TalentOnboardingListType) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between gap-0-20 mobile-wrap">
        <h3 className="list-title m-b-12 text-capitalize">
          {Job?.Title ? Job?.Title : "-"}
        </h3>
        <div className="d-flex m-b-12">
          <h3 className="price-title mb-0 me-3 text-nowrap">
            ${Job?.TotalGrossPay ? Job?.TotalGrossPay?.toFixed(2) : "-"}
            <span>/week</span>
          </h3>
        </div>
      </div>
      <div className="d-flex flex-wrap" style={{ gap: "10px 15px" }}>
        <div className="d-flex align-items-center m-b-12">
          <span className="location-icon material-symbols-outlined me-2">
            corporate_fare
          </span>
          <p className="mb-0 text-capitalize">
            {Facility?.Name ? Facility?.Name : "-"}
          </p>
        </div>
        <div className="d-flex align-items-center m-b-12">
          <span className="location-icon material-symbols-outlined me-2">
            location_on
          </span>
          <p className="mb-0 text-capitalize">
            {Facility?.Address ? Facility?.Address : "-"},
            {Facility?.State?.State ? Facility?.State?.State : "-"}{" "}
            {Facility?.City ? Facility?.City?.City : "-"}{" "}
            {Facility?.ZipCode ? Facility?.ZipCode?.ZipCode : "-"}
          </p>
        </div>
      </div>
      {JobApplication && JobApplication?.JobAssignments?.length > 0 && (
        <div className="d-flex align-items-center flex-wrap list-gap m-b-12">
          <p className="mb-0 text-capitalize">
            Profession:{" "}
            <span className="fw-400">
              {JobApplication?.JobAssignments[0]?.JobProfession?.Profession ??
                "-"}
            </span>
          </p>
          <p className="mb-0 text-capitalize">
            Specialty:{" "}
            <span className="fw-400">
              {JobApplication?.JobAssignments[0]?.JobApplicationStatus
                ?.Status ?? "-"}
            </span>
          </p>
          <p className="mb-0 text-capitalize">
            Hours Per Week: <span className="fw-400">40 Hours</span>
          </p>
          <p className="mb-0">
            Openings: <span className="fw-400">5</span>
          </p>
        </div>
      )}
    </>
  );
};

export default HeadingInfo;
