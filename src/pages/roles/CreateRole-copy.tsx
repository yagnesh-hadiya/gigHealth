import { Form, Link, useNavigate } from "react-router-dom";
import CustomMainCard from "../../components/custom/CustomCard";
import { Col, Label, FormFeedback, Row, Table } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import { useEffect, useState } from "react";
import Loader from "../../components/custom/CustomSpinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { createRoleSchema } from "../../helpers/schemas/RoleSchema";
import { useForm } from "react-hook-form";
import { CreateRoleParams } from "../../types/RoleTypes";
import { createRole, getModules } from "../../services/roles";
import { capitalize, showToast } from "../../helpers";
import ExpandTable from "../../assets/images/expand-more.svg";

export interface Module {
  Module: string;
  SubModules: SubModule[];
  // isOpen: boolean;
}
export interface SubModule {
  SubModule: string;
}

interface AllowSubModule {
  module: string;
  permissions: ("GET" | "POST" | "PUT" | "DELETE")[];
}
interface Allow {
  module: string;
  permissions: ("GET" | "POST" | "PUT" | "DELETE")[];
  submodules?: AllowSubModule[];
}

const CreateRole = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleParams>({
    resolver: yupResolver(createRoleSchema) as any,
  });
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<Allow[]>([]);
  const [exapandedModules, setExpandedModules] = useState<string | null>(null);
  const navigate = useNavigate();

  const isModuleSelected = (
    module: string,
    submodule: string | null = null
  ) => {
    return selectedModules.some((item) => {
      if (submodule) {
        return (
          item.module === module &&
          item.submodules?.some((sub) => sub.module === submodule)
        );
      } else {
        return item.module === module;
      }
    });
  };

  const handleCheckboxChange = ({
    module,
    submodule,
    permission,
  }: {
    module: string;
    submodule: string | null;
    permission: "GET" | "POST" | "PUT" | "DELETE";
  }) => {
    console.log({
      module,
      submodule,
      permission,
    });
    setSelectedModules((prevModules) => {
      const existingModule = prevModules.find((item) => item.module === module);
      if (existingModule) {
        if (submodule) {
          const existingSubmodule = existingModule.submodules?.find(
            (sub) => sub.module === submodule
          );

          if (existingSubmodule) {
            const isPermissionSelected =
              existingSubmodule.permissions.includes(permission);

            // Update submodule permissions
            let updatedModules = prevModules.map((item) =>
              item.module === module
                ? {
                    ...item,
                    submodules: item.submodules?.map((sub) =>
                      sub.module === submodule
                        ? {
                            ...sub,
                            permissions: isPermissionSelected
                              ? sub.permissions.filter((p) => p !== permission)
                              : [...sub.permissions, permission],
                          }
                        : sub
                    ),
                  }
                : item
            );

            // Remove submodules with no permissions
            updatedModules = updatedModules.map((item) =>
              item.module === module
                ? {
                    ...item,
                    submodules: item.submodules?.filter(
                      (sub) => sub.permissions.length > 0
                    ),
                  }
                : item
            );

            return updatedModules.filter(
              (item) =>
                item.permissions.length > 0 ||
                (item.submodules && item.submodules.length > 0)
            );
          } else {
            // Add new submodule
            return prevModules.map((item) =>
              item.module === module
                ? {
                    ...item,
                    submodules: [
                      ...(item.submodules || []),
                      { module: submodule, permissions: [permission] },
                    ],
                  }
                : item
            );
          }
        } else {
          // Handle module
          const isPermissionSelected =
            existingModule.permissions.includes(permission);

          let updatedModules = prevModules.map((item) =>
            item.module === module
              ? {
                  ...item,
                  permissions: isPermissionSelected
                    ? item.permissions.filter((p) => p !== permission)
                    : [...item.permissions, permission],
                }
              : item
          );

          // Remove modules with no permissions
          updatedModules = updatedModules.filter(
            (item) => item.permissions.length > 0
          );

          return updatedModules.filter(
            (item) =>
              item.permissions.length > 0 ||
              (item.submodules && item.submodules.length > 0)
          );
        }
      } else {
        // Add new module
        const newModule: Allow = {
          module,
          permissions: submodule ? [] : [permission],
        };

        if (submodule) {
          newModule.submodules = [
            { module: submodule, permissions: [permission] },
          ];
        }
        const updatedModules = [...prevModules, newModule];

        return updatedModules.filter(
          (item) =>
            item.permissions.length > 0 ||
            (item.submodules && item.submodules.length > 0)
        );
      }
    });
  };

  const handleAllCheckboxChange = ({
    module,
    submodule,
  }: {
    module: string;
    submodule: string | null;
  }) => {
    const isSelected = isModuleSelected(module, submodule);
    if (isSelected) {
      setSelectedModules((prevModules) =>
        prevModules.filter((item) => item.module !== module)
      );
    } else {
      setSelectedModules((prevModules) => [
        ...prevModules,
        {
          module,
          permissions: ["GET", "POST", "PUT", "DELETE"],
          submodules:
            modules
              .find((item) => item.Module === module)
              ?.SubModules.map((sub) => ({
                module: sub.SubModule,
                permissions: ["GET", "POST", "PUT", "DELETE"],
              })) || undefined,
        },
      ]);
    }
  };

  const handleAllSubmoduleCheckboxChange = ({
    module,
    submodule,
  }: {
    module: string;
    submodule: string;
  }) => {
    const isSelected = isModuleSelected(module, submodule);

    if (isSelected) {
      setSelectedModules((prevModules) =>
        prevModules.map((item) =>
          item.module === module
            ? {
                ...item,
                submodules: item.submodules?.filter(
                  (sub) => sub.module !== submodule
                ),
              }
            : item
        )
      );
    } else {
      setSelectedModules((prevModules) => {
        const existingModule = prevModules.find(
          (item) => item.module === module
        );

        if (existingModule) {
          // Add submodule to existing module
          return prevModules.map((item) =>
            item.module === module
              ? {
                  ...item,
                  submodules: [
                    ...(item.submodules ?? []),
                    {
                      module: submodule,
                      permissions: ["GET", "POST", "PUT", "DELETE"],
                    },
                  ],
                }
              : item
          );
        } else {
          // Add new module
          return [
            ...prevModules,
            {
              module,
              permissions: ["GET", "POST", "PUT", "DELETE"],
              submodules: [
                {
                  module: submodule,
                  permissions: ["GET", "POST", "PUT", "DELETE"],
                },
              ],
            },
          ];
        }
      });
    }
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await getModules();
      setLoading(false);
      setModules(data);
    } catch (error: any) {
      console.error(error);
      showToast("error", error.response.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const onSubmit = async (data: CreateRoleParams) => {
    const { title, description } = data;

    if (!selectedModules) {
      showToast("error", "Please select at least one permission.");
      return;
    }

    if (selectedModules.length === 0) {
      showToast("error", "Please select at least one permission.");
      return;
    }

    // check if the modules have empty permissions and submodules

    const modulesWithPermissions = selectedModules.filter(
      (item) =>
        item.permissions.length > 0 ||
        (item.submodules && item.submodules.length > 0)
    );

    if (modulesWithPermissions.length === 0) {
      showToast("error", "Please select at least one permission.");
      return;
    }

    try {
      setLoading(true);
      const res = await createRole(title, description, selectedModules);
      if (res.status === 201) {
        setLoading(false);
        showToast("success", res.data.message || "Role created successfully");
        navigate("/roles");
      }
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
          <div className="roaster-main-table w-100 role-management-table">
            <Table>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>GET</th>
                  <th>POST</th>
                  <th>PUT</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module, index) => (
                  <>
                    <tr key={index}>
                      <td
                        colSpan={5}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                          gap: "0.25rem",
                        }}
                      >
                        <label className="label-container">
                          <input
                            type="checkbox"
                            onClick={() =>
                              handleAllCheckboxChange({
                                module: module.Module,
                                submodule: null,
                              })
                            }
                            checked={selectedModules.some(
                              (item) =>
                                item.module === module.Module &&
                                item.permissions.length === 4
                            )}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <span>{capitalize(module.Module)}</span>
                        {module.SubModules.length > 0 && (
                          <img
                            onClick={() =>
                              setExpandedModules((prevModule) =>
                                prevModule === module.Module
                                  ? null
                                  : module.Module
                              )
                            }
                            src={ExpandTable}
                            alt="expand"
                            className="expand-icon cursor-pointer"
                          />
                        )}
                      </td>
                      <td>
                        <label className="label-container">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange({
                                module: module.Module,
                                submodule: null,
                                permission: "GET",
                              })
                            }
                            checked={selectedModules.some(
                              (item) =>
                                item.module === module.Module &&
                                item.permissions.includes("GET")
                            )}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        <label className="label-container">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange({
                                module: module.Module,
                                submodule: null,
                                permission: "POST",
                              })
                            }
                            checked={selectedModules.some(
                              (item) =>
                                item.module === module.Module &&
                                item.permissions.includes("POST")
                            )}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        <label className="label-container">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange({
                                module: module.Module,
                                submodule: null,
                                permission: "PUT",
                              })
                            }
                            checked={selectedModules.some(
                              (item) =>
                                item.module === module.Module &&
                                item.permissions.includes("PUT")
                            )}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        <label className="label-container">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange({
                                module: module.Module,
                                submodule: null,
                                permission: "DELETE",
                              })
                            }
                            checked={selectedModules.some(
                              (item) =>
                                item.module === module.Module &&
                                item.permissions.includes("DELETE")
                            )}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                    </tr>

                    {exapandedModules === module.Module && (
                      <>
                        {module.SubModules.map((subModule, subIndex) => (
                          <tr key={subIndex} className="expandable-tables">
                            <td
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: "0.25rem",
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <label className="label-container">
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleAllSubmoduleCheckboxChange({
                                      module: module.Module,
                                      submodule: subModule.SubModule,
                                    })
                                  }
                                  checked={selectedModules.some(
                                    (item) =>
                                      item.module === module.Module &&
                                      item.submodules?.some(
                                        (sub) =>
                                          sub.module === subModule.SubModule &&
                                          sub.permissions.length === 4
                                      )
                                  )}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <span>{capitalize(subModule.SubModule)}</span>
                            </td>
                            <td
                              style={{
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <label className="label-container">
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange({
                                      module: module.Module,
                                      submodule: subModule.SubModule,
                                      permission: "GET",
                                    })
                                  }
                                  checked={selectedModules.some(
                                    (item) =>
                                      item.module === module.Module &&
                                      item.submodules?.some(
                                        (sub) =>
                                          sub.module === subModule.SubModule &&
                                          sub.permissions.includes("GET")
                                      )
                                  )}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </td>
                            <td
                              style={{
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <label className="label-container">
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange({
                                      module: module.Module,
                                      submodule: subModule.SubModule,
                                      permission: "POST",
                                    })
                                  }
                                  checked={selectedModules.some(
                                    (item) =>
                                      item.module === module.Module &&
                                      item.submodules?.some(
                                        (sub) =>
                                          sub.module === subModule.SubModule &&
                                          sub.permissions.includes("POST")
                                      )
                                  )}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </td>
                            <td
                              style={{
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <label className="label-container">
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange({
                                      module: module.Module,
                                      submodule: subModule.SubModule,
                                      permission: "PUT",
                                    })
                                  }
                                  checked={selectedModules.some(
                                    (item) =>
                                      item.module === module.Module &&
                                      item.submodules?.some(
                                        (sub) =>
                                          sub.module === subModule.SubModule &&
                                          sub.permissions.includes("PUT")
                                      )
                                  )}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </td>
                            <td
                              style={{
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <label className="label-container">
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange({
                                      module: module.Module,
                                      submodule: subModule.SubModule,
                                      permission: "DELETE",
                                    })
                                  }
                                  checked={selectedModules.some(
                                    (item) =>
                                      item.module === module.Module &&
                                      item.submodules?.some(
                                        (sub) =>
                                          sub.module === subModule.SubModule &&
                                          sub.permissions.includes("DELETE")
                                      )
                                  )}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </>
                ))}
              </tbody>
            </Table>
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
