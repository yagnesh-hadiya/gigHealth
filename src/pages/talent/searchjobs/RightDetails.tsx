import { SetStateAction, useState } from "react";
import { Button } from "reactstrap";
import MissingDocModal from "./MissingDocModal";
import { CompChecklist, TalentJobDetailsType } from "../../../types/TalentJobs";
import moment from "moment";
import ConfirmApplyModal from "./ConfirmApplyModal";
import WithdrawModal from "./WithdrawModal";
import Loader from "../../../components/custom/CustomSpinner";
import { formatDateString, showToast } from "../../../helpers";
import { jobWithdraw } from "../../../services/TalentJobs";
import { useParams } from "react-router-dom";
import JobThankYouModal from "./JobThankYouModal";

const RightDetails = ({
  details,
  requiredDocs,
  setFetchDetails,
}: {
  details: TalentJobDetailsType;
  requiredDocs: CompChecklist;
  setFetchDetails: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [docModal, setDocModal] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [withdrawModal, setWithdrawModal] = useState<boolean>(false);
  const [thankyouModal, setThankYouModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const params = useParams();
  const jobId = Number(params?.Id);

  const toggleDocModal = () => setDocModal((prev) => !prev);
  const toggleConfirmModal = () => setConfirmModal((prev) => !prev);
  const toggleWithdrawModal = () => setWithdrawModal((prev) => !prev);
  const toggleThankYouModal = () => setThankYouModal((prev) => !prev);

  const handleModal = () => {
    if (
      requiredDocs?.CompDocuments?.some(
        (item) => item?.DocumentMaster?.CoreCompDocuments === null
      )
    ) {
      toggleDocModal();
    } else {
      toggleConfirmModal();
    }
  };

  const getJobApplicationIndex = () => {
    const appId = details?.JobApplications[0]?.Id;
    return appId;
  };

  const handleWithDraw = async (jobId: number | undefined) => {
    const applicationIndex = getJobApplicationIndex();
    try {
      setLoading("loading");
      if (jobId && applicationIndex) {
        const response = await jobWithdraw(jobId, applicationIndex);
        if (response.status === 200) {
          showToast(
            "success",
            "Job application withdraw successfully" || response.data?.message
          );
          setFetchDetails((prev) => !prev);
        }
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <div>
        <h3 className="price-title mb-3">
          {details?.TotalGrossPay
            ? `$${details?.TotalGrossPay?.toFixed(2)}`
            : "-"}
          <span>/week</span>
        </h3>
        <p className="fw-600 m-b-10">Facility Name</p>
        <div className="d-flex align-items-center gap-10 m-b-20">
          <span className="material-symbols-outlined">corporate_fare</span>
          <p className="text-capitalize">
            {details?.Facility ? details?.Facility?.Name : "-"}
          </p>
        </div>
        <p className="fw-600 m-b-10">Location</p>
        <div className="d-flex align-items-center gap-10 m-b-20">
          <span className="material-symbols-outlined text-capitalize">
            location_on
          </span>
          <p className="text-capitalize">
            {details?.Location ? details?.Location : "-"}
          </p>
        </div>
        <p className="fw-600 m-b-10">Profession</p>
        <div className="d-flex align-items-center gap-10 m-b-20">
          <span className="material-symbols-outlined">medical_services</span>
          <p className="text-capitalize">
            {details?.JobProfession ? details?.JobProfession?.Profession : "-"}
          </p>
        </div>
        <p className="fw-600 m-b-10">Specialty</p>
        <div className="d-flex align-items-center gap-10 m-b-20">
          <span className="material-symbols-outlined">grade</span>
          <p className="text-capitalize">
            {details?.JobSpeciality ? details?.JobSpeciality?.Speciality : "-"}
          </p>
        </div>
        <p className="fw-600 m-b-10">Shift Details</p>
        <div className="d-flex gap-10 flex-wrap">
          <div className="d-flex align-items-center gap-10 m-b-20">
            <span className="material-symbols-outlined">light_mode</span>
            <p className="text-capitalize">
              {details?.JobShift ? `${details.JobShift.Shift} Shift` : "-"}
            </p>
          </div>
          <div className="d-flex align-items-center gap-10 m-b-20">
            <span className="material-symbols-outlined">schedule</span>
            <p>
              {details?.ShiftStartTime
                ? moment(details?.ShiftStartTime, "HH:mm:ss").format("h:mm A")
                : "-"}
              -{" "}
              {details?.ShiftEndTime
                ? moment(details?.ShiftEndTime, "HH:mm:ss").format("h:mm A")
                : "-"}
            </p>
          </div>
        </div>
        <p className="fw-600 m-b-10">Hours Per Week</p>
        <div className="d-flex align-items-center gap-10 m-b-20">
          <span className="material-symbols-outlined">schedule</span>
          <p className="text-capitalize">
            {details?.HrsPerWeek ? `${details?.HrsPerWeek} Hours` : "-"}
          </p>
        </div>
        <p className="fw-600 m-b-10">Start Date</p>
        <div className="d-flex align-items-center gap-10 m-b-20">
          <span className="material-symbols-outlined">today</span>
          <p>
            {" "}
            {details?.ContractStartDate
              ? formatDateString(details?.ContractStartDate)
              : "-"}
          </p>
        </div>
        <p className="fw-600 m-b-10">Duration</p>
        <div className="d-flex align-items-center gap-10 m-b-20">
          <span className="material-symbols-outlined">calendar_month</span>
          <p>
            {details?.ContractLength ? `${details?.ContractLength} Weeks` : "-"}
          </p>
        </div>
        {loading === "idle" &&
          details?.JobApplications?.length === 0 &&
          requiredDocs &&
          requiredDocs?.CompDocuments?.length > 0 &&
          requiredDocs?.CompDocuments?.some(
            (item) => item?.DocumentMaster?.CoreCompDocuments === null
          ) && (
            <div className="missing-doc-wrapper mb-2">
              <p className="fw-600 mb-3">Missing Documents required to apply</p>
              {requiredDocs?.CompDocuments?.map((doc) => {
                if (doc?.DocumentMaster?.CoreCompDocuments === null) {
                  return (
                    <div
                      key={doc?.Id}
                      className="d-flex align-items-center mb-3 filled-icon"
                      style={{ gap: "8px" }}
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      <p className="text-capitalize">
                        {doc?.DocumentMaster?.Type}
                      </p>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          )}
        {details?.JobApplications && details.JobApplications.length > 0 ? (
          details.JobApplications.some(
            (app) =>
              app.JobApplicationStatus?.Status === "Applied" ||
              app.JobApplicationStatus?.Status === "Submitted"
          ) ? (
            <div className="pt-2">
              <Button
                outline
                className="purple-outline-btn  w-100"
                style={{ height: "40px", marginBottom: "10px" }}
                disabled
                onClick={() => {
                  toggleWithdrawModal();
                }}
              >
                {details?.JobApplications?.[0]?.JobApplicationStatus?.Status}
              </Button>
              <Button
                outline
                className="purple-outline-btn  w-100"
                style={{ height: "40px" }}
                onClick={() => {
                  toggleWithdrawModal();
                }}
              >
                Withdraw Application
              </Button>
            </div>
          ) : (
            <div className="pt-2">
              <Button
                outline
                className="purple-outline-btn  w-100"
                style={{ height: "40px", color: "#7f47dd" }}
                disabled
              >
                {details.JobApplications.map(
                  (status) => status.JobApplicationStatus?.Status
                )}
              </Button>
            </div>
          )
        ) : null}
        {loading === "idle" &&
          details?.JobApplications?.length === 0 &&
          !(details?.JobStatus?.Status === "On Hold") && (
            <div className="pt-2">
              <Button
                className="yellow-btn me-3 mb-0 w-100"
                style={{ height: "40px" }}
                onClick={() => handleModal()}
              >
                Apply Now
              </Button>
            </div>
          )}
      </div>
      {docModal && (
        <MissingDocModal
          isOpen={docModal}
          toggle={toggleDocModal}
          requiredDocs={requiredDocs}
          setFetchDetails={setFetchDetails}
        />
      )}
      <ConfirmApplyModal
        isOpen={confirmModal}
        toggle={toggleConfirmModal}
        setFetchDetails={setFetchDetails}
        toggleThankYouModal={toggleThankYouModal}
      />
      <WithdrawModal
        isOpen={withdrawModal}
        toggle={toggleWithdrawModal}
        onWithdraw={() => handleWithDraw(jobId)}
      />
      <JobThankYouModal isOpen={thankyouModal} toggle={toggleThankYouModal} />
    </>
  );
};

export default RightDetails;
