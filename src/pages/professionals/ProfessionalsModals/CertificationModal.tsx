import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  FormFeedback,
} from "reactstrap";
import Loader from "../../../components/custom/CustomSpinner";
import { Form, useParams } from "react-router-dom";
import { useState } from "react";
import CustomInput from "../../../components/custom/CustomInput";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../assets/images/calendar.svg";
import {
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CertificationModalSchema } from "../../../helpers/schemas/CertificationModalSchema";
import {
  CertificationModalProps,
  CertificationModalType,
} from "../../../types/CertificationModalTypes";
import { createCertification } from "../../../services/ProfessionalDetails";
import { useDispatch } from "react-redux";
import { toggleFetchDetails } from "../../../store/ProfessionalDetailsSlice";

const CertificationModal = ({
  isOpen,
  toggle,
  setFetchData,
}: CertificationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CertificationModalType>({
    resolver: yupResolver(CertificationModalSchema) as any,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const dispatch = useDispatch();
  const params = useParams();

  const handleStartDateChange = (date: Date) => setStartDate(date);

  const handleCancel = () => {
    toggle();
    reset();
    setStartDate(null);
  };

  const onSubmit = async (data: CertificationModalType) => {
    try {
      if (!startDate) {
        return showToast("error", "Select expiration date");
      }

      setLoading(true);
      const response = await createCertification(
        Number(params?.Id),
        data?.name,
        startDate && startDate ? formatDate(startDate?.toString()) : ""
      );
      showToast(
        "success",
        "License created successfully" || response.data?.message
      );
      setLoading(false);
      reset();
      setStartDate(null);
      setFetchData((prevState) => !prevState);
      dispatch(toggleFetchDetails());
      toggle();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  return (
    <>
      {loading && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="lg"
        onClosed={handleCancel}
      >
        <ModalHeader toggle={toggle}>Certifications</ModalHeader>
        <ModalBody className="programModal">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xxl="6" xl="6" lg="6" className="col-group">
                <Label className="">
                  Certification Name
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Certification Name"
                  invalid={!!errors.name}
                  {...register("name")}
                />
                <FormFeedback>{errors.name?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" className="col-group">
                <Label className="">
                  Expiration Date
                  <span className="asterisk">*</span>
                </Label>
                <ReactDatePicker
                  dateFormat={"dd-MM-yyyy"}
                  isClearable={true}
                  placeholderText="--"
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  selected={startDate}
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        placeholder="Expiration Date"
                        value={
                          startDate && startDate
                            ? formatDateInDayMonthYear(startDate?.toString())
                            : ""
                        }
                      />
                      {!startDate && (
                        <img src={Calendar} className="calendar-icon" />
                      )}
                    </div>
                  }
                />
              </Col>
            </Row>
            <Button color="primary primary-btn ms-0">Save</Button>
            <Button color="secondary secondary-btn" onClick={toggle}>
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CertificationModal;
