import { OverlayTrigger, Tooltip } from "react-bootstrap";
import check from "../../../assets/images/check.svg";
import cancel from "../../../assets/images/cancel.svg";
import moment from "moment";
import { capitalize } from "../../../helpers";
import { useState } from "react";
import { TalentJobComplianceDocuments } from "../../../types/TalentOnboardingTypes";
import ViewStatusMobileModal from "./ViewStatusModal";

type OpeningDocumentStatusModalProps = {
  selectedItem: TalentJobComplianceDocuments[];
  isMobile?: boolean;
};

const TalentOpeningDocumentStatusModal = ({
  selectedItem,
  isMobile = false,
}: OpeningDocumentStatusModalProps) => {
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const data = selectedItem;

  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const approvedDocuments = data.filter(
    (doc: TalentJobComplianceDocuments) =>
      doc.ProfessionalDocument && !isExpired(doc.ExpiryDate as string)
  );
  function determineClass(percentage: number) {
    if (percentage === 100) {
      return "percentage-above-50";
    } else {
      return "percentage-below-50";
    }
  }

  const backgroundColorClass = determineClass(
    (approvedDocuments.length / data.length) * 100
  );

  const renderTooltip = (props: any) => {
    const documentsWithoutProfessional = data.filter(
      (doc: TalentJobComplianceDocuments) =>
        !doc.ProfessionalDocument ||
        (doc.ExpiryDate && isExpired(doc.ExpiryDate as string))
    );
    return (
      <Tooltip id="tooltip" className="custom-onboard-tooltip" {...props}>
        <div
          className="custom-onboard-tooltip"
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
              {approvedDocuments?.map(
                (doc: TalentJobComplianceDocuments, index: number) => (
                  <div key={index} className="doc-item doc-check">
                    <img src={check} className="doc-img" alt="check" />
                    <span className="doc-type">
                      {capitalize(doc?.DocMaster?.Type)}
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
              {documentsWithoutProfessional?.map(
                (doc: TalentJobComplianceDocuments, index: number) => (
                  <div key={index} className="doc-item">
                    <img src={cancel} className="doc-img" alt="cancel" />
                    <span className="doc-type">
                      {capitalize(doc?.DocMaster?.Type)}
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

  const professionalDocumentCount = data?.filter(
    (item: TalentJobComplianceDocuments) => item.ProfessionalDocument
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
          style={{ color: "white" }}
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

export default TalentOpeningDocumentStatusModal;
