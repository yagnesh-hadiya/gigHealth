import { showToast } from "../../../../helpers";
import { getJobStatuses } from "../../../../services/JobsServices";
import JobContent from "./JobContent";
import JobHeader from "./JobHeader";
import { useEffect, useState } from "react";

const Jobs = () => {
  const [search, setSearch] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<{ Id: number; Status: string }[]>(
    []
  );
  const [selectedJobStatus, setSelectedJobStatus] = useState<{
    Id: number;
    Status: string;
  } | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<null | Date>(null);
  //   const [searchByDate, setSearchByDate] = useState(false);

  //   const handleDateListener = () => {
  //     if (startDate !== null || endDate !== null) {
  //       setSearchByDate(true);
  //     } else {
  //       setSearchByDate(false);
  //     }
  //   };

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    getJobStatuses()
      .then((res) => {
        setJobStatus(res.data?.data);
      })
      .catch((error) => {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      });
  }, []);

  return (
    <div className="right-job-card-section">
      <JobHeader
        search={search}
        handleSearch={handleSearch}
        jobStatus={jobStatus}
        selectedJobStatus={selectedJobStatus}
        setSelectedJobStatus={setSelectedJobStatus}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        // handleDateListener={handleDateListener}
      />

      <JobContent
        search={search}
        jobStatus={jobStatus}
        selectedJobStatus={selectedJobStatus}
        startDate={startDate}
        endDate={endDate}
        // searchByDate={searchByDate}
      />
    </div>
  );
};

export default Jobs;
