import CustomMainCard from "../../../../../components/custom/CustomCard";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomInput from "../../../../../components/custom/CustomInput";
import Search from "../../../../../assets/images/search.svg";
import { useCallback, useEffect, useState } from "react";
import CustomButton from "../../../../../components/custom/CustomBtn";
import ApplicantProfileModal from "./ApplicantProfileModal";
import { ApplicantType } from "../../../../../types/ApplicantTypes";
import { getApplicants } from "../../../../../services/ApplicantsServices";
import { useParams } from "react-router-dom";
import Loader from "../../../../../components/custom/CustomSpinner";
import { toast } from "react-toastify";
import {
  capitalize,
  debounce,
  formatDateInDayMonthYear,
} from "../../../../../helpers";
import { RightJobContentData } from "../../../../../types/JobsTypes";

const ApplicantList = ({ job }: { job: RightJobContentData }) => {
  const params = useParams();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [data, setData] = useState<ApplicantType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentApplicantId, setCurrentApplicantId] = useState<number | null>(
    null
  );
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
  };
  const [abort, setAbort] = useState<boolean>(false);

  const abortController = new AbortController();
  const fetchApplicants = useCallback(
    debounce(async (): Promise<void> => {
      setLoading("loading");
      try {
        const response = await getApplicants({
          facilityId: Number(params?.fId),
          jobId: Number(params?.jId),
          search: search.length > 0 ? search : undefined,
          abortController,
        });
        if (response.status === 200) {
          setData(response.data.data);
          setLoading("idle");
        }
      } catch (error: any) {
        if (abortController.signal.aborted) {
          setAbort(true);
          return;
        }
        setLoading("error");
        toast.error(error?.response?.data?.message || "Something went wrong");
        console.error(error);
      }
    }, 300),
    [params?.fId, params?.jId, search, abort]
  );

  useEffect(() => {
    fetchApplicants();

    return () => abortController.abort();
  }, [fetchApplicants, abort]);

  const Column: TableColumn<ApplicantType>[] = [
    {
      name: "Id",
      selector: (row: ApplicantType) => row.Id,
      width: "6%",
    },
    {
      name: "Professional Name",
      width: "25%",
      cell: (row: ApplicantType) => (
        <div
          className="table-username"
          onClick={() => {
            setCurrentApplicantId(row.Id);
            setProfessionalId(row.Professional.Id);
            setCurrentStatus(row.JobApplicationStatus.Status);
            toggleProfileModal();
          }}
        >
          <p style={{ marginRight: "5px" }} className="name-logo">
            {capitalize(row.Professional.FirstName[0])}
            {capitalize(row.Professional.LastName[0])}
          </p>
          <span className="center-align text-align">
            <span className="user-name">
              {capitalize(row.Professional.FirstName)}{" "}
              {capitalize(row.Professional.LastName)}
            </span>
          </span>
        </div>
      ),
    },
    {
      name: "Phone",
      //   width: "10%",
      selector: (row: ApplicantType): string =>
        row.Professional.Phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
    },
    {
      name: "Experience",
      width: "10%",
      cell: (row: ApplicantType) => (
        <div className="center-align">
          {" "}
          {row.Professional.Experience
            ? `${row.Professional.Experience} Years`
            : "-"}
        </div>
      ),
    },
    {
      name: "Location",
      width: "12%",
      cell: (row: ApplicantType) => (
        <div className="center-align">{row.Professional.State.State}</div>
      ),
    },
    {
      name: "Applied On",
      // width: "12%",
      cell: (row: ApplicantType) => (
        <div className="center-align">
          {formatDateInDayMonthYear(row.AppliedOn)}
        </div>
      ),
    },
    {
      name: "",
      cell: (cell: ApplicantType) => (
        <>
          <div className="right-buttons mt-0">
            <CustomButton
              className="professional-button view"
              onClick={() => {
                setCurrentApplicantId(cell.Id);
                setProfessionalId(cell.Professional.Id);
                setCurrentStatus(cell.JobApplicationStatus.Status);
                toggleProfileModal();
              }}
            >
              View Profile
            </CustomButton>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="facility-main-card-section">
        <CustomMainCard>
          <div className="facility-listing-loader">
            <h2 className="page-content-header">
              Professionals Applied On the Job
            </h2>
          </div>
          <div className="search-bar-wrapper w-100 mb-3">
            <CustomInput
              placeholder="Search Here"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <img src={Search} alt="search" />
          </div>
          <div className="datatable-wrapper">
            <DataTable
              columns={Column}
              data={data}
              selectableRows={false}
              progressComponent={<Loader />}
              responsive={true}
            />
          </div>
        </CustomMainCard>
      </div>
      {isProfileModalOpen && currentApplicantId && professionalId && (
        <ApplicantProfileModal
          status={currentStatus}
          job={job}
          jobId={Number(params?.jId)}
          facilityId={Number(params?.fId)}
          currentApplicantId={currentApplicantId}
          professionalId={professionalId}
          isOpen={isProfileModalOpen}
          toggle={toggleProfileModal}
          fetchApplicants={fetchApplicants}
        />
      )}
    </>
  );
};

export default ApplicantList;
