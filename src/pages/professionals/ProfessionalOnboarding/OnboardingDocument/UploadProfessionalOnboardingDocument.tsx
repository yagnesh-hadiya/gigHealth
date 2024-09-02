import { FormGroup, Label } from "reactstrap";
import ProfessionalOnboardingServices from "../../../../services/ProfessionalOnboardingServices";
import { showToast } from "../../../../helpers";
import { useState } from "react";
import Loader from "../../../../components/custom/CustomSpinner";

type UploadProfessionalOnboardingDocumentProps = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
  fetchDocuments: () => void;
  name: string;
};

const UploadProfessionalOnboardingDocument = ({
  documentId,
  jobId,
  facilityId,
  professionalId,
  jobApplicationId,
  fetchDocuments,
  name,
}: UploadProfessionalOnboardingDocumentProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");

  const modifyFilename = (file: File, name: string) => {
    const fileExtension = file.name.split(".").pop();
    const modifiedName = `${name}.${fileExtension}`;
    const modifiedFile = new File([file], modifiedName, { type: file.type });
    return modifiedFile;
  };

  const handleDocumentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files?.[0];
    if (!files) {
      showToast("error", "No file selected");
      setLoading("idle");
      return;
    }

    const maxFileSize: number = 2;
    if (document) {
      const fileSizeMb: number = files?.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        return showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
      }
    }

    const modifiedFiles = modifyFilename(files, name);
    setLoading("loading");
    try {
      if (e.target.files?.length === 1) {
        const res =
          await ProfessionalOnboardingServices.uploadOnboardingDocument({
            jobId: jobId,
            professionalId: professionalId,
            facilityId: facilityId,
            jobApplicationId: jobApplicationId,
            documentId: documentId,
            document: modifiedFiles,
          });
        if (res.status === 200) {
          fetchDocuments();
          setLoading("idle");
          showToast(
            "success",
            res.data.message || "Submission document uploaded successfully."
          );
        }
      }
    } catch (error: any) {
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
      console.error(error);
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="view-file-wrapper bg-white border-0 p-0 mt-3">
        <FormGroup>
          <div className="file-picker-wrapper">
            <div className="file-picker-label-wrapper">
              <Label
                for={`file-picker-${documentId}`}
                className="file-picker-label"
              >
                Upload File
              </Label>
            </div>
            <p className="file-para">
              Supported Formats: doc, docx, pdf, jpg, jpeg, png, heic up to 2 MB
            </p>

            <input
              id={`file-picker-${documentId}`}
              name={`file-picker-${documentId}`}
              className="custom-input"
              accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .heic"
              type="file"
              style={{ display: "none" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleDocumentChange(e);
              }}
            />
          </div>
        </FormGroup>
      </div>
    </>
  );
};

export default UploadProfessionalOnboardingDocument;
