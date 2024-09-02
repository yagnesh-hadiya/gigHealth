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
  createChecklist,
  getDocumentCategories,
  listComplianceChecklist,
  listDocuments,
} from "../../../../../services/FacilityCompliance";
import { showToast, ucFirstChar } from "../../../../../helpers";
import DraggableDataTable from "./DraggableDataTable";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  AddNewComplianceProps,
  ChecklistType,
  DocumentCategory,
  DocumentMaster,
  SelectedItem,
} from "../../../../../types/Compliance";

const AddNewCompliance = ({
  modal,
  toggle,
  setListData,
}: AddNewComplianceProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [data, setData] = useState<ComplianceTypes[][]>([]);
  const [documentCategories, setDocumentCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const facilityDataId = useParams();
  const [selectedDocuments, setSelectedDocuments] = useState<
    { value: string; label: string }[][]
  >([]);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getDocumentCategories(facilityDataId?.Id!),
      listDocuments(facilityDataId?.Id!),
    ])
      .then((data) => {
        setDocumentCategories(data[0]);
        setDocuments(data[1]);
        setActiveTab(data[0][0]?.Id);
      })
      .catch((err) => {
        console.error(err);
        showToast("error", err?.message);
      });
  }, []);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const resetData = () => {
    setData([]);
    setSelectedDocuments([]);
    setName("");
  };

  const validateChecklistData = (data: ComplianceTypes[][]) => {
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

      //  const checklist: { categoryId: number, documents: { documentMasterId: number, isInternalUse: boolean, expiryDurationDays: number }[] }[] = []
      const checklist: ChecklistType[] = [];
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

      await createChecklist(facilityDataId?.Id!, name, checklist);
      setLoading(false);

      listComplianceChecklist(facilityDataId?.Id!)
        .then((data) => {
          setListData(data);
        })
        .catch((error) => {
          console.error(error);
          showToast("error", "Something went wrong");
        });

      showToast("success", "Checklist created successfully");
      resetData();
      toggle();
    } catch (error: any) {
      console.error(error);
      showToast("error", "Something went wrong");
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
      arr[activeTab - 1] = selected.map((item: SelectedItem, index: number) => {
        const element = arr[activeTab - 1]?.find(
          (e: any) => e.id === item.value
        );
        return {
          id: item.value,
          priority: index + 1,
          documentname: ucFirstChar(item.label),
          description: item.description,
          expiryDays: Number(element?.expiryDays) || 365,
          internalUse: !!element?.internalUse,
        };
      });
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
      cell: (row: ComplianceTypes) => row.documentname,
      width: "18%",
    },
    {
      name: "Description",
      selector: () => "description",
      cell: (row: ComplianceTypes) => row.description,
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
          onChange={(data: React.ChangeEvent<HTMLInputElement>) => {
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
        <ModalHeader toggle={toggle}>Create Compliance Checklist</ModalHeader>
        <ModalBody>
          {loading && <Loader />}
          <Row>
            <Col md="12" className="col-group">
              <Label>
                Checklist Name <span className="asterisk">*</span>
              </Label>
              <CustomInput
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                value={name}
              />
            </Col>
          </Row>
          <div className="tab-wrapper">
            <Nav tabs>
              {documentCategories.map((category: DocumentCategory) => (
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
              {documentCategories.map((category: DocumentCategory) => (
                <TabPane tabId={category.Id} key={category.Id}>
                  <Row>
                    <Col md="12" className="col-group mt-2 mb-2">
                      <Label>
                        Select Documents <span className="asterisk">*</span>
                      </Label>
                      <CustomMultiSelect
                        options={documents.map((document: DocumentMaster) => ({
                          value: document.Id,
                          label: ucFirstChar(document.Type),
                          description: ucFirstChar(document.Description),
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

export default AddNewCompliance;
