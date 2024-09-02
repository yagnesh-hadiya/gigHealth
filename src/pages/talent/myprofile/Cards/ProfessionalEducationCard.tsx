import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Button, Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import moment from "moment";
import CustomCheckbox from "../../../../components/custom/CustomCheckbox";
import { ProfessionalEducationList } from "../../../../types/ProfessionalMyProfile";
import Loader from "../../../../components/custom/CustomSpinner";
import { EducationModalType } from "../../../../types/EducationModalTypes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EducationModalSchema } from "../../../../helpers/schemas/EducationModalSchema";
import { showToast } from "../../../../helpers";
import { Form } from "react-router-dom";
import Calendar from "../../../../assets/images/calendar.svg";
import {
  deleteProfessionalEducation,
  editProfessionalEducation,
} from "../../../../services/ProfessionalMyProfile";
import CustomDeleteBtn from "../../../../components/custom/CustomDeleteBtn";

const ProfessionalEducationCard = ({
  IsCurrentlyAttending,
  DateStarted,
  Degree,
  School,
  Location,
  GraduationDate,
  Id,
  index,
  fetch,
  setFetchDetails,
}: ProfessionalEducationList) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EducationModalType>({
    resolver: yupResolver(EducationModalSchema) as any,
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [attending, setAttending] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    setValue("degree", Degree);
    setValue("location", Location);
    setValue("school", School);
    setStartDate(new Date(DateStarted));
    setEndDate(GraduationDate ? new Date(GraduationDate) : null);
    setAttending(IsCurrentlyAttending);
  }, []);

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleEndDateChange = (date: Date) => setEndDate(date);

  const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        "End Date is required if not currently attending"
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
      setLoading("loading");
      await editProfessionalEducation(
        Id,
        data?.degree,
        data?.school,
        data?.location,
        startDate ? moment(startDate?.toString()).format("YYYY-MM-DD") : "",
        endDate ? moment(endDate?.toString()).format("YYYY-MM-DD") : "",
        attending
      );
      // showToast(
      //   "success",
      //   "Education edited successfully" || education.data?.message
      // );
      if (fetch) {
        fetch();
        setEdit((prevEdit) => !prevEdit);
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onDeleteHandler = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await deleteProfessionalEducation(Id);
      if (response.status === 200) {
        // showToast("success", "Education deleted successfully");
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

  return (
    <>
      {loading === "loading" && <Loader />}
      <Form>
        <div>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <h2 className="form-small-text scroll-title mb-0">
              Edcuation {index ? index : ""}
            </h2>
            <Button
              type="button"
              className="dt-talent-btn"
              onClick={(e) => onEditHandler(e)}
            >
              <span className="material-symbols-outlined">Edit</span>
            </Button>
            <CustomDeleteBtn onDelete={() => onDeleteHandler(Id)} />
          </div>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label for="deg_text">
                  Degree <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  type="text"
                  placeholder="Degree"
                  id="deg_text"
                  invalid={!!errors.degree}
                  {...register("degree")}
                  disabled={!edit}
                  style={{ textTransform: "capitalize" }}
                />
                <FormFeedback>{errors.degree?.message}</FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="school_text">
                  School <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  type="text"
                  placeholder="School"
                  id="school_text"
                  invalid={!!errors.school}
                  {...register("school")}
                  disabled={!edit}
                  style={{ textTransform: "capitalize" }}
                />
                <FormFeedback>{errors.school?.message}</FormFeedback>
              </FormGroup>
            </Col>
            <Col lg="6" sm="12">
              <FormGroup>
                <Label for="location_text">
                  Location <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  type="text"
                  placeholder="Location"
                  id="location_text"
                  invalid={!!errors.location}
                  {...register("location")}
                  disabled={!edit}
                  style={{ textTransform: "capitalize" }}
                />
                <FormFeedback>{errors.location?.message}</FormFeedback>
              </FormGroup>
            </Col>
            <Col lg="3" sm="6">
              <div className="accented-date-picker mb-3">
                <Label className="">
                  Date Started <span className="asterisk">*</span>
                </Label>
                <ReactDatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  timeIntervals={15}
                  isClearable={true}
                  dateFormat="h:mm aa"
                  className="custom-select-picker-all contract-select"
                  disabled={!edit}
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        value={
                          startDate
                            ? moment(startDate.toDateString()).format(
                                "MM-DD-YYYY"
                              )
                            : ""
                        }
                        placeholder="Date Started"
                        disabled={!edit}
                      />
                      {!startDate && (
                        <img src={Calendar} className="calendar-icon" />
                      )}
                    </div>
                  }
                />
              </div>
            </Col>
            <Col lg="3" sm="6">
              <div className="accented-date-picker mb-3">
                <Label className="">Graduation Date</Label>
                <ReactDatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  timeIntervals={15}
                  disabled={attending || !edit}
                  dateFormat="h:mm aa"
                  isClearable={true}
                  className="custom-select-picker-all contract-select"
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        value={
                          attending
                            ? ""
                            : endDate
                            ? moment(endDate.toDateString()).format(
                                "MM-DD-YYYY"
                              )
                            : ""
                        }
                        placeholder="Graduation Date"
                        disabled={attending || !edit}
                      />
                      {!endDate && (
                        <img src={Calendar} className="calendar-icon" />
                      )}
                    </div>
                  }
                />
              </div>
            </Col>
            <Col sm={12}>
              <div className="d-flex mb-3 talent-check  ">
                <CustomCheckbox
                  disabled={!edit}
                  id="currently_attending"
                  checked={attending}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleCheckBoxChange(e)
                  }
                />
                <Label
                  for="currently_attending"
                  className="col-label register-check-lbl"
                >
                  Currently Attending
                </Label>
              </div>
            </Col>
            <Col sm={12}>
              {/* <div className="mb-3">
                <Button outline className="purple-outline-btn mb-0 sm-height">
                  Add More
                </Button>
              </div> */}
            </Col>
          </Row>
          <div
            className="d-flex align-items-center mb-2"
            style={{ gap: "12px" }}
          >
            <Button
              className="blue-gradient-btn mb-0 mobile-btn"
              disabled={!edit}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ProfessionalEducationCard;
