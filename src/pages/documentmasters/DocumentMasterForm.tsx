import { Form } from "react-router-dom";
import { Col, FormFeedback, Label, Row } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import CustomTextArea from "../../components/custom/CustomTextarea";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  DocumentFormDataType,
  DocumentMasterFormProps,
} from "../../types/DocumentTypes";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import { DocumentFormSchema } from "../../helpers/schemas/DocumentMasterSchema";
import { capitalize, showToast } from "../../helpers";
import {
  createDocumentMaster,
  editDocumentMaster,
} from "../../services/DocumentMasterServices";
import Loader from "../../components/custom/CustomSpinner";
import RadioBtn from "../../components/custom/CustomRadioBtn";

const DocumentMasterForm = ({
  setIsOffCanvasOpen,
  isOffCanvasOpen,
  selectedDocumentForEdit,
  setSelectedDocumentForEdit,
  fetchData,
}: DocumentMasterFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [coreCompliance, setCoreCompliance] = useState<string>("false");
  const handleCoreCompliance = (value: string) => setCoreCompliance(value);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DocumentFormDataType>({
    resolver: yupResolver(DocumentFormSchema) as Resolver<DocumentFormDataType>,
  });

  useEffect(() => {
    if (selectedDocumentForEdit) {
      const { Type, Description, IsCoreCompliance } = selectedDocumentForEdit;
      const capitalizedType = Type
        ? Type.split(" ")
            .map((word) => capitalize(word))
            .join(" ")
        : "";
      setValue("name", capitalizedType);
      setValue("description", capitalize(Description));
      setCoreCompliance(IsCoreCompliance === true ? "true" : "false");
    } else {
      reset();
    }
  }, [selectedDocumentForEdit]);

  const onSubmit = async (data: DocumentFormDataType) => {
    try {
      const { name, description } = data;
      if (selectedDocumentForEdit) {
        const documentId = selectedDocumentForEdit.Id;
        setLoading(true);
        await editDocumentMaster(
          documentId,
          name,
          description,
          coreCompliance === "true" ? true : false
        );
        setLoading(false);
        fetchData();
        setIsOffCanvasOpen(false);
        setSelectedDocumentForEdit(null);
        showToast("success", "Document type updated successfully!");
      } else {
        setLoading(true);
        await createDocumentMaster(
          name,
          description,
          coreCompliance === "true" ? true : false
        );
        setLoading(false);
        fetchData();
        setIsOffCanvasOpen(false);
        reset();
        showToast("success", "Document type created successfully!");
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleCancel = () => {
    setIsOffCanvasOpen(false);
    reset();
    setSelectedDocumentForEdit(null);
  };

  return (
    <div className="offcanvas-wrapper">
      <Offcanvas
        show={isOffCanvasOpen}
        onHide={() => {
          setIsOffCanvasOpen(false);
          reset();
          setSelectedDocumentForEdit(null);
        }}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {" "}
            {selectedDocumentForEdit
              ? "Edit Document Type"
              : "Add Document Type"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {loading && <Loader />}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="12" className="col-group">
                <Label className="">
                  Document Type Name <span className="asterisk">*</span>
                </Label>

                <CustomInput
                  id="DocumentTypeName"
                  placeholder="Document Type Name"
                  invalid={!!errors.name}
                  {...register("name")}
                />
                <FormFeedback>{errors.name?.message}</FormFeedback>
              </Col>
              <Col md="12" className="col-group">
                <Label>Description</Label>
                <CustomTextArea
                  id="Description"
                  placeholder="Description"
                  invalid={!!errors.description}
                  {...register("description")}
                />
                <FormFeedback>{errors.description?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">Is Core Compliance?</Label>
                <table className="w-100">
                  <tbody className="m-4">
                    <td>
                      <span>
                        <RadioBtn
                          options={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" },
                          ]}
                          name={"coreCompliance"}
                          onChange={(value: string) =>
                            handleCoreCompliance(value)
                          }
                          selected={coreCompliance}
                        />
                      </span>
                    </td>
                  </tbody>
                </table>
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
    </div>
  );
};
export default DocumentMasterForm;
