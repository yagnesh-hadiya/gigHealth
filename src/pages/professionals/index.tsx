import DataTable from "react-data-table-component";
import CustomMainCard from "../../components/custom/CustomCard";
import ToggleSwitch from "../../components/custom/CustomToggle";
import { Link, useNavigate } from "react-router-dom";
import { FormGroup } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import { useCallback, useEffect, useState } from "react";
import Search from "../../assets/images/search.svg";
import { capitalize, debounce, showToast } from "../../helpers";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import Loader from "../../components/custom/CustomSpinner";
import { TableColumn } from "react-data-table-component";
import CustomPagination from "../../components/custom/CustomPagination";
import ACL from "../../components/custom/ACL";
import {
  LocationType,
  ProfessionalStatusType,
  ProfessionalType,
} from "../../types/ProfessionalTypes";
import {
  changeProfessionalActivation,
  deleteProfessional,
  getProfessionalStatusList,
  getProfessionalsList,
} from "../../services/ProfessionalServices";
import CustomSelect from "../../components/custom/CustomSelect";
import { getStateLocations } from "../../services/facility";

const ManageProfessionals = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [data, setData] = useState<ProfessionalType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [statusId, setStatusId] = useState<number | string>("");
  const [stateId, setStateId] = useState<number | string>("");
  const [selectedStatus, setSelectedStatus] =
    useState<ProfessionalStatusType | null>(null);
  const [professionalStatuses, setProfessionalStatuses] = useState<
    ProfessionalStatusType[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [abort, setAbort] = useState<boolean>(false);

  const onEditHandler = (professionalId: number): void => {
    try {
      const professionalData = data.find(
        (professional: ProfessionalType): boolean =>
          professional?.Id === professionalId
      );
      const { FirstName, LastName, Phone, State, Email } =
        professionalData || {};
      navigate(`/professionals/edit/${professionalId}`, {
        state: {
          FirstName,
          LastName,
          Phone,
          State,
          Email,
        },
      });
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    }
  };

  const onDeleteHandler = async (professionalId: number): Promise<void> => {
    try {
      setLoading("loading");
      await deleteProfessional(professionalId);
      setLoading("idle");
      fetchProfessionals();
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const toggleProfessionalActivation = debounce(
    async (professionalId: number, value: boolean): Promise<void> => {
      try {
        const responseToggleActivation = await changeProfessionalActivation(
          professionalId,
          value
        );
        showToast(
          "success",
          "Professional activation changed successfully" ||
            responseToggleActivation.data?.message
        );
      } catch (error: any) {
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    },
    500
  );

  const fetchProfessionalStatus = useCallback(async (): Promise<void> => {
    try {
      const data = await getProfessionalStatusList();
      setProfessionalStatuses(data);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, []);

  const abortController = new AbortController();
  const fetchProfessionals = useCallback(
    debounce(async (): Promise<void> => {
      try {
        setLoading("loading");
        const professionals = await getProfessionalsList(
          size,
          page,
          sortKey,
          sortDirection,
          search,
          statusId,
          stateId,
          abortController
        );
        setTotalRows(professionals?.count);
        setData(professionals?.rows);
        setTotalPages(Math.ceil(professionals?.count / size));
        setLoading("idle");
      } catch (error: any) {
        if (abortController.signal.aborted) {
          setAbort(true);
          return;
        }
        console.error(error);
        setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }, 500),
    [page, search, size, sortDirection, sortKey, stateId, statusId, abort]
  );

  const handleProfessionalStatusChange = (
    professionalstatus: ProfessionalStatusType | null
  ): void => {
    setSelectedStatus(professionalstatus ? professionalstatus : null);
    setStatusId(professionalstatus?.Id || "");
  };

  const handleLocationChange = (location: LocationType | null): void => {
    setSelectedLocation(location ? location : null);
    setStateId(location?.Id || "");
  };

  const fetchLocations = useCallback(async (): Promise<void> => {
    try {
      const data = await getStateLocations();
      setLocations(data.data.data);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, []);

  useEffect(() => {
    fetchProfessionals();
    fetchProfessionalStatus();
    fetchLocations();

    return () => abortController.abort();
  }, [
    page,
    size,
    search,
    sortDirection,
    sortKey,
    stateId,
    statusId,
    fetchProfessionals,
    fetchProfessionalStatus,
    fetchLocations,
    abort,
  ]);

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    setPage(selectedPage);
  };

  const handleSearch = (text: string): void => {
    setSearch(text);
  };

  const Column: TableColumn<ProfessionalType>[] = [
    {
      name: "ID",
      selector: (row: ProfessionalType): string => {
        return `PID-${row.Id}`;
      },
      width: "7.5%",
    },
    {
      name:
        sortDirection === "ASC" ? "Professional Name ↑" : "Professional Name ↓",
      // sortable: false,
      sortFunction: (a: ProfessionalType, b: ProfessionalType): number => {
        if (a.FirstName && b.FirstName) {
          const comparison = a.FirstName.localeCompare(b.FirstName);
          const direction =
            sortKey === "name"
              ? sortDirection === "ASC"
                ? "DESC"
                : "ASC"
              : "ASC";
          setSortDirection(direction);
          setSortKey("name");
          return direction === "ASC" ? comparison : -comparison;
        }
        return 0;
      },
      selector: (row: ProfessionalType): any => (
        <Link
          to={`/professionals/${row.Id}`}
          className="facility-link"
          style={{ textDecoration: "none" }}
        >
          <div className="table-username">
            <p style={{ marginRight: "5px" }} className="name-logo">
              {row.FirstName.slice(0, 1).toUpperCase() +
                row.LastName.slice(0, 1).toUpperCase()}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span className="row-user-name">
                {" "}
                {`${capitalize(row.FirstName)} ${capitalize(row.LastName)}`}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(113, 123, 158, 1)",
                  fontWeight: 400,
                  marginTop: "2px",
                }}
              >
                {" "}
                {`${row.Email}`}
              </span>
            </div>
          </div>
        </Link>
      ),
      minWidth: "260px",
    },
    {
      name: "Phone",
      selector: (row: ProfessionalType): string =>
        row.Phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
      minWidth: "120px",
    },
    {
      name: "Employment Expert",

      selector: (row: ProfessionalType): any => (
        <p className={`mb-0`}>
          {row.EmploymentExpert
            ? `${capitalize(row.EmploymentExpert.FirstName)} ${capitalize(
                row.EmploymentExpert.LastName
              )}`
            : "-"}
        </p>
      ),
      minWidth: "140px",
    },
    {
      name: "Program Manager",
      selector: (row: ProfessionalType): any => (
        <p className={`mb-0`}>
          {row.ProgramManager
            ? `${capitalize(row.ProgramManager.FirstName)} ${capitalize(
                row.ProgramManager.LastName
              )}`
            : "-"}
        </p>
      ),
      minWidth: "140px",
    },
    {
      name: "Location",
      selector: (row: ProfessionalType): string => row.State.State,
      minWidth: "120px",
    },
    {
      name: "Professional Status",

      cell: (row: ProfessionalType) => (
        <p
          className={`mb-0`}
          style={{
            color:
              row.ProfessionalStatus.Status === "Prospect"
                ? "rgba(234, 154, 0, 1)"
                : row.ProfessionalStatus.Status === "Assigned"
                ? "rgba(127, 71, 221, 1)"
                : row.ProfessionalStatus.Status === "Active"
                ? "rgba(94, 155, 45, 1)"
                : row.ProfessionalStatus.Status === "DNU"
                ? "rgba(244, 95, 95, 1)"
                : row.ProfessionalStatus.Status === "Lead"
                ? "rgba(68, 128, 229, 1)"
                : row.ProfessionalStatus.Status === "Inactive"
                ? "rgba(244, 95, 95, 1)"
                : row.ProfessionalStatus.Status === "Past Employee"
                ? "rgba(170, 169, 169, 1)"
                : "",
          }}
        >
          {row.ProfessionalStatus ? row.ProfessionalStatus.Status : "-"}
        </p>
      ),
      minWidth: "150px",
    },
    {
      name: "Status",
      cell: (row: ProfessionalType) => (
        <div>
          <ACL submodule={""} module={"professionals"} action={["GET", "PUT"]}>
            <ToggleSwitch
              onStateChange={(state: boolean): void =>
                toggleProfessionalActivation(row.Id, state)
              }
              checked={row.ActivationStatus}
            ></ToggleSwitch>
          </ACL>
        </div>
      ),
      minWidth: "100px",
    },
    {
      name: "Actions",
      cell: (row: ProfessionalType, index: number) => (
        <div key={index} className="d-flex">
          <ACL submodule={""} module={"professionals"} action={["GET", "PUT"]}>
            <CustomEditBtn
              onEdit={() => row.Id !== undefined && onEditHandler(row.Id)}
            />
          </ACL>
          <ACL
            submodule={""}
            module={"professionals"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn
              onDelete={() => row.Id !== undefined && onDeleteHandler(row.Id)}
            />
          </ACL>
        </div>
      ),
      minWidth: "120px",
    },
  ];

  return (
    <>
      <h1 className="list-page-header">Professionals</h1>
      <CustomMainCard>
        <div className="d-flex flex-wrap mb-2" style={{ gap: "8px" }}>
          <div className="search-bar-wrapper flex-grow-1 me-0">
            <CustomInput
              placeholder="Search Here By Name/Email Address/Phone Number"
              ma
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                handleSearch(e.target.value)
              }
            />
            <img src={Search} alt="search" />
          </div>

          <div className="users-header-select ms-0">
            <FormGroup className="mb-0">
              <CustomSelect
                id="location"
                name="location"
                value={
                  selectedLocation
                    ? {
                        value: selectedLocation.Id,
                        label: selectedLocation.State,
                      }
                    : null
                }
                onChange={(
                  location: {
                    value: number;
                    label: string;
                  } | null
                ): void =>
                  handleLocationChange(
                    location
                      ? {
                          Id: location.value,
                          State: location.label,
                          Code: location.label,
                        }
                      : null
                  )
                }
                placeholder="Select Location"
                options={locations.map(
                  (
                    location: LocationType
                  ): {
                    value: number;
                    label: string;
                  } => ({
                    value: location.Id,
                    label: location.State,
                  })
                )}
                noOptionsMessage={(): string => "No Location Found"}
                isClearable={true}
                isSearchable={true}
              />
            </FormGroup>
          </div>

          <div className="users-header-select ms-0">
            <FormGroup>
              <CustomSelect
                id="professionalstatus"
                name="professionalstatus"
                className="ms-0"
                value={
                  selectedStatus
                    ? { value: selectedStatus.Id, label: selectedStatus.Status }
                    : null
                }
                onChange={(
                  professionalstatus: {
                    value: number;
                    label: string;
                  } | null
                ): void =>
                  handleProfessionalStatusChange(
                    professionalstatus
                      ? {
                          Id: professionalstatus.value,
                          Status: professionalstatus.label,
                        }
                      : null
                  )
                }
                placeholder="Show All Professionals"
                options={professionalStatuses.map(
                  (
                    professionalstatus: ProfessionalStatusType
                  ): {
                    value: number;
                    label: string;
                  } => ({
                    value: professionalstatus.Id,
                    label: professionalstatus.Status,
                  })
                )}
                noOptionsMessage={(): string => "No professionalstatus Found"}
                isClearable={true}
                isSearchable={true}
              />
            </FormGroup>
          </div>
          <div className="table-navigate ms-0">
            <Link to="/professionals/create" className="link-button">
              <ACL
                submodule={""}
                module={"professionals"}
                action={["GET", "POST"]}
              >
                <CustomButton className="primary-btn ms-0">
                  Add Professional
                </CustomButton>
              </ACL>
            </Link>
          </div>
        </div>
        {loading === "loading" ? (
          <Loader />
        ) : (
          <>
            <div className="datatable-wrapper">
              <DataTable
                columns={Column}
                data={data}
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={size}
                selectableRows={false}
                progressComponent={<Loader />}
                responsive={true}
              />
            </div>
            <CustomPagination
              currentPage={page}
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

export default ManageProfessionals;
