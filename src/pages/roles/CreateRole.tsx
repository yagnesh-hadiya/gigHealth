import { Form, Link, useNavigate } from "react-router-dom";
import CustomMainCard from "../../components/custom/CustomCard";
import { Col, Label, FormFeedback, Row } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import DataTable from "react-data-table-component";
import Checkbox from "../../components/custom/CustomCheckbox";
import { useEffect, useState } from "react";
import Loader from "../../components/custom/CustomSpinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { createRoleSchema } from "../../helpers/schemas/RoleSchema";
import { useForm } from "react-hook-form";
import { CreateRoleParams, Allow } from "../../types/RoleTypes";
import { createRole, getModules } from "../../services/roles";
import { capitalize, showToast } from "../../helpers";
import { Module, SubModule } from "../../types/RoleTypes";
import ExpandTable from "../../assets/images/expand-more.svg";
import ExpandCloseTable from "../../assets/images/expan-less.svg";

const CreateRole = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleParams>({
    resolver: yupResolver(createRoleSchema) as any,
  });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [, setSubModules] = useState<SubModule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<{
    [key: string]: string[];
  }>({});
  const navigate = useNavigate();
  const getExpandImage = (row: { Module: string }) => {
    return expandedRows.includes(row.Module) ? ExpandCloseTable : ExpandTable;
  };

  const Columns = [
    {
      name: "Modules",
      cell: (row: SubModule) => (
        <>
          {row.SubModule.toLowerCase() === "notes" ? (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>Notes & Activity</span>
            </>
          ) : row.SubModule.toLowerCase() === "faqs" ? (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>FAQ's</span>
            </>
          ) : row.SubModule.toLowerCase() === "gighistory" ? (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>Gig History</span>
            </>
          ) : row.SubModule.toLowerCase() === "contractterms" ? (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>Contract Terms</span>
            </>
          ) : row.SubModule.toLowerCase() === "jobtemplates" ? (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>Job Templates</span>
            </>
          ) : row.SubModule.toLowerCase() === "facilitydocuments" ? (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>Facility Documents</span>
            </>
          ) : row.SubModule.toLowerCase() === "additionaldetails" ? (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>Additional Details</span>
            </>
          ) : (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(row.SubModule, "Module")}
                checked={
                  selectedCheckboxes[row.SubModule] &&
                  selectedCheckboxes[row.SubModule].length === 4
                }
                disabled={false}
              />
              <span style={{ fontWeight: "500" }}>
                {capitalize(row.SubModule)}
              </span>
            </>
          )}
        </>
      ),
      width: "30%",
    },
    {
      name: "View",
      cell: (row: SubModule) => (
        <>
          <Checkbox
            onChange={() => handleCheckboxChange(row.SubModule, "View")}
            checked={
              selectedCheckboxes[row.SubModule] &&
              selectedCheckboxes[row.SubModule].includes("GET")
            }
            disabled={false}
          />
        </>
      ),
      width: "12%",
    },
    {
      name: "Add",
      cell: (row: SubModule) => (
        <>
          <Checkbox
            onChange={() => handleCheckboxChange(row.SubModule, "Add")}
            checked={
              selectedCheckboxes[row.SubModule] &&
              selectedCheckboxes[row.SubModule].includes("POST")
            }
            disabled={false}
          />
        </>
      ),
      width: "12%",
    },
    {
      name: "Edit",
      cell: (row: SubModule) => (
        <>
          <Checkbox
            onChange={() => handleCheckboxChange(row.SubModule, "Edit")}
            checked={
              selectedCheckboxes[row.SubModule] &&
              selectedCheckboxes[row.SubModule].includes("PUT")
            }
            disabled={false}
          />
        </>
      ),
      width: "12%",
    },
    {
      name: "Delete",
      cell: (row: SubModule) => (
        <Checkbox
          onChange={() => handleCheckboxChange(row.SubModule, "Delete")}
          checked={
            selectedCheckboxes[row.SubModule] &&
            selectedCheckboxes[row.SubModule].includes("DELETE")
          }
          disabled={false}
        />
      ),
      width: "12%",
    },
  ];

  const Column = [
    {
      name: "Modules",
      cell: (row: Module) => (
        <>
          <Checkbox
            onChange={() => handleCheckboxChange(row.Module, "Module")}
            checked={
              selectedCheckboxes[row.Module] &&
              selectedCheckboxes[row.Module].length === 4
            }
            disabled={false}
          />
          <span
            style={{ fontWeight: "500", cursor: "pointer" }}
            onClick={() => handleRowExpand(row)}
          >
            {row.Module === "documentmaster" ? (
              <span>Document Master</span>
            ) : row.Module === "users" ? (
              <span>Manage Users</span>
            ) : (
              <span className="text-capitalize">{row.Module}</span>
            )}
            {row.SubModules && row.SubModules.length > 0 && (
              <img src={getExpandImage(row)} />
            )}
          </span>
        </>
      ),
      width: "30%",
    },
    {
      name: "View",
      cell: (row: { Module: string }) => (
        <div className="roles-manage-checkbox">
          <Checkbox
            onChange={() => handleCheckboxChange(row.Module, "View")}
            checked={
              selectedCheckboxes[row.Module] &&
              selectedCheckboxes[row.Module].includes("GET")
            }
            disabled={false}
          />
        </div>
      ),
      width: "12%",
    },
    {
      name: "Add",
      cell: (row: { Module: string }) => (
        <div className="roles-manage-checkbox">
          <Checkbox
            onChange={() => handleCheckboxChange(row.Module, "Add")}
            checked={
              selectedCheckboxes[row.Module] &&
              selectedCheckboxes[row.Module].includes("POST")
            }
            disabled={false}
          />
        </div>
      ),
      width: "12%",
    },
    {
      name: "Edit",
      cell: (row: { Module: string }) => (
        <div className="roles-manage-checkbox">
          <Checkbox
            onChange={() => handleCheckboxChange(row.Module, "Edit")}
            checked={
              selectedCheckboxes[row.Module] &&
              selectedCheckboxes[row.Module].includes("PUT")
            }
            disabled={false}
          />
        </div>
      ),
      width: "12%",
    },
    {
      name: "Delete",
      cell: (row: { Module: string }) => (
        <div className="roles-manage-checkbox">
          <Checkbox
            onChange={() => handleCheckboxChange(row.Module, "Delete")}
            checked={
              selectedCheckboxes[row.Module] &&
              selectedCheckboxes[row.Module].includes("DELETE")
            }
            disabled={false}
          />
        </div>
      ),
      width: "12%",
    },
  ];

  const handleRowExpand = (row: {
    Module: string;
    SubModules?: SubModule[];
  }) => {
    const key = row.Module;
    setExpandedRows((prevRows) => {
      return prevRows.includes(key)
        ? prevRows.filter((module) => module !== key)
        : [...prevRows, key];
    });
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await getModules();
      setLoading(false);
      setModules(data);
      const allSubModules = data.flatMap((module: Module) =>
        module.SubModules.map((subModule) => ({
          SubModule: subModule.SubModule,
        }))
      );
      setSubModules(allSubModules);
    } catch (error: any) {
      console.error(error);
      showToast("error", error.response.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleCheckboxChange = (module: string, value: string) => {
    if (value === "Module") {
      setSelectedCheckboxes((prevSelected) => {
        const isSelected = prevSelected[module]?.length === 4;
        const updatedCheckboxes = { ...prevSelected };

        if (isSelected) {
          // Remove the module and its submodules from the selected checkboxes
          delete updatedCheckboxes[module];
          const modulesSubModules =
            modules.find((mod) => mod.Module === module)?.SubModules || [];
          modulesSubModules.forEach((submodule) => {
            delete updatedCheckboxes[submodule.SubModule];
          });
        } else {
          // Add the module and its submodules to the selected checkboxes
          updatedCheckboxes[module] = ["GET", "POST", "PUT", "DELETE"];
          const modulesSubModules =
            modules.find((mod) => mod.Module === module)?.SubModules || [];
          modulesSubModules.forEach((submodule) => {
            updatedCheckboxes[submodule.SubModule] = [
              "GET",
              "POST",
              "PUT",
              "DELETE",
            ];
          });
        }

        return updatedCheckboxes;
      });
    } else {
      setSelectedCheckboxes((prevSelected) => {
        const updatedCheckboxes = { ...prevSelected };
        const isPermissionSelected =
          prevSelected[module]?.includes(value) || false;

        if (isPermissionSelected) {
          // Remove the permission from the module or submodule
          updatedCheckboxes[module] = prevSelected[module].filter(
            (permission) => permission !== value
          );
          if (updatedCheckboxes[module].length === 0) {
            delete updatedCheckboxes[module];
          }
        } else {
          // Add the permission to the module or submodule
          if (prevSelected[module]) {
            updatedCheckboxes[module] = [...prevSelected[module], value];
          } else {
            updatedCheckboxes[module] = [value];
          }
        }

        return updatedCheckboxes;
      });
    }
  };

  const onSubmit = async (data: CreateRoleParams) => {
    const { title, description } = data;
    let hasOtherErrors = false;

    const allows: Allow[] = modules.reduce((acc: Allow[], module) => {
      const permissions = selectedCheckboxes[module.Module] || [];
      let subModuleAllows: Allow[] = [];

      if (module.SubModules && module.SubModules.length > 0) {
        subModuleAllows = module.SubModules.filter(
          (subModule) => selectedCheckboxes[subModule.SubModule]?.length > 0
        ).map((subModule) => ({
          module: subModule.SubModule,
          permissions: selectedCheckboxes[subModule.SubModule] || [],
        }));
      }

      if (permissions.length > 0 || subModuleAllows.length > 0) {
        if (!permissions.includes("GET")) {
          showToast(
            "error",
            `Please select 'View' permission for the module '${module.Module}'`
          );
          hasOtherErrors = true;
          return acc;
        }

        if (subModuleAllows.length > 0) {
          const missingViewPermissions = subModuleAllows.filter(
            (subModule) => !subModule.permissions.includes("GET")
          );
          if (missingViewPermissions.length > 0) {
            showToast(
              "error",
              `Please select 'View' permission for the  submodules of the module '${
                module.Module
              }': ${missingViewPermissions.map((sub) => sub.module).join(", ")}`
            );
            hasOtherErrors = true;
            return acc;
          }
        }
        acc.push({
          module: module.Module,
          permissions,
          submodules: subModuleAllows,
        });
      }

      return acc;
    }, [] as Allow[]);

    if (hasOtherErrors) {
      return;
    }

    if (allows.length === 0) {
      showToast("error", "Please select at least one permission.");
      return;
    }

    try {
      setLoading(true);
      await createRole(title, description, allows);
      setLoading(false);
      showToast("success", "Role created successfully!");
      setTimeout(() => {
        navigate("/roles");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <div className="navigate-wrapper">
        <Link to="/roles" className="link-btn">
          Role Management
        </Link>
        <span> / </span>
        <span>Create New Role</span>
      </div>
      {loading && <Loader />}
      <CustomMainCard>
        <h2 className="page-content-header">Role Details</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="4" className="col-group">
              <Label className="">
                Role Title <span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="Title"
                placeholder="Role Title"
                invalid={!!errors.title}
                {...register("title")}
              />
              <FormFeedback>{errors.title?.message}</FormFeedback>
            </Col>
            <Col md="8" className="col-group">
              <Label>
                Description <span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="Description"
                placeholder="Description"
                invalid={!!errors.description}
                {...register("description")}
              />
              <FormFeedback>{errors.description?.message}</FormFeedback>
            </Col>
          </Row>

          <h2 className="page-content-header">Module Access</h2>
          <div className="datatable-wrapper role-management-datatable">
            <div>
              <DataTable
                className="role-datatable"
                columns={Column}
                data={modules}
                expandableRows
                expandableRowDisabled={(row) =>
                  !row.SubModules || row.SubModules.length === 0
                }
                expandableRowsComponent={(row) => {
                  if (row.data.SubModules && row.data.SubModules.length > 0) {
                    return (
                      <>
                        <DataTable
                          columns={Columns}
                          data={row.data.SubModules}
                          className="nested-datatable-roles"
                        />
                      </>
                    );
                  } else {
                    return null;
                  }
                }}
                expandOnRowClicked
                onRowClicked={handleRowExpand}
              />
            </div>
          </div>
          <div className="btn-wrapper mt-4">
            <CustomButton className="primary-btn">Save</CustomButton>
            <Link to="/roles">
              <CustomButton className="secondary-btn">Cancel</CustomButton>
            </Link>
          </div>
        </Form>
      </CustomMainCard>
    </>
  );
};

export default CreateRole;
