import { Form, useParams } from "react-router-dom";
import { Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import Search from "../../../../../assets/images/search.svg";
import Offcanvas from "react-bootstrap/Offcanvas";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import { FacilityDocument } from "../../../../../helpers/schemas/FacilityDocument";
import {
  AddNewDocumentsProps,
  FacilityDocumentType,
} from "../../../../../types/FacilityDocument";
import { capitalize, showToast } from "../../../../../helpers";
import { useEffect, useState } from "react";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  addFacilityDocument,
  editDocument,
} from "../../../../../services/FacilityDocuments";
import ACL from "../../../../../components/custom/ACL";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const AddNewDocuments = ({
  setIsOffCanvasOpen,
  isOffCanvasOpen,
  selectedDocumentForEdit,
  setSelectedDocumentForEdit,
  fetchFacilityDocuments,
  search,
  setSearch,
}: AddNewDocumentsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FacilityDocumentType>({
    resolver: yupResolver(FacilityDocument) as Resolver<FacilityDocumentType>,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [document, setDocument] = useState<File>();
  const [uploadedDocument, setUploadedDocument] = useState<File>();
  const facilityId = useParams();

  const handleCancel = () => {
    setSelectedDocumentForEdit(null);
    setDocument(undefined);
    reset();
    setIsOffCanvasOpen(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | undefined = e.target.files?.[0];
    setUploadedDocument((prevUploadedDoc: File | undefined) => {
      if (prevUploadedDoc?.name === selectedFile?.name) {
        showToast("error", "Document already exists");
        return prevUploadedDoc;
      }
      return selectedFile;
    });

    if (selectedFile) {
      setDocument(selectedFile);
    }
  };

  const maxFileSize: number = 2;
  const validFileExtensions = {
    document: ["doc", "docx", "pdf"],
  };
  const getFileExtension = (file: File | undefined) => {
    const fileExtension: string | undefined = file?.name
      ?.split(".")
      .pop()
      ?.toLowerCase();
    return fileExtension;
  };
  const [dataDrp] = useState([
    {
      label: <>American Hospital Association <span className="span-brd">Parent</span></>,
      value: 1,
    },
    {
      label: <>American Hospital Association 2 <span className="span-brd">Parent</span></>,
      value: 2,
    },
    {
      label: <>American Hospital Association 3 <span className="span-brd">Parent</span></>,
      value: 3,
    },
  ]);
  const onSubmit = async (data: FacilityDocumentType) => {
    if (document) {
      const fileExtension: string | undefined =
        getFileExtension(uploadedDocument);
      if (
        !fileExtension ||
        !validFileExtensions.document.includes(fileExtension)
      ) {
        return showToast(
          "error",
          "Supported formats are only .doc, .docx, .pdf"
        );
      }
    }

    if (document) {
      const fileSizeMb: number = document?.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        return showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
      }
    }

    if (selectedDocumentForEdit) {
      try {
        const { Id } = selectedDocumentForEdit;
        setLoading(true);
        const editedDocument = await editDocument(
          Number(facilityId?.Id),
          {
            name: data?.name,
            description: data?.description,
            document: document,
          },
          Id
        );
        setLoading(false);
        setIsOffCanvasOpen(false);
        setSelectedDocumentForEdit(null);
        showToast(
          "success",
          editedDocument?.data?.message || "Document updated successfully!"
        );
        await fetchFacilityDocuments();
      } catch (error: any) {
        console.error(error);
        setLoading(false);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    } else {
      if (!document) {
        return showToast("error", "No Document is selected");
      }
      try {
        setLoading(true);
        const { name, description } = data;
        const response = await addFacilityDocument(Number(facilityId?.Id), {
          name: name,
          description: description,
          document: document,
        });
        setLoading(false);
        setIsOffCanvasOpen(false);
        reset();
        setDocument(undefined);
        showToast(
          "success",
          response?.data?.message || "Document created successfully"
        );
        await fetchFacilityDocuments();
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

  useEffect(() => {
    if (selectedDocumentForEdit && selectedDocumentForEdit !== undefined) {
      const { Name, Description } = selectedDocumentForEdit;
      setValue("name", capitalize(Name));
      setValue("description", Description);
    } else {
      reset();
      setDocument(undefined);
    }
  }, [selectedDocumentForEdit]);

  return (
    <>
      <div className="d-flex mb-3 search-button">
        <div className="search-bar-wrapper w-100">
          <CustomInput
            placeholder="Search Here"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
          />
          <img src={Search} alt="search" />
        </div>
        <div className="facility-header-cus-drp dt-facility-drp" style={{ marginLeft: '10px' }}>
          <CustomSelect
            value={dataDrp[0]}
            id="select_profession"
            isSearchable={false}
            placeholder={"Select Profession"}
            onChange={() => { }}
            name=""
            noOptionsMessage={() => ""}
            options={dataDrp}
          ></CustomSelect>
        </div>
        <div className="table-navigate">
          <ACL
            submodule={"facilitydocuments"}
            module={"facilities"}
            action={["GET", "POST"]}
          >
            <CustomButton
              className="primary-btn"
              onClick={() => setIsOffCanvasOpen(true)}
            >
              Add New
            </CustomButton>
          </ACL>
        </div>
      </div>
      <Offcanvas
        show={isOffCanvasOpen}
        onHide={() => {
          reset();
          setSelectedDocumentForEdit(null);
          setIsOffCanvasOpen(false);
        }}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {selectedDocumentForEdit ? "Edit Document" : "Add Document"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {loading && <Loader />}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="12" className="col-group">
                <Label className="">
                  Document Name <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Document Name"
                  invalid={!!errors.name}
                  {...register("name")}
                />
                <FormFeedback>{errors.name?.message}</FormFeedback>
              </Col>
              <Col md="12" className="col-group">
                <Label>Description</Label>
                <CustomTextArea
                  invalid={!!errors.description}
                  {...register("description")}
                />
                <FormFeedback>{errors.description?.message}</FormFeedback>
              </Col>
              <Col md="12">
                <FormGroup>
                  <div className="file-picker-wrapper">
                    <div className="file-picker-label-wrapper">
                      <Label for="exampleFile" className="file-picker-label">
                        Upload File
                      </Label>
                    </div>
                    {uploadedDocument && (
                      <p className="file-para">
                        Your Document name is: {document?.name}
                      </p>
                    )}
                    {!uploadedDocument && selectedDocumentForEdit && (
                      <p className="file-para">
                        Your Document name is:{" "}
                        {selectedDocumentForEdit?.FileName}
                      </p>
                    )}
                    <p className="file-para">
                      Supported Formats: doc, docx, pdf up to 2 MB
                    </p>
                    <CustomInput
                      id="exampleFile"
                      value=""
                      type="file"
                      accept=".doc,.docx,.pdf"
                      style={{ display: "none" }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleDocumentChange(e)
                      }
                    />
                  </div>
                </FormGroup>
                {/* <FormFeedback>{errors.document?.message?.toString()}</FormFeedback> */}
                {/* <p>{errors.document?.message?.toString()}</p> */}
              </Col>
            </Row>
            <div className="btn-wrapper">
              <CustomButton className="primary-btn">Save</CustomButton>
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

export default AddNewDocuments;
