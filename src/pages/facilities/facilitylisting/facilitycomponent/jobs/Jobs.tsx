import { useEffect, useReducer, useRef, useState } from "react";
import { getFacilityJobList } from "../../../../../services/FacilityJobsServices";
import { useNavigate, useParams } from "react-router";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import FacilityJobsHeader from "./FacilityJobsHeader";
import JobCard from "./JobCard";
import { JobsActions, JobsListType } from "../../../../../types/JobsTypes";
import Loader from "../../../../../components/custom/CustomSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import NoRecordsMessage from "../../jobs/NoRecordsMessage";
import { debounce, showToast } from "../../../../../helpers";
import { getJobStatuses } from "../../../../../services/JobsServices";
import jobsReducer from "../../../../../helpers/reducers/JobsReducer";
import { jobsInitialStateValue } from "../../../../../types";

const Jobs = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const pageRef = useRef<number>(1);
  // const [jobList, setJobList] = useState<JobsListType[]>([]);
  const [jobList, setJobList] = useState<{
    total: number;
    data: JobsListType[];
  }>({
    total: 0,
    data: [],
  });
  const [state, dispatch] = useReducer(jobsReducer, jobsInitialStateValue);
  const [abort, setAbort] = useState<boolean>(false);

  const handleAddJob = () => {
    navigate("/jobs/create", {
      state: {
        facilityId: Number(params?.Id),
      },
    });
  };

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    getJobStatuses()
      .then((res) => {
        dispatch({ type: JobsActions.SetJobStatus, payload: res.data?.data });
      })
      .catch((error) => {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      });
  }, []);

  const abortController = new AbortController();
  const fetchFacilityJobsList = debounce(async () => {
    try {
      setLoading(true);
      const response = await getFacilityJobList(
        Number(params?.Id),
        4,
        pageRef.current,
        abortController,
        state.selectedJobStatus?.Id,
        search
      );

      if (pageRef.current === 1) {
        setJobList({
          data: response.data?.data[0]?.rows || [],
          total: response.data?.data[0]?.count,
        });
      } else {
        setJobList((prevJobList: { total: number; data: JobsListType[] }) => {
          const newJobList = [
            ...prevJobList.data,
            ...response.data?.data[0]?.rows?.filter(
              (newJob: JobsListType) =>
                !prevJobList.data.some(
                  (prevJob: JobsListType) => prevJob?.Id === newJob?.Id
                )
            ),
          ];

          return {
            total: response.data?.data[0]?.count,
            data: newJobList,
          };
        });
      }

      pageRef.current += 1;
      setLoading(false);
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 200);

  useEffect(() => {
    pageRef.current = 1;
    fetchFacilityJobsList();

    return () => abortController.abort();
  }, [abort, search, state.selectedJobStatus]);

  return (
    <div className="facility-main-card-section">
      <CustomMainCard id="custom-scrollable-target">
        <FacilityJobsHeader
          handleAddJob={handleAddJob}
          search={search}
          handleSearch={handleSearch}
          state={state}
          dispatch={dispatch}
          total={jobList.total}
        />
        {/* {!jobList && !jobList.data?.length > 0 && <Loader />} */}
        {jobList && jobList.data?.length > 0 ? (
          <div>
            <InfiniteScroll
              dataLength={jobList.data.length}
              next={fetchFacilityJobsList}
              hasMore={jobList.total > jobList.data?.length}
              loader={""}
              scrollableTarget="custom-scrollable-target"
            >
              {jobList &&
                jobList.data?.map((list: JobsListType, index: number) => (
                  <JobCard key={index} JobData={list} state={state} />
                ))}
            </InfiniteScroll>
            {loading && <Loader styles={{ top: "40%", left: "0%" }} />}
          </div>
        ) : (
          <NoRecordsMessage msg={"There are no records to display"} />
        )}
      </CustomMainCard>
    </div>
  );
};

export default Jobs;
