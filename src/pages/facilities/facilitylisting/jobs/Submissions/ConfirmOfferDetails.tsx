import { Row, Col, Label, Modal, ModalHeader, ModalBody } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import {
  capitalize,
  customStyles,
  formatDate,
  formatPhoneNumber,
  showToast,
  timeOptions,
} from "../../../../../helpers";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfessionList,
  getSpecialityList,
  getShiftList,
  setProfessionList,
  setSpecialityList,
  setShiftList,
} from "../../../../../store/ProfessionalDetailsSlice";
import Calendar from "../../../../../assets/images/calendar.svg";
import {
  ProfessionList,
  ProfessionalDetails,
  ShiftList,
  SpecialityList,
} from "../../../../../types/StoreInitialTypes";
import Select from "react-select";
import {
  getJobDetails,
  getJobShifts,
  getJobSpecialities,
  getProfessions,
  getProfessionsCategories,
} from "../../../../../services/JobsServices";
import { fetchApplicantProfessionalDetails } from "../../../../../services/ApplicantsServices";
import ReactDatePicker from "react-datepicker";
import Loader from "../../../../../components/custom/CustomSpinner";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import { OfferFormType, SlotType } from "../../../../../types/ApplicantTypes";
import { JobTemplate } from "../../../../../types/JobTemplateTypes";
import { OfferFormSchema } from "../../../../../helpers/schemas/ApplicantSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { makeOffer } from "../../../../../services/SubmissionServices";
import Camera from "../../../../../assets/images/camera.svg";
import { getStatusColor } from "../../../../../constant/StatusColors";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import DropdownImage from "../../../../../assets/images/dropdown-arrow.svg";
import { ProfessionSubCategoryType } from "../../../../../types/ProfessionalTypes";
import moment from "moment";
import CustomMultiDatePicker from "../../../../../components/custom/CustomMultiDatePicker";

type ConfirmOfferDetailsProps = {
  isOpen: boolean;
  toggle: () => void;
  toggleParent: () => void;
  professionalId: number;
  facilityId: number;
  jobId: number;
  jobApplicationId: number;
  slot: SlotType;
  fetch: () => void;
  job: RightJobContentData;
  status: string;
  fetchApplicants: () => void;
};

const ConfirmOfferDetails = ({
  isOpen,
  toggle,
  professionalId,
  jobApplicationId,
  jobId,
  facilityId,
  slot,
  fetch,
  status,
  fetchApplicants,
  toggleParent,
}: ConfirmOfferDetailsProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OfferFormType>({
    resolver: yupResolver(OfferFormSchema) as any,
  });

  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const dispatch = useDispatch();
  const [currentJob, setCurrentJob] = useState<JobTemplate | null>(null);
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [approvedTimeOff, setApprovedTimeOff] = useState<Date[]>([]);
  const [complianceDueDate, setComplianceDueDate] = useState<Date | null>(null);
  const [selectedShiftStart, setSelectedShiftStart] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedShiftEndTime, setSelectedShiftEndTime] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const profession: ProfessionList[] = useSelector(getProfessionList);
  const speciality: SpecialityList[] = useSelector(getSpecialityList);
  const shifts: ShiftList[] = useSelector(getShiftList);

  const [currentSpeciality, setCurrentSpeciality] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [currentProfession, setCurrentProfession] = useState<any>(null);
  const [currentShift, setCurrentShift] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const [specialityId, setSpecialityId] = useState<number>();
  // const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

  const fetchDropDownValues = useCallback(async (): Promise<void> => {
    try {
      setLoading("loading");
      const [professions, shifts, currentProfessional, currentJob] =
        await Promise.all([
          getProfessions(),
          // getJobSpecialities(),
          getJobShifts(),
          fetchApplicantProfessionalDetails({
            jobId: jobId,
            professionalId: professionalId,
            facilityId: facilityId,
          }),
          getJobDetails(facilityId, jobId),
        ]);
      dispatch(setProfessionList(professions.data?.data));
      // dispatch(setSpecialityList(specialities.data?.data));
      dispatch(setShiftList(shifts.data?.data));
      setCurrentProfessional(currentProfessional.data.data[0]);
      setCurrentJob(currentJob.data.data[0]);
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [dispatch, facilityId, jobId, professionalId]);

  const handleDate = (data: any, e: any) => {
    if (e.isTyping) {
      setApprovedTimeOff([]);
    } else if (data.length <= 10) {
      const result = data?.map((date: any) =>
        moment(`${date.year}-${date.month.number}-${date.day}`).format(
          "MM-DD-YYYY"
        )
      );
      setApprovedTimeOff(result);
    } else {
      const updatedDates = data.slice(0, 10);
      setApprovedTimeOff(updatedDates);
      showToast("error", "Maximum 10 days can be selected");
    }
  };

  const handleShiftStartTime = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedShiftStart(selectedOption);
  };

  const handleShiftEndTime = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedShiftEndTime(selectedOption);
  };

  const handleSpecialityChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setCurrentSpeciality(selectedOption);
  };

  // const handleProfessionChange = (
  //   selectedOption: { value: number; label: string } | null
  // ) => {
  //   setCurrentProfession(selectedOption);
  // };

  const handleShiftChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setCurrentShift(selectedOption);
  };

  // const handleProfession = (categoryIndex: number) => {
  //   setSelectedCategory(categoryIndex);
  // };

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCategoryProfession(professionItem.Profession);
    setCurrentSpeciality(null);
    setCurrentProfession(professionItem);
    // dispatch({
    //   type: JobsActions.SetSelectedSpecialities,
    //   payload: null,
    // });
    setSpecialityId(professionItem.Id);
  };

  // const fetchProfession = async () => {
  //   if (selectedCategory) {
  //     const response = await getProfessionsCategories(selectedCategory);

  //     setProfessionCategory(response.data?.data);
  //   }
  // };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getJobSpecialities(specialityId);
        dispatch(setSpecialityList(specialities.data?.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfessionSubcategories = async () => {
    try {
      const professionLength = profession?.length;
      if (professionLength > 0) {
        const subCategoriesArray = [];
        for (let i = 1; i <= professionLength; i++) {
          const response = await getProfessionsCategories(i);
          subCategoriesArray.push(response.data?.data);
        }
        setSubCategories(subCategoriesArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   fetchProfession();
  //   setProfessionCategory([]);
  // }, [selectedCategory]);

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [profession?.length]);

  useEffect(() => {
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    fetchDropDownValues();
    setValue("reqId", slot.ReqId);
  }, [fetchDropDownValues, setValue, slot.ReqId]);

  const onSubmit = async (data: OfferFormType) => {
    if (!startDate) {
      showToast("error", "Please select start date");
      return;
    }

    if (!endDate) {
      showToast("error", "Please select end date");
      return;
    }

    if (!selectedShiftStart) {
      showToast("error", "Please select shift start time");
      return;
    }

    if (!selectedShiftEndTime) {
      showToast("error", "Please select shift end time");
      return;
    }

    if (selectedShiftStart && selectedShiftEndTime) {
      if (selectedShiftStart.value > selectedShiftEndTime.value) {
        showToast(
          "error",
          "Shift end time cannot be less than shift start time"
        );
        return;
      }
    }

    // if (!approvedTimeOff) {
    //   showToast("error", "Please select approved time off");
    //   return;
    // }

    if (!complianceDueDate) {
      showToast("error", "Please select compliance due date");
      return;
    }

    if (!currentProfession) {
      showToast("error", "Please select profession");
      return;
    }

    if (!currentSpeciality) {
      showToast("error", "Please select speciality");
      return;
    }

    if (!currentShift) {
      showToast("error", "Please select shift");
      return;
    }

    if (selectedShiftStart && selectedShiftEndTime) {
      if (selectedShiftEndTime.value == selectedShiftStart.value) {
        showToast("error", "Shift start and end time cannot be same");
        return;
      }
    }

    if (
      approvedTimeOff &&
      approvedTimeOff.length > 0 &&
      approvedTimeOff.some((date) => moment(date) < moment(startDate))
    ) {
      return showToast(
        "error",
        "Time off request dates cannot be before the start date"
      );
    }

    try {
      const makeOfferDeails = {
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        offerId: slot.Id,
        jobApplicationId: jobApplicationId,
        data: {
          ...data,
          startDate: formatDate(startDate?.toDateString()),
          endDate: formatDate(endDate?.toDateString()),
          shiftStartTime: selectedShiftStart?.label,
          shiftEndTime: selectedShiftEndTime?.label,
          shiftId: currentShift?.value,
          specialityId: currentSpeciality?.value,
          professionId: currentProfession?.Id,

          complianceDueDate: formatDate(complianceDueDate?.toDateString()),
          reqId: data.reqId,
        },
      };
      if (approvedTimeOff && approvedTimeOff.length > 0) {
        makeOfferDeails.data.approvedTimeOff = approvedTimeOff?.map(
          (date: any) => moment(date).format("YYYY-MM-DD")
        );
      } else {
        makeOfferDeails.data.approvedTimeOff = [];
      }

      const res = await makeOffer(makeOfferDeails);

      if (res.status === 200) {
        showToast("success", res.data.message || "Offer made successfully");
        fetch();
        fetchApplicants();
        toggle();
        toggleParent();
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal isOpen={isOpen} toggle={toggle} centered={true} size="xl">
        <ModalHeader toggle={toggle}>Confirm Offer Details</ModalHeader>
        <ModalBody
          className="viewProfile"
          style={{ height: "600px", overflow: "auto" }}
        >
          <div className="facility-header-wrap p-2 mb-3">
            <div className="">
              <div className="View-profile-section">
                <div className="d-flex">
                  {currentProfessional?.ProfileImage ? (
                    <img
                      src={currentProfessional?.ProfileImage}
                      alt="facilityPicture"
                      style={{
                        borderRadius: "50%",
                        height: "4rem",
                        width: "4rem",
                      }}
                    />
                  ) : (
                    <img
                      src={Camera}
                      alt="facilityPicture"
                      style={{
                        borderRadius: "50%",
                        height: "4rem",
                        width: "4rem",
                      }}
                    />
                  )}
                  <div className="first-section-content">
                    <h1 className="hospital-name text-nowrap">
                      {capitalize(
                        currentProfessional?.FirstName
                          ? currentProfessional?.FirstName
                          : ""
                      )}{" "}
                      {capitalize(
                        currentProfessional?.LastName
                          ? currentProfessional?.LastName
                          : ""
                      )}
                    </h1>
                    <CustomInput
                      value={`PID-${professionalId.toString()}`}
                      disabled
                      className="in-width input"
                      style={{
                        marginRight: "10px",
                      }}
                    />
                    <CustomInput
                      placeholder=""
                      value={`Job ID: ${jobId}`}
                      className="in-width input"
                      style={{
                        marginRight: "10px",
                      }}
                      disabled
                    />
                    {slot.ReqId && (
                      <CustomInput
                        placeholder=""
                        value={`Client Req ID: ${slot.ReqId.toUpperCase()}`}
                        className="in-width input"
                        style={{
                          marginRight: "10px",
                        }}
                        disabled
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span> Application Status:</span>
                  <span
                    style={{
                      color: getStatusColor(status),
                      borderColor: getStatusColor(status),
                      marginLeft: "10px",
                      border: "1px solid",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="facility-header-wrap p-3" style={{}}>
            <Form>
              <div>
                <h6>Job Shared Details</h6>
              </div>

              <Row>
                <Col xxl="4" xl="4" lg="6" className="col-group">
                  <Label className="">Facility Name</Label>
                  <CustomInput
                    value={capitalize(
                      currentJob?.Facility.Name
                        ? currentJob.Facility.Name
                        : "Facility Name"
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" className="col-group">
                  <Label className="">Facility Location</Label>
                  <CustomInput
                    value={capitalize(
                      currentJob?.Facility.State.State
                        ? currentJob.Facility.State.State
                        : "Facility Location"
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" className="col-group">
                  <Label className="">Facility Address</Label>
                  <CustomInput
                    value={capitalize(
                      currentJob?.Facility.Address
                        ? currentJob.Facility.Address
                        : "Facility Address"
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" className="col-group">
                  <Label className="">Program Manager</Label>
                  <CustomInput
                    value={capitalize(
                      currentProfessional?.ProgramManager
                        ? currentProfessional?.ProgramManager.FirstName +
                            " " +
                            currentProfessional?.ProgramManager.LastName
                        : ""
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" className="col-group">
                  <Label className="">Employment Expert</Label>
                  <CustomInput
                    value={capitalize(
                      currentProfessional?.EmploymentExpert
                        ? currentProfessional?.EmploymentExpert.FirstName +
                            " " +
                            currentProfessional?.EmploymentExpert.LastName
                        : ""
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" className="col-group">
                  <Label className="">Professional Name</Label>
                  <CustomInput
                    value={capitalize(
                      currentProfessional?.FirstName
                        ? currentProfessional?.FirstName +
                            " " +
                            currentProfessional?.LastName
                        : ""
                    )}
                    disabled
                  />
                </Col>

                <Col xxl="4" xl="4" lg="6" className="col-group">
                  <Label className="">Professional Phone Number</Label>
                  <CustomInput
                    value={
                      currentProfessional?.Phone
                        ? formatPhoneNumber(currentProfessional?.Phone)
                        : ""
                    }
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Professional Email Address</Label>
                  <CustomInput
                    value={
                      currentProfessional?.Email
                        ? currentProfessional?.Email
                        : ""
                    }
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Job Title</Label>
                  <CustomInput
                    className="text-capitalize"
                    value={currentJob?.Title ? currentJob?.Title : ""}
                    disabled
                  />
                </Col>
                <Col md="4" className="col-group">
                  <Label className="col-label">
                    Select Profession <span className="asterisk">*</span>
                  </Label>
                  <Menu
                    menuButton={
                      <CustomInput
                        style={{
                          cursor: "pointer",
                          caretColor: "transparent",
                        }}
                        type="text"
                        value={
                          categoryProfession
                            ? categoryProfession
                            : "Select Profession"
                        }
                      />
                    }
                  >
                    {profession?.map((item: any, index: number) => (
                      <SubMenu
                        key={item.Id}
                        label={item.Category}
                        className="sub-menu"
                      >
                        {subCategories &&
                          subCategories[index]?.map(
                            (profItem: { Id: number; Profession: string }) => (
                              <MenuRadioGroup
                                dir="top"
                                key={profItem.Id}
                                onClick={() =>
                                  handleProfessionCategory(profItem)
                                }
                              >
                                <MenuItem
                                  value={profItem.Profession}
                                  className="sub-menu-item"
                                >
                                  {profItem.Profession}
                                </MenuItem>
                              </MenuRadioGroup>
                            )
                          )}
                      </SubMenu>
                    ))}
                  </Menu>
                  <img
                    src={DropdownImage}
                    alt="DropdownImage"
                    className="submenu-dropdown"
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Specialty</Label>
                  <span className="asterisk">*</span>
                  <CustomSelect
                    options={speciality.map((item) => ({
                      value: item.Id,
                      label: item.Speciality,
                    }))}
                    value={currentSpeciality ? currentSpeciality : null}
                    isClearable={true}
                    isSearchable={true}
                    isDisabled={!categoryProfession}
                    noOptionsMessage={(): string => "No Specialty Found"}
                    placeholder="Select Specialty"
                    id="speciality"
                    name="speciality"
                    onChange={handleSpecialityChange}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Unit</Label>
                  <span className="asterisk">*</span>
                  <CustomInput {...register("unit")} />
                  {errors.unit && (
                    <label style={{ color: "red" }}>
                      {errors.unit.message}
                    </label>
                  )}
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Shift</Label>
                  <span className="asterisk">*</span>
                  <CustomSelect
                    options={shifts.map((item) => ({
                      value: item.Id,
                      label: item.Shift,
                    }))}
                    value={currentShift ? currentShift : null}
                    isClearable={true}
                    isSearchable={true}
                    noOptionsMessage={(): string => "No Shift Found"}
                    placeholder="Select Shift"
                    id="shift"
                    name="shift"
                    onChange={handleShiftChange}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Start Date</Label>
                  <span className="asterisk">*</span>
                  <ReactDatePicker
                    selected={startDate}
                    minDate={new Date()}
                    onChange={(date) => setStartDate(date)}
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    className="custom-select-picker-all contract-select"
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
                          placeholder="Start Date"
                        />
                        <img src={Calendar} className="calendar-icon" />
                      </div>
                    }
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">End Date</Label>
                  <span className="asterisk">*</span>
                  <ReactDatePicker
                    selected={endDate}
                    minDate={
                      startDate
                        ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                        : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                    }
                    onChange={(date) => setEndDate(date)}
                    className="custom-select-picker-all contract-select"
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            endDate
                              ? moment(endDate.toDateString()).format(
                                  "MM-DD-YYYY"
                                )
                              : ""
                          }
                          placeholder="Select Date"
                        />
                        <img src={Calendar} className="calendar-icon" />
                      </div>
                    }
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Start Time</Label>
                  <span className="asterisk">*</span>
                  <Select
                    styles={customStyles}
                    className="custom-select-picker-all contract-select"
                    placeholder="Shift Start Time"
                    options={timeOptions}
                    value={selectedShiftStart}
                    onChange={(
                      time: {
                        value: string;
                        label: string;
                      } | null
                    ) => handleShiftStartTime(time)}
                    isClearable={true}
                    isSearchable={true}
                    noOptionsMessage={(): string => "No Start Time Found"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">End Time</Label>
                  <span className="asterisk">*</span>
                  <Select
                    styles={customStyles}
                    className="custom-select-picker-all contract-select"
                    placeholder="Shift End Time"
                    options={timeOptions}
                    value={selectedShiftEndTime}
                    onChange={(
                      time: {
                        value: string;
                        label: string;
                      } | null
                    ) => handleShiftEndTime(time)}
                    isClearable={true}
                    isSearchable={true}
                    noOptionsMessage={(): string => "No Start Time Found"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Approved Time Off</Label>
                  {/* <ReactDatePicker
                    selected={approvedTimeOff}
                    minDate={new Date()}
                    onChange={(date) => setApprovedTimeOff(date)}
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    className="custom-select-picker-all contract-select"
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            approvedTimeOff
                              ? moment(approvedTimeOff.toDateString()).format(
                                  "MM-DD-YYYY"
                                )
                              : ""
                          }
                          placeholder="Approved Time Off"
                        />
                        <img src={Calendar} className="calendar-icon" />
                      </div>
                    }
                  /> */}
                  <CustomMultiDatePicker
                    value={approvedTimeOff}
                    onChangeDate={handleDate}
                    minDate={startDate}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Regular Hours</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("regularHrs")}
                    placeholder="Regular Hours"
                    type="number"
                    step="0.1"
                  />
                  {errors.regularHrs && (
                    <label style={{ color: "red" }}>
                      {errors.regularHrs.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Overtime Hours</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("overtimeHrs")}
                    placeholder="Overtime Hours"
                    type="number"
                    step="0.1"
                  />
                  {errors.overtimeHrs && (
                    <label style={{ color: "red" }}>
                      {errors.overtimeHrs.message}
                    </label>
                  )}
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Total Hours{" "}
                    <span className="california-text">(Weekly)</span>
                  </Label>
                  <CustomInput
                    {...register("totalHrsWeekly")}
                    placeholder="Total Hours (weekly)"
                    type="number"
                  />
                  {errors.totalHrsWeekly && (
                    <label style={{ color: "red" }}>
                      {errors.totalHrsWeekly.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Total Days on Assignment</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("totalDaysOnAssignment")}
                    placeholder="Total Days on Assignment"
                    type="number"
                  />
                  {errors.totalDaysOnAssignment && (
                    <label style={{ color: "red" }}>
                      {errors.totalDaysOnAssignment.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Guaranteed Hours</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("gauranteedHours")}
                    placeholder="Guaranteed Hours"
                    type="number"
                  />
                  {errors.gauranteedHours && (
                    <label style={{ color: "red" }}>
                      {errors.gauranteedHours.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Compliance Due Date</Label>
                  <span className="asterisk">*</span>
                  <ReactDatePicker
                    selected={complianceDueDate}
                    minDate={new Date()}
                    onChange={(date) => setComplianceDueDate(date)}
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    className="custom-select-picker-all contract-select"
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            complianceDueDate
                              ? formatDate(complianceDueDate.toDateString())
                              : ""
                          }
                          placeholder="Compliance Due Date"
                        />
                        <img src={Calendar} className="calendar-icon" />
                      </div>
                    }
                  />
                </Col>
                <Col xxl="8" xl="8" lg="6" md="6" className="col-group">
                  <Label className="">Notes</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("notes")}
                    placeholder="Notes"
                    type="textarea"
                  />

                  {errors.notes && (
                    <label style={{ color: "red" }}>
                      {errors.notes.message}
                    </label>
                  )}
                </Col>
              </Row>
              <div>
                <h6>Pay Details</h6>
              </div>

              <Row>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Regular Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.regularRate")}
                    placeholder="Regular Rate"
                    type="number"
                    step="0.1"
                  />
                  {errors.payDetails?.regularRate && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.regularRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Overtime Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.overTimeRate")}
                    placeholder="Overtime Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.overTimeRate && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.overTimeRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Double Time Rate{" "}
                    <span className="california-text">(California Only)</span>
                  </Label>
                  <CustomInput
                    {...register("payDetails.doubleTimeRate")}
                    placeholder="Double Time Rate"
                    type="number"
                    step="0.1"
                  />
                  {errors.payDetails?.doubleTimeRate && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.doubleTimeRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Holiday Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.holidayRate")}
                    placeholder="Holiday Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.holidayRate && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.holidayRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Charge Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.chargeRate")}
                    placeholder="Charge Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.chargeRate && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.chargeRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">On-Call Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.onCallRate")}
                    placeholder="On-Call Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.onCallRate && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.onCallRate.message}
                    </label>
                  )}
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">CallBack Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.callBackRate")}
                    placeholder="CallBack Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.callBackRate && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.callBackRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Travel Reimbursement</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.travelReimbursement")}
                    placeholder="Travel Reimbursement"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.travelReimbursement && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.travelReimbursement.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Travel Reimbursement</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("payDetails.travelReimbursement")}
                    placeholder="Travel Reimbursement"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.travelReimbursement && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.travelReimbursement.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Meals & Incidentals Stipend{" "}
                    <span className="california-text">(Daily)</span>
                  </Label>
                  <CustomInput
                    {...register("payDetails.mealsAndIncidentals")}
                    placeholder="Meals & Incidentals Stipend"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.mealsAndIncidentals && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.mealsAndIncidentals.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Housing Stipend{" "}
                    <span className="california-text">(Daily)</span>
                  </Label>
                  <CustomInput
                    {...register("payDetails.housingStipend")}
                    placeholder="Housing Stipend"
                    type="number"
                    step="0.1"
                  />

                  {errors.payDetails?.housingStipend && (
                    <label style={{ color: "red" }}>
                      {errors.payDetails?.housingStipend.message}
                    </label>
                  )}
                </Col>
              </Row>
              <div>
                <h6>Billing Details</h6>
              </div>
              <Row>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Bill Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("billingDetails.billRate")}
                    placeholder="Bill Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.billingDetails?.billRate && (
                    <label style={{ color: "red" }}>
                      {errors.billingDetails?.billRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Overtime Bill Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("billingDetails.overTimeBillRate")}
                    placeholder="Overtime Bill Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.billingDetails?.overTimeBillRate && (
                    <label style={{ color: "red" }}>
                      {errors.billingDetails?.overTimeBillRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Double Time Rate{" "}
                    <span className="california-text">(California Only)</span>
                  </Label>
                  <CustomInput
                    {...register("billingDetails.doubleTimeBillRate")}
                    placeholder="Double Time Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.billingDetails?.doubleTimeBillRate && (
                    <label style={{ color: "red" }}>
                      {errors.billingDetails?.doubleTimeBillRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Holiday Bill Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("billingDetails.holidayBillRate")}
                    placeholder="Holiday Bill Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.billingDetails?.holidayBillRate && (
                    <label style={{ color: "red" }}>
                      {errors.billingDetails?.holidayBillRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">Charge Bill Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("billingDetails.chargeBillRate")}
                    placeholder="Charge Bill Rate"
                    type="number"
                    step="0.1"
                  />
                  {errors.billingDetails?.chargeBillRate && (
                    <label style={{ color: "red" }}>
                      {errors.billingDetails?.chargeBillRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">On-Call Bill Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("billingDetails.onCallBillRate")}
                    placeholder="On-Call Bill Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.billingDetails?.onCallBillRate && (
                    <label style={{ color: "red" }}>
                      {errors.billingDetails?.onCallBillRate.message}
                    </label>
                  )}
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">CallBack Rate</Label>
                  <span className="asterisk">*</span>
                  <CustomInput
                    {...register("billingDetails.callBackBillRate")}
                    placeholder="CallBack Bill Rate"
                    type="number"
                    step="0.1"
                  />

                  {errors.billingDetails?.callBackBillRate && (
                    <label style={{ color: "red" }}>
                      {errors.billingDetails?.callBackBillRate.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Cost Center{" "}
                    <span className="california-text">(If applicable)</span>
                  </Label>
                  <CustomInput
                    {...register("costCenter")}
                    placeholder="Cost Center"
                    type="text"
                  />

                  {errors.costCenter && (
                    <label style={{ color: "red" }}>
                      {errors.costCenter.message}
                    </label>
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Client Req ID #{" "}
                    <span className="california-text">(If applicable)</span>
                  </Label>
                  <CustomInput
                    placeholder="Client Req ID"
                    type="text"
                    {...register("reqId")}
                  />
                  {errors.reqId && (
                    <label style={{ color: "red" }}>
                      {errors.reqId.message}
                    </label>
                  )}
                </Col>
              </Row>
            </Form>
            <div style={{ marginLeft: "0px" }}>
              <CustomButton
                className="primary-btn ms-0"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={loading === "loading"}
              >
                Make Offer
              </CustomButton>
              <CustomButton className="secondary-btn" onClick={toggle}>
                Cancel
              </CustomButton>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ConfirmOfferDetails;
