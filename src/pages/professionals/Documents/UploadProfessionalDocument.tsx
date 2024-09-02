import { Form, useParams } from "react-router-dom";
import { Col, FormGroup, Label, Row } from "reactstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useEffect, useState } from "react";
import CustomInput from "../../../components/custom/CustomInput";
import CustomButton from "../../../components/custom/CustomBtn";
import { listDocumentMasterList } from "../../../services/DocumentMasterServices";
import { capitalize, showToast } from "../../../helpers";
import CustomSelect from "../../../components/custom/CustomSelect";
import { DocumentMasterListType } from "../../../types/DocumentTypes";
import Loader from "../../../components/custom/CustomSpinner";
import ProfessionalDocumentServices from "../../../services/ProfessionalDocumentServices";

type AddNewDocumentsProps = {
  setIsOffCanvasOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOffCanvasOpen: boolean;
  fetchFacilityDocuments: () => void;
  documentToEdit?: {
    documentId: number;
    documentMasterId: number;
    documentName: string;
    fileType: string;
    createdAt: string;
  };
};

const UploadProfessionalDocument = ({
  setIsOffCanvasOpen,
  isOffCanvasOpen,
  fetchFacilityDocuments,
  documentToEdit,
}: AddNewDocumentsProps) => {
  const [document, setDocument] = useState<File>();
  const params = useParams<{ Id: string }>();
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [documentMasterList, setDocumentMasterList] = useState<
    DocumentMasterListType[]
  >([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    label: string;
    value: number;
  } | null>(null);

  const fetchData = async () => {
    try {
      setLoading("loading");
      const res = await listDocumentMasterList();
      setLoading("idle");
      setDocumentMasterList(res.data.data);
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (documentToEdit) {
      setSelectedDocument({
        label: capitalize(documentToEdit.fileType),
        value: documentToEdit.documentMasterId,
      });
    }
  }, [documentToEdit]);

  const handleCancel = () => {
    setDocument(undefined);
    setDocumentMasterList([]);
    setSelectedDocument(null);
    setIsOffCanvasOpen(false);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | undefined = e.target.files?.[0];

    if (selectedFile) {
      setDocument(selectedFile);
    }
  };

  const onSubmit = async () => {
    if (!selectedDocument?.value) {
      return showToast("error", "Please select a document type");
    }

    if (!document) {
      return showToast("error", "Please select a file");
    }

    const maxFileSize: number = 2;
    if (document) {
      const fileSizeMb: number = document?.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        return showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
      }
    }
    setLoading("loading");
    try {
      const res = await ProfessionalDocumentServices.createProfessionalDocument(
        {
          professionalId: Number(params.Id),
          document: document,
          documentMasterId: selectedDocument?.value,
        }
      );

      if (res.status === 201) {
        setLoading("idle");
        showToast("success", "Document added successfully");
        fetchFacilityDocuments();
        handleCancel();
      }
    } catch (error: any) {
      console.error("Error adding document", error);
      setLoading("error");
      showToast(
        "error",
        error.response.data.message || "Error adding document"
      );
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}

      <Offcanvas
        show={isOffCanvasOpen}
        onHide={() => {
          setIsOffCanvasOpen(false);
        }}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Document</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Row>
              <Col md="12" className="col-group">
                <Label>Select Documents</Label>
                <CustomSelect
                  id="document-master-id"
                  name="document-master"
                  noOptionsMessage={() => "No Documents Found"}
                  options={documentMasterList.map((item) => ({
                    label: capitalize(item.Type),
                    value: item.Id,
                  }))}
                  onChange={(e) => {
                    setSelectedDocument(e);
                  }}
                  value={selectedDocument}
                  placeholder="Select Documents"
                />
              </Col>
              <Col md="12">
                <FormGroup>
                  <div className="file-picker-wrapper">
                    <div className="file-picker-label-wrapper">
                      <Label for="exampleFile" className="file-picker-label">
                        Upload File
                      </Label>
                    </div>
                    {documentToEdit && (
                      <p className="file-para">
                        Your Document name is: {documentToEdit?.documentName}
                      </p>
                    )}
                    {document && (
                      <p className="file-para">
                        Your Document name is: {document?.name}
                      </p>
                    )}
                    <p className="file-para">
                      Supported Formats: doc, docx, pdf, jpg, jpeg, png, heic up
                      to 2 MB
                    </p>
                    <CustomInput
                      id="exampleFile"
                      value=""
                      type="file"
                      accept=".doc, .docx, .pdf, .heic, .jpeg, .jpg, .png"
                      style={{ display: "none" }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleDocumentChange(e)
                      }
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <div className="btn-wrapper">
              <CustomButton
                className="primary-btn ms-0"
                onClick={onSubmit}
                disabled={
                  !selectedDocument || !document || loading === "loading"
                }
              >
                Save
              </CustomButton>
              <CustomButton className="secondary-btn" onClick={handleCancel}>
                Cancel
              </CustomButton>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default UploadProfessionalDocument;
