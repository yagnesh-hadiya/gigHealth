import CustomInput from "../../../../../components/custom/CustomInput";
import Search from "../../../../../assets/images/search.svg";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import Calendar from "../../../../../assets/images/calendar.svg";
import NoteCard from "./NoteCard";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import ActivityModal from "./AcitivityModal";
// import MessageModal from "./MessageModal";
import EmailModal from "./EmailModal";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
// import ExportIcon from "../../../../../components/icons/ExportIcon";
import {
  optioncustomStyles,
  notecustomStyles,
  showToast,
  formatDateInDayMonthYear,
  formatDate,
  debounce,
  checkAclPermission,
} from "../../../../../helpers/index";
import { useParams } from "react-router-dom";
import {
  exortNotesToCSV,
  getNotesActivities,
  getNotesList,
} from "../../../../../services/NotesServices";
import { NotesActivitiesType } from "../../../../../types/NotesTypes";
import Loader from "../../../../../components/custom/CustomSpinner";
import { Note } from "../../../../../types/StoreInitialTypes";
import NoRecordsMessage from "./NoRecordsMessage";
import ACL from "../../../../../components/custom/ACL";
import SearchIcon from "../../../../../components/icons/Search";
import CustomPagination from "../../../../../components/custom/CustomPagination";

const Notes = () => {
  const [selectedActivity, setSelectedActivity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isAcitivityModalOpen, setAcitivityModalOpen] = useState(false);
  // const [isMessageModal, setMessageModal] = useState(false);
  const [isEmailModal, setEmailModalOpen] = useState(false);
  const [, setIsDownloadHovered] = useState<boolean>(false);
  const [dropdownExports, setDropdownExports] = useState(false);
  const [exports, setExports] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const [activities, setActivities] = useState<NotesActivitiesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [notesList, setNotesList] = useState<Note[]>([]);
  const facilityId = useParams();
  const allow = checkAclPermission("facilities", "notes", ["GET", "POST"]);

  const toggleExports = () => setDropdownExports((prevState) => !prevState);

  const getAllActivities = async () => {
    try {
      setLoading(true);
      const response = await getNotesActivities();
      setActivities(response.data?.data);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllActivities();
  }, []);

  const fetchNotesList = useCallback(async () => {
    try {
      if (endDate !== null && startDate !== null && endDate < startDate) {
        showToast("error", "End date must be greater than start date");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await getNotesList(
        Number(facilityId?.Id),
        size,
        search.length > 0 ? currentPageSearch : page,
        search,
        selectedActivity?.value,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );

      if (response.status === 200) {
        const responseData = response.data?.data[0];
        if (responseData) {
          const { count, rows } = responseData;
          setTotalRows(count);
          setNotesList(rows);
          setTotalPages(Math.ceil(count / size));
        } else {
          showToast("error", "Response data format incorrect");
        }
      } else {
        showToast("error", response?.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [
    currentPageSearch,
    endDate,
    facilityId?.Id,
    page,
    search,
    selectedActivity?.value,
    size,
    startDate,
  ]);

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    if (search.length > 0) {
      setCurrentPageSearch(selectedPage);
    } else {
      setPage(selectedPage);
    }
  };

  useEffect(() => {
    fetchNotesList();
  }, [fetchNotesList]);

  const AddNewOptions = [
    { value: 1, label: "Activity" },
    { value: 2, label: "Email" },
    // { value: 3, label: "Message" },
  ];

  const handleExportToCsv = debounce(async () => {
    try {
      setLoading(true);
      const response = await exortNotesToCSV(
        Number(facilityId?.Id),
        search,
        selectedActivity?.value,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        endDate && endDate ? formatDate(endDate?.toString()) : ""
      );
      showToast(
        "success",
        "Export request sent succesfully" || response.data?.message
      );
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 1000);

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

  const handleOptionChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      switch (selectedOption.value) {
        case 1:
          setAcitivityModalOpen(true);
          break;
        case 2:
          setEmailModalOpen(true);
          break;
        case 3:
          // setMessageModal(true);
          break;
        default:
          setAcitivityModalOpen(false);
          // setMessageModal(false);
          setEmailModalOpen(false);
          setSelectedActivity(null);
          break;
      }
    } else {
      setAcitivityModalOpen(false);
      // setMessageModal(false);
      setEmailModalOpen(false);
      setSelectedActivity(null);
    }
  };

  const handleDownloadMouseEnter = () => setIsDownloadHovered(true);
  const handleDownloadMouseLeave = () => setIsDownloadHovered(false);
  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleEndDateChange = (date: Date) => setEndDate(date);
  const handleSearch = (text: string) => setSearch(text);
  const handleSearchMouseEnter = () => setIsSearchHovered(true);
  const handleSearchMouseLeave = () => setIsSearchHovered(false);
  const [isSearchHovered, setIsSearchHovered] = useState<boolean>(false);

  const [dataDrp] = useState([
    {
      label: <>American Hospital Association <span className="span-brd">Parent</span></>,
      value: 1,
    },
    {
      label: <>American Hospital Association 2 <span className="span-brd">Parent</span></>,
      value: 2,
    },
    {
      label: <>American Hospital Association 3 <span className="span-brd">Parent</span></>,
      value: 3,
    },
  ]);

  return (
    <>
      <div className="facility-main-card-section">
        <CustomMainCard id="custom-scrollable-target">
          <h2 className="page-content-header">
            Notes & Activity <span></span>
          </h2>

          <div
            className="d-flex align-items-center search-button template-header"
            style={{ gap: "10px", marginBottom: '10px' }}
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
            <div className="activity-search custom-height-40">
              <CustomSelect
                styles={notecustomStyles}
                className="custom-select-activity"
                id="activity"
                name="activity"
                options={activities?.map(
                  (activity: {
                    Id: number;
                    Type: string;
                  }): { value: number; label: string } => ({
                    value: activity?.Id,
                    label: activity?.Type,
                  })
                )}
                value={selectedActivity}
                onChange={handleStatusChange}
                placeholder="Show All Activities"
                isClearable={true}
                isSearchable={true}
                noOptionsMessage={() => "No options available"}
              />
            </div>

            <div className="facility-header-cus-drp dt-facility-drp">
              <CustomSelect
                value={dataDrp[0]}
                id="select_profession"
                isSearchable={false}
                placeholder={"Select Profession"}
                onChange={() => { }}
                name=""
                noOptionsMessage={() => ""}
                options={dataDrp}
              ></CustomSelect>
            </div>

            <ACL
              submodule={"notes"}
              module={"facilities"}
              action={["GET", "POST"]}
            >
              <CustomSelect
                styles={optioncustomStyles}
                id="addnew"
                name="addnew"
                options={AddNewOptions}
                onChange={handleOptionChange}
                placeholder="Add New"
                isClearable={false}
                isSearchable={false}
                className="select-btn"
                noOptionsMessage={() => "No options available"}
                isDisabled={!allow}
              />
            </ACL>
          </div>
          <div className="d-flex justify-content-end" style={{ marginBottom: '12px', gap: '10px' }}>
            <div className="date-range notes-range notes">
              <ReactDatePicker
                dateFormat={"dd-MM-yyyy"}
                isClearable={true}
                placeholderText="--"
                onChange={handleStartDateChange}
                // minDate={new Date()}
                selected={startDate}
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
              {/* <span className="hyphen">-</span> */}
              <ReactDatePicker
                dateFormat={"dd-MM-yyyy"}
                isClearable={true}
                onChange={handleEndDateChange}
                placeholderText="----"
                // minDate={new Date()}
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
                    {!endDate && (
                      <img src={Calendar} className="calendar-icon" />
                    )}
                  </div>
                }
              />
              <div
                onMouseEnter={handleSearchMouseEnter}
                onMouseLeave={handleSearchMouseLeave}
                className="header-search-icon"
              // onClick={() => handleDateListener()}
              >
                <SearchIcon color={isSearchHovered ? "#FFF" : "#717B9E"} />
              </div>
              {/* <img
              src={Search}
              alt="search"
              className="activity-search-icon"
              onClick={handleDateListener}
            /> */}
            </div>
            {notesList.length > 0 && (
              <div className="d-flex note-wrapper note-right-button">
                <>
                  <ACL
                    submodule={"notes"}
                    module={"facilities"}
                    action={["GET", "GET"]}
                  >
                    <button
                      className="note-btn"
                      onMouseEnter={handleDownloadMouseEnter}
                      onMouseLeave={handleDownloadMouseLeave}
                      onClick={() => setExports(!exports)}
                    ></button>
                  </ACL>
                  <Dropdown
                    className="jobs-dropdown-content export-option btn-notes"
                    isOpen={dropdownExports}
                    toggle={toggleExports}
                  >
                    <DropdownToggle
                      className="drop-down"
                      caret
                      onMouseEnter={handleDownloadMouseEnter}
                      onMouseLeave={handleDownloadMouseLeave}
                    >
                      {/* <ExportIcon
                    className="expert-icon"
                    color={isDownloadHovered ? "#FFF" : "#7F47DD"}
                  /> */}
                      <p className="material-symbols-outlined mb-0 ms-2">
                        download
                      </p>

                      <span className="icon-shift ms-0">Export</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <div className="jobs-dropdown">
                        <p
                          className="jobs-dropdown-heading"
                          onClick={handleExportToCsv}
                        >
                          Export as CSV
                        </p>
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                </>
              </div>
            )}
          </div>
          {loading && notesList.length === 0 && (
            <Loader styles={{ top: "20%", left: "12%" }} />
          )}
          {notesList.length !== 0 ? (
            <>
              {notesList.map((activity) => (
                <NoteCard
                  facId={Number(facilityId?.Id)}
                  fetchNotes={fetchNotesList}
                  data={activity}
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
      </div>
      {isAcitivityModalOpen && (
        <ActivityModal
          isOpen={isAcitivityModalOpen}
          toggle={() => setAcitivityModalOpen(false)}
          facilityId={Number(facilityId?.Id)}
          fetchNotes={fetchNotesList}
        />
      )}
      {isEmailModal && (
        <EmailModal
          isOpen={isEmailModal}
          toggle={() => setEmailModalOpen(false)}
          facilityId={Number(facilityId?.Id)}
          fetchNotes={fetchNotesList}
        />
      )}
    </>
  );
};

export default Notes;
