import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import CustomButton from "../../../../components/custom/CustomBtn";
import { useState } from "react";
// import ExportIcon from "../../../../components/icons/ExportBtn";
import FilterIcon from "../../../../components/icons/Filters";
import FilterModal from "./FilterModal";
import { LeftContentHeaderProps } from "../../../../types/JobsTypes";
import ACL from "../../../../components/custom/ACL";
import dropdownArrow from "../../../../assets/images/dropdown-arrow.svg";
import ExportIcon from "../../../../components/icons/ExportIcon";

const LeftContentHeader = ({
  profession,
  speciality,
  states,
  shiftTime,
  currentState,
  dispatch,
  fetchJobsList,
  pageRef,
  setSort,
  sort,
  totalCountRef,
  handleExport,
  setAbort,
  handleProfessionCategory,
  categoryProfession,
  professionCategory,
  setCategoryProfession,
  setProfessionId,
}: LeftContentHeaderProps) => {
  const [isDownloadHovered, setIsDownloadHovered] = useState<boolean>(false);
  const [isFilterHovered, setIsFilterHovered] = useState<boolean>(false);
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownExports, setDropdownExports] = useState(false);
  const [exports, setExports] = useState<boolean>(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleExports = () => setDropdownExports((prevState) => !prevState);
  const toggleFilter = () => setFilterModal(!filterModal);

  const handleDownloadMouseEnter = () => {
    setIsDownloadHovered(true);
  };

  const handleDownloadMouseLeave = () => {
    setIsDownloadHovered(false);
  };

  const handleDownloadMouseFilterLeave = () => {
    setIsFilterHovered(false);
  };

  const handleDownloadMouseFilterEnter = () => {
    setIsFilterHovered(true);
  };

  const handleSort = (
    sortkey: string,
    sortDir: string,
    sortBehavior: string
  ) => {
    setSort({ sortkey, sortDir, sortBehavior });
    toggleDropdown();
  };

  const totalCount: boolean[] = Object.values(currentState.count)?.filter(
    (value) => value == true
  );

  return (
    <>
      <div className="w-100 main-wrapper">
        <div className="">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <div className="jobs-left-header">
                <h3>
                  Job Listings{" "}
                  <span className="jobs-left-length">{`(Showing ${totalCountRef.current} jobs)`}</span>
                </h3>
              </div>
            </div>
            <div>
              <div className="d-flex jobs-right-wrapper flex-wrap">
                {totalCountRef.current > 0 && (
                  <ACL submodule={""} module={"jobs"} action={["GET", "GET"]}>
                    <button
                      className="jobs-right-button"
                  
                      onClick={() => setExports(!exports)}
                    >
                      <Dropdown
                        className="jobs-dropdown-content export-option "
                        isOpen={dropdownExports}
                        toggle={toggleExports}
                      >
                        <DropdownToggle className="drop-down"     onMouseEnter={handleDownloadMouseEnter}
                      onMouseLeave={handleDownloadMouseLeave} >
                          <ExportIcon
                            className="expert-icon"
                            color={isDownloadHovered ? "#FFF" : "#7f47dd"}
                          />
                          <span className="icon-shift">Export</span>
                        </DropdownToggle>
                        <DropdownMenu>
                          <div className="jobs-dropdown">
                            <h5
                              className="jobs-dropdown-heading export-heading"
                              onClick={() => handleExport()}
                            >
                              Export as CSV
                            </h5>
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                    </button>
                  </ACL>
                 )}
                <ACL
                  submodule={""}
                  module={"jobs"}
                  action={["GET", "GET", "PUT"]}
                >
                  <div className="jobs-right-button">
                    <button
                      className="drop-down"
                      style={{ marginRight: "5px" }}
                      onMouseEnter={handleDownloadMouseFilterEnter}
                      onMouseLeave={handleDownloadMouseFilterLeave}
                      onClick={toggleFilter}
                    >
                      <FilterIcon color={isFilterHovered ? "#FFF" : ""} />{" "}
                      <span className="icon-shift">More Filters</span>
                    </button>
                  </div>
                </ACL>
              </div>
            </div>
          </div>
          <div className="align-items-center edit-flex d-flex justify-content-between">
            <div className="left-content-filters d-flex">
              <div className="filter-button">
                {totalCount && totalCount.length > 0 && (
                  <div className="filter-button">
                    <CustomButton
                      className="filter-button button"
                      onClick={toggleFilter}
                    >
                      Filters - {totalCount.length} Applied
                    </CustomButton>
                  </div>
                )}
              </div>
            </div>
            <div className=" sidebar-dropdown small-screen-dropdown mt-2 filter-section sort-by-section">
              <ACL submodule={""} module={"jobs"} action={["GET", "GET"]}>
                <Dropdown
                  className="jobs-dropdown-content"
                  isOpen={dropdownOpen}
                  toggle={toggleDropdown}
                >
                  <DropdownToggle
                    style={{ margin: 0, padding: "10px 12px" }}
                    caret
                  >
                    {" "}
                    Sort By :{" "}
                    <strong>
                      <span className="pay text-capitalize ms-1">
                        {sort.sortkey ?? ""}
                      </span>
                    </strong>{" "}
                    - {sort.sortBehavior ? sort.sortBehavior : "--"}
                    <img src={dropdownArrow} alt="down-arrow" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <div className="jobs-dropdown">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="jobs-dropdown-heading ms-1">Pay</h5>
                        <span
                          className="material-symbols-outlined cross-cancel"
                          onClick={toggleDropdown}
                        >
                          close
                        </span>
                      </div>
                      <ul className="jobs-dropdown-list d-flex">
                        <li
                          onClick={() =>
                            handleSort("pay", "DESC", "High to Low")
                          }
                        >
                          High to Low
                        </li>
                        <li
                          onClick={() =>
                            handleSort("pay", "ASC", "Low to High")
                          }
                        >
                          Low to High
                        </li>
                      </ul>
                    </div>
                    {/* <div className="jobs-dropdown">
                                        <h5 className="jobs-dropdown-heading ms-1">Relevance</h5>
                                        <ul className="jobs-dropdown-list">
                                            <li>Relevance</li>
                                        </ul>
                                    </div> */}
                    <div className="jobs-dropdown">
                      <h5 className="jobs-dropdown-heading ms-1">Openings</h5>
                      <ul className="jobs-dropdown-list">
                        <li
                          onClick={() =>
                            handleSort("opening", "DESC", "High to Low")
                          }
                        >
                          High to Low
                        </li>
                        <li
                          onClick={() =>
                            handleSort("opening", "ASC", "Low to High")
                          }
                        >
                          Low to High
                        </li>
                      </ul>
                    </div>
                    <div className="jobs-dropdown">
                      <h5 className="jobs-dropdown-heading ms-1">
                        Posted Date
                      </h5>
                      <ul className="jobs-dropdown-list">
                        <li
                          onClick={() =>
                            handleSort("created", "DESC", "Most Recent")
                          }
                        >
                          Most Recent
                        </li>
                        <li
                          onClick={() => handleSort("created", "ASC", "Oldest")}
                        >
                          Oldest
                        </li>
                      </ul>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </ACL>
            </div>
          </div>
        </div>
      </div>
      {/* <JobModal filterModal={filterModal} toggleFilter={toggleFilter} /> */}
      <FilterModal
        filterModal={filterModal}
        toggleFilter={toggleFilter}
        profession={profession}
        speciality={speciality}
        states={states}
        shiftTime={shiftTime}
        currentState={currentState}
        dispatch={dispatch}
        fetchJobsList={fetchJobsList}
        pageRef={pageRef}
        setAbort={setAbort}
        handleProfessionCategory={handleProfessionCategory}
        categoryProfession={categoryProfession}
        professionCategory={professionCategory}
        setCategoryProfession={setCategoryProfession}
        setProfessionId={setProfessionId}
      />
    </>
  );
};

export default LeftContentHeader;
