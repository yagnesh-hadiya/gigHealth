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
import { AppliedJobType } from "../../../../types/ProfessionalGigHistoryType";
import GigHistoryModal from "../GigHistoryModal";
import { useNavigate, useParams } from "react-router-dom";
import ACL from "../../../../components/custom/ACL";
import { useState } from "react";
import { updateJobStatus } from "../../../../services/JobsServices";
import Loader from "../../../../components/custom/CustomSpinner";
import { getStatusColor } from "../../../../constant/StatusColors";
import { removeActiveMenu } from "../../../../helpers/tokens";

type AppliedJobsCardType = {
  row: AppliedJobType;
  jobStatus: { Id: number; Status: string }[];
};

const AppliedJobsCard = ({ row, jobStatus }: AppliedJobsCardType) => {
  const params = useParams<{ Id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [selectedJobStatus, setSelectedJobStatus] = useState<{
    Id: number;
    Status: string;
  } | null>({
    Id: row.Job.JobStatus.Id,
    Status: row.Job.JobStatus.Status,
  });

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
          row.Facility.Id,
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
      <div className="job-temp-header disc-header-wrap applied-jobs">
        <div className="d-flex justify-content-between ">
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
        </div>
        <div className="d-flex align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            <span style={{ marginRight: "5px" }}> Application Status:</span>
            <span
              style={{
                backgroundColor: "#fff",
                border: "1px solid",
                padding: "5px 10px",
                borderRadius: "5px",
                borderColor: getStatusColor(row.JobApplicationStatus.Status),
                color: getStatusColor(row.JobApplicationStatus.Status),
              }}
            >
              {row.JobApplicationStatus.Status
                ? capitalize(row.JobApplicationStatus.Status)
                : ""}
            </span>
          </div>
          <div className="ms-2">
            <span className="dollar-amount">${row.Job.BillRate}.00</span>
            <span className="week">/week</span>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between facility-job-wrapper">
        <div className="d-flex flex-wrap">
          <div className="d-flex">
            <img src={Building} />
            <p className="hospital-text text-capitalize">
              {row.Facility ? capitalize(row.Facility.Name) : ""}
            </p>
          </div>
          <div className="d-flex">
            <img src={Locations} />
            <p className="hospital-text text-capitalize">
              {row.Facility ? capitalize(row.Facility.Address) : ""}
            </p>
          </div>
        </div>
        <div>
          <span className="bill-rate me-1 text-nowrap">Bill Rate.</span>
          <span className="bill-rate-rating">${row.Job.BillRate}.00</span>
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
        <div>
          <GigHistoryModal
            slotId={row.Id}
            professionalId={Number(params.Id)}
            jobId={row.Job.Id}
            jobApplicationId={row.Id}
            facilityId={row.Facility.Id}
          />
        </div>

        <span className="bill-rate border rounded py-2 px-3 mb-0 mt-0">
          Applied On:{" "}
          {row.AppliedOn ? new Date(row.AppliedOn).toLocaleString() : "-"}
        </span>

        <ACL submodule={""} module={"jobs"} action={["GET", "GET"]}>
          <CustomButton
            className="primary-btn ms-2"
            onClick={() =>
              handleViewJob({
                facilityId: Number(row.Facility.Id),
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

export default AppliedJobsCard;
