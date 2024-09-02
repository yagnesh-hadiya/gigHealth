import {
  Button,
  Col,
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Loader from "../../../components/custom/CustomSpinner";
import { Form, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createReferenceSchema } from "../../../helpers/schemas/CreateReferenceSchema";
import CustomInput from "../../../components/custom/CustomInput";
import { ChangeEvent, useState } from "react";
import CustomCheckbox from "../../../components/custom/CustomCheckboxBtn";
import { formatPhoneNumber } from "../../../helpers";
import { CreateWorkReference } from "../../../services/ProfessionalServices";
import { toast } from "react-toastify";
import ACL from "../../../components/custom/ACL";
import { useDispatch } from "react-redux";
import { toggleFetchDetails } from "../../../store/ProfessionalDetailsSlice";

type CreateReferenceProps = {
  isOpen: boolean;
  toggle: () => void;
  fetch: () => void;
};

export type CreateReferenceType = {
  facilityName: string;
  referenceName: string;
  title: string;
  email: string;
  phone: string;
  canContact: boolean;
};

export type CreateReferenceModalRadiobtn = {
  selectCanContact: true | false;
};

const CreateReference = ({ isOpen, toggle, fetch }: CreateReferenceProps) => {
  const [radionBtnValue, setRadionBtnValue] =
    useState<CreateReferenceModalRadiobtn>({
      selectCanContact: false,
    });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateReferenceType>({
    resolver: yupResolver(createReferenceSchema) as any,
  });

  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const dispatch = useDispatch();
  const params = useParams();

  const onSubmit = async (data: CreateReferenceType) => {
    const numberNoHyphens = data.phone.replace(/-/g, "");
    try {
      setLoading("loading");
      const response = await CreateWorkReference({
        professionalId: Number(params?.Id),
        facilityName: data.facilityName,
        referenceName: data.referenceName,
        title: data.title,
        email: data.email,
        phone: numberNoHyphens,
        canContact: radionBtnValue.selectCanContact,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        setLoading("idle");
        fetch();
        toggle();
        dispatch(toggleFetchDetails());
      }
    } catch (error: any) {
      setLoading("error");
      toast.error(error.response.data.message);
    }
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue({ selectCanContact: e.target.checked });
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="lg"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Work Reference</ModalHeader>
        <ModalBody className="programModal">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Facility
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Facility"
                  invalid={!!errors.facilityName}
                  {...register("facilityName")}
                />
                <FormFeedback>{errors.facilityName?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Reference Name
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Reference Name"
                  invalid={!!errors.referenceName}
                  {...register("referenceName")}
                />
                <FormFeedback>{errors.referenceName?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Title
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Title"
                  invalid={!!errors.title}
                  {...register("title")}
                />
                <FormFeedback>{errors.title?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Email
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Email"
                  invalid={!!errors.email}
                  {...register("email")}
                />
                <FormFeedback>{errors.email?.message}</FormFeedback>
              </Col>
              <Row className="d-flex mb-4 align-items-center">
                <Col md="4" className="col-group">
                  <Label>
                    Phone <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="Phone"
                    placeholder="Phone Number"
                    invalid={!!errors.phone}
                    {...register("phone", {
                      onChange: (e) => {
                        const formattedNumber: string = formatPhoneNumber(
                          e.target.value
                        );
                        setValue("phone", formattedNumber);
                      },
                    })}
                  />
                  {errors.phone && (
                    <label
                      className="text-danger"
                      style={{
                        fontSize: "0.875em",
                        marginTop: "0.25rem",
                        marginLeft: "5px",
                        width: "100%",
                      }}
                    >
                      {errors.phone.message}
                    </label>
                  )}
                </Col>
                <Col>
                  <div className="d-flex align-items-center">
                    <CustomCheckbox
                      disabled={false}
                      checked={radionBtnValue.selectCanContact}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleCheckBoxChange(e)
                      }
                    />
                    <Label className="col-label">Can contact</Label>
                  </div>
                </Col>
              </Row>
            </Row>
            <ACL
              submodule={"details"}
              module={"professionals"}
              action={["GET", "POST"]}
            >
              <Button color="primary primary-btn ms-0" type="submit">
                Save
              </Button>
            </ACL>
            <Button color="secondary secondary-btn" onClick={toggle}>
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateReference;
