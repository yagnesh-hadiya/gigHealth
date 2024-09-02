import { Row, Col, Label } from "reactstrap";
import CustomInput from "../../../../../../components/custom/CustomInput";
import Calendar from "../../../../../../assets/images/calendar.svg";
import DropdownImage from "../../../../../../assets/images/dropdown-arrow.svg";
import ReactDatePicker from "react-datepicker";
import { Form } from "react-router-dom";
import Select from "react-select";
import CustomButton from "../../../../../../components/custom/CustomBtn";
import {
  ProfessionalDetails,
  ProfessionList,
  ShiftList,
  SpecialityList,
} from "../../../../../../types/StoreInitialTypes";
import { RightJobContentData } from "../../../../../../types/JobsTypes";
import {
  capitalize,
  customStyles,
  formatDate,
  formatPhoneNumber,
  showToast,
  timeOptions,
} from "../../../../../../helpers";
import Loader from "../../../../../../components/custom/CustomSpinner";
import { useCallback, useEffect, useState } from "react";
import {
  FacilityGigHistoryJobAssignment,
  FacilityGigHistoryType,
} from "../../../../../../types/FacilityGigHistoryType";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import CustomDatePicker from "../../../../../../components/custom/CustomDatePicker";
import moment from "moment";
import CustomSelect from "../../../../../../components/custom/CustomSelect";
import { SelectOption } from "../../../../../../types/FacilityTypes";
import {
  getJobShifts,
  getJobSpecialities,
  getProfessions,
  getProfessionsCategories,
} from "../../../../../../services/JobsServices";
import {
  getProfessionList,
  getShiftList,
  getSpecialityList,
  setProfessionList,
  setShiftList,
  setSpecialityList,
} from "../../../../../../store/ProfessionalDetailsSlice";
import { ProfessionSubCategoryType } from "../../../../../../types/ProfessionalTypes";
import { OfferFormType } from "../../../../../../types/ApplicantTypes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OfferFormSchema } from "../../../../../../helpers/schemas/ApplicantSchema";
import { useDispatch, useSelector } from "react-redux";
import FacilityGigHistoryServices from "../../../../../../services/FacilityGigHistoryServices";
import CustomMultiDatePicker from "../../../../../../components/custom/CustomMultiDatePicker";
import { JobRequestingTimeOffsType } from "../../../jobs/ViewAssignment";

interface JobApplicationStatus {
  Id: number;
  Status: string;
}

interface JobShift {
  Id: number;
  Shift: string;
}

interface JobSpeciality {
  Id: number;
  Speciality: string;
}

interface JobProfessionCategory {
  Id: number;
  Category: string;
}

interface JobProfession {
  Id: number;
  Profession: string;
  JobProfessionCategory: JobProfessionCategory;
}

interface JobData {
  Id: number;
  IsActive: boolean;
  Unit: string;
  JobRequestingTimeOffs?: JobRequestingTimeOffsType[];
  RegularHrs: number;
  OverTimeHrs: number;
  TotalHrs: number;
  TotalDaysOnAssignment: number;
  GauranteedHrs: number;
  ComplianceDueDate: string;
  Notes: string | null;
  RegularRate: number;
  OvertimeRate: number;
  DoubleTimeRate: number;
  HolidayRate: number;
  ChargeRate: number;
  OnCallRate: number;
  CallbackRate: number;
  TravelReimbursement: number;
  MealsAndIncidentials: number;
  HousingStipend: number;
  BillRate: number;
  OvertimeBillRate: number;
  DoubleTimeBillRate: number;
  HolidayBillRate: number;
  ChargeBillRate: number;
  OnCallBillRate: number;
  CallbackBillRate: number;
  CostCenter: string;
  StartDate: string;
  EndDate: string;
  ShiftStartTime: string;
  ShiftEndTime: string;
  IsExtension: boolean;
  HasValidExtensions: boolean;
  TerminationNotes: null | string;
  JobApplicationStatus: JobApplicationStatus;
  JobShift: JobShift;
  JobSpeciality: JobSpeciality;
  JobProfession: JobProfession;
}

type FacilityEditExtensionProps = {
  toggle: () => void;
  edit: boolean;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  fetchRosterData: () => void;
  professional: ProfessionalDetails;
  jobDetails: RightJobContentData;
  jobAssignment: JobData;
  row: FacilityGigHistoryType;
  isReadOnly?: boolean;
  currentAssignmentRow: FacilityGigHistoryJobAssignment;
};

const FacilityEditExtension = ({
  toggle,
  facilityId,
  professionalId,
  jobApplicationId,
  jobId,
  fetchRosterData,
  professional,
  jobDetails,
  jobAssignment,
  currentAssignmentRow,
  edit,
}: FacilityEditExtensionProps) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [approvedTimeOff, setApprovedTimeOff] = useState<string[]>([]);
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
  const [currentProfession, setCurrentProfession] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [currentShift, setCurrentShift] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const [specialityId, setSpecialityId] = useState<number>();
  const [categoryProfession, setCategoryProfession] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

  const fetchDropDownValues = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      if (jobAssignment?.JobProfession.Id === undefined) {
        setLoading(false);
        return;
      }
      const [professions, specialities, shifts] = await Promise.all([
        getProfessions(),
        getJobSpecialities(jobAssignment.JobProfession.Id),
        getJobShifts(),
      ]);
      dispatch(setProfessionList(professions.data?.data));
      dispatch(setSpecialityList(specialities.data?.data));
      dispatch(setShiftList(shifts.data?.data));
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [jobAssignment?.JobProfession.Id, dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OfferFormType>({
    resolver: yupResolver(OfferFormSchema) as any,
  });

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

  const handleShiftChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setCurrentShift(selectedOption);
  };

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
      const updatedDates = approvedTimeOff.slice(0, 10);
      setApprovedTimeOff(updatedDates);
      showToast("error", "Maximum 10 days can be selected");
    }
  };

  useEffect(() => {
    fetchDropDownValues();
  }, [fetchDropDownValues]);

  useEffect(() => {
    if (currentAssignmentRow.ReqId) {
      setValue("reqId", currentAssignmentRow.ReqId);
    }
    if (jobAssignment) {
      setCurrentSpeciality({
        value: jobAssignment?.JobSpeciality.Id,
        label: jobAssignment?.JobSpeciality.Speciality,
      });
      setCurrentProfession({
        value: jobAssignment?.JobProfession.Id,
        label: jobAssignment?.JobProfession.Profession,
      });
      setCategoryProfession({
        value: jobAssignment?.JobProfession.JobProfessionCategory.Id,
        label: jobAssignment?.JobProfession.JobProfessionCategory.Category,
      });
      setCurrentShift({
        value: jobAssignment?.JobShift.Id,
        label: jobAssignment?.JobShift.Shift,
      });
      setStartDate(new Date(jobAssignment?.StartDate));
      setEndDate(new Date(jobAssignment?.EndDate));
      setSelectedShiftStart({
        value: jobAssignment?.ShiftStartTime,
        label: jobAssignment?.ShiftStartTime,
      });
      setSelectedShiftEndTime({
        value: jobAssignment?.ShiftEndTime,
        label: jobAssignment?.ShiftEndTime,
      });
      if (jobAssignment?.JobRequestingTimeOffs) {
        setApprovedTimeOff(
          jobAssignment?.JobRequestingTimeOffs.map((item) =>
            moment(item.Date).format("MM-DD-YYYY")
          )
        );
      }
      setComplianceDueDate(new Date(jobAssignment?.ComplianceDueDate));
      setEndDate(new Date(jobAssignment?.EndDate));
      setValue("unit", jobAssignment?.Unit ? jobAssignment?.Unit : "");
      setValue("regularHrs", jobAssignment?.RegularHrs);
      setValue("overtimeHrs", jobAssignment?.OverTimeHrs);
      setValue("totalHrsWeekly", jobAssignment?.TotalHrs);
      setValue("totalDaysOnAssignment", jobAssignment?.TotalDaysOnAssignment);
      setValue("gauranteedHours", jobAssignment?.GauranteedHrs);
      setValue("notes", jobAssignment?.Notes);
      setValue("payDetails.regularRate", jobAssignment?.RegularRate);
      setValue("payDetails.overTimeRate", jobAssignment?.OvertimeRate);
      setValue("payDetails.doubleTimeRate", jobAssignment?.DoubleTimeRate);
      setValue("payDetails.holidayRate", jobAssignment?.HolidayRate);
      setValue("payDetails.chargeRate", jobAssignment?.ChargeRate);
      setValue("payDetails.onCallRate", jobAssignment?.OnCallRate);
      setValue("payDetails.callBackRate", jobAssignment?.CallbackRate);
      setValue(
        "payDetails.travelReimbursement",
        jobAssignment?.TravelReimbursement
      );
      setValue(
        "payDetails.travelReimbursement",
        jobAssignment?.TravelReimbursement
      );
      setValue(
        "payDetails.mealsAndIncidentals",
        jobAssignment?.MealsAndIncidentials
      );
      setValue("payDetails.housingStipend", jobAssignment?.HousingStipend);
      setValue("costCenter", jobAssignment?.CostCenter);
      setValue("billingDetails.billRate", jobAssignment?.BillRate);
      setValue(
        "billingDetails.overTimeBillRate",
        jobAssignment?.OvertimeBillRate
      );
      setValue(
        "billingDetails.doubleTimeBillRate",
        jobAssignment?.DoubleTimeBillRate
      );
      setValue(
        "billingDetails.holidayBillRate",
        jobAssignment?.HolidayBillRate
      );
      setValue("billingDetails.chargeBillRate", jobAssignment?.ChargeBillRate);
      setValue("billingDetails.onCallBillRate", jobAssignment?.OnCallBillRate);
      setValue(
        "billingDetails.callBackBillRate",
        jobAssignment?.CallbackBillRate
      );
    }
  }, [jobAssignment, currentAssignmentRow, setValue]);

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

    if (!currentSpeciality?.value) {
      showToast("error", "Please select speciality");
      return;
    }

    if (!currentProfession?.value) {
      showToast("error", "Please select profession");
      return;
    }

    if (!currentShift) {
      showToast("error", "Please select shift");
      return;
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
      const editAssignmentDetails = {
        facilityId: Number(facilityId),
        jobId: Number(jobId),
        professionalId: professionalId,
        jobAssignmentId: jobAssignment.Id,
        jobApplicationId: jobApplicationId,
        data: {
          ...data,
          startDate: formatDate(startDate?.toDateString()),
          endDate: formatDate(endDate?.toDateString()),
          shiftStartTime: selectedShiftStart?.label,
          shiftEndTime: selectedShiftEndTime?.label,
          shiftId: currentShift?.value,
          specialityId: currentSpeciality?.value,
          professionId: currentProfession?.value,
          complianceDueDate: formatDate(complianceDueDate?.toDateString()),
          reqId: data.reqId,
        },
      };

      if (approvedTimeOff.length > 0) {
        editAssignmentDetails.data.approvedTimeOff = approvedTimeOff?.map(
          (item: any) => moment(item).format("YYYY-MM-DD")
        );
      } else {
        editAssignmentDetails.data.approvedTimeOff = [];
      }

      const res = await FacilityGigHistoryServices.editAssignment(
        editAssignmentDetails
      );

      if (res.status === 200) {
        showToast("success", res.data.message || "Offer made successfully");
        fetchRosterData();
        toggle();
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.jobAssignment?.message || "Something went wrong"
      );
    }
  };

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCurrentProfession({
      value: professionItem.Id,
      label: professionItem.Profession,
    });
    setCurrentSpeciality(null);
    setSpecialityId(professionItem.Id);
  };

  const fetchProfessionSubcategories = useCallback(async () => {
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
  }, [profession]);

  const fetchSpecialities = useCallback(async () => {
    try {
      if (specialityId) {
        const specialities = await getJobSpecialities(specialityId);
        dispatch(setSpecialityList(specialities.data?.data));
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, specialityId]);

  const handleSpecialities = (selectedOption: SelectOption | null) => {
    setCurrentSpeciality(selectedOption);
  };

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [fetchProfessionSubcategories, profession.length]);

  useEffect(() => {
    fetchSpecialities();
  }, [fetchSpecialities, specialityId]);

  return (
    <>
      {loading && <Loader />}
      <div className="offer-wrapper px-4 py-3">
        <Form>
          <Form>
            <div className="d-flex align-items-center gap-2">
              <h6>Job Shared Details</h6>
            </div>

            <Row>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Professional Name</Label>
                <CustomInput
                  value={capitalize(
                    professional?.FirstName
                      ? professional?.FirstName + " " + professional?.LastName
                      : ""
                  )}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Professional Phone Number</Label>
                <CustomInput
                  value={
                    professional?.Phone
                      ? formatPhoneNumber(professional?.Phone)
                      : ""
                  }
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Professional Email Address</Label>
                <CustomInput
                  value={professional?.Email ? professional?.Email : ""}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Job Title</Label>
                <CustomInput
                  value={capitalize(jobDetails?.Title ? jobDetails?.Title : "")}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="col-label">
                  Select Profession <span className="asterisk">*</span>
                </Label>
                {edit ? (
                  <>
                    <Menu
                      menuButton={
                        <CustomInput
                          style={{
                            cursor: "pointer",
                            caretColor: "transparent",
                          }}
                          type="text"
                          value={
                            currentProfession?.label
                              ? currentProfession?.label
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
                              (profItem: {
                                Id: number;
                                Profession: string;
                              }) => (
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
                  </>
                ) : (
                  <CustomInput value={currentProfession?.label} disabled />
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">
                  Speciality
                  <span className="asterisk">*</span>
                </Label>
                {edit ? (
                  <CustomSelect
                    id={"specialities"}
                    name={"specialities"}
                    options={speciality?.map(
                      (templateSpeciality: {
                        Id: number;
                        Speciality: string;
                      }): { value: number; label: string } => ({
                        value: templateSpeciality?.Id,
                        label: templateSpeciality?.Speciality,
                      })
                    )}
                    value={currentSpeciality}
                    placeholder="Select Speciality"
                    noOptionsMessage={() => "No Speciality Found"}
                    onChange={(speciality) => handleSpecialities(speciality)}
                    isClearable={true}
                    isSearchable={true}
                    isDisabled={!categoryProfession}
                  />
                ) : (
                  <CustomInput value={currentSpeciality?.label} disabled />
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Unit</Label>
                <CustomInput
                  disabled={edit ? false : true}
                  {...register("unit")}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Shift</Label>
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
                  isDisabled={edit ? false : true}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Start Date</Label>
                {edit ? (
                  <ReactDatePicker
                    selected={startDate}
                    minDate={moment(startDate).subtract(7, "days").toDate()}
                    maxDate={moment(startDate).add(7, "days").toDate()}
                    onChange={(date) => setStartDate(date)}
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    className="custom-select-picker-all contract-select"
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            startDate
                              ? formatDate(startDate.toDateString())
                              : ""
                          }
                          placeholder="Start Date"
                        />
                        <img src={Calendar} className="calendar-icon" />
                      </div>
                    }
                  />
                ) : (
                  <CustomDatePicker
                    value={
                      jobAssignment?.StartDate ? jobAssignment?.StartDate : "-"
                    }
                    disabled
                  />
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">End Date</Label>
                {edit ? (
                  <ReactDatePicker
                    selected={endDate}
                    minDate={moment(startDate).add(1, "days").toDate()}
                    maxDate={moment(startDate).add(7, "days").toDate()}
                    onChange={(date) => setEndDate(date)}
                    className="custom-select-picker-all contract-select"
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            endDate ? formatDate(endDate.toDateString()) : ""
                          }
                          placeholder="Select Date"
                        />
                        <img src={Calendar} className="calendar-icon" />
                      </div>
                    }
                  />
                ) : (
                  <CustomDatePicker
                    value={
                      jobAssignment?.EndDate ? jobAssignment?.EndDate : "-"
                    }
                    disabled
                  />
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Start Time</Label>
                <Select
                  styles={customStyles}
                  className="custom-select-picker-all contract-select"
                  placeholder="Shift Start Time"
                  options={timeOptions}
                  value={selectedShiftStart ? selectedShiftStart : null}
                  onChange={(
                    time: {
                      value: string;
                      label: string;
                    } | null
                  ) => handleShiftStartTime(time)}
                  isClearable={true}
                  isSearchable={true}
                  noOptionsMessage={(): string => "No Start Time Found"}
                  isDisabled={edit ? false : true}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">End Time</Label>
                <Select
                  styles={customStyles}
                  className="custom-select-picker-all contract-select"
                  placeholder="Shift End Time"
                  options={timeOptions}
                  value={selectedShiftEndTime ? selectedShiftEndTime : null}
                  onChange={(
                    time: {
                      value: string;
                      label: string;
                    } | null
                  ) => handleShiftEndTime(time)}
                  isClearable={true}
                  isSearchable={true}
                  noOptionsMessage={(): string => "No Start Time Found"}
                  isDisabled={edit ? false : true}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Approved Time Off</Label>
                {edit ? (
                  // <ReactDatePicker
                  //   selected={approvedTimeOff}
                  //   onChange={(date) => setApprovedTimeOff(date)}
                  //   className="custom-select-picker-all contract-select"
                  //   customInput={
                  //     <div className="custom-calendar-wrapper">
                  //       <CustomInput
                  //         value={
                  //           approvedTimeOff
                  //             ? formatDate(approvedTimeOff.toDateString())
                  //             : ""
                  //         }
                  //         placeholder="Select Date"
                  //       />
                  //       <img src={Calendar} className="calendar-icon" />
                  //     </div>
                  //   }
                  // />
                  <CustomMultiDatePicker
                    onChangeDate={handleDate}
                    value={
                      approvedTimeOff
                        ? approvedTimeOff?.map((item: string) => item)
                        : "-"
                    }
                    minDate={startDate}
                  />
                ) : (
                  <CustomDatePicker
                    value={
                      jobAssignment?.JobRequestingTimeOffs
                        ? jobAssignment?.JobRequestingTimeOffs?.map((item) =>
                            moment(item.Date).format("MM-DD-YYYY")
                          )
                        : "-"
                    }
                    disabled
                  />
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Regular Hours</Label>
                <CustomInput
                  {...register("regularHrs")}
                  placeholder="Regular Hours"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.regularHrs && (
                  <label style={{ color: "red" }}>
                    {errors.regularHrs.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Overtime Hours</Label>
                <CustomInput
                  {...register("overtimeHrs")}
                  placeholder="Overtime Hours"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.overtimeHrs && (
                  <label style={{ color: "red" }}>
                    {errors.overtimeHrs.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Total Hours (weekly)</Label>
                <CustomInput
                  {...register("totalHrsWeekly")}
                  placeholder="Total Hours (weekly)"
                  type="number"
                  disabled={edit ? false : true}
                />
                {errors.totalHrsWeekly && (
                  <label style={{ color: "red" }}>
                    {errors.totalHrsWeekly.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Total Days on Assignment</Label>
                <CustomInput
                  {...register("totalDaysOnAssignment")}
                  placeholder="Total Days on Assignment"
                  type="number"
                  disabled={edit ? false : true}
                />
                {errors.totalDaysOnAssignment && (
                  <label style={{ color: "red" }}>
                    {errors.totalDaysOnAssignment.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Guaranteed Hours</Label>
                <CustomInput
                  {...register("gauranteedHours")}
                  placeholder="Guaranteed Hours"
                  type="number"
                  disabled={edit ? false : true}
                />
                {errors.gauranteedHours && (
                  <label style={{ color: "red" }}>
                    {errors.gauranteedHours.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Compliance Due Date</Label>
                {edit ? (
                  <ReactDatePicker
                    selected={
                      jobAssignment?.ComplianceDueDate
                        ? new Date(jobAssignment?.ComplianceDueDate)
                        : complianceDueDate
                    }
                    onChange={(date) => setComplianceDueDate(date)}
                    className="custom-select-picker-all contract-select"
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            jobAssignment?.ComplianceDueDate
                              ? formatDate(jobAssignment?.ComplianceDueDate)
                              : complianceDueDate
                              ? formatDate(complianceDueDate.toDateString())
                              : ""
                          }
                          placeholder="Select Date"
                        />
                        <img src={Calendar} className="calendar-icon" />
                      </div>
                    }
                    disabled
                  />
                ) : (
                  <CustomDatePicker
                    value={
                      jobAssignment?.ComplianceDueDate
                        ? jobAssignment?.ComplianceDueDate
                        : "-"
                    }
                    disabled
                  />
                )}
              </Col>
              <Col className="col-group">
                <Label className="">Notes</Label>
                <CustomInput
                  {...register("notes")}
                  placeholder="Notes"
                  type="textarea"
                  disabled={edit ? false : true}
                />

                {errors.notes && (
                  <label style={{ color: "red" }}>{errors.notes.message}</label>
                )}
              </Col>
            </Row>
            <div>
              <h6>Pay Details</h6>
            </div>
            <Row>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Regular Rate</Label>
                <CustomInput
                  {...register("payDetails.regularRate")}
                  placeholder="Regular Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.regularRate && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.regularRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Overtime Rate</Label>
                <CustomInput
                  {...register("payDetails.overTimeRate")}
                  placeholder="Overtime Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.overTimeRate && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.overTimeRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Double Time Rate(california only)</Label>
                <CustomInput
                  {...register("payDetails.doubleTimeRate")}
                  placeholder="Double Time Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.doubleTimeRate && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.doubleTimeRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Holiday Rate</Label>
                <CustomInput
                  {...register("payDetails.holidayRate")}
                  placeholder="Holiday Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.holidayRate && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.holidayRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Charge Rate</Label>
                <CustomInput
                  {...register("payDetails.chargeRate")}
                  placeholder="Charge Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.chargeRate && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.chargeRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">On-Call Rate</Label>
                <CustomInput
                  {...register("payDetails.onCallRate")}
                  placeholder="On-Call Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.onCallRate && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.onCallRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">CallBack Rate</Label>
                <CustomInput
                  {...register("payDetails.callBackRate")}
                  placeholder="CallBack Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.callBackRate && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.callBackRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Travel Reimbursement</Label>
                <CustomInput
                  {...register("payDetails.travelReimbursement")}
                  placeholder="Travel Reimbursement"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.travelReimbursement && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.travelReimbursement.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Meals & Incidentals Stipend(Daily)</Label>
                <CustomInput
                  {...register("payDetails.mealsAndIncidentals")}
                  placeholder="Meals & Incidentals Stipend"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.payDetails?.mealsAndIncidentals && (
                  <label style={{ color: "red" }}>
                    {errors.payDetails?.mealsAndIncidentals.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Housing Stipend(Daily)</Label>
                <CustomInput
                  {...register("payDetails.housingStipend")}
                  placeholder="Housing Stipend"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
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
                <CustomInput
                  {...register("billingDetails.billRate")}
                  placeholder="Bill Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.billingDetails?.billRate && (
                  <label style={{ color: "red" }}>
                    {errors.billingDetails?.billRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Overtime Bill Rate</Label>
                <CustomInput
                  {...register("billingDetails.overTimeBillRate")}
                  placeholder="Overtime Bill Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.billingDetails?.overTimeBillRate && (
                  <label style={{ color: "red" }}>
                    {errors.billingDetails?.overTimeBillRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">
                  Double Time Bill Rate(California only)
                </Label>
                <CustomInput
                  {...register("billingDetails.doubleTimeBillRate")}
                  placeholder="Double Time Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.billingDetails?.doubleTimeBillRate && (
                  <label style={{ color: "red" }}>
                    {errors.billingDetails?.doubleTimeBillRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Holiday Bill Rate</Label>
                <CustomInput
                  {...register("billingDetails.holidayBillRate")}
                  placeholder="Holiday Bill Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.billingDetails?.holidayBillRate && (
                  <label style={{ color: "red" }}>
                    {errors.billingDetails?.holidayBillRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Charge Bill Rate</Label>
                <CustomInput
                  {...register("billingDetails.chargeBillRate")}
                  placeholder="Charge Bill Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.billingDetails?.chargeBillRate && (
                  <label style={{ color: "red" }}>
                    {errors.billingDetails?.chargeBillRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">On-Call Bill Rate</Label>
                <CustomInput
                  {...register("billingDetails.onCallBillRate")}
                  placeholder="On-Call Bill Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.billingDetails?.onCallBillRate && (
                  <label style={{ color: "red" }}>
                    {errors.billingDetails?.onCallBillRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">CallBack Rate</Label>
                <CustomInput
                  {...register("billingDetails.callBackBillRate")}
                  placeholder="CallBack Bill Rate"
                  type="number"
                  step="0.1"
                  disabled={edit ? false : true}
                />
                {errors.billingDetails?.callBackBillRate && (
                  <label style={{ color: "red" }}>
                    {errors.billingDetails?.callBackBillRate.message}
                  </label>
                )}
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Cost Center(If applicable)</Label>
                <CustomInput
                  {...register("costCenter")}
                  placeholder="Cost Center"
                  type="text"
                  disabled={edit ? false : true}
                />
                {errors.costCenter && (
                  <label style={{ color: "red" }}>
                    {errors.costCenter.message}
                  </label>
                )}
              </Col>

              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Client Req ID #(If applicable)</Label>
                <CustomInput
                  placeholder="Client Req ID"
                  type="text"
                  {...register("reqId")}
                  disabled={edit ? false : true}
                />
              </Col>
            </Row>
            {edit && (
              <div style={{ marginLeft: "0px" }}>
                <CustomButton
                  className="primary-btn ms-0"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading === true}
                >
                  Update
                </CustomButton>
                <CustomButton className="secondary-btn" onClick={toggle}>
                  Cancel
                </CustomButton>
              </div>
            )}
          </Form>
        </Form>
      </div>
    </>
  );
};

export default FacilityEditExtension;
