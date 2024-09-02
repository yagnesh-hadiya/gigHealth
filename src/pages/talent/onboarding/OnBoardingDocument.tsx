import moment from "moment";
import {
  TalentJobComplianceDocuments,
  TalentOnboardingDocumentProps,
} from "../../../types/TalentOnboardingTypes";
import { Button } from "reactstrap";
import { useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import { deleteOnboardingCoreComplianceDocument } from "../../../services/TalentOnboarding";
import { showToast } from "../../../helpers";
import { downloadCoreComplianceDocument } from "../../../services/ProfessionalDetails";

const OnBoardingDocument = ({
  list,
  submittedDocs,
  fetchData,
}: TalentOnboardingDocumentProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const handleDownloadDocument = async (Id: number, fileName: string) => {
    try {
      setLoading("loading");
      const response = await downloadCoreComplianceDocument(Id);
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "file");
        document.body.appendChild(link);
        link.click();
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleRemoveDocument = async (
    jobId: number,
    jobApplicationId: number,
    documentId: number
  ) => {
    try {
      setLoading("loading");
      const response = await deleteOnboardingCoreComplianceDocument(
        jobId,
        jobApplicationId,
        documentId
      );
      if (response.status === 200) {
        fetchData();
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  console.log("submitted docs", submittedDocs);

  return (
    <>
      {loading === "loading" && <Loader />}
      <h3 className="list-title mb-3">Onboarding Documents</h3>
      <div className="onboarding-doc-wr">
        {submittedDocs?.map((doc: TalentJobComplianceDocuments) => (
          <div key={doc?.Id}>
            <p className="onboarding-label-p m-b-10 text-capitalize">
              {doc?.DocMaster?.Type ? doc?.DocMaster?.Type : "-"}
              <span className="asterisk">*</span>
              <span className="fw-400">
                {" "}
                {doc?.DocMaster?.Description
                  ? `(${doc?.DocMaster?.Description})`
                  : ""}
              </span>
            </p>
            <div className="onboarding-doc-box mb-3">
              <div
                className="avatar-wr filled-icon"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (
                    doc?.ProfessionalDocumentId &&
                    doc?.ProfessionalDocument?.FileName
                  ) {
                    handleDownloadDocument(
                      doc?.ProfessionalDocumentId,
                      doc?.ProfessionalDocument?.FileName
                    );
                  }
                }}
              >
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="right-info-wr">
                <div className="d-flex gap-8 mt-0">
                  <h4 className="doc-heading text-capitalize">
                    {doc?.DocMaster?.Type ? doc?.DocMaster?.Type : "-"}
                  </h4>
                  <Button
                    outline
                    className="remove-outline-btn mb-1"
                    onClick={() => {
                      if (doc?.Id) {
                        handleRemoveDocument(
                          list?.JobId,
                          list?.JobApplicationId,
                          doc?.Id
                        );
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-8-16 mb-1">
                  <p className="key_value mb-0">
                    Uploaded On:{" "}
                    <span className="fw-400">
                      {doc?.ProfessionalDocument
                        ? moment(doc?.ProfessionalDocument?.CreatedOn).format(
                            "MM/DD/YYYY"
                          )
                        : "-"}
                    </span>
                  </p>
                  {doc?.EffectiveDate && (
                    <p className="key_value mb-0">
                      Effective Date:{" "}
                      <span className="fw-400">
                        {doc?.EffectiveDate
                          ? moment(doc?.EffectiveDate).format("MM/DD/YYYY")
                          : "-"}
                      </span>
                    </p>
                  )}
                  {doc?.ExpiryDate && (
                    <p className="key_value mb-0">
                      Expiry Date:{" "}
                      <span className="fw-400">
                        {doc?.ExpiryDate
                          ? moment(doc?.ExpiryDate).format("MM/DD/YYYY")
                          : "-"}
                      </span>
                    </p>
                  )}
                </div>
                <div className="d-flex flex-wrap align-items-center mb-1 gap-8-16">
                  <div className="d-flex icon-p-flex filled-icon">
                    {doc?.ApprovedByUser && (
                      <>
                        <span className="material-symbols-outlined verified-icon">
                          verified
                        </span>
                        <p
                          className="key_value"
                          style={{ marginBottom: "2px" }}
                        >
                          Approved By:{" "}
                          <span className="fw-400 text-capitalize">
                            {doc?.ApprovedByUser?.FirstName
                              ? doc?.ApprovedByUser?.FirstName
                              : "-"}{" "}
                            {doc?.ApprovedByUser?.LastName
                              ? doc?.ApprovedByUser?.LastName
                              : "-"}
                          </span>
                        </p>
                      </>
                    )}
                    {doc?.ApprovedOn && (
                      <p className="key_value mb-0">
                        Approved On:{" "}
                        <span className="fw-400">
                          {moment(doc?.ApprovedOn).format("MM/DD/YYYY")}
                        </span>
                      </p>
                    )}
                    {!doc?.ApprovedByUser && (
                      <div className="d-flex flex-wrap align-items-center mb-1 gap-8-16">
                        <p className="key_value mb-0">
                          Approval Status:{" "}
                          <span className="yellow-text fw-400">Pending</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OnBoardingDocument;
