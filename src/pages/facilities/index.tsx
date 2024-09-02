import DataTable, { TableColumn } from "react-data-table-component";
import CustomMainCard from "../../components/custom/CustomCard";
import { Link, useNavigate } from "react-router-dom";
import { FormGroup } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomSelect from "../../components/custom/CustomSelect";
import Search from "../../assets/images/search.svg";
import CustomButton from "../../components/custom/CustomBtn";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import { useEffect, useState } from "react";
import { capitalize, debounce, showToast } from "../../helpers";
import {
  deleteFaciltiy,
  getFacilityList,
  getStateLocations,
} from "../../services/facility";
import Loader from "../../components/custom/CustomSpinner";
import { FacilityList } from "../../types/FacilityTypes";
import CustomPagination from "../../components/custom/CustomPagination";
import ACL from "../../components/custom/ACL";

const Facility = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [locations, setLocations] = useState<
    { Id: number; State: string; Code: string }[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [facilityList, setFacilityList] = useState<FacilityList[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#5E9B2D";
      case "Inactive":
        return "#717B9E";
      case "Target":
        return "#F45F5F";
      case "Prospect":
        return "#EA9A00";
      default:
        return "";
    }
  };

  const getLocations = async (): Promise<void> => {
    try {
      setLoading(true);
      const locations = await getStateLocations();
      setLocations(locations?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getFacility = async () => {
    try {
      const stateId: number | string = selectedLocation?.value ?? "";
      setLoading(true);
      const facilityList = await getFacilityList(
        size,
        search ? currentPageSearch : page,
        search,
        stateId
      );
      setTotalRows(facilityList?.count);
      setFacilityList(facilityList?.rows);
      // setCurrentPage(page);
      setTotalPages(Math.ceil(facilityList?.count / size));
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    getLocations();
    getFacility();
  }, [size, search, selectedLocation, setFacilityList]);

  useEffect(() => {
    getFacility();
    setCurrentPage(page);
  }, [page]);

  const handleLocationChange = (
    selectedLocation: { value: number; label: string } | null
  ) => {
    try {
      if (selectedLocation === null) {
        setSelectedLocation(null);
        return;
      }
      if (selectedLocation) {
        setSelectedLocation({
          value: selectedLocation.value,
          label: selectedLocation.label,
        });
        setPage(1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageSizeChange = async (selectedPage: number) => {
    if (search) {
      setCurrentPageSearch(selectedPage);
    } else {
      setPage(selectedPage);
    }
    // await getFacility();
  };

  const handleSearch = debounce((text: string): void => {
    setSearch(text);
    setCurrentPageSearch(1);
  }, 200);

  const onDeleteHandler = async (facilityId: number) => {
    try {
      setLoading(true);
      const response = await deleteFaciltiy(facilityId);
      showToast(
        "success",
        "Facility deleted successfully" || response.data.message
      );
      setLoading(false);
      setLoading(true);
      await getFacility();
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEditHandler = (facilityId: number) => {
    navigate(`/facility/edit/${facilityId}`);
  };

  const Column: TableColumn<FacilityList>[] = [
    {
      name: "Sr No",
      selector: (row: FacilityList, index?: number): number => {
        const pageIndex: number = (page - 1) * size;
        return pageIndex + (index !== undefined ? index + 1 : row.Id || 0);
      },
      width: "5%",
    },
    {
      name: "Facility ID",
      selector: (row: FacilityList) => {
        return `FID-${row.Id}`;
      },
     minWidth:'90px'
    },
    {
      name: "Facility Name",
      cell: (row: FacilityList) => (
        <Link
          to={`/facility/${row.Id}`}
          className="facility-link"
          style={{ textDecoration: "none" }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#474D6A",
              textDecoration: "none",
            }}
          >
            {capitalize(row.Name)}
          </span>
        </Link>
      ),
      minWidth: "208px",
    },
    {
      name: "Location",
      minWidth: "120px",
      cell: (row: FacilityList) => (
        <div className="center-align">{row.State.State}</div>
      ),
    },
    {
      name: "System Name",
      minWidth: "163px",
      cell: (row: FacilityList) => (
        <div className="center-align">
          {row.ParentHealthSystem?.Name
            ? capitalize(row.ParentHealthSystem?.Name)
            : capitalize(row?.FacilityHealthSystem?.Name ?? "--")}
        </div>
      ),
    },
    {
      name: "Service Type",
      minWidth: "110px",
      cell: (row: FacilityList) => (
        <div className="center-align">{row.ServiceType?.Type}</div>
      ),
    },
    // {
    //   name: "Openings",
    //   width: "10%",
    //   cell: (row: { Openings: any }) => (
    //     <div className="center-align">{row.Openings}</div>
    //   ),
    // },
    {
      name: "Program Manager",
      minWidth: "100px",
      cell: (row: FacilityList) => (
        <div className="center-align">
          {capitalize(row.ProgramManager?.FirstName ?? "--")}{" "}
          {capitalize(row.ProgramManager?.LastName ?? "--")}
        </div>
      ),
    },
    {
      name: "Status",
      minWidth: "100px",
      cell: (row: FacilityList) => (
        <div
          className="center-align"
          style={{ color: getStatusColor(row?.FacilityStatus?.Status) }}
        >
          {row?.FacilityStatus?.Status}
        </div>
      ),
    },
    {
      name: "Actions",
      minWidth: "120px",
      cell: (row: FacilityList) => (
        <>
          <ACL submodule={""} module={"facilities"} action={["GET", "PUT"]}>
            <CustomEditBtn
              onEdit={() => row.Id !== undefined && onEditHandler(row.Id)}
            />
          </ACL>
          <ACL submodule={""} module={"facilities"} action={["GET", "DELETE"]}>
            <CustomDeleteBtn
              onDelete={() => row.Id !== undefined && onDeleteHandler(row.Id)}
            />
          </ACL>
        </>
      ),
      // width: "7%",
    },
  ];

  return (
    <>
      <h1 className="list-page-header">Facilities</h1>
      <CustomMainCard>
        {loading && <Loader />}
        <div className="d-flex search-button">
          <div className="search-bar-wrapper flex-grow-1">
            <CustomInput
              placeholder="Search by Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
            />
            <img src={Search} alt="search" />
          </div>
          <div className="users-header-select select-dropdown">
            <FormGroup>
              <CustomSelect
                id="location"
                name="location"
                className="custom-select-placeholder"
                value={selectedLocation}
                onChange={(location) => handleLocationChange(location)}
                options={locations.map(
                  (location: {
                    Id: number;
                    State: string;
                    Code: string;
                  }): { value: number; label: string } => ({
                    value: location?.Id,
                    label: `${location?.State} (${location?.Code})`,
                  })
                )}
                placeholder={"Select Location"}
                noOptionsMessage={(): string => "No Location Found"}
                isClearable={true}
                isSearchable={true}
              />
            </FormGroup>
          </div>
          <div className="table-navigate">
            <Link to="/facility/create" className="link-button">
              <ACL
                submodule={""}
                module={"facilities"}
                action={["GET", "POST"]}
              >
                <CustomButton className="primary-btn">
                  Add New Facility
                </CustomButton>
              </ACL>
            </Link>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="datatable-wrapper">
              <DataTable
                columns={Column}
                data={facilityList}
                progressPending={loading}
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={size}
                selectableRows={false}
                progressComponent={<Loader />}
                responsive={true}
              />
            </div>
            <CustomPagination
              currentPage={search ? currentPageSearch : currentPage}
              totalPages={totalPages}
              onPageChange={handlePageSizeChange}
              onPageSizeChange={setSize}
              entriesPerPage={size}
              totalRows={totalRows}
              setPage={setPage}
            />
          </>
        )}
      </CustomMainCard>
    </>
  );
};
export default Facility;
