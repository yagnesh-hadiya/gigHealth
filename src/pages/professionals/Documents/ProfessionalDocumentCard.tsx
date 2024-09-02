import { useParams } from "react-router-dom";
// import File from "../../../assets/images/file.svg";
import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import ProfessionalDocumentServices from "../../../services/ProfessionalDocumentServices";
import {
  JobComplianceDocument,
  JobComplianceRejectedDocument,
  ProfessionalDocument,
} from "../../../types/ProfessionalDocumentType";
import { capitalize, showToast } from "../../../helpers";
import { useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import moment from "moment";
import EditProfessionalDocument from "./EditProfessionalDocument";
import { Col } from "reactstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import AddRowIcon from "../../../components/icons/CollapseRowBtn";
import ExpandRowIcon from "../../../components/icons/ExpandRowBtn";

type ProfessionalDocumentCardProps = {
  doc: ProfessionalDocument;
  fetchDocuments: () => void;
};

const ProfessionalDocumentCard = ({
  doc,
  fetchDocuments,
}: ProfessionalDocumentCardProps) => {
  const params = useParams<{ Id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState<boolean>(false);
  const [isRejectedDocumentsOpen, setIsRejectedDocumentsOpen] =
    useState<boolean>(false);

  const toggleDataTables = () => {
    setIsRejectedDocumentsOpen(!isRejectedDocumentsOpen);
  };
  const [isComplianceDocumentsOpen, setIsComplianceDocumentsOpen] =
    useState<boolean>(false);

  const toggleCompliance = () => {
    setIsComplianceDocumentsOpen(!isComplianceDocumentsOpen);
  };

  const downloadDocument = async (documentId: number, fileName: string) => {
    setLoading(true);
    try {
      const res =
        await ProfessionalDocumentServices.downloadProfessionalDocument({
          professionalId: Number(params.Id),
          documentId: documentId,
        });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "file");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error downloading document", error);
      showToast(
        "error",
        error.response.data.message || "Error downloading file"
      );
    }
  };

  const deleteDocument = async (documentId: number) => {
    setLoading(true);
    try {
      const res = await ProfessionalDocumentServices.deleteProfessionalDocument(
        {
          professionalId: Number(params.Id),
          documentId: documentId,
        }
      );
      if (res.status === 200) {
        fetchDocuments();
        setLoading(false);
        showToast("success", "Document deleted successfully");
      }
    } catch (error: any) {
      setLoading(false);
      showToast("error", error.response.data.message || "Error deleting file");
      console.error(error);
    }
  };

  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const RejectedColumn: TableColumn<JobComplianceRejectedDocument>[] = [
    {
      id: "rejectedOn",
      name: "Rejected On",
      cell: (doc) => {
        return (
          <span
            style={{
              color: "red",
              fontWeight: "500",
            }}
          >
            {moment(doc.RejectedOn).format("MM/DD/YYYY HH:mm:ss")}
          </span>
        );
      },
    },
    {
      id: "rejectedBy",
      name: "Rejected By",
      selector: (doc) =>
        `${capitalize(doc.RejectedByUser.FirstName)} ${capitalize(
          doc.RejectedByUser.LastName
        )}`,
    },
  ];

  const ComplianceColumn: TableColumn<JobComplianceDocument>[] = [
    {
      id: "uploadedon",
      name: "Uploaded On",
      minWidth: "140px",
      cell: (doc) => {
        return (
          <span>
            {doc.CreatedOn
              ? moment(doc.CreatedOn).format("MM/DD/YYYY HH:mm:ss")
              : "-"}
          </span>
        );
      },
    },
    {
      id: "effectivedate",
      name: "Effective Date",
      minWidth: "150px",
      cell: (doc) => {
        return (
          <span>
            {doc.EffectiveDate
              ? moment(doc.EffectiveDate).format("MM/DD/YYYY")
              : "-"}
          </span>
        );
      },
    },
    {
      id: "expiryDate",
      name: "Expiry Date",
      minWidth: "160px",
      cell: (doc) => {
        return (
          <span
            style={{
              color: isExpired(doc.ExpiryDate ?? "") ? "red" : "black",
              fontWeight: isExpired(doc.ExpiryDate ?? "") ? "500" : "normal",
            }}
          >
            {doc.ExpiryDate ? moment(doc.ExpiryDate).format("MM/DD/YYYY") : "-"}
          </span>
        );
      },
    },
    {
      id: "approvedon",
      name: "Approved On",
      minWidth: "160px",
      cell: (doc) => {
        return (
          <span
            style={{
              color: doc.IsApproved ? "green" : "black",
              fontWeight: doc.IsApproved ? "green" : "black",
            }}
          >
            {doc.ApprovedOn
              ? moment(doc.ApprovedOn).format("MM/DD/YYYY HH:mm:ss")
              : "-"}
          </span>
        );
      },
    },
    {
      id: "approvedBy",
      name: "Approved By",
      minWidth: "180px",
      selector: (doc) =>
        `${
          doc.ApprovedByUser ? capitalize(doc?.ApprovedByUser.FirstName) : ""
        } ${
          doc.ApprovedByUser ? capitalize(doc?.ApprovedByUser.LastName) : "-"
        }`,
    },
  ];

  const getType = () => {
    if (doc.JobComplianceDocuments.length > 0) {
      return doc.JobComplianceDocuments[0].DocumentMaster.Type;
    } else if (doc.JobComplianceRejectedDocuments.length > 0) {
      return doc.JobComplianceRejectedDocuments[0].DocumentMaster.Type;
    } else if (doc.AdditionalDocument) {
      return doc.AdditionalDocument.DocumentMaster.Type;
    } else if (doc.ProfessionalCoreComplianceDocument) {
      return doc.ProfessionalCoreComplianceDocument.DocumentMaster.Type;
    } else {
      return doc.FileName;
    }
  };
  const hasNoApprovedDocuments =
    doc.JobComplianceDocuments.filter((doc) => doc.IsApproved).length === 0;
  const hasJobComplianceDocuments =
    doc.JobComplianceDocuments.length === 0 ||
    doc.ProfessionalCoreComplianceDocument?.DocumentMaster;
  const hasRejectedDocuments =
    doc.JobComplianceRejectedDocuments.length === 0 ||
    doc.JobComplianceDocuments[0]?.DocumentMaster?.Type;

  return (
    <>
      {loading && <Loader />}
      <Col className={`view-file-wrapper p-3 mb-3 gap-4`}>
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center">
            <div
              className="file-img d-flex align-items-center"
              onClick={() => downloadDocument(doc.Id, doc.FileName)}
              title="Click here to download"
            >
              {/* <img src={File} /> */}
              <span className="material-symbols-outlined filled">
                description
              </span>
            </div>
            <div>
              <div className="d-flex align-items-center">
                <p
                  className="file-name mt-0"
                  style={{ marginBottom: "0px", marginRight: "10px" }}
                >
                  {capitalize(getType())}
                </p>
              </div>
              <div className="file-content d-flex align-items-center flex-wrap">
                <p style={{ marginBottom: "0px" }} className="me-2">
                  <span className="onboard-title">Uploaded On:</span>
                  <span className="onboard-info-content ms-2">
                    {moment(doc.CreatedOn).format("MM/DD/YYYY HH:mm:ss")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex">
            {hasJobComplianceDocuments && (
              <>
                {hasRejectedDocuments &&
                  !doc?.ProfessionalCoreComplianceDocument?.DocumentMaster
                    ?.Type && (
                    <CustomEditBtn
                      onEdit={() => {
                        setIsOffCanvasOpen(true);
                      }}
                    />
                  )}
                <CustomDeleteBtn onDelete={() => deleteDocument(doc.Id)} />
              </>
            )}
          </div>
        </div>

        {!hasNoApprovedDocuments && doc.JobComplianceDocuments.length > 0 && (
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <div className="d-flex align-items-center align-content-center gap-2 mb-2">
              {isComplianceDocumentsOpen ? (
                <div
                  className="cursor-pointer d-flex align-items-center"
                  onClick={toggleCompliance}
                >
                  <ExpandRowIcon />
                </div>
              ) : (
                <div
                  className="cursor-pointer d-flex align-items-center"
                  onClick={toggleCompliance}
                >
                  <AddRowIcon />
                </div>
              )}
              <span>Approved</span>
            </div>
            {isComplianceDocumentsOpen && (
              <div
                className="datatable-wrapper history-table assignment-history"
                style={{
                  border: "1px solid #e5e5e5",
                }}
              >
                <DataTable
                  columns={ComplianceColumn}
                  data={doc.JobComplianceDocuments.filter(
                    (doc) => doc.IsApproved
                  )}
                />
              </div>
            )}
          </div>
        )}
        {doc.JobComplianceRejectedDocuments.length > 0 && (
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <div className="d-flex align-items-center align-content-center gap-2 mb-2">
              {isRejectedDocumentsOpen ? (
                <div
                  className="cursor-pointer d-flex align-items-center"
                  onClick={toggleDataTables}
                >
                  <ExpandRowIcon />
                </div>
              ) : (
                <div
                  className="cursor-pointer d-flex align-items-center"
                  onClick={toggleDataTables}
                >
                  <AddRowIcon />
                </div>
              )}
              <span>Rejected</span>
            </div>
            {isRejectedDocumentsOpen && (
              <div
                className="datatable-wrapper history-table assignment-history"
                style={{
                  border: "1px solid #e5e5e5",
                }}
              >
                <DataTable
                  columns={RejectedColumn}
                  data={doc.JobComplianceRejectedDocuments}
                />
              </div>
            )}
          </div>
        )}
      </Col>

      {isOffCanvasOpen && doc.AdditionalDocument && (
        <EditProfessionalDocument
          setIsOffCanvasOpen={setIsOffCanvasOpen}
          isOffCanvasOpen={isOffCanvasOpen}
          fetchDocuments={fetchDocuments}
          documentToEdit={{
            documentId: doc.Id,
            documentMaster: doc.AdditionalDocument.DocumentMaster,
            documentName: doc.FileName,
            createdAt: doc.CreatedOn,
          }}
        />
      )}
    </>
  );
};

export default ProfessionalDocumentCard;
