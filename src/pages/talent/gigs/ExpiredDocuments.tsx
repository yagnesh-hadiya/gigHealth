import { Button, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { formatDateString, showToast } from "../../../helpers";
import { downloadCoreComplianceDocument } from "../../../services/ProfessionalDetails";
import Loader from "../../../components/custom/CustomSpinner";
import { uploadJobComplinceDocuments } from "../../../services/GigHistoryServices";

const ExpiredDocuments = ({ doc }: any) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [documentations, setDocumentations] = useState<{
    [key: number]: File | undefined;
  }>({});

  const [documentsList, setDocumentsList] = useState(
    doc.JobComplianceDocuments || []
  );

  useEffect(() => {
    setDocumentsList(doc.JobComplianceDocuments || []);
  }, [doc]);

  // Update upload state for a specific item
  const updateUploadState = (
    itemId: number,
    selectedFile: File | undefined
  ) => {
    setDocumentations((prevDocumentations) => ({
      ...prevDocumentations,
      [itemId]: selectedFile,
    }));
  };

  // Function to handle file upload for a specific item
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

  const handleDownloadDocument = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await downloadCoreComplianceDocument(Id);
      if (response) {
        const contentDisposition = response.headers["content-disposition"];
        let filename = "download";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }
        const file = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const fileURL = URL.createObjectURL(file);
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.download = filename;
        fileLink.click();
        URL.revokeObjectURL(fileURL);
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

  const isDocumentExpired = (doc: any) => {
    if (!doc.ExpiryDate) return false;
    const expiryDate = moment(doc.ExpiryDate);
    const currentDate = moment();
    return expiryDate.isBefore(currentDate, "day");
  };
  const expiredDocuments = useMemo(
    () =>
      documentsList.filter(
        (item: any) =>
          item.ProfessionalDocument !== null &&
          item.ExpiryDate !== null &&
          isDocumentExpired(item)
      ),
    [documentsList]
  );

  return (
    <>
      {loading === "loading" && <Loader />}
      {expiredDocuments.length > 0 && (
        <h3 className="list-title m-b-12">Expired Documents</h3>
      )}
      {documentsList?.map((item: any) => (
        <>
          {item.ProfessionalDocument !== null &&
            item.ExpiryDate !== null &&
            isDocumentExpired(item) && (
              <div className="expired-doc-wrapper mb-3" key={item.Id}>
                <div className="d-flex mb-3">
                  <div
                    title="Click here to download"
                    className="doc-avatar-wr filled-icon"
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() =>
                      handleDownloadDocument(item?.ProfessionalDocument?.Id)
                    }
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
                        {item.DocumentMaster.Type}
                      </h4>
                      {item.DocumentMaster.Description && (
                        <p className="mb-0">
                          ({item.DocumentMaster.Description})
                        </p>
                      )}
                    </div>
                    <div className="d-flex flex-wrap align-items-center mb-1 gap-8-16">
                      <p className="key-value mb-0">
                        Uploaded On:{" "}
                        <span className="fw-400">
                          {item.CreatedOn
                            ? formatDateString(item.CreatedOn)
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
                        Expired On:{" "}
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
                        Supported Formats: doc, docx, pdf, upto 2 MB
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleImageUpload(item.Id, e)
                        }
                      />
                    </div>
                    <div className="btn-absolute-position">
                      <Button
                        className="blue-gradient-btn mb-0 mobile-btn"
                        onClick={() =>
                          handleSave(item.Id, doc.Job.Id, doc.JobApplicationId)
                        }
                        disabled={!documentations[item.Id]}
                      >
                        Save & Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
      ))}
    </>
  );
};
export default ExpiredDocuments;
