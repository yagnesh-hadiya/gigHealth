import { Modal, ModalHeader, ModalBody, FormGroup, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import { memo, useEffect, useState } from "react";
import ConfirmApplyModal from "./ConfirmApplyModal";
import { CompChecklist, MissingDocModalProps } from "../../../types/TalentJobs";
import { showToast } from "../../../helpers";
import { uploadRequiredDoc } from "../../../services/TalentJobs";
import useFetchSuggestedDocs from "../../hooks/useFetchSuggestedDocs";
import Loader from "../../../components/custom/CustomSpinner";
import SelectSuggestedDocument from "./SelectSuggesDocument";
import useUpdateEffect from "../../hooks/useUpdateEffect";

const MissingDocModal = ({
  isOpen,
  toggle,
  requiredDocs,
  setFetchDetails,
}: MissingDocModalProps) => {
  const [requiredDocsData, setRequiredDocsData] = useState<CompChecklist>();
  const [modal2, setModal2] = useState<boolean>(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [page, setPage] = useState<number>(1);
  const docIds = requiredDocs?.CompDocuments?.filter(
    (item: any) => item?.DocumentMaster?.CoreCompDocuments === null
  )?.map((doc) => doc?.DocumentMaster?.Id);

  const { loading, setLoading, suggestedJobs } = useFetchSuggestedDocs(
    docIds,
    10,
    page
  );

  const applyConfirmModal = () => setModal2((prev) => !prev);

  const computeRequiredDocs = () => {
    const isEnabled = requiredDocsData?.CompDocuments?.every(
      (item) => item?.DocumentMaster?.CoreCompDocuments !== null
    );
    return isEnabled;
  };

  const computeValue = requiredDocs?.CompDocuments?.some(
    (item) => item.DocumentMaster?.CoreCompDocuments === null
  );

  useUpdateEffect(() => {
    toggle();
    applyConfirmModal();
  }, [computeValue]);

  useEffect(() => {
    setRequiredDocsData(requiredDocs);
  }, [computeRequiredDocs]);

  const handleImageUpload = async (
    docIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
    documentId: number
  ) => {
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

      const updatedDocuments = [...uploadedDocuments];
      updatedDocuments[docIndex] = selectedFile;
      setUploadedDocuments(updatedDocuments);

      try {
        setLoading("loading");
        const upload = await uploadRequiredDoc(selectedFile, documentId);
        if (upload.status === 200) {
          showToast(
            "success",
            "Document uploaded successfully" || upload.data?.message
          );
          setFetchDetails((prev) => !prev);
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
    <>
      <div>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          centered={true}
          size="lg"
          wrapClassName="talent-modal-wrapper"
        >
          {loading === "loading" && <Loader />}
          <ModalHeader toggle={toggle}>Upload Documents</ModalHeader>
          <ModalBody className="dark-modal-body">
            <div className="select-picker-wrapper">
              {requiredDocsData &&
                requiredDocsData?.CompDocuments?.length > 0 &&
                requiredDocs?.CompDocuments?.some(
                  (item) => item.DocumentMaster?.CoreCompDocuments === null
                ) && (
                  <p style={{ fontSize: "14px", marginBottom: "6px" }}>
                    Upload Missing Documents to Apply on the Job
                  </p>
                )}
              {requiredDocs?.CompDocuments?.filter(
                (doc) => doc.DocumentMaster?.CoreCompDocuments === null
              )?.map((doc, index) => {
                return (
                  <div className="talent-modal-picker" key={doc.Id}>
                    <FormGroup>
                      {suggestedJobs &&
                        suggestedJobs[index]?.rows?.length > 0 && (
                          <div className="mb-2">
                            <SelectSuggestedDocument
                              docId={doc?.DocumentMaster?.Id}
                              docCount={suggestedJobs[index]?.count}
                              setFetchDetails={setFetchDetails}
                              setPage={setPage}
                              filename={doc?.DocumentMaster?.Type}
                            />
                          </div>
                        )}
                      <p className="modal-p-label text-capitalize">
                        {doc?.DocumentMaster?.Type}
                        <span className="asterisk">*</span>{" "}
                        <span className="light-text text-capitalize">
                          {doc?.DocumentMaster?.Type}
                        </span>
                      </p>
                      <div className="file-picker-wrapper">
                        <div className="file-picker-label-wrapper">
                          <Label
                            for={`exampleFile-${doc.Id}`}
                            className="file-picker-label"
                          >
                            Upload File
                          </Label>
                        </div>
                        <p className="file-para">
                          Supported Formats: doc, docx, pdf, jpg, jpeg, png,
                          heic upto 2 MB
                        </p>
                        <CustomInput
                          id={`exampleFile-${doc.Id}`}
                          value=""
                          type="file"
                          accept=".doc, .docx, .pdf, .heic, .png, .jpg, .jpeg"
                          style={{ display: "none" }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleImageUpload(index, e, doc?.DocumentMaster?.Id)
                          }
                        />
                      </div>
                    </FormGroup>
                  </div>
                );
              })}

              {/* <div className="modal-btn-wr">
                <Button
                  className="yellow-btn me-3 mb-0"
                  style={{ height: "34px" }}
                  onClick={() => {
                    applyConfirmModal();
                  }}
                  disabled={!computeRequiredDocs()}
                >
                  Upload & Proceed
                </Button>
                <Button
                  outline
                  className="purple-outline-btn mb-0 mobile-btn"
                  style={{ width: "120px" }}
                  onClick={() => toggle()}
                >
                  Cancel
                </Button>
              </div> */}
            </div>
          </ModalBody>
        </Modal>
      </div>
      {modal2 && (
        <ConfirmApplyModal
          isOpen={modal2}
          toggleDocModal={toggle}
          toggle={() => {
            setModal2((prev) => !prev);
          }}
        />
      )}
    </>
  );
};

export default memo(MissingDocModal);
