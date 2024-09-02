import { Button, Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomCheckbox from "../../../../components/custom/CustomCheckbox";
import { ProfessionalCreateReferenceType } from "../../../../types/ProfessionalMyProfile";
import { Form } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { professionalReferenceSchema } from "../../../../helpers/schemas/CreateReferenceSchema";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { CreateReferenceModalRadiobtn } from "../../../professionals/Reference/CreateReference";
import {
  deleteProfessionalReference,
  EditProfessionalWorkReference,
} from "../../../../services/ProfessionalMyProfile";
import { formatPhoneNumber, showToast } from "../../../../helpers";
import Loader from "../../../../components/custom/CustomSpinner";
import CustomDeleteBtn from "../../../../components/custom/CustomDeleteBtn";
const ProfessionalReferenceCard = ({
  index,
  Id,
  FacilityName,
  ReferenceName,
  Title,
  Email,
  Phone,
  CanContact,
  IsVerified,
  toggle,
  fetch,
  setFetchDetails,
}: ProfessionalCreateReferenceType) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [edit, setEdit] = useState<boolean>(false);
  const [radionBtnValue, setRadionBtnValue] =
    useState<CreateReferenceModalRadiobtn>({
      selectCanContact: false,
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalCreateReferenceType>({
    resolver: yupResolver(professionalReferenceSchema) as any,
  });

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue({ selectCanContact: e.target.checked });
  };

  const onSubmit = async (data: ProfessionalCreateReferenceType) => {
    const numberNoHyphens = data.Phone.replace(/-/g, "");
    try {
      setLoading("loading");
      const response = await EditProfessionalWorkReference({
        Id: Id,
        FacilityName: data.FacilityName,
        ReferenceName: data.ReferenceName,
        Title: data.Title,
        Email: data.Email,
        Phone: numberNoHyphens,
        CanContact: radionBtnValue.selectCanContact,
      });

      if (response.status === 200) {
        // showToast(
        //   "success",
        //   response.data?.message || "Reference edited successfully"
        // );
        if (fetch && toggle) {
          fetch();
        }
        setLoading("idle");
        setEdit((prevValue) => !prevValue);
      }
    } catch (error: any) {
      setLoading("error");
      console.error(error);
      showToast("error", error.response?.data?.message);
    }
  };

  const onDeleteHandler = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await deleteProfessionalReference(Id);

      if (response.status === 200) {
        // showToast("success", "Reference deleted successfully");
        if (fetch) {
          fetch();
          setFetchDetails && setFetchDetails((prev) => !prev);
        }
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEditHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEdit((prevValue) => !prevValue);
  };

  useEffect(() => {
    setValue("Email", Email);
    setValue("FacilityName", FacilityName);
    setValue("Phone", formatPhoneNumber(Phone));
    setValue("Title", Title);
    setValue("ReferenceName", ReferenceName);
    setRadionBtnValue({ selectCanContact: CanContact });
  }, []);

  return (
    <>
      <Form>
        {loading === "loading" && <Loader />}
        <div>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <h2 className="form-small-text scroll-title mb-0">
              Reference {index ? index : ""}
            </h2>
            {!IsVerified && (
              <>
                <Button
                  type="button"
                  className="dt-talent-btn"
                  onClick={(e) => onEditHandler(e)}
                >
                  <span className="material-symbols-outlined">Edit</span>
                </Button>
                <CustomDeleteBtn
                  onDelete={() => {
                    if (Id) {
                      onDeleteHandler(Id);
                    }
                  }}
                />
              </>
            )}
          </div>
          {/* <h2 className="form-small-text scroll-title mb-0">
            Reference {index ? index : ""}
          </h2>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={(e) => onEditHandler(e)}
          >
            <span className="material-symbols-outlined">Edit</span>
          </Button>
          <CustomDeleteBtn
            onDelete={() => {
              if (Id) {
                onDeleteHandler(Id);
              }
            }}
          /> */}
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
                  disabled={!edit}
                  invalid={!!errors.FacilityName}
                  {...register("FacilityName")}
                  style={{ textTransform: "capitalize" }}
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
                  disabled={!edit}
                  invalid={!!errors.ReferenceName}
                  {...register("ReferenceName")}
                  style={{ textTransform: "capitalize" }}
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
                  disabled={!edit}
                  invalid={!!errors.Title}
                  {...register("Title")}
                  style={{ textTransform: "capitalize" }}
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
                  disabled={!edit}
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
                  disabled={!edit}
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
                  disabled={!edit}
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
          <div
            className="d-flex align-items-center mb-4"
            style={{ gap: "12px" }}
          >
            <Button
              className="blue-gradient-btn mb-0 mobile-btn"
              disabled={!edit}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
            {/* <Button outline className="purple-outline-btn mb-0 mobile-btn">
                Skip to Next
              </Button> */}
          </div>
        </div>
      </Form>
    </>
  );
};

export default ProfessionalReferenceCard;
