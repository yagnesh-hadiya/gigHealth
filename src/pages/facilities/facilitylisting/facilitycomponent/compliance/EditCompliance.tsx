import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Nav,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import CustomCheckbox from "../../../../../components/custom/CustomCheckbox";
import {
  ComplianceTypes,
  MultiSelectTypes,
} from "../../../../../types/FacilityTypes";
import Drag from "../../../../../assets/images/drag.svg";
import CustomMultiSelect from "../../../../../components/custom/CustomMultiSelect";
import {
  editChecklist,
  getComplianceChecklist,
  getDocumentCategories,
  listComplianceChecklist,
  listDocuments,
} from "../../../../../services/FacilityCompliance";
import { capitalize, showToast } from "../../../../../helpers";
import DraggableDataTable from "./DraggableDataTable";
import Loader from "../../../../../components/custom/CustomSpinner";
import { ucFirstChar } from "../../../../../helpers/index";
import {
  ComplianceDocument,
  DocumentDetail,
  DocumentMaster,
  EditComplianceProps,
} from "../../../../../types/Compliance";

const EditCompliance = ({
  modal,
  toggle,
  checklistId,
  setListData,
}: EditComplianceProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [data, setData] = useState<ComplianceTypes[][]>([]);
  const [documentCategories, setDocumentCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const facilityDataId = useParams();
  const [selectedDocuments, setSelectedDocuments] = useState<
    { value: number; label: string }[][]
  >([]);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checklistId || !modal) return;

    Promise.all([
      getDocumentCategories(facilityDataId?.Id!),
      listDocuments(facilityDataId?.Id!),
      getComplianceChecklist(facilityDataId?.Id!, checklistId),
    ])
      .then((data) => {
        setDocumentCategories(data[0]);
        setDocuments(data[1]);
        setActiveTab(data[0][0]?.Id);

        setName(ucFirstChar(data[2][0]?.Name)!);
        const formattedData = formatComplianceData(
          data[2][0]?.ComplianceDocuments
        );
        setData(formattedData);
        const seletedDocs = formatSelectedDocsData(formattedData, data[1]);
        setSelectedDocuments(seletedDocs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Something went wrong");
      });
  }, [checklistId, modal]);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const formatSelectedDocsData = (
    data: (ComplianceDocument[] | undefined)[],
    documentsData: DocumentMaster[]
  ) => {
    try {
      const result: { value: number; label: string }[][] = [];
      data.forEach((item: ComplianceDocument[] | undefined, index: number) => {
        item?.forEach((ele: any) => {
          const docName = ele.documentname;
          const doc = documentsData.find(
            (doc: DocumentMaster) => doc.Type === docName
          );
          if (!doc) {
            return;
          }
          if (result[index]) {
            result[index].push({
              value: doc.Id,
              label: doc.Type,
            });
          } else {
            result[index] = [
              {
                value: doc.Id,
                label: doc.Type,
              },
            ];
          }
        });
      });

      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const formatComplianceData = (data: DocumentDetail[]) => {
    try {
      if (!data) return [];
      const formattedData: (ComplianceDocument[] | undefined)[] = [];
      data.forEach((item: DocumentDetail) => {
        const index = formattedData[item?.DocumentCategory?.Id - 1];

        if (index) {
          (
            formattedData[item.DocumentCategory.Id - 1] as ComplianceDocument[]
          ).push({
            id: item.DocumentMaster.Id,
            documentname: item.DocumentMaster.Type,
            description: item.DocumentMaster.Type,
            priority: item.Priority,
            expiryDays: item.ExpiryDurationDays,
            internalUse: item.IsInternalUse,
          });
        } else {
          formattedData[item.DocumentCategory.Id - 1] = [
            {
              id: item.DocumentMaster.Id,
              documentname: item.DocumentMaster.Type,
              description: item.DocumentMaster.Type,
              priority: item.Priority,
              expiryDays: item.ExpiryDurationDays,
              internalUse: item.IsInternalUse,
            },
          ];
        }
      });

      return formattedData.map((item: any) =>
        item.sort((a: any, b: any) => a.priority - b.priority)
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const resetData = () => {
    setData([]);
    setSelectedDocuments([]);
    setName("");
  };

  const validateChecklistData = (data: ComplianceDocument[][]) => {
    const result = {
      valid: true,
      message: "",
    };

    if (!name) {
      result.valid = false;
      result.message = "Name is required";
      return result;
    }

    if (
      !data ||
      !Array.isArray(data) ||
      data.length === 0 ||
      !data.some(Boolean)
    ) {
      result.valid = false;
      result.message = "Documents are required";
      return result;
    }

    for (const item of data) {
      if (!item) continue;
      if (item.length === 0) {
        result.valid = false;
        result.message = "Documents are required";
        return result;
      }
      for (const ele of item) {
        if (
          !ele.expiryDays ||
          !Number.isInteger(ele.expiryDays) ||
          ele.expiryDays <= 0
        ) {
          result.valid = false;
          result.message = "Expiry Days must be greater than 0";
          return result;
        }
        if (ele.expiryDays > 36500) {
          result.valid = false;
          result.message = "Expiry Days must be less than or equal to 36500";
          return result;
        }
      }
    }

    return result;
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const isValid = validateChecklistData(data);
      if (!isValid.valid) {
        setLoading(false);
        return showToast("error", isValid.message);
      }

      const checklist: {
        categoryId: number;
        documents: {
          documentMasterId: number;
          isInternalUse: boolean;
          expiryDurationDays: number;
        }[];
      }[] = [];

      data.forEach((item, index) => {
        if (!item) return;

        const checklistData = {
          categoryId: index + 1,
          documents: item
            .map((doc: ComplianceTypes) => ({
              documentMasterId: doc.id,
              expiryDurationDays: doc.expiryDays,
              isInternalUse: doc.internalUse,
            }))
            .sort((a: any, b: any) => a.priority - b.priority),
        };

        checklist.push(checklistData);
      });

      await editChecklist(facilityDataId?.Id!, name, checklist, checklistId);

      listComplianceChecklist(facilityDataId?.Id!)
        .then((data) => {
          setListData(data);
        })
        .catch((error) => {
          console.error(error);
          showToast("error", "Something went wrong");
        });

      setLoading(false);
      showToast("success", "Checklist edited successfully");
      resetData();
      toggle();
    } catch (error: any) {
      console.error(error);
      showToast("error", error?.response?.data?.message);
      setLoading(false);
    }
  };

  const onCancel = () => {
    resetData();
    toggle();
  };

  const handleMultiSelectChange = (selected: any) => {
    setSelectedDocuments((doc) => {
      const arr = [...doc];
      arr[activeTab - 1] = selected;
      return arr;
    });
    setData((ele) => {
      const arr = [...ele];
      arr[activeTab - 1] = selected.map((item: any, index: number) => {
        const element = arr[activeTab - 1]?.find((e: any) => {
          return e.id === item.value;
        });
        return {
          id: item.value,
          priority: index + 1,
          documentname: item.label,
          description: element?.description || item.description,
          expiryDays: Number(element?.expiryDays) || 365,
          internalUse: !!element?.internalUse,
        };
      });

      if (arr[activeTab - 1].length === 0) {
        delete arr[activeTab - 1];
      }
      return arr;
    });
  };

  // const handleRowDrop = (startIndex: number, endIndex: number) => {
  //     setData(ele => {
  //         const arr = [...ele];
  //         const start = { ...arr[activeTab - 1][startIndex] };
  //         const end = { ...arr[activeTab - 1][endIndex] };
  //         start.priority = endIndex + 1;
  //         end.priority = startIndex + 1;
  //         arr[activeTab - 1][endIndex] = start;
  //         arr[activeTab - 1][startIndex] = end;
  //         return arr;
  //     })
  // };

  const handleRowDrop = (startIndex: number, endIndex: number) => {
    setData((ele) => {
      const arr = [...ele];
      const activeTabData = arr[activeTab - 1];
      const [removed] = activeTabData.splice(startIndex, 1);
      activeTabData.splice(endIndex, 0, removed);
      const updatedData = activeTabData.map((item, index) => ({
        ...item,
        priority: index + 1,
      }));
      arr[activeTab - 1] = updatedData;
      return arr;
    });
  };

  const Column = [
    {
      name: "",
      selector: () => "drag",
      cell: () => <img src={Drag} />,
      width: "5%",
    },
    {
      name: "Internal Use",
      selector: () => "internalUse",
      cell: (row: ComplianceTypes) => (
        <CustomCheckbox
          onChange={(data) => {
            setData((ele) => {
              const arr = [...ele];
              arr[activeTab - 1] = arr[activeTab - 1].map(
                (item: ComplianceTypes) => {
                  if (item.documentname === row.documentname) {
                    return {
                      ...item,
                      internalUse: data.target.checked,
                    };
                  }
                  return item;
                }
              );
              return arr;
            });
          }}
          checked={row.internalUse}
          disabled={false}
        />
      ),
      width: "10%",
    },
    {
      name: "Priority",
      selector: () => "priority",
      cell: (row: ComplianceTypes) => row.priority,
      width: "10%",
    },
    {
      name: "Document Name",
      selector: () => "documentname",
      cell: (row: ComplianceTypes) => capitalize(row.documentname),
      width: "18%",
    },
    {
      name: "Description",
      selector: () => "description",
      cell: (row: ComplianceTypes) => ucFirstChar(row.description),
      width: "27%",
    },
    {
      // name: "Expiry Duration (Days)",
      name: (
        <span>
          Expiry Duration <span style={{ color: "#717B9E" }}>(Days)</span>
        </span>
      ),
      selector: () => "expiry",
      cell: (row: ComplianceTypes) => (
        <CustomInput
          type="number"
          min={0}
          value={row.expiryDays}
          onChange={(data: any) => {
            setData((ele) => {
              const arr = [...ele];
              arr[activeTab - 1] = arr[activeTab - 1].map(
                (item: ComplianceTypes) => {
                  if (item.documentname === row.documentname) {
                    return {
                      ...item,
                      expiryDays: Number(data.target.value),
                    };
                  }
                  return item;
                }
              );
              return arr;
            });
          }}
        />
      ),
      width: "20%",
    },
    {
      name: "Actions",
      selector: () => "actions",
      cell: (row: ComplianceTypes) => (
        <>
          <CustomDeleteBtn
            onDelete={function (): void {
              setSelectedDocuments((doc) => {
                const arr = [...doc];
                arr[activeTab - 1] = arr[activeTab - 1].filter(
                  (item: MultiSelectTypes) => item.label !== row.documentname
                );
                return arr;
              });
              setData((ele) => {
                const arr = [...ele];
                arr[activeTab - 1] = arr[activeTab - 1]
                  .filter(
                    (item: ComplianceTypes) =>
                      item.documentname !== row.documentname
                  )
                  .map((item: ComplianceTypes, index: number) => {
                    return {
                      ...item,
                      priority: index + 1,
                    };
                  });
                if (arr[activeTab - 1].length === 0) {
                  delete arr[activeTab - 1];
                }
                return arr;
              });
            }}
          />
        </>
      ),
      width: "10%",
    },
  ];

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={resetData}
      >
        <ModalHeader toggle={toggle}>Edit Compliance Checklist</ModalHeader>
        <ModalBody>
          {loading && <Loader />}
          <Row>
            <Col md="12" className="col-group">
              <Label>
                Checklist Name <span className="asterisk">*</span>
              </Label>
              <CustomInput
                onChange={(data: any) => setName(data.target.value)}
                value={name}
              />
            </Col>
          </Row>
          <div className="tab-wrapper">
            <Nav tabs>
              {documentCategories.map((category: any) => (
                <NavItem key={Math.random()}>
                  <NavLink
                    className={activeTab === category.Id ? "show" : ""}
                    onClick={() => toggleTab(category.Id)}
                    to={""}
                  >
                    {category.Category}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={activeTab}>
              {documentCategories.map((category: any) => (
                <TabPane tabId={category.Id} key={Math.random()}>
                  <Row>
                    <Col md="12" className="col-group mt-2 mb-2">
                      <Label>
                        Select Documents <span className="asterisk">*</span>
                      </Label>
                      <CustomMultiSelect
                        options={documents.map((document: any) => ({
                          value: document.Id,
                          label: ucFirstChar(document.Type),
                          description: document.Description,
                        }))}
                        onChange={handleMultiSelectChange}
                        allowSelectAll={true}
                        value={selectedDocuments[activeTab - 1]}
                      />
                      <div className="datatable-wrapper facility-datatable-wrapper facility-modal-table mt-3 assignment-history">
                        <DraggableDataTable
                          columns={Column}
                          data={data[activeTab - 1]}
                          onRowDrop={handleRowDrop}
                        />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              ))}
            </TabContent>
          </div>
        </ModalBody>
        <ModalFooter className="mb-3 justify-content-start">
          <div className="btn-wrapper">
            <CustomButton onClick={onSubmit} className="primary-btn">
              Save
            </CustomButton>
            <CustomButton onClick={onCancel} className="secondary-btn">
              Cancel
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditCompliance;
