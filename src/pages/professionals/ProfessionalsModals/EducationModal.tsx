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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "../../../components/custom/CustomInput";
import {
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../helpers";
import { ChangeEvent, useState } from "react";
import {
  EducationModalProps,
  EducationModalType,
} from "../../../types/EducationModalTypes";
import { EducationModalSchema } from "../../../helpers/schemas/EducationModalSchema";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../assets/images/calendar.svg";
import CustomCheckbox from "../../../components/custom/CustomCheckbox";
import { createEducation } from "../../../services/ProfessionalDetails";
import { toggleFetchDetails } from "../../../store/ProfessionalDetailsSlice";
import { useDispatch } from "react-redux";

const EducationModal = ({
  isOpen,
  toggle,
  setFetchData,
}: EducationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EducationModalType>({
    resolver: yupResolver(EducationModalSchema) as any,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [attending, setAttending] = useState<boolean>(false);
  const dispatch = useDispatch();
  const params = useParams();

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleEndDateChange = (date: Date) => setEndDate(date);
  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttending(e.target.checked);
    if (e.target.checked) {
      setEndDate(null);
    }
  };

  const onSubmit = async (data: EducationModalType) => {
    if (!startDate) {
      return showToast("error", "Please select the start date");
    }

    if (!attending && endDate === null) {
      return showToast(
        "error",
        "Graduation Date is required if not currently attending"
      );
    }

    if (endDate) {
      if (endDate < startDate) {
        return showToast(
          "error",
          "Graduation date cannot be smaller than start date"
        );
      }
    }

    try {
      setLoading(true);
      const education = await createEducation(
        Number(params?.Id),
        data?.degree,
        data?.school,
        data?.location,
        startDate ? formatDate(startDate?.toString()) : "",
        endDate ? formatDate(endDate?.toString()) : "",
        attending
      );
      showToast(
        "success",
        "Education created successfully" || education.data?.message
      );
      setFetchData((prevValue: boolean): boolean => !prevValue);
      setLoading(false);
      reset();
      dispatch(toggleFetchDetails());
      setEndDate(null);
      setStartDate(null);
      setAttending(false);
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

  const handleCancel = () => {
    toggle();
    reset();
    setEndDate(null);
    setStartDate(null);
    setAttending(false);
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
        <ModalHeader toggle={toggle}>Education</ModalHeader>
        <ModalBody className="programModal">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Degree
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Degree"
                  invalid={!!errors.degree}
                  {...register("degree")}
                />
                <FormFeedback>{errors.degree?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  School
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="School"
                  invalid={!!errors.school}
                  {...register("school")}
                />
                <FormFeedback>{errors.school?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Location
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Location"
                  invalid={!!errors.location}
                  {...register("location")}
                />
                <FormFeedback>{errors.location?.message}</FormFeedback>
              </Col>
              <Col xxl="3" xl="3" lg="3" md="6" className="col-group">
                <Label className="">
                  Date Started
                  <span className="asterisk">*</span>
                </Label>
                <ReactDatePicker
                  dateFormat={"dd-MM-yyyy"}
                  isClearable={true}
                  placeholderText="--"
                  onChange={handleStartDateChange}
                  selected={startDate}
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        placeholder="Select Date"
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
              <Col xxl="3" xl="3" lg="3" md="6" className="col-group">
                <Label className="">Graduation Date</Label>
                <ReactDatePicker
                  dateFormat={"dd-MM-yyyy"}
                  isClearable={true}
                  placeholderText="--"
                  onChange={handleEndDateChange}
                  minDate={startDate ? startDate : null}
                  selected={endDate}
                  disabled={attending}
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        placeholder="Select Date"
                        disabled={attending}
                        value={
                          endDate && endDate
                            ? formatDateInDayMonthYear(endDate?.toString())
                            : ""
                        }
                      />
                      {!endDate && (
                        <img src={Calendar} className="calendar-icon" />
                      )}
                    </div>
                  }
                />
              </Col>
              <div className="d-flex mb-4">
                <CustomCheckbox
                  disabled={false}
                  checked={attending}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleCheckBoxChange(e)
                  }
                />
                <Label className="col-label">Currently Attending</Label>
              </div>
            </Row>
            <Button color="primary primary-btn ms-0">Save</Button>
            <Button color="secondary secondary-btn" onClick={handleCancel}>
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EducationModal;
