import { capitalize } from "../../../../../helpers";
// import File from "../../../../../assets/images/file.svg";
import {
  JobComplianceDocument,
  JobComplianceRejectedDocument,
  ProfessionalDocument,
} from "../../../../../types/ProfessionalDocumentType";
import { downloadProfessionalDocument } from "../../../../../services/ApplicantsServices";
import { useCallback, useState } from "react";
import Loader from "../../../../../components/custom/CustomSpinner";
import moment from "moment";
import DataTable, { TableColumn } from "react-data-table-component";
import { Col } from "reactstrap";
import ExpandRowIcon from "../../../../../components/icons/ExpandRowBtn";
import AddRowIcon from "../../../../../components/icons/CollapseRowBtn";

const ReadOnlyDocumentCard = ({
  facilityId,
  jobId,
  professionalId,
  doc,
}: {
  doc: ProfessionalDocument;
  facilityId: number;
  jobId: number;
  professionalId: number;
}) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
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

  const downloadDocument = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await downloadProfessionalDocument({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        documentId: doc.Id,
      });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", doc.FileName);
        document.body.appendChild(link);
        link.click();
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
      setLoading("error");
    }
  }, [doc.FileName, doc.Id, facilityId, jobId, professionalId]);
  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const RejectedColumn: TableColumn<JobComplianceRejectedDocument>[] = [
    {
      id: "id",
      name: "Document Id",
      selector: (doc) => capitalize(doc.DocumentMaster.Id.toString()),
    },
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
      minWidth:'140px',
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
      minWidth:'150px',
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
      minWidth:'160px',
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
      minWidth:'160px',
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
      minWidth:'180px',
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
    } else {
      return doc.FileName;
    }
  };

  const hasNoApprovedDocuments =
    doc.JobComplianceDocuments.filter((doc) => doc.IsApproved).length === 0;

  return (
    <div className="details-wrapper" style={{ padding: "5px 10px" }}>
      {loading === "loading" && <Loader />}
      <Col className={`view-file-wrapper p-3 mb-3 gap-4`}>
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center">
            <div
              className="file-img d-flex align-items-center"
              onClick={() => downloadDocument()}
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
              <span>Approved Documents</span>
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
              <span>Rejected Documents</span>
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
    </div>
  );
};

export default ReadOnlyDocumentCard;
