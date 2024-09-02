import { useEffect, useState } from "react";
import Building from "../../../../assets/images/building.svg";
import Locations from "../../../../assets/images/location.svg";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomSelect from "../../../../components/custom/CustomSelect";
import {
  capitalize,
  checkAclPermission,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../helpers";
import { JobsCardProps } from "../../../../types/JobsTypes";
import { updateJobStatus } from "../../../../services/JobsServices";
import { jobsCustomStyle } from "./JobsSelectStyles";
import ACL from "../../../../components/custom/ACL";

const JobCard = ({
  Id,
  JobStatus,
  Title,
  TotalGrossPay,
  MinYearsExperience,
  Profession,
  ContractLength,
  BillRate,
  NoOfOpenings,
  Location,
  Speciality,
  Name,
  ContractStartDate,
  CreatedOn,
  Status,
  ApplicantCount,
  Facility,
  setFetchRightJobCard,
}: JobsCardProps) => {
  const [selectedJobStatus, SetSelectedJobStatus] = useState<{
    Id: number;
    Status: string;
  } | null>(Status);
  const allow = checkAclPermission("jobs", "", ["GET", "PUT"]);

  useEffect(() => {
    SetSelectedJobStatus(Status);
  }, [Id, Status]);

  const handleJobStatus = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      SetSelectedJobStatus(null);
      return;
    }

    if (selectedOption) {
      SetSelectedJobStatus({
        Id: selectedOption?.value,
        Status: selectedOption?.label,
      });

      updateJobStatus(Facility?.Id, Id, selectedOption?.value)
        .then((response) => {
          showToast(
            "success",
            "JobStatus Updated Successfully" || response?.data?.message
          );
          setFetchRightJobCard((prevValue) => !prevValue);
        })
        .catch((error) => {
          console.error(error);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        });
    }
  };

  return (
    <div
      className={`job-template-wrapper left-content-header-wrapper job-details`}
    >
      <div className="job-temp-header flex-wrap">
        <div className="d-flex gap-2 custom-select-wr align-items-center">
          <h4>{capitalize(Title)}</h4>
          <CustomInput
            className="header-input"
            disabled={true}
            value={`JID-${Id}`}
          />
          <ACL submodule={""} module={"jobs"} action={["GET", "PUT"]}>
            <CustomSelect
              styles={jobsCustomStyle}
              id={"jobStatus"}
              name={"jobStatus"}
              className="custom-select-placeholder custom-select-job"
              isDisabled={!allow}
              options={JobStatus?.map(
                (job: {
                  Id: number;
                  Status: string;
                }): { value: number; label: string } => ({
                  value: job?.Id,
                  label: job?.Status,
                })
              )}
              value={
                selectedJobStatus
                  ? {
                      value: selectedJobStatus?.Id,
                      label: selectedJobStatus?.Status,
                    }
                  : null
              }
              placeholder="Select Job Status "
              isSearchable={false}
              noOptionsMessage={() => "No Job Status Found"}
              onChange={(jobStatus) => handleJobStatus(jobStatus)}
            />
          </ACL>
        </div>
        <p>
          <span className="dollar-amount">$ {TotalGrossPay?.toFixed(2)}</span>
          <span className="week">/week</span>
        </p>
      </div>
      <div className="d-flex">
        <img src={Building} />
        <p className="hospital-detail-text">{capitalize(Name)}</p>
        <img src={Locations} />
        <p className="hospital-detail-text text-capitalize">{Location}</p>
        <div className="ml-auto">
          <div className="bill-rate">
            Bill Rate.{" "}
            <span className="bill-rate-rating">${BillRate?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap">
        <p>
          <span className="temp-details key">Profession: </span>
          <span className="temp-answer value">{Profession}</span>
        </p>
        <p>
          <span className="temp-details key">Speciality: </span>
          <span className="temp-answer value">{Speciality}</span>
        </p>
        <p>
          <span className="temp-details key">Start Date: </span>
          <span className="temp-answer value">
            {formatDateInDayMonthYear(ContractStartDate)}
          </span>
        </p>
        <p>
          <span className="temp-details key">Contract: </span>
          <span className="temp-answer value"> {ContractLength} Weeks</span>
        </p>
      </div>
      <div className="d-flex hospital-more-details flex-wrap">
        <p>
          <span className="temp-details key">Experience:</span>
          <span className="temp-answer value">{MinYearsExperience} Years</span>
        </p>
        <p>
          <span className="temp-details key">Openings:</span>
          <span className="temp-answer value">{NoOfOpenings}</span>
        </p>
        <p>
          <span className="temp-details key">Job Applicants:</span>
          <span className="temp-answer value">
            {ApplicantCount ? ApplicantCount : "-"}
          </span>
        </p>
        <p>
          <span className="temp-details key">Date Posted:</span>
          <span className="temp-answer value">
            {formatDateInDayMonthYear(CreatedOn)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default JobCard;
