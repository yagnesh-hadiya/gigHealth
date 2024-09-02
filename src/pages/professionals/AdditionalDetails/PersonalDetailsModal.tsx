import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import {
  Col,
  FormFeedback,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import moment from "moment";
import Calendar from "../../../assets/images/calendar.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, useParams } from "react-router-dom";
import Loader from "../../../components/custom/CustomSpinner";
import {
  PersonalDetailsModalProps,
  PersonalDetailsType,
} from "../../../types/ProfessionalDocumentType";
import { PersonalDetailsSchema } from "../../../helpers/schemas/PersonalDetailsSchema";
import { showToast } from "../../../helpers";
import { editPersonalDetials } from "../../../services/AdditionalDetails";
import { fetchProfessionalHeaderDetails } from "../../../services/ProfessionalDetails";
import { useDispatch } from "react-redux";
import { setHeaderDetails } from "../../../store/ProfessionalDetailsSlice";
import CustomButton from "../../../components/custom/CustomBtn";

const PersonalDetailsModal = ({
  isOpen,
  toggle,
  setFetch,
  state,
}: PersonalDetailsModalProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [dob, setDob] = useState<Date | null>(null);
  const dispatch = useDispatch();
  const params = useParams();
  const professionalId = Number(params?.Id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PersonalDetailsType>({
    resolver: yupResolver(PersonalDetailsSchema) as any,
  });

  useEffect(() => {
    setValue("ssn", state?.gigList?.Ssn ? state?.gigList?.Ssn : "");
    setDob(state?.gigList?.Dob ? new Date(state?.gigList?.Dob) : null);
  }, [state?.gigList?.Dob, state?.gigList?.Ssn]);

  const onSubmit = async (data: PersonalDetailsType) => {
    const datas = {
      dob: dob ? moment(dob).format("YYYY-MM-DD") : null,
      ssn: data?.ssn ? data?.ssn : null,
    };
    try {
      const response = await editPersonalDetials(professionalId, datas);
      if (response.status === 200) {
        toggle();
        setFetch((prev) => !prev);
        reset(), setDob(null);

        fetchProfessionalHeaderDetails(Number(params.Id))
          .then((details) => {
            dispatch(setHeaderDetails(details.data?.data));
          })
          .catch((error) => {
            console.error(error);
          });
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
        <ModalHeader toggle={toggle} className="text-header ps-4">
          Edit Personal Details
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6">
                <div className="accented-date-picker mb-3">
                  <Label className="">Date of Birth</Label>
                  <ReactDatePicker
                    selected={dob}
                    onChange={(date) => setDob(date)}
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    className="custom-select-picker-all contract-select"
                    isClearable={true}
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            dob
                              ? moment(dob.toDateString()).format("MM-DD-YYYY")
                              : ""
                          }
                          placeholder="Date of Birth "
                        />
                        {!dob && (
                          <img src={Calendar} className="calendar-icon" />
                        )}
                      </div>
                    }
                  />
                </div>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="ssn_input">SSN</Label>
                  <CustomInput
                    type="text"
                    placeholder="SSN"
                    id="ssn_input"
                    invalid={!!errors.ssn}
                    {...register("ssn")}
                    className="text-capitalize"
                  />
                  <FormFeedback>{errors.ssn?.message}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <CustomButton type="submit" className="primary-btn">
              Save
            </CustomButton>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PersonalDetailsModal;
