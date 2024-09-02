import CustomInput from "../../../components/custom/CustomInput";
import Search from "../../../assets/images/search.svg";
import CustomMainCard from "../../../components/custom/CustomCard";
import Calendar from "../../../assets/images/calendar.svg";
import CustomSelect from "../../../components/custom/CustomSelect";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import {
  optioncustomStyles,
  notecustomStyles,
  formatDateInDayMonthYear,
  checkAclPermission,
  showToast,
  formatDate,
} from "../../../helpers/index";
import { useParams } from "react-router-dom";
import ACL from "../../../components/custom/ACL";
import SearchIcon from "../../../components/icons/Search";
import ProfessionalNotesServices from "../../../services/ProfessionalNotesServices";
import { NotesActivitiesType } from "../../../types/NotesTypes";
import Loader from "../../../components/custom/CustomSpinner";
import { ProfessionalActivity } from "../../../types/ProfessionalNotesTypes";
import CustomPagination from "../../../components/custom/CustomPagination";
import NoRecordsMessage from "../../facilities/facilitylisting/jobs/NoRecordsMessage";
import ProfessionalActivityModal from "./ProfessionalActivityModal";
import ProfessionalEmailModal from "./ProfessionalEmailModal";
import ProfessionalNoteCard from "./ProfessionalNoteCard";
import ExportIcon from "../../../components/icons/ExportIcon";

const ProfessionalNotes = () => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [selectedActivity, setSelectedActivity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [isEmailModal, setEmailModalOpen] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState<boolean>(false);
  const [dropdownExports, setDropdownExports] = useState(false);
  const [exports, setExports] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const allow = checkAclPermission("professionals", "notes", ["GET", "POST"]);
  const [activities, setActivities] = useState<NotesActivitiesType[]>([]);
  const [data, setData] = useState<ProfessionalActivity[]>([]);
  const params = useParams();
  const [isSearchHovered, setIsSearchHovered] = useState<boolean>(false);
  const handleSearchMouseEnter = () => setIsSearchHovered(true);
  const handleSearchMouseLeave = () => setIsSearchHovered(false);

  const getAllActivities = async () => {
    try {
      setLoading("loading");
      const response = await ProfessionalNotesServices.getActivityTypes();
      if (response.status === 200) {
        setActivities(response.data?.data);
        setLoading("idle");
      }
    } catch (error: any) {
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const fetch = useCallback(async () => {
    try {
      const res = await ProfessionalNotesServices.listActivities({
        professionalId: Number(params.Id),
        size,
        page: search.length > 0 ? currentPageSearch : page,
        search,
        typeId: selectedActivity?.value.toString(),
        startDate: startDate ? formatDate(startDate.toString()) : undefined,
        endDate: endDate ? formatDate(endDate.toString()) : undefined,
      });

      if (res.status === 200) {
        const responseData = res.data?.data[0];
        if (responseData) {
          const { count, rows } = responseData;
          setTotalRows(count);
          setData(rows);
          setTotalPages(Math.ceil(count / size));
        } else {
          showToast("error", "Response data format incorrect");
        }
      } else {
        showToast("error", res?.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [
    params.Id,
    size,
    search,
    page,
    currentPageSearch,
    selectedActivity?.value,
    startDate,
    endDate,
  ]);

  const toggleExports = () => setDropdownExports((prevState) => !prevState);

  const AddNewOptions = [
    { value: 1, label: "Activity" },
    { value: 2, label: "Email" },
  ];

  const handleOptionChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      switch (selectedOption.value) {
        case 1:
          setActivityModalOpen(true);
          break;
        case 2:
          setEmailModalOpen(true);
          break;
        default:
          setActivityModalOpen(false);
          setEmailModalOpen(false);
          setSelectedActivity(null);
          break;
      }
    } else {
      setActivityModalOpen(false);
      setEmailModalOpen(false);
      setSelectedActivity(null);
    }
  };

  const handleStatusChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setSelectedActivity(
      selectedOption
        ? {
            value: selectedOption?.value,
            label: selectedOption?.label,
          }
        : null
    );
  };

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleEndDateChange = (date: Date) => setEndDate(date);
  const handleDownloadMouseEnter = () => setIsDownloadHovered(true);
  const handleDownloadMouseLeave = () => setIsDownloadHovered(false);

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    if (search.length > 0) {
      setCurrentPageSearch(selectedPage);
    } else {
      setPage(selectedPage);
    }
  };

  const handleSearch = (text: string): void => {
    setSearch(text);
  };

  useEffect(() => {
    getAllActivities();
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const exportAsCSV = async () => {
    try {
      const res = await ProfessionalNotesServices.exportAsCsv({
        professionalId: Number(params.Id),
        search,
        typeId: selectedActivity?.value.toString(),
        startDate: startDate ? formatDate(startDate.toString()) : undefined,
        endDate: endDate ? formatDate(endDate.toString()) : undefined,
      });
      if (res.status === 200) {
        showToast(
          "success",
          res.data.message || "Export request sent succesfully"
        );
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <CustomMainCard id="custom-scrollable-target">
        <h2 className="page-content-header">
          Notes & Activity <span></span>
        </h2>
        <div
          className="d-flex mb-3 align-items-center notes-wrapper"
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
          <div className="activity-search">
            <CustomSelect
              styles={notecustomStyles}
              className="custom-select-activity"
              id="activity"
              name="activity"
              value={selectedActivity}
              placeholder="Show All Activities"
              isClearable={true}
              isSearchable={true}
              noOptionsMessage={() => "No options available"}
              options={activities.map((activity) => ({
                value: activity.Id,
                label: activity.Type,
              }))}
              onChange={handleStatusChange}
            />
          </div>
          <div className="date-range notes-range notes">
            <ReactDatePicker
              dateFormat={"dd-MM-yyyy"}
              isClearable={true}
              placeholderText="--"
              onChange={handleStartDateChange}
              selected={startDate}
              maxDate={new Date()}
              customInput={
                <div className="custom-calendar-wrapper">
                  <CustomInput
                    className="calendar-placeholder"
                    placeholder="Start Date"
                    value={
                      startDate && startDate
                        ? formatDateInDayMonthYear(startDate?.toString())
                        : ""
                    }
                  />
                  {!startDate && (
                    <img src={Calendar} className="calendar-icon" />
                  )}
                </div>
              }
            />
            <ReactDatePicker
              dateFormat={"dd-MM-yyyy"}
              isClearable={true}
              onChange={handleEndDateChange}
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
                    className="calendar-placeholder"
                    placeholder="End Date"
                    value={
                      endDate && endDate
                        ? formatDateInDayMonthYear(endDate?.toString())
                        : ""
                    }
                  />
                  {!endDate && <img src={Calendar} className="calendar-icon" />}
                </div>
              }
            />
            {/* <img
              src={Search}
              alt="search"
              className="activity-search-icon"
              onClick={handleDateListener}
            /> */}
            <div
              onMouseEnter={handleSearchMouseEnter}
              onMouseLeave={handleSearchMouseLeave}
              className="header-search-icon"
            >
              <SearchIcon color={isSearchHovered ? "#FFF" : "#717B9E"} />
            </div>
          </div>
          <div className="d-flex jobs-right-wrapper note-wrapper note-right-button export-select-btn">
            <>
              <ACL module="professionals" submodule="notes" action={["GET"]}>
                <button
                  className="jobs-right-button"
                  onClick={() => setExports(!exports)}
                ></button>
              </ACL>
              <Dropdown
                className="jobs-dropdown-content export-option"
                isOpen={dropdownExports}
                toggle={toggleExports}
              >
                <DropdownToggle
                  className="drop-down"
                  caret
                  onMouseEnter={handleDownloadMouseEnter}
                  onMouseLeave={handleDownloadMouseLeave}
                >
                  <ExportIcon
                    className="expert-icon"
                    color={isDownloadHovered ? "#FFF" : "#7f47dd"}
                  />

                  <span className="icon-shift">Export</span>
                </DropdownToggle>
                <DropdownMenu>
                  <div className="jobs-dropdown">
                    <h5
                      className="jobs-dropdown-heading "
                      onClick={exportAsCSV}
                    >
                      Export as CSV
                    </h5>
                  </div>
                </DropdownMenu>
              </Dropdown>
            </>
          </div>
          {allow && (
            <CustomSelect
              styles={optioncustomStyles}
              id="addnew"
              name="addnew"
              options={AddNewOptions}
              onChange={handleOptionChange}
              placeholder="Add New"
              isClearable={false}
              isSearchable={false}
              noOptionsMessage={() => "No options available"}
              isDisabled={!allow}
            />
          )}
        </div>

        {data.length !== 0 ? (
          <>
            {data.map((activity) => (
              <ProfessionalNoteCard
                fetchNotes={fetch}
                activity={activity}
                professionalId={Number(params.Id)}
              />
            ))}
            <div
              style={{
                marginTop: "auto",
              }}
            >
              <CustomPagination
                currentPage={search.length > 0 ? currentPageSearch : page}
                totalPages={totalPages}
                onPageChange={handlePageSizeChange}
                onPageSizeChange={setSize}
                entriesPerPage={size}
                totalRows={totalRows}
                setPage={search.length > 0 ? setCurrentPageSearch : setPage}
              />
            </div>
          </>
        ) : (
          <div className="mt-2">
            <NoRecordsMessage msg={"There are no records to display"} />
          </div>
        )}
      </CustomMainCard>
      {isActivityModalOpen && (
        <ProfessionalActivityModal
          isOpen={isActivityModalOpen}
          toggle={() => setActivityModalOpen(false)}
          professionalId={Number(params.Id)}
          fetchNotes={fetch}
        />
      )}
      {/* {isMessageModal && (
        <MessageModal
          isOpen={isMessageModal}
          toggle={() => setMessageModal(false)}
        />
      )} */}
      {isEmailModal && (
        <ProfessionalEmailModal
          isOpen={isEmailModal}
          toggle={() => setEmailModalOpen(false)}
          professionalId={Number(params.Id)}
          fetchNotes={fetch}
        />
      )}
    </>
  );
};

export default ProfessionalNotes;
