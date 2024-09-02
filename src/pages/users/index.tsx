import DataTable from "react-data-table-component";
import CustomMainCard from "../../components/custom/CustomCard";
import ToggleSwitch from "../../components/custom/CustomToggle";
import { Link, useNavigate } from "react-router-dom";
import { FormGroup } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import { useContext, useEffect, useState } from "react";
import Search from "../../assets/images/search.svg";
import { UserType } from "../../types/UserTypes";
import { capitalize, debounce, showToast } from "../../helpers";
import {
  changeUserActivation,
  deleteUser,
  getUserRoles,
  getUsersList,
} from "../../services/user";
import CustomSelect from "../../components/custom/CustomSelect";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import Loader from "../../components/custom/CustomSpinner";
import { TableColumn } from "react-data-table-component";
import CustomPagination from "../../components/custom/CustomPagination";
import ACL from "../../components/custom/ACL";
import { Tooltip } from "reactstrap";
import { ActiveSidebarMenuContext } from "../../helpers/context/ActiveSidebar";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserType[]>([]);
  const [selectedRole, setSelectedRole] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [roles, setRoles] = useState<{ Id: number; Role: string }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const { activeMenu } = useContext(ActiveSidebarMenuContext);
  const [abort, setAbort] = useState<boolean>(false);

  const toggle = (index: number) => {
    setTooltipOpen((prevTooltip) => ({
      ...prevTooltip,
      [index]: !prevTooltip[index],
    }));
  };

  const onEditHandler = (userId: number): void => {
    try {
      const userData = data.find(
        (user: UserType): boolean => user?.Id === userId
      );
      const {
        FirstName,
        LastName,
        Phone,
        State,
        Zip,
        Address,
        City,
        Role,
        Email,
      } = userData || {};
      navigate(`/user/edit/${userId}`, {
        state: {
          FirstName,
          LastName,
          Phone,
          State,
          Zip,
          Address,
          City,
          Role,
          Email,
        },
      });
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    }
  };

  const onDeleteHandler = async (userId: number): Promise<void> => {
    try {
      setLoading(true);
      const deletedUser = await deleteUser(userId);
      showToast("success", deletedUser.data?.message);
      setLoading(false);
      setLoading(true);
      await fetchUsers();
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

  const getRoles = async (): Promise<void> => {
    try {
      const roles = await getUserRoles();
      setRoles(roles?.data?.data);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const toggleUserActivation = debounce(
    async (userId: number, value: boolean): Promise<void> => {
      try {
        const responseToggleActivation = await changeUserActivation(
          userId,
          value
        );
        showToast(
          "success",
          "User activation changed successfully" ||
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

  const abortController = new AbortController();
  const fetchUsers = debounce(async (): Promise<void> => {
    try {
      const roleId: number | string = selectedRole?.value ?? "";
      setLoading(true);
      const users = await getUsersList(
        size,
        abortController,
        search ? currentPageSearch : page,
        search,
        roleId
      );
      setLoading(false);
      setTotalRows(users?.count);

      if (selectedRole) {
        const filteredUsers = users?.rows?.filter(
          (user: UserType) => user?.Role?.Role === selectedRole?.label
        );
        setData(filteredUsers);
      }

      setData(users?.rows);
      //  setCurrentPage(page);
      setTotalPages(Math.ceil(users?.count / size));
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
  }, 300);

  useEffect(() => {
    getRoles();
    fetchUsers();
    setCurrentPage(page);

    return () => abortController.abort();
  }, [size, search, selectedRole, setData, activeMenu, page, abort]);

  // useEffect(() => {
  //   fetchUsers();
  //   setCurrentPage(page);
  // }, [page]);

  const handleRoleChange = (
    role: { value: number; label: string } | null
  ): void => {
    if (role === null) {
      setSelectedRole(null);
      return;
    }
    setPage(1);
    setSelectedRole(role);
  };

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

  const Column: TableColumn<UserType>[] = [
    {
      name: "Sr No",
      selector: (row: UserType, index?: number): number => {
        const pageIndex: number = (page - 1) * size;
        return pageIndex + (index !== undefined ? index + 1 : row.Id || 0);
      },
      width: "7%",
    },
    {
      name: "User Name",
      selector: (row: UserType): any => (
        <div className="table-username">
          <p style={{ marginRight: "5px" }} className="name-logo">
            {row.FirstName.slice(0, 1).toUpperCase() +
              row.LastName.slice(0, 1).toUpperCase()}
          </p>
          <span className="row-user-name">
            {`${capitalize(row.FirstName)} ${capitalize(row.LastName)}`}
          </span>
        </div>
      ),
      minWidth: "260px",
    },
    {
      name: "Contact",
      selector: (row: UserType): string =>
        row.Phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
      minWidth: "120px",
    },
    {
      name: "Email Address",
      minWidth: "160px",
      selector: (row: UserType): any => (
        <div key={row.Id}>
          <span id={`email-${row.Id}`} style={{ cursor: "pointer" }}>
            {row.Email}
          </span>
          <Tooltip
            isOpen={tooltipOpen[row.Id]}
            target={`email-${row.Id}`}
            toggle={() => toggle(row.Id)}
            placement="bottom"
          >
            {row.Email}
          </Tooltip>
        </div>
      ),
      // width: "20%",
    },
    {
      name: "Address",
      selector: (row: UserType): string => row.Address,
      minWidth: "150px",
    },
    {
      name: "Role",
      selector: (row: UserType): string =>
        row.Role?.Role
          ? row.Role?.Role.split(" ")
              .map((word) => capitalize(word))
              .join(" ")
          : "No Role",
      minWidth: "190px",
    },
    {
      name: "Status",
      minWidth: "70px",
      cell: (row: UserType) => (
        <div>
          <ACL submodule={""} module={"users"} action={["GET", "PUT"]}>
            <ToggleSwitch
              onStateChange={(state: boolean): void =>
                toggleUserActivation(row.Id, state)
              }
              checked={row.ActivationStatus}
            ></ToggleSwitch>
          </ACL>
        </div>
      ),
      // width: "7%",
    },
    {
      name: "Actions",
      minWidth: "120px",
      cell: (row: UserType, index: number) => (
        <div key={index} className="d-flex">
          <ACL submodule={""} module={"users"} action={["GET", "PUT"]}>
            <CustomEditBtn
              onEdit={() => row.Id !== undefined && onEditHandler(row.Id)}
            />
          </ACL>
          <ACL submodule={""} module={"users"} action={["GET", "DELETE"]}>
            <CustomDeleteBtn
              onDelete={() => row.Id !== undefined && onDeleteHandler(row.Id)}
            />
          </ACL>
        </div>
      ),
      // width: "17%",
    },
  ];

  return (
    <>
      <h1 className="list-page-header">Manage Users</h1>
      <CustomMainCard>
        <div className="d-flex search-button">
          <div className="search-bar-wrapper flex-grow-1 ">
            <CustomInput
              placeholder="search by Name, Contact, Email Address and Role"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                handleSearch(e.target.value)
              }
            />
            <img src={Search} alt="search" />
          </div>
          <div className="users-header-select select-dropdown">
            <FormGroup>
              <CustomSelect
                id="role"
                name="role"
                value={selectedRole}
                onChange={(
                  role: { value: number; label: string } | null
                ): void => handleRoleChange(role)}
                placeholder="Select Role"
                options={roles.map(
                  (role: {
                    Id: number;
                    Role: string;
                  }): { value: number; label: string } => ({
                    value: role?.Id,
                    label: role?.Role.split(" ")
                      .map((word: string) => capitalize(word))
                      .join(" "),
                  })
                )}
                noOptionsMessage={(): string => "No Role Found"}
                isClearable={true}
                isSearchable={true}
              />
            </FormGroup>
          </div>
          <div className="table-navigate">
            <Link to="/users/create" className="link-button">
              <ACL submodule={""} module={"users"} action={["GET", "POST"]}>
                <CustomButton className="primary-btn me-0">
                  Add New User
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
                data={data}
                progressPending={loading}
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={size}
                selectableRows={false}
                // progressComponent={<Loader />}
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

export default ManageUsers;
