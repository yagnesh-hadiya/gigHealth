// import { ModalTitle } from "react-bootstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { capitalize } from "../../../helpers";
import { TalentJobComplianceDocuments } from "../../../types/TalentOnboardingTypes";
import moment from "moment";
import check from "../../../assets/images/check.svg";
import cancel from "../../../assets/images/cancel.svg";

const ViewStatusMobileModal = ({
  isOpen,
  toggle,
  data,
}: {
  isOpen: boolean;
  toggle: () => void;
  data: TalentJobComplianceDocuments[];
}) => {
  const isExpired = (date: string | null) => {
    if (date) {
      const expiryDate = moment(date);
      const currentDate = moment();
      return expiryDate.isSameOrBefore(currentDate, "day");
    }
  };

  const approvedDocuments = data.filter(
    (doc) => doc.ProfessionalDocument && !isExpired(doc?.ExpiryDate)
  );

  const documentsWithoutProfessional = data.filter(
    (doc) => !doc.ProfessionalDocument || isExpired(doc?.ExpiryDate)
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true} size="lg">
      <ModalHeader toggle={toggle}>Document Status</ModalHeader>
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
                    {doc?.DocMaster
                      ? capitalize(doc?.DocMaster?.Type)
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
                    {doc?.DocMaster
                      ? capitalize(doc?.DocMaster?.Type)
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

export default ViewStatusMobileModal;
