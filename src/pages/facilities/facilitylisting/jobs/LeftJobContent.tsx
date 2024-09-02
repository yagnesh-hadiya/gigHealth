import { useEffect, useReducer, useRef, useState } from "react";
import JobCard from "./JobCard";
import LeftContentHeader from "./LeftContentHeader";
import {
  JobsActions,
  JobsListType,
  LeftJobContentProps,
} from "../../../../types/JobsTypes";
import {
  exportJobsToCSV,
  getJobShifts,
  getJobSpecialities,
  getJobsList,
  getProfessions,
  getProfessionsCategories,
} from "../../../../services/JobsServices";
import { debounce, formatDate, showToast } from "../../../../helpers";
import Loader from "../../../../components/custom/CustomSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { jobsInitialStateValue } from "../../../../types";
import jobsReducer from "../../../../helpers/reducers/JobsReducer";
import { getStates } from "../../../../services/user";
import NoRecordsMessage from "./NoRecordsMessage";
import { ProfessionSubCategoryType } from "../../../../types/ProfessionalTypes";

const LeftJobContent = ({
  search,
  jobStatus,
  selectedJobStatus,
  startDate,
  endDate,
  setIds,
  // searchByDate,
  setFetchRightJobCard,
}: LeftJobContentProps) => {
  const [state, dispatch] = useReducer(jobsReducer, jobsInitialStateValue);
  const [jobList, setJobList] = useState<JobsListType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pageRef = useRef<number>(1);
  const totalCountRef = useRef<number>(0);
  const [initialLoadComplete, setInitialLoadComplete] =
    useState<boolean>(false);
  const [sort, setSort] = useState<{
    sortkey: string;
    sortDir: string;
    sortBehavior: string;
  }>({
    sortkey: "",
    sortDir: "",
    sortBehavior: "",
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [abort, setAbort] = useState<boolean>(false);

  const [specialityId, setSpecialityId] = useState<number>();
  const [professionId, setProfessionId] = useState<number>(0);
  // const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

  useEffect(() => {
    Promise.all([
      getProfessions(),
      // getJobSpecialities(),
      getStates(),
      getJobShifts(),
    ])
      .then(([apiProfession, apiStates, apiShifts]) => {
        dispatch({
          type: JobsActions.SetProfession,
          payload: apiProfession.data?.data,
        });
        // dispatch({
        //   type: JobsActions.SetSpeciality,
        //   payload: apiSpecialities.data?.data,
        // });
        dispatch({ type: JobsActions.SetState, payload: apiStates.data?.data });
        dispatch({
          type: JobsActions.SetShiftTime,
          payload: apiShifts.data?.data,
        });
        setInitialLoadComplete(true);
      })
      .catch((error) => {
        console.error(error);
        showToast("error", error?.message || "Something went wrong");
      });
  }, []);

  const abortController = new AbortController();
  const fetchJobsList = debounce(async () => {
    try {
      if (endDate !== null && startDate !== null && endDate < startDate) {
        showToast("error", "End date must be greater than start date");
        setLoading(false);
        return;
      }

      const response = await getJobsList(
        5,
        pageRef.current,
        search,
        abortController,
        sort.sortkey,
        sort.sortDir,
        selectedJobStatus?.Id,
        professionId,
        state.selectedSpecialities?.Id,
        state.selectedState?.value,
        state.selectedShiftTime?.Id,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );

      if (pageRef.current === 1) {
        setJobList(response.data?.data[0]?.rows);
        totalCountRef.current = response.data?.data[0]?.count;
      } else {
        setJobList((prevJobList: JobsListType[]) => {
          const newJobList = [
            ...prevJobList,
            ...response.data?.data[0]?.rows.filter(
              (newJob: JobsListType) =>
                !prevJobList.some(
                  (prevJob: JobsListType) => prevJob?.Id === newJob?.Id
                )
            ),
          ];
          return newJobList;
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
    fetchJobsList();

    return () => abortController.abort();
  }, [abort, search, selectedJobStatus, sort, startDate, endDate]);

  useEffect(() => {
    if (jobList && jobList.length > 0) {
      setIds({
        facilityId: jobList[0]?.Facility?.Id,
        templateId: jobList[0]?.Id,
      });
    } else if (!jobList.length) {
      setIds({ facilityId: "", templateId: "" });
    }
  }, [jobList]);

  // const fetchProfession = async () => {
  //   if (selectedCategory) {
  //     const response = await getProfessionsCategories(selectedCategory);

  //     setProfession(response.data?.data);
  //   }
  // };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getJobSpecialities(specialityId);
        dispatch({
          type: JobsActions.SetSpeciality,
          payload: specialities?.data?.data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfessionSubcategories = async () => {
    try {
      const professionLength = state.profession?.length;
      if (professionLength > 0) {
        const subCategoriesArray = [];
        for (let i = 1; i <= professionLength; i++) {
          const response = await getProfessionsCategories(i);
          subCategoriesArray.push(response.data?.data);
        }
        setSubCategories(subCategoriesArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [state.profession?.length]);

  // const handleProfession = (categoryIndex: number) => {
  //   setSelectedCategory(categoryIndex);
  // };

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCategoryProfession(professionItem.Profession);
    dispatch({
      type: JobsActions.SetCount,
      payload: { ...state.count, professionCount: true },
    });
    dispatch({
      type: JobsActions.SetSelectedSpecialities,
      payload: null,
    });
    setSpecialityId(professionItem.Id);
    setProfessionId(professionItem.Id);
  };

  // useEffect(() => {
  //   fetchProfession();
  //   setProfession([]);
  // }, [selectedCategory]);

  useEffect(() => {
    fetchSpecialities();
  }, [specialityId]);

  const handleClick = (index: number) => {
    if (jobList[index]) {
      const clickedJob: JobsListType = jobList[index];
      const facilityId: number = clickedJob?.Facility?.Id;
      const templateId: number = clickedJob?.Id;

      setIds({ facilityId, templateId });
      setActiveIndex(index);
    }
  };

  const handleExport = debounce(async () => {
    try {
      setLoading(true);
      const response = await exportJobsToCSV(
        sort.sortkey,
        sort.sortDir,
        selectedJobStatus?.Id,
        professionId,
        state.selectedSpecialities?.Id,
        state.selectedState?.value,
        state.selectedShiftTime?.Id,
        search,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      showToast(
        "success",
        "Export request sent successfully" || response.data?.message
      );
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 1000);

  return (
    <>
      <div
        id="custom-scrollable-target"
        className="main-card-wrapper main-wrapper-section left-content-section"
        style={{ height: "100vh" }}
      >
        <LeftContentHeader
          profession={state.profession}
          speciality={state.speciality}
          states={state.states}
          shiftTime={state.shiftTime}
          currentState={state}
          dispatch={dispatch}
          fetchJobsList={fetchJobsList}
          pageRef={pageRef}
          setSort={setSort}
          sort={sort}
          totalCountRef={totalCountRef}
          handleExport={handleExport}
          setAbort={setAbort}
          handleProfessionCategory={handleProfessionCategory}
          categoryProfession={categoryProfession}
          professionCategory={subCategories}
          setCategoryProfession={setCategoryProfession}
          setProfessionId={setProfessionId}
        />
        {loading && !initialLoadComplete && (
          <Loader styles={{ top: "0", left: "-15%" }} />
        )}
        {(!loading || initialLoadComplete) && (
          <>
            {jobList && jobList.length > 0 ? (
              <>
                {jobList.length === 0 && !loading && search && (
                  <NoRecordsMessage
                    msg={"No records found for the search term"}
                  />
                )}
                <InfiniteScroll
                  dataLength={jobList.length}
                  next={fetchJobsList}
                  hasMore={totalCountRef.current > jobList.length}
                  loader={
                    loading && <Loader styles={{ top: "46%", left: "-15%" }} />
                  }
                  scrollableTarget="custom-scrollable-target"
                >
                  {jobList &&
                    jobList?.map((list: JobsListType, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`${
                          activeIndex === index ? "active-job-card" : ""
                        }`}
                      >
                        <JobCard
                          JobStatus={jobStatus}
                          Id={list?.Id}
                          TotalGrossPay={list?.TotalGrossPay}
                          MinYearsExperience={list?.MinYearsExperience}
                          Title={list?.Title}
                          Profession={list?.JobProfession?.Profession}
                          ContractLength={list?.ContractLength}
                          BillRate={list?.BillRate}
                          NoOfOpenings={list?.NoOfOpenings}
                          Location={list?.Location}
                          Speciality={list?.JobSpeciality?.Speciality}
                          Name={list?.Facility?.Name}
                          Address={list?.Facility?.Address}
                          ContractStartDate={list?.ContractStartDate}
                          CreatedOn={list?.CreatedOn}
                          Status={list?.JobStatus}
                          Facility={list?.Facility}
                          ApplicantCount={list?.ApplicantCount}
                          setFetchRightJobCard={setFetchRightJobCard}
                        />
                      </div>
                    ))}
                </InfiniteScroll>
                {loading && <Loader styles={{ top: "46%", left: "-15%" }} />}
              </>
            ) : (
              <>
                {jobList.length === 0 && !loading && (
                  <NoRecordsMessage msg={"There are no records to display"} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LeftJobContent;
