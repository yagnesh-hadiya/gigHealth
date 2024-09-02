import CustomMainCard from "../../../components/custom/CustomCard";
import CustomInput from "../../../components/custom/CustomInput";
import { useCallback, useEffect, useState } from "react";
import Search from "../../../assets/images/search.svg";
import Calendar from "../../../assets/images/calendar.svg";
import ReactDatePicker from "react-datepicker";
import AssignmentHistoryCard from "./AssignmentHistory/Card";
import { useParams } from "react-router-dom";
import ProfessionalGigHistoryServices from "../../../services/ProfessionalGigHistoryServices";
import Loader from "../../../components/custom/CustomSpinner";
import { ProfessionalGigHistoryType } from "../../../types/ProfessionalGigHistoryType";
import CustomPagination from "../../../components/custom/CustomPagination";
import {
  debounce,
  formatDate,
  formatDateInDayMonthYear,
} from "../../../helpers";

const AssignmentHistory = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [page, setPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const [data, setData] = useState<ProfessionalGigHistoryType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [abort, setAbort] = useState<boolean>(false);

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    if (search) {
      setCurrentPageSearch(selectedPage);
    } else {
      setPage(selectedPage);
    }
  };

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(1);
  };

  const params = useParams<{ Id: string }>();

  const abortController = new AbortController();
  const fetchGigHistory = useCallback(
    debounce(async () => {
      setLoading("loading");
      try {
        const response =
          await ProfessionalGigHistoryServices.getProfessionalGigHistory({
            professionalId: Number(params.Id),
            size: 10,
            page: search ? currentPageSearch : page,
            search: search.length > 0 ? search : undefined,
            startDate: startDate ? formatDate(startDate.toString()) : undefined,
            endDate: endDate ? formatDate(endDate.toString()) : undefined,
            abortController,
          });
        setTotalRows(response.data.data[0].count);
        setData(response.data.data[0].rows);
        setTotalPages(Math.ceil(response.data.data[0].count / 10));
        setLoading("idle");
      } catch (error) {
        if (abortController.signal.aborted) {
          setAbort(true);
          return;
        }
        console.error(error);
        setLoading("error");
      }
    }, 300),
    [currentPageSearch, endDate, page, params.Id, search, startDate, abort]
  );

  useEffect(() => {
    fetchGigHistory();

    return () => abortController.abort();
  }, [fetchGigHistory, abort]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div
        className="d-flex mt-2 px-3 pt-3 align-items-center notes-wrapper"
        style={{ gap: "10px" }}
      >
        <div className="search-bar-wrapper w-100">
          <CustomInput
            placeholder="Search Here"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              handleSearch(e.target.value)
            }
          />
          <img src={Search} alt="search" />
        </div>
        <div className="date-range notes-range notes">
          <ReactDatePicker
            dateFormat={"dd-MM-yyyy"}
            isClearable={true}
            placeholderText="--"
            onChange={(date) => {
              setStartDate(date);
            }}
            selected={startDate}
            customInput={
              <div className="custom-calendar-wrapper">
                <CustomInput
                  placeholder={
                    startDate
                      ? formatDateInDayMonthYear(startDate.toDateString())
                      : "Start Date"
                  }
                  value={null}
                />
                {!startDate && <img src={Calendar} className="calendar-icon" />}
              </div>
            }
          />
          <ReactDatePicker
            dateFormat={"dd-MM-yyyy"}
            isClearable={true}
            onChange={(date) => {
              setEndDate(date);
            }}
            placeholderText="----"
            minDate={
              startDate
                ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                : new Date()
            }
            selected={endDate}
            customInput={
              <div className="custom-calendar-wrapper">
                <CustomInput
                  placeholder={
                    endDate
                      ? formatDateInDayMonthYear(endDate.toDateString())
                      : "End Date"
                  }
                  value={null}
                />
                {!endDate && <img src={Calendar} className="calendar-icon" />}
              </div>
            }
          />
          {/* <img src={Search} alt="search" className="activity-search-icon" /> */}
        </div>
      </div>
      <CustomMainCard id="custom-scrollable-target">
        {data.map((row: ProfessionalGigHistoryType) => (
          <AssignmentHistoryCard
            key={row.Id}
            row={row}
            fetchGigHistory={fetchGigHistory}
          />
        ))}

        <div style={{ marginTop: "auto" }}>
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageSizeChange}
            onPageSizeChange={setSize}
            entriesPerPage={size}
            totalRows={totalRows}
            setPage={setPage}
          />
        </div>
      </CustomMainCard>
    </>
  );
};

export default AssignmentHistory;
