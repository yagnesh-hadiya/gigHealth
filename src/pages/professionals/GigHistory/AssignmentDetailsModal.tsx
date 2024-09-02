import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Form,
} from "reactstrap";
import Camera from "../../../assets/images/camera.svg";
import Calendar from "../../../assets/images/calendar.svg";
import DropdownImage from "../../../assets/images/dropdown-arrow.svg";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import {
  ProfessionalDetails,
  ProfessionList,
  ShiftList,
  SpecialityList,
} from "../../../types/StoreInitialTypes";
import { JobTemplate } from "../../../types/JobTemplateTypes";
import Loader from "../../../components/custom/CustomSpinner";
import {
  capitalize,
  customStyles,
  formatDate,
  formatPhoneNumber,
  showToast,
  timeOptions,
} from "../../../helpers";
import CustomInput from "../../../components/custom/CustomInput";
import CustomDatePicker from "../../../components/custom/CustomDatePicker";
import ProfessionalGigHistoryServices from "../../../services/ProfessionalGigHistoryServices";
import {
  getJobDetails,
  getJobShifts,
  getJobSpecialities,
  getProfessions,
  getProfessionsCategories,
} from "../../../services/JobsServices";
import CustomButton from "../../../components/custom/CustomBtn";
import ReactDatePicker from "react-datepicker";
import ReactSelect from "react-select";
import moment from "moment";
import CustomSelect from "../../../components/custom/CustomSelect";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import CustomCloseButton from "../../../components/custom/CustomCloseButton";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import { SelectOption } from "../../../types/FacilityTypes";
import {
  getProfessionList,
  getShiftList,
  getSpecialityList,
  setProfessionList,
  setShiftList,
  setSpecialityList,
} from "../../../store/ProfessionalDetailsSlice";
import { ProfessionSubCategoryType } from "../../../types/ProfessionalTypes";
import { editAssignment } from "../../../services/SubmissionServices";
import { OfferFormType } from "../../../types/ApplicantTypes";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OfferFormSchema } from "../../../helpers/schemas/ApplicantSchema";
import { fetchApplicantProfessionalDetails } from "../../../services/ApplicantsServices";
import CustomMultiDatePicker from "../../../components/custom/CustomMultiDatePicker";
import { JobRequestingTimeOffsType } from "../../facilities/facilitylisting/jobs/ViewAssignment";

type FinalizeOfferProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  clientReqId: string;
  fetchGigHistory: () => void;
};

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

const AssignmentDetailsModal = ({
  isOpen,
  toggle,
  facilityId,
  jobId,
  jobApplicationId,
  jobAssignmentId,
  clientReqId,
  fetchGigHistory,
}: FinalizeOfferProps) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobTemplate | null>(null);
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);
  const [data, setData] = useState<JobData | null>(null);
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
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

  const fetchDropDownValues = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      if (data?.JobProfession.Id === undefined) {
        setLoading(false);
        return;
      }
      const [professions, specialities, shifts] = await Promise.all([
        getProfessions(),
        getJobSpecialities(data.JobProfession.Id),
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
  }, [data?.JobProfession.Id, dispatch]);

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

  const fetch = useCallback(async () => {
    setLoading(true);
    const [currentProfessional, currentJob, data] = await Promise.all([
      fetchApplicantProfessionalDetails({
        facilityId: Number(facilityId),
        jobId: Number(jobId),
        professionalId: Number(params.Id),
      }),
      getJobDetails(Number(facilityId), Number(jobId)),
      ProfessionalGigHistoryServices.getJobAssignment({
        facilityId: Number(facilityId),
        jobId: Number(jobId),
        professionalId: Number(params.Id),
        jobApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
      }),
    ]);

    setCurrentProfessional(currentProfessional.data.data[0]);
    setCurrentJob(currentJob.data.data[0]);
    setData(data.data.data[0]);
    setLoading(false);
  }, [facilityId, jobId, params?.Id, jobApplicationId, jobAssignmentId]);

  useEffect(() => {
    fetch();
    fetchDropDownValues();
  }, [fetch, fetchDropDownValues]);

  useEffect(() => {
    if (data) {
      setCurrentSpeciality({
        value: data?.JobSpeciality.Id,
        label: data?.JobSpeciality.Speciality,
      });
      setCurrentProfession({
        value: data?.JobProfession.Id,
        label: data?.JobProfession.Profession,
      });
      setCategoryProfession({
        value: data?.JobProfession.JobProfessionCategory.Id,
        label: data?.JobProfession.JobProfessionCategory.Category,
      });
      setCurrentShift({
        value: data?.JobShift.Id,
        label: data?.JobShift.Shift,
      });
      setStartDate(new Date(data?.StartDate));
      setEndDate(new Date(data?.EndDate));
      setSelectedShiftStart({
        value: data?.ShiftStartTime,
        label: data?.ShiftStartTime,
      });
      setSelectedShiftEndTime({
        value: data?.ShiftEndTime,
        label: data?.ShiftEndTime,
      });
      if (data?.JobRequestingTimeOffs) {
        setApprovedTimeOff(
          data?.JobRequestingTimeOffs.map((item) =>
            moment(item.Date).format("MM-DD-YYYY")
          )
        );
      }
      setComplianceDueDate(new Date(data?.ComplianceDueDate));
      setEndDate(new Date(data?.EndDate));
      setValue("unit", data?.Unit ? data?.Unit : "");
      setValue("regularHrs", data?.RegularHrs);
      setValue("overtimeHrs", data?.OverTimeHrs);
      setValue("totalHrsWeekly", data?.TotalHrs);
      setValue("totalDaysOnAssignment", data?.TotalDaysOnAssignment);
      setValue("gauranteedHours", data?.GauranteedHrs);
      setValue("notes", data?.Notes);
      setValue("payDetails.regularRate", data?.RegularRate);
      setValue("payDetails.overTimeRate", data?.OvertimeRate);
      setValue("payDetails.doubleTimeRate", data?.DoubleTimeRate);
      setValue("payDetails.holidayRate", data?.HolidayRate);
      setValue("payDetails.chargeRate", data?.ChargeRate);
      setValue("payDetails.onCallRate", data?.OnCallRate);
      setValue("payDetails.callBackRate", data?.CallbackRate);
      setValue("payDetails.travelReimbursement", data?.TravelReimbursement);
      setValue("payDetails.mealsAndIncidentals", data?.MealsAndIncidentials);
      setValue("payDetails.housingStipend", data?.HousingStipend);
      setValue("costCenter", data?.CostCenter);
      setValue("billingDetails.billRate", data?.BillRate);
      setValue("billingDetails.overTimeBillRate", data?.OvertimeBillRate);
      setValue("billingDetails.doubleTimeBillRate", data?.DoubleTimeBillRate);
      setValue("billingDetails.holidayBillRate", data?.HolidayBillRate);
      setValue("billingDetails.chargeBillRate", data?.ChargeBillRate);
      setValue("billingDetails.onCallBillRate", data?.OnCallBillRate);
      setValue("billingDetails.callBackBillRate", data?.CallbackBillRate);
      setValue("reqId", clientReqId);
    }
  }, [data, setValue, clientReqId]);

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

    if (!currentSpeciality) {
      showToast("error", "Please select speciality");
      return;
    }

    if (!currentProfession) {
      showToast("error", "Please select profession");
      return;
    }

    if (!categoryProfession) {
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
        facilityId: facilityId,
        jobId: jobId,
        professionalId: Number(params.Id),
        jobAssignmentId: jobAssignmentId,
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

      const res = await editAssignment(editAssignmentDetails);

      if (res.status === 200) {
        showToast("success", res.data.message || "Offer made successfully");
        fetch();
        fetchGigHistory();
        toggle();
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const [specialityId, setSpecialityId] = useState<number>();
  const [categoryProfession, setCategoryProfession] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

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
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Assignment Details Offer</ModalHeader>
        <ModalBody
          className="viewAssignmentViewAssignment"
          style={{
            height: "800px",
            overflow: "auto",
            backgroundColor: "#f7f8f3",
          }}
        >
          <div className="facility-header-wrap p-2 mb-3">
            <div className="">
              <div className="View-profile-section">
                <div className="d-flex">
                  <img
                    src={
                      currentProfessional?.ProfileImage
                        ? currentProfessional?.ProfileImage
                        : Camera
                    }
                    style={{
                      borderRadius: "50%",
                      height: "4rem",
                      width: "4rem",
                      backgroundColor: "#f4f4f4",
                    }}
                  />
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
                      placeholder=""
                      disabled
                      value={`PID-${Number(params?.Id).toString()}`}
                      className="in-width input"
                      style={{
                        marginRight: "10px",
                      }}
                    />
                    <CustomInput
                      placeholder=""
                      disabled
                      value={`Job ID: ${jobId}`}
                      className="in-width input"
                      style={{
                        marginRight: "10px",
                      }}
                    />
                    {clientReqId && (
                      <CustomInput
                        placeholder=""
                        disabled
                        value={`Req ID: ${clientReqId.toUpperCase()}`}
                        className="in-width input"
                        style={{
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <CustomEditBtn
                      onEdit={() => setEdit(true)}
                      disabled={
                        data?.JobApplicationStatus.Status ===
                          "Declined by Professional" ||
                        data?.JobApplicationStatus.Status ===
                          "Declined by Facility" ||
                        data?.JobApplicationStatus.Status ===
                          "Declined by Gig" ||
                        data?.JobApplicationStatus.Status ===
                          "Facility Termination" ||
                        data?.JobApplicationStatus.Status ===
                          "Professional Termination" ||
                        data?.JobApplicationStatus.Status ===
                          "Gig Termination" ||
                        data?.JobApplicationStatus.Status === "Past Placement"
                          ? true
                          : false
                      }
                    />
                    {edit && (
                      <CustomCloseButton
                        onEdit={() => {
                          setEdit(false);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="facility-header-wrap p-3">
            <Form>
              <div>
                <h6>Job Shared Details</h6>
              </div>

              <Row>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Facility Name</Label>
                  <CustomInput
                    disabled
                    value={capitalize(
                      currentJob?.Facility.Name
                        ? currentJob.Facility.Name
                        : "Facility Name"
                    )}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Facility Location</Label>
                  <CustomInput
                    disabled
                    value={capitalize(
                      currentJob?.Facility.State.State
                        ? currentJob.Facility.State.State
                        : "Facility Location"
                    )}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Facility Address</Label>
                  <CustomInput
                    value={capitalize(
                      currentJob?.Facility.Address
                        ? currentJob.Facility.Address
                        : "Facility Address"
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Program Manager</Label>
                  <CustomInput
                    disabled
                    value={
                      currentProfessional?.ProgramManager
                        ? capitalize(
                            currentProfessional?.ProgramManager.FirstName +
                              " " +
                              currentProfessional?.ProgramManager.LastName
                          )
                        : "-"
                    }
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Employment Expert</Label>
                  <CustomInput
                    value={
                      currentProfessional?.EmploymentExpert
                        ? capitalize(
                            currentProfessional?.EmploymentExpert.FirstName +
                              " " +
                              currentProfessional?.EmploymentExpert.LastName
                          )
                        : "-"
                    }
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Professional Name</Label>
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
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Professional Phone Number</Label>
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
                  <Label>Professional Email Address</Label>
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
                  <Label>Job Title</Label>
                  <CustomInput
                    value={capitalize(
                      currentJob?.Title ? currentJob?.Title : ""
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="col-label">
                    Select Profession{" "}
                    {edit && <span className="asterisk">*</span>}
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
                    {edit && <span className="asterisk">*</span>}
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
                  <Label>
                    Unit{edit && <span className="asterisk">*</span>}
                  </Label>
                  <CustomInput
                    disabled={edit ? false : true}
                    {...register("unit")}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Shift{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Start Date{edit && <span className="asterisk">*</span>}
                  </Label>
                  {edit ? (
                    <ReactDatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setEndDate(null);
                      }}
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
                      value={data?.StartDate ? data?.StartDate : "-"}
                      disabled
                    />
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    End Date{edit && <span className="asterisk">*</span>}
                  </Label>
                  {edit ? (
                    <ReactDatePicker
                      selected={endDate}
                      minDate={moment(new Date()).toDate()}
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
                      value={data?.EndDate ? data?.EndDate : "-"}
                      disabled
                    />
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Start Time{edit && <span className="asterisk">*</span>}
                  </Label>
                  <ReactSelect
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
                  <Label className="">
                    End Time{edit && <span className="asterisk">*</span>}
                  </Label>
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
                      minDate={startDate}
                      onChangeDate={handleDate}
                      value={
                        approvedTimeOff
                          ? approvedTimeOff?.map((item) =>
                              moment(item).format("MM-DD-YYYY")
                            )
                          : "-"
                      }
                    />
                  ) : (
                    <CustomDatePicker
                      value={
                        data?.JobRequestingTimeOffs
                          ? data?.JobRequestingTimeOffs?.map((item) =>
                              moment(item.Date).format("MM-DD-YYYY")
                            )
                          : "-"
                      }
                      disabled
                    />
                  )}
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label className="">
                    Regular Hours{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Overtime Hours{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Total Hours{" "}
                    <span className="california-text">(Weekly)</span>
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Total Days on Assignment
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Guaranteed Hours
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label>
                    Compliance Due Date
                    {edit && <span className="asterisk">*</span>}
                  </Label>
                  {edit ? (
                    <ReactDatePicker
                      selected={complianceDueDate}
                      onChange={(date) => setComplianceDueDate(date)}
                      className="custom-select-picker-all contract-select"
                      customInput={
                        <div className="custom-calendar-wrapper">
                          <CustomInput
                            value={
                              complianceDueDate
                                ? formatDate(complianceDueDate.toDateString())
                                : ""
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
                        data?.ComplianceDueDate ? data?.ComplianceDueDate : "-"
                      }
                      disabled
                    />
                  )}
                </Col>
                <Col className="col-group">
                  <Label className="">
                    Notes{edit && <span className="asterisk">*</span>}
                  </Label>
                  <CustomInput
                    {...register("notes")}
                    placeholder="Notes"
                    type="textarea"
                    disabled={edit ? false : true}
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
                  <Label className="">
                    Regular Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Overtime Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label>
                    Double Time Rate{" "}
                    <span className="california-text">(California Only)</span>
                  </Label>
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
                  <Label className="">
                    Holiday Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Charge Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    On-Call Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    CallBack Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Travel Reimbursement
                    {edit && <span className="asterisk">*</span>}
                  </Label>
                  <CustomInput
                    {...register("payDetails.travelReimbursement")}
                    placeholder=" Travel Reimbursement"
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
                  <Label>
                    Meals & Incidentals Stipend{" "}
                    <span className="california-text">(Daily)</span>
                  </Label>
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
                  <Label className="">
                    Housing Stipend(Daily)
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Bill Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Overtime Bill Rate
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label>
                    Double Time Rate{" "}
                    <span className="california-text">(California Only)</span>
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
                  <Label className="">
                    Holiday Bill Rate
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Charge Bill Rate
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    On-Call Bill Rate
                    {edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    CallBack Rate{edit && <span className="asterisk">*</span>}
                  </Label>
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
                  <Label className="">
                    Cost Center{" "}
                    <span className="california-text">(If Applicable)</span>
                  </Label>
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
                  <Label className="">
                    Client Req ID #{" "}
                    <span className="california-text">(If Applicable)</span>
                  </Label>
                  <CustomInput
                    placeholder="Client Req ID"
                    type="text"
                    disabled={edit ? false : true}
                    {...register("reqId")}
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
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AssignmentDetailsModal;
