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
import { useEffect, useState } from "react";
import CustomInput from "../../../components/custom/CustomInput";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../assets/images/calendar.svg";
import {
  capitalize,
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CertificationModalSchema } from "../../../helpers/schemas/CertificationModalSchema";
import {
  CertificationEditModalProps,
  CertificationModalType,
} from "../../../types/CertificationModalTypes";
import { editCertification } from "../../../services/ProfessionalDetails";

const CertificationEditModal = ({
  isOpen,
  toggle,
  editData,
  setFetchData,
  readOnly,
}: CertificationEditModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CertificationModalType>({
    resolver: yupResolver(CertificationModalSchema) as any,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const params = useParams();

  const handleStartDateChange = (date: Date) => setStartDate(date);

  useEffect(() => {
    if (editData) {
      setValue("name", capitalize(editData?.Name));
      setStartDate(new Date(editData?.Expiry));
    }
  }, []);

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
      const response = await editCertification(
        Number(params?.Id),
        editData?.Id,
        data?.name,
        startDate && startDate ? formatDate(startDate?.toString()) : ""
      );
      showToast(
        "success",
        "Certification edited successfully" || response.data?.message
      );
      setLoading(false);
      setFetchData((prevState) => !prevState);
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
                  disabled={readOnly}
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
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  selected={startDate}
                  disabled={readOnly}
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
            <Button color="primary primary-btn ms-0" disabled={readOnly}>
              Save
            </Button>
            <Button color="secondary secondary-btn" onClick={handleCancel}>
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CertificationEditModal;
