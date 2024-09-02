import Building from "../../../../assets/images/building.svg";
import Locations from "../../../../assets/images/location.svg";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomSelect from "../../../../components/custom/CustomSelect";
import {
  capitalize,
  facilityjobCustomStyles,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../helpers";
import CustomButton from "../../../../components/custom/CustomBtn";
import { Button } from "reactstrap";
import HeartIcon from "../../../../components/icons/HeartBtn";
import { JobInterestType } from "../../../../types/ProfessionalGigHistoryType";
import ACL from "../../../../components/custom/ACL";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ProfessionalGigHistoryServices from "../../../../services/ProfessionalGigHistoryServices";
import Loader from "../../../../components/custom/CustomSpinner";
import { updateJobStatus } from "../../../../services/JobsServices";
import { removeActiveMenu } from "../../../../helpers/tokens";

type JobInterestCardProps = {
  row: JobInterestType;
  fetchInterest: () => void;
  jobStatus: { Id: number; Status: string }[];
};

const JobInterestCard = ({ row, jobStatus }: JobInterestCardProps) => {
  const [selected, setSelected] = useState<boolean>(true);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [selectedJobStatus, setSelectedJobStatus] = useState<{
    Id: number;
    Status: string;
  } | null>({
    Id: row.Job.JobStatus.Id,
    Status: row.Job.JobStatus.Status,
  });
  const params = useParams<{ Id: string }>();

  const handleJobStatus = async (
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

      setLoading("loading");
      try {
        const res = await updateJobStatus(
          row.Job.Id,
          row.Job.Id,
          selectedOption?.value
        );
        if (res.status === 200) {
          setLoading("idle");
          showToast(
            "success",
            res?.data?.message || "JobStatus Updated Successfully"
          );
        }
      } catch (error: any) {
        setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  const handleMouseClick = async ({
    facilityId,
    jobId,
  }: {
    facilityId: number;
    jobId: number;
  }) => {
    setLoading("loading");
    try {
      const res = await ProfessionalGigHistoryServices.updateJobInterest({
        professionalId: Number(params.Id),
        facilityId: facilityId,
        jobId: jobId,
        status: !selected,
      });

      if (res.status === 200) {
        // fetchInterest();
        setLoading("idle");
        showToast(
          "success",
          res.data.data.message || "Job removed from interest"
        );
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "Something went wrong");
    }
  };

  const navigate = useNavigate();

  const handleViewJob = ({
    facilityId,
    jobId,
  }: {
    facilityId: number;
    jobId: number;
  }): void => {
    removeActiveMenu();
    navigate(`/view/facility/${facilityId}/job/${jobId}`);
  };

  return (
    <div className="job-template-wrapper  w-100">
      {loading === "loading" && <Loader />}
      <div className="job-temp-header applied-jobs">
        <div className="">
          <div
            className="d-flex align-items-center flex-wrap"
            style={{ gap: "8px" }}
          >
            <>
              <h3 className="job-title-card-heading text-capitalize">
                {row.Job.Title ? capitalize(row.Job.Title) : "-"}
              </h3>
              <CustomInput
                className="header-input"
                disabled={true}
                value={row.Job ? `JID-${row.Job.Id}` : ""}
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
                    options={jobStatus.map(
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
          <div className="d-flex justify-content-between facility-job-wrapper flex-wrap">
            <div className="d-flex">
              <img src={Building} />
              <p className="hospital-text text-capitalize">
                {row.Job.Facility ? capitalize(row.Job.Facility.Name) : ""}
              </p>
            </div>
            <div className="d-flex">
              <img src={Locations} />
              <p className="hospital-text text-capitalize">
                {row.Job.Location ? capitalize(row.Job.Facility.Address) : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="facility-job-wrapper">
          <div className="d-flex align-items-center">
            <div className="">
              <span className="dollar-amount">${row.Job.BillRate}.00</span>
              <span className="week">/week</span>
            </div>
            <div>
              <Button
                onClick={() => {
                  setSelected(!selected);
                  handleMouseClick({
                    facilityId: Number(row.Job.Facility.Id),
                    jobId: Number(row.Job.Id),
                  });
                }}
                color={selected ? "#FBAE17" : "#717B9E"}
                className="border-0"
              >
                <HeartIcon color={selected ? "#FBAE17" : "#717B9E"} />
              </Button>
            </div>
          </div>
          <div>
            <span className="bill-rate me-1">Bill Rate.</span>
            <span className="bill-rate-rating">${row.Job.BillRate}.00</span>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap">
        <p>
          <span className="temp-details">Profession:</span>
          <span className="temp-answer">
            {row.Job.JobProfession
              ? capitalize(row.Job.JobProfession.Profession)
              : ""}
          </span>
        </p>
        <p>
          <span className="temp-details">Specialty:</span>
          <span className="temp-answer">
            {" "}
            {row.Job.JobSpeciality
              ? capitalize(row.Job.JobSpeciality.Speciality)
              : ""}
          </span>
        </p>
        <p>
          <span className="temp-details">Start Date:</span>
          <span className="temp-answer">
            {row.Job.ContractStartDate
              ? formatDateInDayMonthYear(row.Job.ContractStartDate).replace(
                  /-/g,
                  "/"
                )
              : "-"}
          </span>
        </p>
        <p>
          <span className="temp-details">Contract:</span>
          <span className="temp-answer">
            {row.Job.ContractLength ? row.Job.ContractLength : ""} Weeks
          </span>
        </p>
        <p>
          <span className="temp-details">Experience:</span>
          <span className="temp-answer">
            {row.Job.MinYearsExperience ? row.Job.MinYearsExperience : ""} Years
          </span>
        </p>
        <p>
          <span className="temp-details">Openings:</span>
          <span className="temp-answer">
            {row.Job.NoOfOpenings ? row.Job.NoOfOpenings : ""}
          </span>
        </p>
        <p>
          <span className="temp-details">Job Applicants:</span>
          <span className="temp-answer">
            {row.Job.ApplicantCount ? row.Job.ApplicantCount : "-"}
          </span>
        </p>
        <p>
          <span className="temp-details">Date Posted:</span>
          <span className="temp-answer">
            {row.Job.CreatedOn
              ? formatDateInDayMonthYear(row.Job.CreatedOn).replace(/-/g, "/")
              : ""}
          </span>
        </p>
      </div>
      <div className="btn-wrapper d-flex align-items-center justify-content-end">
        <span className="bill-rate border rounded py-2 px-3 mb-0 mt-0">
          Saved On:{" "}
          {row.CreatedOn ? new Date(row.CreatedOn).toLocaleString() : "-"}
        </span>

        <ACL submodule={""} module={"jobs"} action={["GET", "GET"]}>
          <CustomButton
            className="primary-btn ms-2"
            onClick={() =>
              handleViewJob({
                facilityId: Number(row.Job.Facility.Id),
                jobId: Number(row.Job.Id),
              })
            }
          >
            View Job
          </CustomButton>
        </ACL>
      </div>
    </div>
  );
};

export default JobInterestCard;
