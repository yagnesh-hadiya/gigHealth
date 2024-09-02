import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import Search from "../../assets/images/search.svg";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomMainCard from "../../components/custom/CustomCard";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import { getRolesList } from "../../services/roles";
import { useEffect, useState } from "react";
import { RoleType } from "../../types/RoleTypes";
import { debounce, showToast, ucFirstChar } from "../../helpers";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import Loader from "../../components/custom/CustomSpinner";
import { deleteRole } from "../../services/roles";
import { capitalize } from "../../helpers";
import { getRolesDetails } from "../../services/roles";

const RoleManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [rolesList, setRolesList] = useState<RoleType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);

  const abortController = new AbortController();
  const fetchRoles = debounce(async () => {
    try {
      setLoading(true);
      const data = await getRolesList(search, abortController);
      setLoading(false);
      setRolesList(data);
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      setLoading(false);
      showToast("error", error.response.message || "Something went wrong");
    }
  }, 300);

  useEffect(() => {
    fetchRoles();

    return () => abortController.abort();
  }, [search, abort]);

  const onEditHandler = async (roleId: number) => {
    try {
      setLoading(true);
      const roleToEdit = rolesList.find((role) => role.Id === roleId);

      const data = await getRolesDetails(roleId);

      if (roleToEdit !== undefined) {
        const { role, description, allows } = data;
        const { IsRoleNameEditable, IsPermissionsEditable } = roleToEdit;

        navigate(`/role/edit/${roleId}`, {
          state: {
            role,
            description,
            allows,
            IsRoleNameEditable,
            IsPermissionsEditable,
          },
        });
        setLoading(false);
      } else {
        setLoading(false);
        showToast("error", "Role not found");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    }
  };

  const onDeleteHandler = async (roleId: number) => {
    try {
      setLoading(true);
      const deletedRole = await deleteRole(roleId);
      showToast(
        "success",
        "Role Deleted Successfully" || deletedRole?.data?.message
      );
      setLoading(false);
      setLoading(true);
      await fetchRoles();
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

  const Column = [
    {
      name: "Sr No",
      cell: (row: RoleType, index: number) => index + 1 || row.Id,
      width: "8%",
    },
    {
      name: "Role Type",
      cell: (row: RoleType) => (
        <span style={{ fontWeight: "600" }}>
          {row.Role.split(" ")
            .map((word) => capitalize(word))
            .join(" ")}
        </span>
      ),
      width: "15%",
    },
    {
      name: "Description",
      cell: (row: RoleType) => ucFirstChar(row.Description),
      width: "68%",
    },
    {
      name: "Actions",
      cell: (row: RoleType) => (
        <>
          {
            <CustomEditBtn
              onEdit={() => {
                onEditHandler(row.Id);
              }}
            />
          }
          {row.IsRoleDeletable && (
            <CustomDeleteBtn
              onDelete={() => {
                onDeleteHandler(row.Id);
              }}
            />
          )}
        </>
      ),
      width: "7%",
    },
  ];
  const handleTextChange = (text: string) => {
    setSearch(text);
  };

  return (
    <>
      <h1 className="list-page-header">Role Management</h1>
      <CustomMainCard>
        <div>
          <div className="d-flex mb-3 search-button">
            {loading && <Loader />}
            <div className="search-bar-wrapper flex-grow-1">
              <CustomInput
                placeholder="Search Here"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleTextChange(e.target.value);
                }}
              />
              <img src={Search} alt="search" />
            </div>
            <div className="table-navigate">
              <Link to="/roles/create" className="link-button">
                <CustomButton className="primary-btn">
                  Create New Role
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>
        <div className="datatable-wrapper">
          <DataTable
            columns={Column}
            data={rolesList}
            progressPending={loading}
            progressComponent={
              <Loader styles={{ backgroundColor: "white", zIndex: "9999" }} />
            }
            // pagination
            // selectableRows={false}
          />
        </div>
      </CustomMainCard>
    </>
  );
};
export default RoleManagement;
