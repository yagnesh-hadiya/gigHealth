import CustomInput from "../../../../components/custom/CustomInput";
import Search from "../../../../assets/images/search.svg";
import CustomSelect from "../../../../components/custom/CustomSelect";
import { Link } from "react-router-dom";
import ACL from "../../../../components/custom/ACL";
import CustomButton from "../../../../components/custom/CustomBtn";
import CustomMainCard from "../../../../components/custom/CustomCard";
import { JobHeaderProps } from "../../../../types/JobsTypes";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../../assets/images/calendar.svg";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateInDayMonthYear } from "../../../../helpers";
import { headerStyles } from "./JobsSelectStyles";
import { useState } from "react";
import SearchIcon from "../../../../components/icons/Search";

const JobHeader = ({
  search,
  handleSearch,
  jobStatus,
  selectedJobStatus,
  setSelectedJobStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: //   handleDateListener,
JobHeaderProps) => {
  const [isSearchHovered, setIsSearchHovered] = useState<boolean>(false);
  const handleDownloadMouseEnter = () => {
    setIsSearchHovered(true);
  };

  const handleDownloadMouseLeave = () => {
    setIsSearchHovered(false);
  };

  const handleJobStatus = (
    selectedOption: { value: number; label: string } | null
  ) => {
    // if (!selectedOption) {
    //     setSelectedJobStatus(null);
    //     return;
    // }

    setSelectedJobStatus(
      selectedOption && {
        Id: selectedOption?.value,
        Status: selectedOption?.label,
      }
    );
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  return (
    <CustomMainCard className="card main-search-wrapper">
      <div className="d-flex gap-2 search-section">
        <ACL submodule={""} module={"jobs"} action={["GET", "GET"]}>
          <div className="search-bar-wrapper flex-grow-1">
            <CustomInput
              placeholder="Search Here"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                handleSearch(e.target.value)
              }
            />
            <img src={Search} alt="search" />
          </div>
        </ACL>
        <ACL submodule={""} module={"jobs"} action={["GET", "PUT"]}>
          <CustomSelect
            styles={headerStyles}
            id={"jobStatus"}
            name={"jobStatus"}
            className="custom-select-placeholder custom-select-job"
            options={jobStatus.map(
              (job: {
                Id: number;
                Status: string;
              }): { value: number; label: string } => ({
                value: job?.Id,
                label: job?.Status,
              })
            )}
            value={
              selectedJobStatus
                ? {
                    value: selectedJobStatus?.Id,
                    label: selectedJobStatus?.Status,
                  }
                : null
            }
            placeholder="Select Job Status"
            noOptionsMessage={(): string => ""}
            onChange={(jobStatus) => handleJobStatus(jobStatus)}
            isSearchable={true}
            isClearable={true}
          />
        </ACL>
        <div className="date-range-input">
          <ACL submodule={""} module={"jobs"} action={["GET", "PUT"]}>
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
          </ACL>
          {/* <span className="hyphen">-</span> */}
          <ACL submodule={""} module={"jobs"} action={["GET", "PUT"]}>
            <ReactDatePicker
              dateFormat={"dd-MM-yyyy"}
              isClearable={true}
              onChange={handleEndDateChange}
              placeholderText="----"
              minDate={startDate}
              selected={endDate}
              customInput={
                <div className="custom-calendar-wrapper">
                  <CustomInput
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
          </ACL>
          {/* <img src={Search} alt="search" className={`job-search-icon header-search-icon`} onClick={() => handleDateListener()} /> */}
          <ACL submodule={""} module={"jobs"} action={["GET", "GET"]}>
            <div
              onMouseEnter={handleDownloadMouseEnter}
              onMouseLeave={handleDownloadMouseLeave}
              // className="header-search-icon" onClick={() => handleDateListener()} >
              className="header-search-icon"
            >
              <SearchIcon color={isSearchHovered ? "#FFF" : "#717B9E"} />
            </div>
          </ACL>
        </div>
        <div className="job-header-navigate">
          <Link to="/jobs/create" className="link-button">
            <ACL submodule={""} module={"jobs"} action={["GET", "POST"]}>
              <CustomButton className="job-header-button">
                Add New Job
              </CustomButton>
            </ACL>
          </Link>
        </div>
      </div>
    </CustomMainCard>
  );
};

export default JobHeader;
