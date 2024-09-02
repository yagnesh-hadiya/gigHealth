import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  ModalFooter,
} from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomCheckbox from "../../../../../components/custom/CustomCheckbox";
import { ComplianceTypes } from "../../../../../types/FacilityTypes";
import Drag from "../../../../../assets/images/drag.svg";
import {
  getDocumentCategories,
  getComplianceChecklist,
} from "../../../../../services/FacilityCompliance";
import { showToast, ucFirstChar } from "../../../../../helpers";
import DraggableDataTable from "./DraggableDataTable";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  ComplianceDocument,
  DocumentDetail,
  ViewComplianceProps,
} from "../../../../../types/Compliance";
import CustomButton from "../../../../../components/custom/CustomBtn";

const ViewCompliance = ({
  modal,
  toggle,
  checklistId,
  onEdit,
}: ViewComplianceProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [data, setData] = useState<ComplianceTypes[][]>([]);
  const [documentCategories, setDocumentCategories] = useState([]);
  const facilityDataId = useParams();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checklistId || !modal) return;

    setLoading(true);
    Promise.all([
      getDocumentCategories(facilityDataId?.Id!),
      getComplianceChecklist(facilityDataId?.Id!, checklistId),
    ])
      .then((data) => {
        setDocumentCategories(data[0]);
        setActiveTab(data[0][0]?.Id);
        setName(ucFirstChar(data[1][0]?.Name)!);

        const formattedData = formatComplianceData(
          data[1][0]?.ComplianceDocuments
        );
        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        showToast("error", err?.message);
      });
  }, [checklistId, modal]);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const handleEdit = () => {
    onEdit(checklistId);
    toggle();
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
          checked={row.internalUse}
          disabled={false}
          onChange={() => {}}
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
      cell: (row: ComplianceTypes) => (
        <span className="text-capitalize">{row.documentname}</span>
      ),
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
        <CustomInput value={row.expiryDays} disabled />
      ),
      width: "20%",
    },
  ];

  const resetData = () => {
    setData([]);
    setName("");
  };

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={resetData}
      >
        <ModalHeader toggle={toggle}>Compliance Checklist</ModalHeader>
        <ModalBody>
          {loading && <Loader />}
          <Row>
            <Col md="12" className="col-group">
              <Label>
                Checklist Name <span className="asterisk">*</span>
              </Label>
              <CustomInput disabled value={name} />
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
                      <div className="datatable-wrapper facility-datatable-wrapper facility-modal-table">
                        <DraggableDataTable
                          columns={Column}
                          data={data[activeTab - 1]}
                          onRowDrop={() => {}}
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
            <CustomButton onClick={handleEdit} className="primary-btn">
              Edit
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ViewCompliance;
