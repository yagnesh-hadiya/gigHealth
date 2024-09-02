import { FormGroup, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import { RequiredDocsUplaodFileProps } from "../../../types/TalentOnboardingTypes";
import { useState } from "react";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import { uploadOnboardingRequiredDoc } from "../../../services/ProfessionalDetails";

const RequiredDocsUplaodFile = ({
  list,
  file,
  fetchData,
}: RequiredDocsUplaodFileProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const acceptedTypes = [
        ".doc",
        ".docx",
        ".pdf",
        ".heic",
        ".jpg",
        ".jpeg",
        ".png",
      ];
      const selectedFile = files[0];
      const extension = selectedFile.name.split(".").pop()?.toLowerCase();

      if (!acceptedTypes.includes("." + extension)) {
        showToast("error", "Unsupported file format");
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024;
      const fileSize = selectedFile.size;
      if (fileSize > maxSizeInBytes) {
        showToast("error", "File size exceeds the limit of 2MB");
        return;
      }

      try {
        setLoading("loading");
        const upload = await uploadOnboardingRequiredDoc(
          selectedFile,
          list?.JobId,
          list?.JobApplicationId,
          file?.Id
        );
        if (upload.status === 200) {
          showToast(
            "success",
            "Document uploaded successfully" || upload.data?.message
          );
          fetchData();
          setLoading("idle");
        } else {
          console.error(upload);
          setLoading("error");
          showToast("error", "Failed to upload document");
        }
      } catch (error: any) {
        console.error(error);
        setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  return (
    <FormGroup>
      {loading === "loading" && <Loader />}
      {/* <p className="text-capitalize">
        {file?.DocMaster?.Type ? file?.DocMaster?.Type : "-"}
        <span className="asterisk">*</span>
        <span className="fw-400">
          {" "}
          {file?.DocMaster?.Description ? file?.DocMaster?.Description : ""}
        </span>
      </p> */}
      <div className="file-picker-wrapper">
        <div className="file-picker-label-wrapper">
          <Label for={`exampleFile-${file?.Id}`} className="file-picker-label">
            Upload File
          </Label>
        </div>

        <p className="file-para">
          Supported Formats: doc, docx, pdf, jpg, jpeg, png upto 2 MB
        </p>
        <CustomInput
          id={`exampleFile-${file?.Id}`}
          value=""
          type="file"
          accept=".doc, .docx, .pdf, .heic, .png, .jpg, .jpeg"
          style={{ display: "none" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDocUpload(e)
          }
        />
      </div>
    </FormGroup>
  );
};

export default RequiredDocsUplaodFile;
