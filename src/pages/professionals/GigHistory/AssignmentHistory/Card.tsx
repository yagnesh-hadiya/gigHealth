import { useState } from "react";
import CustomButton from "../../../../components/custom/CustomBtn";
import AddRowIcon from "../../../../components/icons/CollapseRowBtn";
import DownloadIcon from "../../../../components/icons/DownloadBtn";
import ExpandRowIcon from "../../../../components/icons/ExpandRowBtn";
import Building from "../../../../assets/images/building.svg";
import Locations from "../../../../assets/images/location.svg";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button } from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import GigViewDocuments from "../Documents/GigViewDocuments";
import {
  ProfessionalGigHistoryType,
  ProfessionalGigHistoryJobAssignment,
} from "../../../../types/ProfessionalGigHistoryType";
import {
  capitalize,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../helpers";
import ProfessionalGigHistoryServices from "../../../../services/ProfessionalGigHistoryServices";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../components/custom/CustomSpinner";
import GigHistoryModal from "../GigHistoryModal";
import AssignmentDetailsModal from "../AssignmentDetailsModal";
import { getStatusColor } from "../../../../constant/StatusColors";

type AssignmentHistoryCardProps = {
  row: ProfessionalGigHistoryType;
  fetchGigHistory: () => void;
};

const AssignmentHistoryCard = ({
  row,
  fetchGigHistory,
}: AssignmentHistoryCardProps) => {
  const params = useParams<{ Id: string }>();

  const navigate = useNavigate();

  const handleViewJob = ({
    facilityId,
    jobId,
  }: {
    facilityId: number;
    jobId: number;
  }): void => {
    navigate(`/view/facility/${facilityId}/job/${jobId}`);
  };
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewDocModalOpen, setViewDocModalOpen] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<number | null>(
    null
  );
  const [currentReqId, setCurrentReqId] = useState<string>();
  const [isDocumentHovered1, setIsDocumentHovered1] = useState<boolean>(false);

  const [isShowDataTable, isSetShowDataTable] = useState(false);

  const toggleDataTables = () => {
    isSetShowDataTable(!isShowDataTable);
  };
  const handleDocumentMouseEnter = () => {
    setIsDocumentHovered1(true);
  };
  const handleDocumentMouseLeave = () => {
    setIsDocumentHovered1(false);
  };

  const viewHandler = (id: number, reqId: string) => {
    setCurrentAssignmentId(id);
    setCurrentReqId(reqId);
    setIsViewModalOpen(true);
  };
  const toggleViewDocModal = () => {
    setViewDocModalOpen(!isViewDocModalOpen);
  };

  const download = async () => {
    setLoading("loading");
    try {
      const response =
        await ProfessionalGigHistoryServices.downloadAllDocuments({
          professionalId: Number(params.Id),
          facilityId: row.Facility.Id,
          jobId: row.Job.Id,
          jobApplicationId: row.Id,
        });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/zip",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = `gighistory-${Number(params.Id)}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      showToast("error", error.response.data.message || "Error");
      setLoading("error");
    }
  };

  const Column: TableColumn<ProfessionalGigHistoryJobAssignment>[] = [
    {
      name: "Job ID",
      cell: () => (
        <div
          className="center-align roster-jobid"
          onClick={() =>
            handleViewJob({ facilityId: row.Facility.Id, jobId: row.Job.Id })
          }
        >
          JID-{row.Job.Id}
        </div>
      ),
      //   width: "9%",
    },
    {
      name: "Req ID",
      cell: (row: ProfessionalGigHistoryJobAssignment) => (
        <span className="row-user-name">
          {row.ReqId ? row.ReqId.toUpperCase() : "-"}
        </span>
      ),
    },
    {
      name: "Job Speciality",
      cell: (row: ProfessionalGigHistoryJobAssignment) => (
        <span className="row-user-name">
          {row.JobSpeciality.Speciality
            ? capitalize(row.JobSpeciality.Speciality)
            : ""}
        </span>
      ),
      minWidth:"130px"
    },
    {
      name: "Start Date & End Date",
      minWidth:"200px",
      cell: (row: ProfessionalGigHistoryJobAssignment) => (
        <div className="center-align">
          {row.StartDate
            ? formatDateInDayMonthYear(row.StartDate).replace(/-/g, "/")
            : "-"}
          -
          {row.EndDate
            ? formatDateInDayMonthYear(row.EndDate).replace(/-/g, "/")
            : "-"}
        </div>
      ),
    },
    {
      name: "Employment Status",
      minWidth:"190px",
      cell: (row: ProfessionalGigHistoryJobAssignment) => (
        <div
          className="center-align"
          style={{
            color: getStatusColor(row.JobApplicationStatus.Status),
          }}
        >
          {row.JobApplicationStatus.Status
            ? capitalize(row.JobApplicationStatus.Status)
            : ""}
        </div>
      ),
    },
    {
      name: "",
      cell: (cell: ProfessionalGigHistoryJobAssignment) => (
        <div className="d-flex center-align custom-article-btn">
          <Button
            type="button"
            className="text-nowrap history-btn"
            onClick={() => {
              viewHandler(cell.Id, cell.ReqId);
            }}
          >
            <span className="material-symbols-outlined">article</span>
          </Button>

          <GigHistoryModal
            facilityId={row.Facility.Id}
            jobId={row.Job.Id}
            jobApplicationId={row.Id}
            professionalId={Number(params.Id)}
            slotId={cell.Id}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {loading === "loading" && <Loader />}
      <div>
        <div className="job-template-wrapper bg-white w-100">
          <div className="job-temp-header">
            <div className="first-section-content d-flex align-items-center pb-2">
              <h3 className="text-nowrap me-3">
                {row.Job ? capitalize(row.Job.Title) : ""}
              </h3>
              <CustomInput
                placeholder=""
                disabled
                value={row.Job ? `JID-${row.Job.Id}` : ""}
                className="in-width input"
                style={{
                  marginRight: "10px",
                }}
              />
            </div>
          </div>
          <div className="d-flex">
            <img src={Building} />
            <p className="hospital-detail-text">
              {" "}
              {row.Facility ? capitalize(row.Facility.Name) : ""}
            </p>
            <img src={Locations} />
            <p className="hospital-detail-text">
              {row.Facility ? capitalize(row.Facility.Address) : ""}
            </p>
          </div>
          {/* <div>
            <p className="mb-2 text-purple fw-600">Extension Details</p>
            <div className="d-flex flex-wrap">
              <p>
                <span className="temp-details">Extension Offer Rate:</span>
                <span className="temp-answer">$2,250,00</span>
              </p>
              <p>
                <span className="temp-details">Bill Rate:</span>
                <span className="temp-answer">$2,250,00</span>
              </p>
              <p>
                <span className="temp-details">Start Date:</span>
                <span className="temp-answer">12/2/2023</span>
              </p>
              <p>
                <span className="temp-details">End Date:</span>
                <span className="temp-answer">12/2/2023</span>
              </p>{" "}
            </div>
          </div> */}
          <div className="assignment-history-card flex-wrap mb-3">
            <div className="d-flex align-items-center">
              {isShowDataTable ? (
                <div
                  className="cursor-pointer d-flex align-items-center"
                  onClick={toggleDataTables}
                >
                  <ExpandRowIcon />
                </div>
              ) : (
                <div
                  className="cursor-pointer d-flex align-items-center"
                  onClick={toggleDataTables}
                >
                  <AddRowIcon />
                </div>
              )}
              <p className="hospital-detail-text mb-0">Placement Details</p>
            </div>
            <div className="btn-wrapper d-flex align-items-center">
              <CustomButton
                className="secondary-btn"
                onMouseEnter={handleDocumentMouseEnter}
                onMouseLeave={handleDocumentMouseLeave}
                onClick={download}
                // color={isDocumentHovered ? "#FFF" : ""}
              >
                <DownloadIcon color={isDocumentHovered1 ? "#FFF" : "#7F47DD"} />
                All Documents
              </CustomButton>
              <CustomButton
                className="secondary-btn"
                onClick={toggleViewDocModal}
              >
                View Documents
              </CustomButton>
            </div>
          </div>
          <div className="datatable-wrapper history-table assignment-history">
            {isShowDataTable && (
              <DataTable columns={Column} data={row.JobAssignments} />
            )}
          </div>
        </div>
      </div>

      {isViewModalOpen && currentAssignmentId && (
        <AssignmentDetailsModal
          fetchGigHistory={fetchGigHistory}
          clientReqId={currentReqId ? currentReqId.toUpperCase() : "-"}
          facilityId={row.Facility.Id}
          jobId={row.Job.Id}
          jobApplicationId={row.Id}
          jobAssignmentId={currentAssignmentId}
          isOpen={isViewModalOpen}
          toggle={() => setIsViewModalOpen(false)}
        />
      )}
      {isViewDocModalOpen && (
        <GigViewDocuments
          professionalId={Number(params.Id)}
          facilityId={row.Facility.Id}
          jobApplicationId={row.Id}
          jobId={row.Job.Id}
          isOpen={isViewDocModalOpen}
          toggle={() => setViewDocModalOpen(false)}
        />
      )}
    </>
  );
};

export default AssignmentHistoryCard;
