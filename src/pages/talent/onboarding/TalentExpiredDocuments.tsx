import { Button, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import { useEffect, useState } from "react";
import { formatDateString, showToast } from "../../../helpers";
import { downloadCoreComplianceDocument } from "../../../services/ProfessionalDetails";
import Loader from "../../../components/custom/CustomSpinner";
import { uploadJobComplinceDocuments } from "../../../services/GigHistoryServices";
import {
  TalentJobComplianceDocuments,
  TalentOnboardingListType,
} from "../../../types/TalentOnboardingTypes";
import { getDocumentStatus, isDocumentExpired } from "../../common";

const TalentExpiredDocuments = ({
  doc,
  fetchData,
}: {
  doc: TalentOnboardingListType;
  fetchData: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [documentations, setDocumentations] = useState<{
    [key: number]: File | undefined;
  }>({});

  const [documentsList, setDocumentsList] = useState(
    doc?.JobApplication?.JobComplianceDocuments || []
  );

  useEffect(() => {
    setDocumentsList(doc?.JobApplication?.JobComplianceDocuments || []);
  }, [doc]);

  const updateUploadState = (
    itemId: number,
    selectedFile: File | undefined
  ) => {
    setDocumentations((prevDocumentations) => ({
      ...prevDocumentations,
      [itemId]: selectedFile,
    }));
  };

  const handleImageUpload = (
    itemId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];

      updateUploadState(itemId, selectedFile);
    }
  };

  const handleSave = async (
    itemId: number,
    JobId: number,
    JobApplicationId: number
  ) => {
    const documentation = documentations[itemId];
    if (!documentation) {
      return showToast("error", "Please upload the file");
    }

    try {
      setLoading("loading");
      const response = await uploadJobComplinceDocuments(
        JobId,
        JobApplicationId,
        itemId,
        documentation
      );
      if (response.status === 200) {
        setDocumentations((prevDocumentations) => ({
          ...prevDocumentations,
          [itemId]: undefined,
        }));
        fetchData();
        showToast("success", "Document added successfully");
        setDocumentsList((prevDocumentsList: any[]) =>
          prevDocumentsList.filter((doc: any) => doc.Id !== itemId)
        );
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

  const handleDownloadDocument = async (Id: number, fileName: string) => {
    try {
      setLoading("loading");
      const response = await downloadCoreComplianceDocument(Id);
      if (response.status === 200) {
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

  return (
    <>
      {loading === "loading" && <Loader />}{" "}
      {documentsList?.map((item: TalentJobComplianceDocuments) => {
        return (
          <>
            {item.ProfessionalDocument !== null &&
              item.ExpiryDate !== null &&
              isDocumentExpired(item) && (
                <>
                  <p className="onboarding-label-p m-b-10 text-capitalize">
                    {item?.DocMaster?.Type ? item?.DocMaster?.Type : "-"}
                    <span className="asterisk">*</span>
                    <span className="fw-400">
                      {" "}
                      {item?.DocMaster?.Description
                        ? `(${item?.DocMaster?.Description})`
                        : ""}
                    </span>
                  </p>
                  <div className="expired-doc-wrapper mb-3" key={item.Id}>
                    <div className="d-flex mb-3">
                      <div
                        className="doc-avatar-wr filled-icon"
                        style={{ marginRight: "10px", cursor: "pointer" }}
                        onClick={() => {
                          if (item?.ProfessionalDocument) {
                            handleDownloadDocument(
                              item?.ProfessionalDocument?.Id,
                              item?.ProfessionalDocument?.FileName
                            );
                          }
                        }}
                      >
                        <span className="material-symbols-outlined">
                          description
                        </span>
                      </div>
                      <div className="doc-right-side mt-1">
                        <div
                          className="d-flex flex-wrap align-items-center"
                          style={{ marginBottom: "4px" }}
                        >
                          <h4 className="mb-0 me-1 text-capitalize">
                            {item?.DocMaster?.Type
                              ? item?.DocMaster?.Type
                              : "-"}
                          </h4>
                          {item?.DocMaster?.Description && (
                            <p className="mb-0 text-capitalize">
                              ({item?.DocMaster?.Description ?? ""})
                            </p>
                          )}
                        </div>
                        <div className="d-flex flex-wrap align-items-center mb-1 gap-8-16">
                          <p className="key-value mb-0">
                            Uploaded On:{" "}
                            <span className="fw-400">
                              {item
                                ? formatDateString(
                                    item.ProfessionalDocument?.CreatedOn
                                  )
                                : "-"}
                            </span>
                          </p>
                          <p className="key-value mb-0">
                            Effective:{" "}
                            <span className="fw-400">
                              {item.EffectiveDate
                                ? formatDateString(item.EffectiveDate)
                                : "-"}
                            </span>
                          </p>
                          <p className="key-value mb-0 red-text">
                            {getDocumentStatus(item)}:{" "}
                            <span className="fw-400">
                              {item.ExpiryDate
                                ? formatDateString(item.ExpiryDate)
                                : "-"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="talent-file-picker assignment-picker">
                      <div className="file-picker-wrapper justify-content-between">
                        <div className="d-flex align-items-center gap-8-16">
                          <div className="file-picker-label-wrapper">
                            <Label
                              for={`file-${item.Id}`}
                              className="file-picker-label"
                            >
                              Upload File
                            </Label>
                          </div>
                          <div className="file-para">
                            Supported Formats: doc, docx, pdf, jpg, jpeg, png
                            upto 2 MB
                            {documentations[item.Id] && (
                              <div className="file-para">
                                Your Document name is:{" "}
                                {documentations[item.Id]?.name}
                              </div>
                            )}
                          </div>
                          <CustomInput
                            id={`file-${item.Id}`}
                            value=""
                            type="file"
                            jpeg
                            accept=".doc, .docx, .pdf, .jpeg, .jpg, .png"
                            style={{ display: "none" }}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleImageUpload(item.Id, e)}
                          />
                        </div>
                        <div className="btn-absolute-position">
                          <Button
                            className="blue-gradient-btn mb-0 mobile-btn"
                            onClick={() =>
                              handleSave(
                                item.Id,
                                doc.JobId,
                                doc.JobApplicationId
                              )
                            }
                            disabled={!documentations[item.Id]}
                          >
                            Save & Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </>
        );
      })}
    </>
  );
};
export default TalentExpiredDocuments;
