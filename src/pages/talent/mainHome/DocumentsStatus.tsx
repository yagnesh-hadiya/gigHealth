import {
  Modal,
  ModalBody,
  ModalHeader,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import check from "../../../assets/images/check.svg";
import cancel from "../../../assets/images/cancel.svg";
import { Progress } from "reactstrap";
import { capitalize } from "../../../helpers";
import { Key, useState } from "react";
import moment from "moment";

const ViewStatusMobileModal = ({
  isOpen,
  toggle,
  data,
}: {
  isOpen: boolean;
  toggle: () => void;
  data: any;
}) => {
  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const approvedDocuments = data.filter(
    (doc: { ProfessionalDocument: any; ExpiryDate: string }) =>
      doc.ProfessionalDocument && !isExpired(doc.ExpiryDate)
  );

  const documentsWithoutProfessional = data.filter(
    (doc: { ProfessionalDocument: any; ExpiryDate: string }) =>
      !doc.ProfessionalDocument || isExpired(doc.ExpiryDate)
  );

  return (
    <Modal show={isOpen} onHide={toggle} centered size="sm">
      <ModalHeader closeButton>
        <Modal.Title>Document Status</Modal.Title>
      </ModalHeader>
      <ModalBody
        className="viewAssignmentViewAssignment"
        style={{
          overflow: "auto",
        }}
      >
        <div
          className="custom-onboard-tooltip p-2"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              {approvedDocuments.map(
                (
                  doc: { DocumentMaster: { Type: string } },
                  index: Key | null | undefined
                ) => (
                  <div key={index} className="doc-item doc-check">
                    <img src={check} className="doc-img" alt="check" />
                    <span className="doc-type">
                      {doc.DocumentMaster
                        ? capitalize(doc.DocumentMaster.Type)
                        : "Unknown"}
                    </span>
                  </div>
                )
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {documentsWithoutProfessional.map(
                (
                  doc: { DocumentMaster: { Type: string } },
                  index: Key | null | undefined
                ) => (
                  <div key={index} className="doc-item">
                    <img src={cancel} className="doc-img" alt="cancel" />
                    <span className="doc-type">
                      {doc.DocumentMaster
                        ? capitalize(doc.DocumentMaster.Type)
                        : "Unknown"}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
const DocumentsStatus = ({ DocumentList, isMobile }: any) => {
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const approvedDocuments = DocumentList.filter(
    (doc: { ProfessionalDocument: any; ExpiryDate: string }) =>
      doc.ProfessionalDocument && !isExpired(doc.ExpiryDate as string)
  );

  const renderTooltip = (props: any) => {
    const documentsWithoutProfessional = DocumentList.filter(
      (doc: { ProfessionalDocument: any; ExpiryDate: string }) =>
        !doc.ProfessionalDocument ||
        (doc.ExpiryDate && isExpired(doc.ExpiryDate as string))
    );
    return (
      <Tooltip id="tooltip" className="custom-onboard-tooltip" {...props}>
        <div
          className="custom-onboard-tooltip p-2"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h6>Document Status</h6>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {approvedDocuments.map(
                (
                  doc: { DocumentMaster: { Type: string } },
                  index: Key | null | undefined
                ) => (
                  <div key={index} className="doc-item doc-check">
                    <img src={check} className="doc-img" alt="check" />
                    <span className="doc-type">
                      {capitalize(doc.DocumentMaster.Type)}
                    </span>
                  </div>
                )
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {documentsWithoutProfessional.map(
                (
                  doc: { DocumentMaster: { Type: string } },
                  index: Key | null | undefined
                ) => (
                  <div key={index} className="doc-item">
                    <img src={cancel} className="doc-img" alt="cancel" />
                    <span className="doc-type">
                      {capitalize(doc.DocumentMaster.Type)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Tooltip>
    );
  };
  const professionalDocumentCount = DocumentList.filter(
    (item: { ProfessionalDocument: any }) => item.ProfessionalDocument
  ).length;
  const totalCount = DocumentList.length;
  const progress = Math.floor((professionalDocumentCount / totalCount) * 100);

  return (
    <div className="w-100">
      <div className="d-flex justify-content-between align-items-center w-100">
        <p className="me-2">Document Status</p>
        <p>
          {professionalDocumentCount} / {totalCount}
        </p>
      </div>
      <OverlayTrigger
        placement="top"
        trigger={["hover", "focus"]}
        overlay={isMobile ? <></> : renderTooltip}
      >
        <div style={{ width: "100%" }}>
          <Progress
            onClick={() => setStatusModal((prev) => !prev)}
            className="my-2"
            color="success"
            value={progress}
            style={{ fontSize: "9px", height: "0.8rem" }}
          >
            {`${progress}%`}
          </Progress>
        </div>
      </OverlayTrigger>
      {isMobile && (
        <ViewStatusMobileModal
          isOpen={statusModal}
          toggle={() => setStatusModal((prev) => !prev)}
          data={DocumentList}
        />
      )}
    </div>
  );
};

export default DocumentsStatus;
