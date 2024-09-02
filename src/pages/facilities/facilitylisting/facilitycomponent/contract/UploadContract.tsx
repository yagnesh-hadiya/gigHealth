import { Form, Link, useNavigate, useParams } from "react-router-dom";
import { Col, Label, Row } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import DataTable from "react-data-table-component";
// import File from "../../../../../assets/images/file.svg";
import CustomEyeBtn from "../../../../../components/custom/CustomEyeBtn";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import { useContext, useEffect, useState } from "react";
import { showToast, ucFirstChar } from "../../../../../helpers";
import {
  deleteContractDocument,
  downloadDoc,
  editedDocument,
  getContractDetails,
  uploadDocument,
  uploadEditedDocument,
} from "../../../../../services/ContractTerm";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  ContractTermTableData,
  UploadContractProps,
} from "../../../../../types/ContractTerm";
import { FacilityActiveComponentProps } from "../../../../../types";
import { FacilityActiveComponentContext } from "../../../../../helpers/context/FacilityActiveComponent";
import ACL from "../../../../../components/custom/ACL";

const UploadContract = ({
  contractIdprop,
  switchToContractInfoTab,
}: UploadContractProps) => {
  const [document1, setDocument1] = useState<File>();
  const [uploadedDocument, setUploadedDocument] = useState<File>();
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [contractDocuments, setContractDocuments] = useState<
    ContractTermTableData[]
  >([]);
  const { setActiveComponent } = useContext<FacilityActiveComponentProps>(
    FacilityActiveComponentContext
  );
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(
    null
  );
  const [editingDocument, setEditingDocument] =
    useState<ContractTermTableData | null>(null);
  const [isEditRecord, setIsEditRecord] = useState<boolean>(false);
  const navigate = useNavigate();
  const { Id, contractId } = useParams();

  const fetchContractData = async () => {
    setLoading(true);
    try {
      if (contractId !== undefined) {
        const data = await getContractDetails(Number(Id), Number(contractId));
        setContractDocuments(data.ContractDocuments);
      } else {
        if (contractIdprop !== undefined) {
          const data = await getContractDetails(
            Number(Id),
            Number(contractIdprop)
          );
          setContractDocuments(data.ContractDocuments);
        }
      }
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast("error", error.response.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [contractId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | undefined = e.target.files?.[0];
    setUploadedDocument((prevUploadedDoc: File | undefined) => {
      if (prevUploadedDoc?.name === selectedFile?.name) {
        showToast("error", "Contract Document already exists");
        return prevUploadedDoc;
      }
      return selectedFile;
    });
    const isDuplicate = contractDocuments.some(
      (document) => document.FileName === selectedFile?.name
    );
    if (isDuplicate) {
      showToast("error", "Contract Document already exists");
    } else {
      if (selectedFile) {
        setDocument1(selectedFile);
        setUploadedDocument(selectedFile);
        // setEditingDocumentId(null);
        setEditingDocument(null);
        //  setUploadedFileName(selectedFile.name);
      }
    }
  };

  const onDeleteHandler = async (documentId: number) => {
    try {
      setLoading(true);
      if (contractId !== undefined) {
        await deleteContractDocument(
          Number(Id),
          Number(contractId),
          documentId
        );
        await fetchContractData();
        showToast("success", "Contract term deleted successfully");
      } else if (contractIdprop !== undefined) {
        await deleteContractDocument(
          Number(Id),
          Number(contractIdprop),
          documentId
        );
        await fetchContractData();
        showToast("success", "Contract term deleted successfully ");
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onDownloadHandler = async (docId: number) => {
    try {
      setLoading(true);
      if (contractId !== undefined) {
        downloadDoc(Number(Id), Number(contractId), docId).then((response) => {
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
        });
      } else if (contractIdprop !== undefined) {
        downloadDoc(Number(Id), Number(contractIdprop), docId).then(
          (response) => {
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
        );
      }
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  const maxFileSize: number = 2;
  const validFileExtensions = { document1: ["doc", "docx", "pdf"] };
  const getFileExtension = (file: File | undefined) => {
    const fileExtension: string | undefined = file?.name
      ?.split(".")
      .pop()
      ?.toLowerCase();
    return fileExtension;
  };

  const handleUpload = async () => {
    // if (contractIdprop === undefined || contractId === undefined) {
    //     showToast('error', 'Contract Id is not available')
    //     return;
    // }
    if (document1) {
      const fileExtension: string | undefined =
        getFileExtension(uploadedDocument);
      if (
        !fileExtension ||
        !validFileExtensions.document1.includes(fileExtension)
      ) {
        return showToast(
          "error",
          "Supported formats are only .doc, .docx, .pdf"
        );
      }
    }
    if (document1) {
      const fileSizeMb: number = document1?.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        return showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
      }
    }

    if (notes.length === 0) {
      showToast("error", "Notes is requied");
      return;
    }

    if (isEditRecord) {
      try {
        setLoading(true);
        if (contractId !== undefined) {
          await editedDocument(
            Number(Id),
            Number(contractId),
            Number(editingDocumentId),
            { notes, contractDocuments: document1 }
          );
        } else if (contractIdprop !== undefined) {
          await editedDocument(
            Number(Id),
            Number(contractIdprop),
            Number(editingDocumentId),
            { notes, contractDocuments: document1 }
          );
        }

        setLoading(false);
        setDocument1(undefined);
        setUploadedDocument(undefined);
        await fetchContractData();
        setNotes("");
        setIsEditRecord(false);
        setEditingDocument(null);
        //  showToast('success', response?.data?.message || 'Contract document Edited successfully');
      } catch (error: any) {
        console.error(error);
        setLoading(false);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }

    if (contractIdprop && !isEditRecord) {
      try {
        if (!document1) {
          return showToast("error", "No Contract Document is selected");
        }
        setLoading(true);
        const response = await uploadDocument(
          Number(Id),
          Number(contractIdprop),
          { notes, contractDocuments: document1 }
        );
        setLoading(false);
        setDocument1(undefined);
        setUploadedDocument(undefined);
        await fetchContractData();
        setNotes("");
        showToast(
          "success",
          response?.data?.message || "Contract document uploaded successfully"
        );
      } catch (error: any) {
        console.error(error);
        setLoading(false);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    } else {
      try {
        if (contractId !== undefined && !isEditRecord) {
          if (!document1) {
            return showToast("error", "No Contract Document is selected");
          }

          const response = await uploadEditedDocument(
            Number(Id),
            Number(contractId),
            { notes, contractDocuments: document1 }
          );
          setLoading(false);
          setDocument1(undefined);
          setUploadedDocument(undefined);
          await fetchContractData();
          setNotes("");
          showToast(
            "success",
            response?.data?.message || "Contract document uploaded successfully"
          );
        }
      } catch (error: any) {
        console.error(error);
        setLoading(false);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  const handleCancel = () => {
    setActiveComponent("Contract Terms");
    navigate(`/facility/${Number(Id)}`);
  };
  const handleEditClick = (document: ContractTermTableData) => {
    const documentToEdit = contractDocuments.find(
      (doc) => doc.Id === document.Id
    );
    if (documentToEdit) {
      setEditingDocumentId(document.Id);
      setNotes(documentToEdit.Notes);
      setEditingDocument(document);
      setIsEditRecord(true);
    }
  };

  const Column = [
    {
      name: "Contract File",
      cell: (row: ContractTermTableData) => (
        <div
          className="d-flex align-items-center"
          onClick={() => onDownloadHandler(row.Id)}
          title="Click to download"
        >
          <div className="file-img">
            {/* <img
              src={File}
              className=""
              alt="Download"
              style={{ cursor: "pointer" }}
            /> */}
            <span className="material-symbols-outlined filled">
              description
            </span>
          </div>
          <span className="file-name">{row.FileName}</span>
        </div>
      ),
    },
    {
      name: "Uploaded On",
      cell: (row: ContractTermTableData) => {
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        };
        return new Date(row.CreatedOn).toLocaleString("en-US", options);
      },
    },
    {
      name: "Notes",
      width: "10%",
      cell: (row: ContractTermTableData) => ucFirstChar(row.Notes),
    },
    {
      name: "Actions",
      width: "20%",
      cell: (row: ContractTermTableData) => (
        <>
          <ACL
            submodule={"contractterms"}
            module={"facilities"}
            action={["GET", "GET"]}
          >
            <CustomEyeBtn onEye={() => onDownloadHandler(row.Id)} />
          </ACL>
          <ACL
            submodule={"contractterms"}
            module={"facilities"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn onEdit={() => handleEditClick(row)} />
          </ACL>
          <ACL
            submodule={"contractterms"}
            module={"facilities"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDeleteHandler(row.Id)} />
          </ACL>
        </>
      ),
      // width: "10%",
    },
  ];

  return (
    <div className="upload-tab-wrap">
      {loading && <Loader />}
      <Form>
        <Row className="mt-3">
          <Col xxl="6" xl="6" lg="6" className="col-group mt-2">
            <Label className="">
              Upload Contract <span className="asterisk"> *</span>
            </Label>
            <div className="contract-file-wrapper">
              <div className="file-picker-label-wrapper">
                <Label for="exampleFile" className="file-picker-label">
                  Choose File
                </Label>
              </div>
              {document1 || editingDocumentId ? (
                <p className="file-para">
                  {document1 ? document1.name : editingDocument?.FileName}
                </p>
              ) : (
                <p className="file-para">
                  PDF, DOC, DOCX Maximum file size can be 2 MB
                </p>
              )}
              <CustomInput
                id="exampleFile"
                type="file"
                style={{ display: "none" }}
                //multiple
                onChange={handleFileSelect}
              />
            </div>
          </Col>
          <Col xxl="6" xl="6" lg="6" className="col-group mt-2">
            <Label className="">
              Notes
              <span className="asterisk"> *</span>
            </Label>
            <CustomInput
              placeholder=" "
              id="note"
              value={notes}
              onChange={(e: any) => setNotes(e.target.value)}
            />
          </Col>
        </Row>
        <CustomButton
          className="primary-btn  "
          onClick={handleUpload}
          disabled={!document1?.name}
        >
          Save & Upload
        </CustomButton>
      </Form>
      <div className="datatable-wrapper contract-table-wrap mt-4">
        <DataTable columns={Column} data={contractDocuments} />
      </div>
      <div className="btn-wrapper">
        {/* <CustomButton className="primary-btn"  >
                    Save
                </CustomButton> */}

        <CustomButton
          className="secondary-btn me-3"
          onClick={switchToContractInfoTab}
        >
          Back
        </CustomButton>

        <Link onClick={handleCancel} to={""}>
          <CustomButton className="secondary-btn">Cancel</CustomButton>
        </Link>
      </div>
    </div>
  );
};

export default UploadContract;
