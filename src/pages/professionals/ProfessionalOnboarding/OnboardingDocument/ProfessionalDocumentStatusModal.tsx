import { OverlayTrigger, Tooltip } from "react-bootstrap";
import check from "../../../../assets/images/check.svg";
import cancel from "../../../../assets/images/cancel.svg";
import { capitalize } from "../../../../helpers";
import { ProfessionalOnboardingType } from "../../../../types/ProfessionalOnboardingTypes";
import moment from "moment";

type OpeningDocumentStatusModalProps = {
  jobId: number;
  professionalId: number;
  facilityId: number;
  jobApplicationId: number;
  row: ProfessionalOnboardingType;
  documentStatusData: ProfessionalOnboardingType[];
};

type Document = {
  Id: number;
  ProfessionalDocumentId: number | null;
  ExpiryDate: string | null;
  DocumentMaster: {
    Id: number;
    Type: string;
  };
  ProfessionalDocument: {
    Id: number;
  } | null;
};

const OpeningDocumentStatusModal = ({
  row,
}: OpeningDocumentStatusModalProps) => {
  const data = row.JobApplication?.JobComplianceDocuments as Document[];

  function determineClass(percentage: number) {
    if (percentage === 100) {
      return "percentage-above-50";
    } else {
      return "percentage-below-50";
    }
  }

  const isExpired = (date: string) => {
    const expiryDate = moment(date);
    const currentDate = moment();
    return expiryDate.isSameOrBefore(currentDate, "day");
  };

  const approvedDocuments = data.filter(
    (doc) => doc.ProfessionalDocument && !isExpired(doc.ExpiryDate as string)
  );

  const backgroundColorClass = determineClass(
    (approvedDocuments.length / data.length) * 100
  );

  const renderTooltip = (props: any) => {
    const documentsWithoutProfessional = data.filter(
      (doc) =>
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
            className="pb-2"
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
              {approvedDocuments.map((doc, index) => (
                <div key={index} className="doc-item doc-check">
                  <img src={check} className="doc-img" alt="check" />
                  <span className="doc-type">
                    {capitalize(doc.DocumentMaster.Type)}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {documentsWithoutProfessional.map((doc, index) => (
                <div key={index} className="doc-item">
                  <img src={cancel} className="doc-img" alt="cancel" />
                  <span className="doc-type">
                    {capitalize(doc.DocumentMaster.Type)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <>
      <OverlayTrigger
        placement="left"
        trigger={["hover", "focus"]}
        overlay={renderTooltip}
      >
        <span
          className={`doc-status ${backgroundColorClass}`}
          style={{ color: "white" }}
        >
          {((approvedDocuments.length / data.length) * 100).toFixed(0)}%
        </span>
      </OverlayTrigger>
      <span>{`
              ${approvedDocuments.length}/${data.length}
          `}</span>
    </>
  );
};

export default OpeningDocumentStatusModal;
