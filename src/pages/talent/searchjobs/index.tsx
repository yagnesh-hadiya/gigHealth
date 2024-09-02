import { useState, useEffect, useRef } from "react";
import { Button } from "reactstrap";
import FilterForm from "../searchjobs/FilterForm";
import JobListing from "../searchjobs/JobListing";
import {
  getJobsList,
  getSearchJobShifts,
} from "../../../services/SearchJobsServices";
import { debounce, showToast } from "../../../helpers";
import { useLocation } from "react-router-dom";
import {
  getStatesLocations,
  getStateSpecialities,
  getProfessionCategories,
  getProfessions,
} from "../../../services/SearchJobsServices";

const Index = () => {
  const location = useLocation();
  const {
    selectedProfessionCategoriesProps,
    selectedProfessionProps,
    selectedSpecialitiesProps,
    selectedLocationsProps,
    professionCategoriesIdsProps,
    professionIdsProps,
  } = location.state || {};

  const [professionCategoriesList, setProfessionCategoriesList] = useState([]);
  const [professionsList, setProfessionsList] = useState([]);
  const [specialitiesList, setSpecialitiesList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const [selectedProfessionCategories, setSelectedProfessionCategories] =
    useState(selectedProfessionCategoriesProps || null);
  const [selectedProfession, setSelectedProfession] = useState(
    selectedProfessionProps || null
  );
  const [selectedSpecialities, setSelectedSpecialities] = useState<any[]>(
    selectedSpecialitiesProps || []
  );
  const [selectedLocations, setSelectedLocations] = useState<any[]>(
    selectedLocationsProps || []
  );

  const [professionCategoriesIds, setProfessionCategoriesIds] = useState(
    professionCategoriesIdsProps || 0
  );
  const [professionIds, setProfessionIds] = useState(professionIdsProps || 0);

  const size = 15;
  const toggle = () => setShowSideBar(!showSideBar);
  const abortController = new AbortController();
  const pageRef = useRef<number>(1);
  const [sortDir] = useState("");
  const defaultSortByFilter = { label: "--", value: 0 };

  const [sortByFilter, setSortByFilter] = useState(defaultSortByFilter);
  const [showSideBar, setShowSideBar] = useState(false);
  const [search, setSearch] = useState("");
  const [specialityIds, setSpecialityIds] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [stateIds, setStateIds] = useState("");
  const [searchJobsShift, setSearchJobShift] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [abort, setAbort] = useState<boolean>(false);
  const [fetchJobsList, setFetchJobsList] = useState<boolean>(false);

  const [jobList, setJobList] = useState<{
    total: number;
    newJobCount: number;
    data: SearchJobList[];
  }>({
    newJobCount: 0,
    total: 0,
    data: [],
  });

  const fetchJobs = debounce(async () => {
    try {
      setLoading(true);
      const sortByOptions = ["pay", "created", "start"];
      let sortByFilterPayload = "";
      if (sortByFilter.value !== 0) {
        sortByFilterPayload = sortByOptions[sortByFilter.value - 1];
      }

      const response = await getJobsList(
        size,
        pageRef.current,
        abortController,
        sortByFilterPayload,
        sortDir,
        search,
        specialityIds,
        shiftId,
        stateIds
      );

      if (pageRef.current === 1) {
        setJobList({
          data: response?.rows || [],
          total: response?.count,
          newJobCount: response?.newJobCount,
        });
      } else {
        setJobList(
          (prevJobList: {
            newJobCount: number;
            total: number;
            data: SearchJobList[];
          }) => {
            const newJobList = [
              ...prevJobList.data,
              ...response?.rows?.filter(
                (newJob: SearchJobList) =>
                  !prevJobList.data.some(
                    (prevJob: SearchJobList) => prevJob?.Id === newJob?.Id
                  )
              ),
            ];
            return {
              newJobCount: response?.newJobCount,
              total: response?.count,
              data: newJobList,
            };
          }
        );
      }
      pageRef.current += 1;
      setLoading(false);
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 200);

  const fetchMoreJobs = async () => {
    try {
      const sortByOptions = ["pay", "created", "start"];
      let sortByFilterPayload = "";
      if (sortByFilter.value !== 0) {
        sortByFilterPayload = sortByOptions[sortByFilter.value - 1];
      }

      const response = await getJobsList(
        size,
        pageRef.current,
        abortController,
        sortByFilterPayload,
        sortDir,
        search,
        specialityIds,
        shiftId,
        stateIds
      );

      if (pageRef.current === 1) {
        setJobList({
          data: response?.rows || [],
          total: response?.count,
          newJobCount: response?.newJobCount,
        });
      } else {
        setJobList(
          (prevJobList: {
            newJobCount: number;
            total: number;
            data: SearchJobList[];
          }) => {
            const newJobList = [
              ...prevJobList.data,
              ...response?.rows?.filter(
                (newJob: SearchJobList) =>
                  !prevJobList.data.some(
                    (prevJob: SearchJobList) => prevJob?.Id === newJob?.Id
                  )
              ),
            ];
            return {
              newJobCount: response?.newJobCount,
              total: response?.count,
              data: newJobList,
            };
          }
        );
      }
      pageRef.current += 1;
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      setLoading(false);
      showToast("error", error?.response?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    pageRef.current = 1;
    fetchJobs();
    return () => abortController.abort();
  }, [
    abort,
    sortByFilter,
    search,
    specialityIds,
    shiftId,
    stateIds,
    fetchJobsList,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const professionCategoriesRes = await getProfessionCategories();
      setProfessionCategoriesList(professionCategoriesRes.data.data);

      const locationsRes = await getStatesLocations();
      setLocationList(locationsRes.data.data);

      const jobShiftRes = await getSearchJobShifts();
      setSearchJobShift(jobShiftRes?.data?.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (professionIds) {
      const fetchStateSpecialities = async () => {
        const res = await getStateSpecialities(professionIds);
        setSpecialitiesList(res.data.data);
      };
      fetchStateSpecialities();
    }
  }, [professionIds]);

  useEffect(() => {
    if (professionCategoriesIds) {
      const fetchProfessions = async () => {
        const res = await getProfessions(professionCategoriesIds);
        setProfessionsList(res.data.data);
      };
      fetchProfessions();
    }
  }, [professionCategoriesIds]);

  const handleClearFilters = () => {
    setSearch("");
    setSpecialityIds("");
    setShiftId("");
    setStateIds("");
    setProfessionCategoriesIds(0);
    setProfessionsList([]);
    setProfessionIds(0);
    setSelectedSpecialities([]);
    setSelectedProfession(null);
    setSelectedProfessionCategories(null);
    setSelectedLocations([]);
    setSortByFilter(defaultSortByFilter);
  };

  useEffect(() => {
    const output_preffered_specialities = selectedSpecialities
      ?.map((item: any) => item.value)
      .join(",");
    setSpecialityIds(output_preffered_specialities);
  }, [selectedSpecialities]);

  useEffect(() => {
    const output_preffered_locations = selectedLocations
      ?.map((item: any) => item.value)
      .join(",");
    setStateIds(output_preffered_locations);
  }, [selectedLocations]);

  return (
    <div className="search-job-flex">
      <div className={`jobs-filter-wr ${showSideBar ? "sidebarOpen" : ""}`}>
        <div className="filter-head">
          <h3>Search Filters</h3>
          <Button
            color="link"
            className="transparent-btn filter-btn m-0"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
        <div className="filter-body">
          <FilterForm
            professionCategoriesList={professionCategoriesList}
            professionsList={professionsList}
            setProfessionsList={setProfessionsList}
            specialitiesList={specialitiesList}
            locationList={locationList}
            selectedProfessionCategories={selectedProfessionCategories}
            setSelectedProfessionCategories={setSelectedProfessionCategories}
            selectedProfession={selectedProfession}
            setSelectedProfession={setSelectedProfession}
            selectedSpecialities={selectedSpecialities}
            setSelectedSpecialities={setSelectedSpecialities}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            professionCategoriesIds={professionCategoriesIds}
            setProfessionCategoriesIds={setProfessionCategoriesIds}
            professionIds={professionIds}
            setProfessionIds={setProfessionIds}
            shiftId={shiftId}
            setShiftId={setShiftId}
            searchJobsShift={searchJobsShift}
          />
        </div>
        <Button
          color="link"
          className="transparent-btn close-filter-btn m-0"
          onClick={toggle}
        >
          <span className="material-symbols-outlined">close</span>
        </Button>
      </div>
      <div className={`sidebar-backdrop ${showSideBar ? "show" : ""}`}></div>
      <div className="jobs-listings pt-0" id="custom-scrollable-target">
        <JobListing
          loading={loading}
          setSearch={setSearch}
          search={search}
          toggle={toggle}
          jobList={jobList}
          sortByFilter={sortByFilter}
          setSortByFilter={setSortByFilter}
          callBack={fetchMoreJobs}
          setFetchJobsList={setFetchJobsList}
        />
      </div>
    </div>
  );
};

export default Index;
