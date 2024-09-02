import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomCheckbox from "../../../../components/custom/CustomCheckbox";
import { ProfessionalCreateReferenceProps } from "../../../../types/WorkHistoryModalTypes";
import Loader from "../../../../components/custom/CustomSpinner";
import { ChangeEvent, useState } from "react";
import { Form } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { professionalReferenceSchema } from "../../../../helpers/schemas/CreateReferenceSchema";
import { ProfessionalCreateReferenceType } from "../../../../types/ProfessionalMyProfile";
import { formatPhoneNumber, showToast } from "../../../../helpers";
import { CreateReferenceModalRadiobtn } from "../../../professionals/Reference/CreateReference";
import { CreateProfessionalWorkReference } from "../../../../services/ProfessionalMyProfile";

const ProfessionalCreateReference = ({
  isOpen,
  toggle,
  fetch,
  setFetchDetails,
}: ProfessionalCreateReferenceProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalCreateReferenceType>({
    resolver: yupResolver(professionalReferenceSchema) as any,
  });

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [radionBtnValue, setRadionBtnValue] =
    useState<CreateReferenceModalRadiobtn>({
      selectCanContact: false,
    });

  const onSubmit = async (data: ProfessionalCreateReferenceType) => {
    const numberNoHyphens = data.Phone.replace(/-/g, "");
    try {
      setLoading("loading");
      const response = await CreateProfessionalWorkReference({
        FacilityName: data.FacilityName,
        ReferenceName: data.ReferenceName,
        Title: data.Title,
        Email: data.Email,
        Phone: numberNoHyphens,
        CanContact: radionBtnValue.selectCanContact,
      });

      if (response.status === 201) {
        // showToast(
        //   "success",
        //   response.data?.message || "Reference created successfully"
        // );
        setLoading("idle");
        fetch();
        toggle();
        setFetchDetails && setFetchDetails((prev) => !prev);
      }
    } catch (error: any) {
      setLoading("error");
      console.error(error);
      showToast("error", error.response?.data?.message);
    }
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue({ selectCanContact: e.target.checked });
  };

  return (
    <>
      {loading && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle} className="text-header ps-4">
          Add Reference
        </ModalHeader>
        <ModalBody style={{ padding: "20px 30px", height: "auto" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <Label for="facility_name">
                      Facility Name <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Facility Name"
                      id="facility_name"
                      invalid={!!errors.FacilityName}
                      {...register("FacilityName")}
                    />
                    <FormFeedback>{errors.FacilityName?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="reference_name">
                      Reference Name <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Reference Name"
                      id="reference_name"
                      invalid={!!errors.ReferenceName}
                      {...register("ReferenceName")}
                    />
                    <FormFeedback>{errors.ReferenceName?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="title_input">
                      Title <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Title"
                      id="title_input"
                      invalid={!!errors.Title}
                      {...register("Title")}
                    />
                    <FormFeedback>{errors.Title?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="email_address">
                      Email Address <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="email"
                      placeholder="Email Address"
                      id="email_address"
                      invalid={!!errors.Email}
                      {...register("Email")}
                    />
                    <FormFeedback>{errors.Email?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="PhoneNumber">
                      Phone <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Phone"
                      id="PhoneNumber"
                      invalid={!!errors.Phone}
                      {...register("Phone", {
                        onChange: (e) => {
                          const formattedNumber: string = formatPhoneNumber(
                            e.target.value
                          );
                          setValue("Phone", formattedNumber);
                        },
                      })}
                    />
                    <FormFeedback>{errors.Phone?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <div className="d-flex mb-3 talent-check center-col-checkbox">
                    <CustomCheckbox
                      disabled={false}
                      id="can_connect"
                      checked={radionBtnValue.selectCanContact}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleCheckBoxChange(e)
                      }
                    />
                    <Label
                      for="can_connect"
                      className="col-label register-check-lbl"
                    >
                      Can Contact
                    </Label>
                  </div>
                </Col>
              </Row>
              {/* <p className="scroll-title mb-3" style={{ fontSize: "16px" }}>
              Reference 2
            </p>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="facility_name2">
                    Facility Name <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    type="text"
                    placeholder="Facility Name"
                    id="facility_name2"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="reference_name2">
                    Reference Name <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    type="text"
                    placeholder="Reference Name"
                    id="reference_name2"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="title_input3">
                    Title <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    type="text"
                    placeholder="Title"
                    id="title_input3"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="email_address2">
                    Email Address <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    type="email"
                    placeholder="Email Address"
                    id="email_address2"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="phone_input2">
                    Phone <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    type="text"
                    placeholder="Phone"
                    id="phone_input2"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <div className="d-flex mb-3 talent-check center-col-checkbox">
                  <CustomCheckbox disabled={false} id="can_connect2" />
                  <Label
                    for="can_connect2"
                    className="col-label register-check-lbl"
                  >
                    Can Contact
                  </Label>
                </div>
              </Col>
              <Col sm={12}>
                <div className="mb-3">
                  <Button outline className="purple-outline-btn mb-0 sm-height">
                    Add More References
                  </Button>
                </div>
              </Col>
            </Row> */}
              <div
                className="d-flex align-items-center mb-2"
                style={{ gap: "12px" }}
              >
                <Button className="blue-gradient-btn mb-0 mobile-btn">
                  Save
                </Button>
                {/* <Button outline className="purple-outline-btn mb-0 mobile-btn">
                Skip to Next
              </Button> */}
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProfessionalCreateReference;
