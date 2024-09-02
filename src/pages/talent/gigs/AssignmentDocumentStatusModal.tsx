import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import check from "../../../assets/images/check.svg";
import cancel from "../../../assets/images/cancel.svg";
import moment from "moment";
import { capitalize } from "../../../helpers";

type Document = {
  ProfessionalDocument: any;
  ExpiryDate: string;
  DocumentMaster: {
    Type: string;
  };
};

type OpeningDocumentStatusModalProps = {
  selectedItem: Document[];
  isMobile?: boolean;
};

const ViewStatusMobileModal = ({
  isOpen,
  toggle,
  data,
}: {
  isOpen: boolean;
  toggle: () => void;
  data: Document[];
}) => {
  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const approvedDocuments = data.filter(
    (doc) => doc.ProfessionalDocument && !isExpired(doc.ExpiryDate)
  );

  const documentsWithoutProfessional = data.filter(
    (doc) => !doc.ProfessionalDocument || isExpired(doc.ExpiryDate)
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
              {approvedDocuments.map((doc, index) => (
                <div key={index} className="doc-item doc-check">
                  <img src={check} className="doc-img" alt="check" />
                  <span className="doc-type">
                    {doc.DocumentMaster
                      ? capitalize(doc.DocumentMaster.Type)
                      : "Unknown"}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {documentsWithoutProfessional.map((doc, index) => (
                <div key={index} className="doc-item">
                  <img src={cancel} className="doc-img" alt="cancel" />
                  <span className="doc-type">
                    {doc.DocumentMaster
                      ? capitalize(doc.DocumentMaster.Type)
                      : "Unknown"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

const AssignmentDocumentStatusModal = ({
  selectedItem,
  isMobile = false,
}: OpeningDocumentStatusModalProps) => {
  const data = selectedItem;

  const [statusModal, setStatusModal] = useState<boolean>(false);

  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const approvedDocuments = data.filter(
    (doc) => doc.ProfessionalDocument && !isExpired(doc.ExpiryDate)
  );

  const determineClass = (percentage: number) => {
    return percentage === 100 ? "percentage-above-50" : "percentage-below-50";
  };

  const backgroundColorClass = determineClass(
    (approvedDocuments.length / data.length) * 100
  );

  const renderTooltip = (props: any) => {
    const documentsWithoutProfessional = data.filter(
      (doc) => !doc.ProfessionalDocument || isExpired(doc.ExpiryDate)
    );
    return (
      <Tooltip id="tooltip" className="custom-onboard-tooltip" {...props}>
        <div
          className="custom-onboard-tooltip p-2"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h6>Document Status</h6>
          <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {approvedDocuments.map((doc, index) => (
                <div key={index} className="doc-item doc-check">
                  <img src={check} className="doc-img" alt="check" />
                  <span className="doc-type">
                    {doc.DocumentMaster
                      ? capitalize(doc.DocumentMaster.Type)
                      : "Unknown"}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {documentsWithoutProfessional.map((doc, index) => (
                <div key={index} className="doc-item">
                  <img src={cancel} className="doc-img" alt="cancel" />
                  <span className="doc-type">
                    {doc.DocumentMaster
                      ? capitalize(doc.DocumentMaster.Type)
                      : "Unknown"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Tooltip>
    );
  };

  const professionalDocumentCount = data.filter(
    (item) => item.ProfessionalDocument
  ).length;
  const totalCount = data.length;
  const progress = Math.floor((professionalDocumentCount / totalCount) * 100);

  return (
    <>
      <OverlayTrigger
        placement="left"
        trigger={["hover", "focus"]}
        overlay={isMobile ? <></> : renderTooltip}
      >
        <span
          onClick={() => setStatusModal((prev) => !prev)}
          className={`doc-status ${backgroundColorClass}`}
          style={{ color: "white", cursor: "pointer" }}
        >
          {progress}%
        </span>
      </OverlayTrigger>
      <span>
        {professionalDocumentCount} / {totalCount}
      </span>
      {isMobile && (
        <ViewStatusMobileModal
          isOpen={statusModal}
          toggle={() => setStatusModal((prev) => !prev)}
          data={data}
        />
      )}
    </>
  );
};

export default AssignmentDocumentStatusModal;
