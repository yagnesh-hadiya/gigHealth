import { Button, FormGroup, Label } from "reactstrap";
import CustomSelect from "../../../components/custom/CustomSelect";
import { useState } from "react";
import CustomInput from "../../../components/custom/CustomInput";
import { AdditionalDocumentsProps } from "../../../types/ProfessionalDetails";
import {
  ProfessionalDocumentsType,
  ProfessionalUploadedDocsType,
} from "../../../types/ProfessionalAuth";
import { capitalize, showToast } from "../../../helpers";
import { SelectOption } from "../../../types/FacilityTypes";
import Loader from "../../../components/custom/CustomSpinner";
import {
  deleteCoreComplianceDocument,
  downloadCoreComplianceDocument,
  uploadProfessionalDocuments,
} from "../../../services/ProfessionalDetails";
import moment from "moment";

const AdditionalDocuments = ({ state, fetch }: AdditionalDocumentsProps) => {
  const [selectedDocument, setSelectedDocument] = useState<SelectOption | null>(
    null
  );
  const [documentation, setDocument] = useState<File | undefined>();
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const acceptedTypes = [
        ".doc",
        ".docx",
        ".pdf",
        ".heic",
        ".jpeg",
        ".jpg",
        ".png",
      ];
      const selectedFiles = Array.from(files).filter((file) => {
        const extension = file.name.split(".").pop()?.toLowerCase();
        return extension && acceptedTypes.includes("." + extension);
      });

      const maxSizeInBytes = 2 * 1024 * 1024;
      if (files || selectedFiles) {
        const fileSize = files[0].size || selectedFiles[0].size;
        if (fileSize > maxSizeInBytes) {
          setDocument(undefined);
          showToast("error", "File size exceeds the limit of 2MB");
          return;
        }
      }

      setDocument(selectedFiles[0]);
    }
  };

  const handleDocument = (selectedOption: SelectOption | null) => {
    if (selectedDocument === null) {
      setSelectedDocument(null);
    }
    if (selectedOption) {
      setSelectedDocument({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  };

  const handleSave = async () => {
    if (!documentation) {
      return showToast("error", "Please upload the file");
    }

    if (!selectedDocument?.value) {
      return showToast("error", "Please select the document");
    }
    try {
      setLoading("loading");
      const response = await uploadProfessionalDocuments(
        selectedDocument?.value,
        documentation
      );
      if (response.status === 200) {
        // showToast(
        //   "success",
        //   "Compliance document uploaded successfully" || response.data?.message
        // );
        fetch();
        setDocument(undefined);
        setSelectedDocument(null);
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
      const res = await downloadCoreComplianceDocument(Id);
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
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

  const handleRemoveDocument = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await deleteCoreComplianceDocument(Id);
      if (response.status === 200) {
        // showToast(
        //   "success",
        //   "Compliance document removed successfully" || response.data?.message
        // );
        fetch();
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
      {loading === "loading" && <Loader />}
      <div className="doc-tab-section">
        <h3 className="scroll-title mb-3">Additional Documents</h3>
        <div className="mb-3">
          <Label for="doc_drp">Select Document</Label>
          <CustomSelect
            className="mb-3"
            value={selectedDocument}
            onChange={(doc) => handleDocument(doc)}
            options={state?.documents?.map(
              (item: ProfessionalDocumentsType) => ({
                value: item.Id,
                label: capitalize(item?.Type),
              })
            )}
            placeholder="Select Document"
            noOptionsMessage={() => "No Document Found"}
            isSearchable={true}
            id="doc_drp"
            name="doc_drp"
            isDisabled={false}
          />
        </div>
        <FormGroup>
          <Label for="doc_desc">Document Description</Label>
          <CustomInput
            type="text"
            placeholder="Document Description"
            id="doc_desc"
            value={
              selectedDocument?.value
                ? state?.documents?.find(
                    (item: ProfessionalDocumentsType) =>
                      item?.Id === selectedDocument?.value
                  )?.Description || "--"
                : ""
            }
            disabled={true}
          />
        </FormGroup>
        {selectedDocument?.value && (
          <div className="talent-file-picker">
            <FormGroup>
              <div className="file-picker-wrapper gap-file-picker">
                <div className="file-picker-label-wrapper">
                  <Label for="exampleFile" className="file-picker-label">
                    Upload File
                  </Label>
                </div>

                <p className="file-para">
                  Supported Formats: doc, docx, pdf, .jpg, .jpeg, .png, .heic
                  upto 2 MB
                  {documentation && (
                    <p className="file-para">
                      Your Document name is: {documentation?.name}
                    </p>
                  )}
                </p>
                <CustomInput
                  id="exampleFile"
                  value=""
                  type="file"
                  jpeg
                  accept=".doc, .docx, .pdf, .jpeg, .jpg, .png"
                  style={{ display: "none" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleImageUpload(e)
                  }
                />
              </div>
            </FormGroup>
          </div>
        )}

        <div className="mb-3">
          <Button
            className="blue-gradient-btn mb-0 mobile-btn"
            onClick={() => handleSave()}
            disabled={!documentation}
          >
            Save & Upload
          </Button>
        </div>
        {state?.uploadedDocuments && state?.uploadedDocuments?.length > 0 && (
          <h3 className="scroll-title mb-3" style={{ fontSize: "16px" }}>
            Saved Documents
          </h3>
        )}

        {state?.uploadedDocuments &&
          state?.uploadedDocuments?.length > 0 &&
          state?.uploadedDocuments?.map(
            (item: ProfessionalUploadedDocsType) => {
              return (
                <>
                  <p className="doc-info-text mb-2 text-capitalize">
                    {item?.DocumentMaster?.Type}
                    <span className="asterisk">*</span>{" "}
                    <span className="grey-text">
                      {item?.DocumentMaster?.Description
                        ? `(${item?.DocumentMaster?.Description})`
                        : ""}
                    </span>
                  </p>

                  <div className="doc-info-box mb-3">
                    <div className="d-flex align-items-center">
                      <div
                        className="doc-avatar filled-icon me-3 cursor-pointer"
                        title="Click here to download"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleDownloadDocument(
                              item?.ProfessionalDocument?.Id,
                              item?.ProfessionalDocument?.FileName
                            )
                          }
                        >
                          description
                        </span>
                      </div>
                      <div className="doc-info-wr">
                        <div
                          className="d-flex align-items-center flex-wrap"
                          style={{ gap: "8px" }}
                        >
                          <p className="blue-text mb-1 text-capitalize">
                            {item?.ProfessionalDocument?.FileName
                              ? item?.ProfessionalDocument?.FileName
                              : ""}
                          </p>
                          <Button
                            outline
                            className="remove-outline-btn mb-1"
                            onClick={() => handleRemoveDocument(item?.Id)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="d-flex flex-wrap gap-8-16">
                          <p className="black-text">
                            <span className="fw-500">Uploaded On:</span>{" "}
                            {item?.ProfessionalDocument?.CreatedOn
                              ? moment(
                                  item?.ProfessionalDocument?.CreatedOn
                                ).format("MM-DD-YYYY HH:mm:ss")
                              : ""}
                          </p>
                          {/* <p className="black-text">
                            <span className="fw-500">Effective:</span>{" "}
                            04/12/2023 10:40:12
                          </p>
                          <p className="red-text">
                            <span className="fw-500">Expired On:</span>{" "}
                            04/12/2023 10:40:12
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
          )}
      </div>
    </>
  );
};

export default AdditionalDocuments;
