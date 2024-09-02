import { Row, Col, Label, Modal, ModalHeader, ModalBody } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import CustomDatePicker from "../../../../../components/custom/CustomDatePicker";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomButton from "../../../../../components/custom/CustomBtn";
import {
  ProfessionalDetails,
  ShiftList,
} from "../../../../../types/StoreInitialTypes";
import {
  capitalize,
  formatDate,
  formatDateInDayMonthYear,
  formatPhoneNumber,
  showToast,
} from "../../../../../helpers";
import Loader from "../../../../../components/custom/CustomSpinner";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomBooleanSelect from "../../../../../components/custom/CustomBooleanSelect";
import {
  BooleanSelectOption,
  SelectOption,
} from "../../../../../types/FacilityTypes";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../../../assets/images/calendar.svg";
import CustomCheckbox from "../../../../../components/custom/CustomCheckboxBtn";
import {
  submitSubmission,
  submitSubmissionType,
} from "../../../../../services/ApplicantsServices";
import { SubmitApplicantSchema } from "../../../../../helpers/schemas/ApplicantSchema";
import { getJobShifts } from "../../../../../services/JobsServices";
import CustomMultiDatePicker from "../../../../../components/custom/CustomMultiDatePicker";
import moment from "moment";

type CoverPageDetailsTypes = {
  currentApplicantId: number;
  facilityId: number;
  jobId: number;
  professionalId: number;
  toggle: () => void;
  professionalDetails: ProfessionalDetails | null;
  job: RightJobContentData;
  fetchApplicants: () => void;
  hasValidationError: boolean;
};

type SubmitApplicantType = {
  unit: string;
  availableStartDate: string;
  shiftId: number;
  requestingTimeOff: string[];
  totalYearsOfExperience: number;
  totalYearsOfExperienceInUnit: number;
  isTravelExperience: boolean;
  isTraumaExperience: boolean;
  isTeachingHospitalExperience: boolean;
  isEMRExperience: boolean;
  notes: string;
  removeLogo: boolean;
  addSsn: boolean;
  addDob: boolean;
};

type SubmitApplicantModalType = {
  selectedShift: SelectOption | null;
  isTravelExperience: BooleanSelectOption | null;
  isTraumaExperience: BooleanSelectOption | null;
  isTeachingHospitalExperience: BooleanSelectOption | null;
  isEMRExperience: BooleanSelectOption | null;
};

type SubmitApplicantModalRadiobtn = {
  removeLogo: true | false;
  addSsn: true | false;
  addDob: true | false;
};

const ConfirmModal = ({
  onSubmit,
  isOpen,
  toggle,
}: {
  onSubmit: () => void;
  isOpen: boolean;
  toggle: () => void;
}): React.ReactElement => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle}>Confirm Offer Details</ModalHeader>
      <ModalBody>
        <label className="mb-4">
          Are you sure you wish to generate a submission profile? Please note
          that the profile will need to be emailed to the facility once
          generated.
        </label>
        <CustomButton
          className="primary-btn ms-0"
          type="submit"
          onClick={onSubmit}
        >
          Submit
        </CustomButton>

        <CustomButton className="secondary-btn" onClick={toggle}>
          Cancel
        </CustomButton>
      </ModalBody>
    </Modal>
  );
};

const CoverPageDetails = ({
  currentApplicantId,
  facilityId,
  jobId,
  professionalId,
  job,
  toggle,
  professionalDetails,
  fetchApplicants,
  hasValidationError,
}: CoverPageDetailsTypes) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SubmitApplicantModalType>({
    selectedShift: null,
    isTravelExperience: null,
    isTraumaExperience: null,
    isTeachingHospitalExperience: null,
    isEMRExperience: null,
  });
  const [dates, setDates] = useState<Date[]>([]);

  const [radionBtnValue, setRadionBtnValue] =
    useState<SubmitApplicantModalRadiobtn>({
      removeLogo: false,
      addSsn: false,
      addDob: false,
    });

  const [startDate, setStartDate] = useState<Date | null>(null);
  // const [requestingTimeOff, setRequestingTimeOff] = useState<Date | null>(null);
  const [shifts, setShifts] = useState<ShiftList[]>([]);

  useEffect(() => {
    getJobShifts().then((response) => {
      setShifts(response.data.data);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitApplicantType>({
    resolver: yupResolver(SubmitApplicantSchema) as any,
  });

  const onSubmit = async (data: SubmitApplicantType) => {
    if (startDate === null) {
      showToast("error", "Please select a start date");
      return;
    }

    // if (!dates || dates.length < 1) {
    //   showToast("error", "Please select a requesting time off");
    //   return;
    // }

    if (selectedValue.selectedShift === null) {
      showToast("error", "Please select a shift");
      return;
    }
    if (selectedValue.isTravelExperience === null) {
      showToast("error", "Please select Travel Experience");
      return;
    }
    if (selectedValue.isTraumaExperience === null) {
      showToast("error", "Please select Trauma Experience");
      return;
    }
    if (selectedValue.isTeachingHospitalExperience === null) {
      showToast("error", "Please select Teaching Hospital Experience");
      return;
    }
    if (selectedValue.isEMRExperience === null) {
      showToast("error", "Please select EMR Experience");
      return;
    }

    if (hasValidationError) {
      showToast(
        "error",
        "Please upload all required documents before submitting"
      );
      return;
    }

    if (
      dates &&
      dates.length > 0 &&
      dates.some((date) => moment(date) < moment(startDate))
    ) {
      return showToast(
        "error",
        "Time off request dates cannot be before the start date"
      );
    }

    try {
      setLoading("loading");
      const submissionData: submitSubmissionType = {
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        currentApplicantId: currentApplicantId,
        data: {
          unit: data.unit,
          availableStartDate: formatDate(startDate?.toString()),
          shiftId: selectedValue.selectedShift?.value,
          totalYearsOfExperience: data.totalYearsOfExperience,
          totalYearsOfExperienceInUnit: data.totalYearsOfExperienceInUnit,
          isTravelExperience: selectedValue.isTravelExperience?.value,
          isTraumaExperience: selectedValue.isTraumaExperience?.value,
          isTeachingHospitalExperience:
            selectedValue.isTeachingHospitalExperience?.value,
          isEMRExperience: selectedValue.isEMRExperience?.value,
          notes: data.notes,
          removeLogo: radionBtnValue.removeLogo,
          addSsn: radionBtnValue.addSsn,
          addDob: radionBtnValue.addDob,
        },
      };

      if (dates && dates.length > 0) {
        submissionData.data.requestingTimeOff = dates.map((date: any) =>
          moment(`${date?.year}-${date?.month?.number}-${date?.day}`).format(
            "YYYY-MM-DD"
          )
        );
      } else {
        submissionData.data.requestingTimeOff = [];
      }

      const res = await submitSubmission(submissionData);

      if (res.status === 200) {
        showToast(
          "success",
          res.data.message || "Job application submitted successfully."
        );
        setLoading("idle");
        toggle();
        fetchApplicants();
      }
    } catch (error: any) {
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
      console.error(error);
    }
  };

  const handleStartDateChange = (date: Date) => setStartDate(date);
  // const handleRequestingTimeOff = (date: Date) => setRequestingTimeOff(date);
  const handleShiftTime = (selectedOption: SelectOption | null) => {
    setSelectedValue((prevValue: SubmitApplicantModalType) => ({
      ...prevValue,
      selectedShift: selectedOption,
    }));
  };
  const handleRemoveLogo = (e: ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue((prevValue: SubmitApplicantModalRadiobtn) => ({
      ...prevValue,
      removeLogo: e.target.checked,
    }));
  };

  const handleAddSsn = (e: ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue((prevValue: SubmitApplicantModalRadiobtn) => ({
      ...prevValue,
      addSsn: e.target.checked,
    }));
  };

  const handleAddDob = (e: ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue((prevValue: SubmitApplicantModalRadiobtn) => ({
      ...prevValue,
      addDob: e.target.checked,
    }));
  };

  const handleDate = (data: any, e: any) => {
    if (e.isTyping) {
      setDates([]);
    } else if (data.length <= 10) {
      const result = data?.map((date: any) =>
        moment(`${date.year}-${date.month.number}-${date.day}`).format(
          "MM-DD-YYYY"
        )
      );
      setDates(result);
    } else {
      const updatedDates = dates.slice(0, 10);
      setDates(updatedDates);
      showToast("error", "Maximum 10 days can be selected");
    }
  };

  return (
    <>
      {professionalDetails === null && loading === "loading" && <Loader />}
      <div
        className="offer-wrapper mt-0 p-3 border-0"
        style={{ boxShadow: " 0px 2px 2px 0px rgba(0, 0, 0, 0.15)" }}
      >
        <Form>
          <Row>
            <h5>Candidate Information</h5>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                First Name <span className="asterisk">*</span>
              </Label>

              <CustomInput
                value={capitalize(
                  professionalDetails?.FirstName
                    ? professionalDetails?.FirstName
                    : ""
                )}
                placeholder="Candidate Information"
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Last Name <span className="asterisk">*</span>
              </Label>
              <CustomInput
                value={capitalize(
                  professionalDetails?.LastName
                    ? professionalDetails?.LastName
                    : ""
                )}
                placeholder="Last Name"
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Phone Number <span className="asterisk">*</span>
              </Label>
              <CustomInput
                disabled
                value={formatPhoneNumber(
                  professionalDetails?.Phone ? professionalDetails?.Phone : ""
                )}
                placeholder="Phone Number"
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Email Address <span className="asterisk">*</span>
              </Label>
              <CustomInput
                value={
                  professionalDetails?.Email ? professionalDetails?.Email : ""
                }
                placeholder="Email Address"
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">SSN#</Label>
              <CustomInput
                value={professionalDetails?.Ssn ? professionalDetails?.Ssn : ""}
                disabled
                placeholder="SSN#"
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Date Of Birth</Label>
              <CustomDatePicker
                value={
                  professionalDetails?.Dob
                    ? formatDate(professionalDetails?.Dob)
                    : ""
                }
                placeholder="Date Of Birth"
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Address <span className="asterisk">*</span>
              </Label>
              <CustomInput
                className="text-capitalize"
                value={
                  professionalDetails?.Address
                    ? professionalDetails?.Address
                    : ""
                }
                placeholder="Address"
                disabled
              />
            </Col>
            <Col xxl="4" xl="2" lg="6" md="6" className="col-group">
              <Label className="">
                State <span className="asterisk">*</span>
              </Label>

              <CustomInput
                value={
                  professionalDetails?.State
                    ? professionalDetails?.State.State
                    : ""
                }
                placeholder="State"
                disabled
              />
            </Col>
            <Col xxl="2" xl="2" lg="6" md="6" className="col-group">
              <Label className="">
                City <span className="asterisk">*</span>
              </Label>
              <CustomInput
                value={
                  professionalDetails?.City
                    ? professionalDetails?.City.City
                    : ""
                }
                placeholder="City"
                disabled
              />
            </Col>
            <Col xxl="2" xl="2" lg="6" md="6" className="col-group">
              <Label className="">
                Zip Code <span className="asterisk">*</span>
              </Label>
              <CustomInput
                value={
                  professionalDetails?.ZipCode
                    ? professionalDetails?.ZipCode.ZipCode
                    : ""
                }
                placeholder="Zip Code"
                disabled
              />
            </Col>

            <h6>Submission Information</h6>
            <Col xxl="8" xl="8" lg="6" md="6" className="col-group">
              <Label className="">
                Facility Submitting To <span className="asterisk">*</span>
              </Label>
              <CustomInput
                className="text-capitalize"
                value={job.Facility ? job.Facility.Name : ""}
                disabled
                placeholder="Facility Submitting To"
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Unit <span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="unit"
                {...register("unit")}
                error={errors.unit?.message}
                placeholder="Unit"
              />
              {errors.unit && (
                <label
                  className="text-danger"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    marginTop: "5px",
                    marginLeft: "5px",
                  }}
                >
                  {errors.unit?.message}
                </label>
              )}
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Available Start Date <span className="asterisk">*</span>
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
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Shift <span className="asterisk">*</span>
              </Label>
              <CustomSelect
                id="shift"
                name="shift"
                options={shifts.map((shift) => ({
                  value: shift.Id,
                  label: shift.Shift,
                }))}
                onChange={handleShiftTime}
                noOptionsMessage={() => "No Shifts Found"}
                placeholder="Shift"
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Requesting Time Off</Label>

              {/* <ReactDatePicker
                dateFormat={"dd-MM-yyyy"}
                isClearable={true}
                placeholderText="Requesting Time Off"
                minDate={
                  startDate
                    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                    : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                }
                onChange={handleRequestingTimeOff}
                selected={requestingTimeOff}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      placeholder="Select Date"
                      value={
                        requestingTimeOff && requestingTimeOff
                          ? formatDateInDayMonthYear(
                              requestingTimeOff?.toString()
                            )
                          : ""
                      }
                    />
                    {!requestingTimeOff && (
                      <img src={Calendar} className="calendar-icon" />
                    )}
                  </div>
                }
              /> */}
              <CustomMultiDatePicker
                value={dates}
                onChangeDate={handleDate}
                minDate={startDate}
              />
            </Col>

            <h6>Candidate Summary</h6>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Total Years of Experience <span className="asterisk">*</span>
              </Label>
              <CustomInput
                {...register("totalYearsOfExperience")}
                error={errors.totalYearsOfExperience?.message}
                placeholder="Total Years of Experience"
              />
              {errors.totalYearsOfExperience && (
                <label
                  className="text-danger"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    marginTop: "5px",
                    marginLeft: "5px",
                  }}
                >
                  {errors.totalYearsOfExperience?.message}
                </label>
              )}
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Years of Experience in Unit Submitting
                <span className="asterisk">*</span>
              </Label>
              <CustomInput
                {...register("totalYearsOfExperienceInUnit")}
                error={errors.totalYearsOfExperienceInUnit?.message}
                placeholder="Years of Experience in Unit Submitting"
              />
              {errors.totalYearsOfExperienceInUnit && (
                <label
                  className="text-danger"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    marginTop: "5px",
                    marginLeft: "5px",
                  }}
                >
                  {errors.totalYearsOfExperienceInUnit?.message}
                </label>
              )}
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Travel Experience <span className="asterisk">*</span>
              </Label>
              <CustomBooleanSelect
                id="travel-experience"
                name="travel-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder="Travel Experience"
                value={selectedValue.isTravelExperience}
                onChange={(option) =>
                  setSelectedValue((prevValue: SubmitApplicantModalType) => ({
                    ...prevValue,
                    isTravelExperience: option,
                  }))
                }
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Trauma Experience <span className="asterisk">*</span>
              </Label>
              <CustomBooleanSelect
                id="trauma-experience"
                name="trauma-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder="Trauma Experience"
                value={selectedValue.isTraumaExperience}
                onChange={(option) =>
                  setSelectedValue((prevValue: SubmitApplicantModalType) => ({
                    ...prevValue,
                    isTraumaExperience: option,
                  }))
                }
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Teaching Hospital Experience <span className="asterisk">*</span>
              </Label>
              <CustomBooleanSelect
                id="teaching-hospital-experience"
                name="teaching-hospital-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder="Teaching Hospital Experience"
                value={selectedValue.isTeachingHospitalExperience}
                onChange={(option) =>
                  setSelectedValue((prevValue: SubmitApplicantModalType) => ({
                    ...prevValue,
                    isTeachingHospitalExperience: option,
                  }))
                }
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                EMR Experience <span className="asterisk">*</span>
              </Label>
              <CustomBooleanSelect
                id="emr-experience"
                name="emr-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder="EMR Experience"
                value={selectedValue.isEMRExperience}
                onChange={(option) =>
                  setSelectedValue((prevValue: SubmitApplicantModalType) => ({
                    ...prevValue,
                    isEMRExperience: option,
                  }))
                }
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
          </Row>
          <div>
            <h6>Additional Notes</h6>
          </div>
          <Row>
            <Col xxl="12" xl="12" lg="12" className="col-group">
              <Label className="">Notes</Label>
              <CustomTextArea placeholder="Notes" />
            </Col>
            <Col xxl="12" xl="12" lg="12" className="col-group">
              <div className="d-flex gap-4">
                <div className="d-flex text-nowrap">
                  <CustomCheckbox
                    disabled={false}
                    checked={radionBtnValue.removeLogo}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleRemoveLogo(e)
                    }
                  />
                  Remove Logo
                </div>
                <div className="d-flex text-nowrap">
                  <CustomCheckbox
                    disabled={false}
                    checked={radionBtnValue.addSsn}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleAddSsn(e)
                    }
                  />
                  Add SSN
                </div>
                <div className="d-flex">
                  <CustomCheckbox
                    disabled={false}
                    checked={radionBtnValue.addDob}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleAddDob(e)
                    }
                  />
                  Add DOB (Once checked this fields will be visible on the
                  submission)
                </div>
              </div>
            </Col>
          </Row>
        </Form>

        <div style={{ marginLeft: "0px" }}>
          <CustomButton
            className="primary-btn ms-0"
            style={{ marginLeft: "0px" }}
            onClick={() => {
              setConfirmModalOpen(!confirmModalOpen);
            }}
          >
            Generate Submission
          </CustomButton>
          <CustomButton className="secondary-btn" onClick={toggle}>
            Cancel
          </CustomButton>
        </div>
      </div>

      {confirmModalOpen && (
        <ConfirmModal
          isOpen={confirmModalOpen}
          toggle={() => setConfirmModalOpen(!confirmModalOpen)}
          onSubmit={handleSubmit(onSubmit)}
        />
      )}
    </>
  );
};

export default CoverPageDetails;
