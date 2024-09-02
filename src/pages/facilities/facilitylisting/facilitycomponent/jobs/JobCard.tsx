import CustomButton from "../../../../../components/custom/CustomBtn";
import Building from "../../../../../assets/images/building.svg";
import Locations from "../../../../../assets/images/location.svg";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { useEffect, useState } from "react";
import CustomInput from "../../../../../components/custom/CustomInput";
import {
  checkAclPermission,
  facilityjobCustomStyles,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../../helpers";
import { FacilityJobCardProps } from "../../../../../types/JobsTypes";
import { updateJobStatus } from "../../../../../services/JobsServices";
import { useNavigate, useParams } from "react-router-dom";
import ACL from "../../../../../components/custom/ACL";
import { removeActiveMenu } from "../../../../../helpers/tokens";

const JobCard = ({ JobData, state }: FacilityJobCardProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedJobStatus, setSelectedJobStatus] = useState<{
    Id: number;
    Status: string;
  } | null>(null);
  const allow = checkAclPermission("facilities", "jobs", ["GET", "PUT"]);

  useEffect(() => {
    if (JobData && Object.keys(JobData).length >= 0) {
      setSelectedJobStatus(JobData?.JobStatus);
    }
  }, [JobData]);

  const handleJobStatus = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      setSelectedJobStatus(null);
      return;
    }

    if (selectedOption) {
      setSelectedJobStatus({
        Id: selectedOption?.value,
        Status: selectedOption?.label,
      });

      updateJobStatus(JobData?.Facility?.Id, JobData?.Id, selectedOption?.value)
        .then((response) => {
          showToast(
            "success",
            "JobStatus Updated Successfully" || response?.data?.message
          );
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

  const handleViewJob = () => {
    removeActiveMenu();
    navigate(`/view/facility/${Number(params.Id)}/job/${JobData?.Id}`, {
      state: {
        jobId: JobData?.Id,
        facilityId: JobData?.Facility?.Id,
      },
    });
  };

  const handleEditJob = () => {
    navigate(`/facility/${Number(params.Id)}/jobs/edit/${JobData?.Id}`, {
      state: {
        jobId: JobData?.Id,
        facilityId: JobData?.Facility?.Id,
      },
    });
  };

  return (
    <>
      {JobData &&
        Object.values(JobData).length >= 0 &&
        JobData !== undefined && (
          <div className="job-template-wrapper  w-100">
            <div className="job-temp-header applied-jobs">
              <div className="d-flex justify-content-between">
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ gap: "8px" }}
                >
                  <>
                    <h3 className="job-title-card-heading text-capitalize">
                      {JobData?.Title}
                    </h3>
                    <CustomInput
                      className="header-input facility-job-header-input ms-0"
                      disabled={true}
                      value={`JID-${JobData?.Id}`}
                    />
                    <div className="facilityjob-custom-dropdown">
                      <ACL
                        submodule={"jobs"}
                        module={"facilities"}
                        action={["GET", "PUT"]}
                      >
                        <CustomSelect
                          styles={facilityjobCustomStyles}
                          id={"jobStatus"}
                          name={"jobStatus"}
                          className="custom-select-placeholder custom-select-job"
                          isDisabled={!allow}
                          options={state.jobStatus.map(
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
                          placeholder="Select Job Status"
                          noOptionsMessage={(): string => ""}
                          onChange={(jobStatus) => handleJobStatus(jobStatus)}
                          isSearchable={false}
                          isClearable={false}
                        />
                      </ACL>
                    </div>
                  </>
                </div>
              </div>
              <div>
                <span className="dollar-amount">
                  ${JobData?.TotalGrossPay?.toFixed(2)}
                </span>
                <span className="week">/week</span>
              </div>
            </div>
            <div className="d-flex justify-content-between facility-job-wrapper">
              <div className="d-flex">
                <img src={Building} />
                <p className="hospital-text text-capitalize">
                  {JobData?.Facility?.Name}
                </p>
                <img src={Locations} />
                <p className="hospital-text text-capitalize">
                  {JobData?.Facility?.Address}
                </p>
              </div>
              <div>
                <span className="bill-rate">Bill Rate.</span>
                <span className="bill-rate-rating">
                  ${JobData?.BillRate?.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="d-flex flex-wrap">
              <p>
                <span className="temp-details">Profession:</span>
                <span className="temp-answer">
                  {JobData?.JobProfession?.Profession}
                </span>
              </p>
              <p>
                <span className="temp-details">Specialty:</span>
                <span className="temp-answer">
                  {JobData?.JobSpeciality?.Speciality}
                </span>
              </p>
              <p>
                <span className="temp-details">Start Date:</span>
                <span className="temp-answer">
                  {formatDateInDayMonthYear(JobData?.ContractStartDate)}
                </span>
              </p>
              <p>
                <span className="temp-details">Contract:</span>
                <span className="temp-answer">
                  {" "}
                  {JobData?.ContractLength} Weeks
                </span>
              </p>
              <p>
                <span className="temp-details">Experience:</span>
                <span className="temp-answer">
                  {" "}
                  {JobData?.MinYearsExperience} Years
                </span>
              </p>
              <p>
                <span className="temp-details">Openings:</span>
                <span className="temp-answer">{JobData?.NoOfOpenings}</span>
              </p>
              <p>
                <span className="temp-details">Job Applicants:</span>
                <span className="temp-answer">{`--`}</span>
              </p>
              <p>
                <span className="temp-details">Date Posted:</span>
                <span className="temp-answer">
                  {formatDateInDayMonthYear(JobData?.CreatedOn)}
                </span>
              </p>
            </div>
            <div className="btn-wrapper text-end">
              <ACL
                submodule={"jobs"}
                module={"facilities"}
                action={["GET", "GET"]}
              >
                <CustomButton className="primary-btn" onClick={handleEditJob}>
                  Edit Job
                </CustomButton>
              </ACL>
              <ACL
                submodule={"jobs"}
                module={"facilities"}
                action={["GET", "GET"]}
              >
                <CustomButton className="primary-btn" onClick={handleViewJob}>
                  View Job
                </CustomButton>
              </ACL>
            </div>
          </div>
        )}
    </>
  );
};

export default JobCard;
