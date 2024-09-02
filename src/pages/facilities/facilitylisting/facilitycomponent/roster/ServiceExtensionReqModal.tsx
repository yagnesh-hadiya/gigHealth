import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Col,
  Row,
  FormFeedback,
} from "reactstrap";
import ServiceExtensionReqHeader from "./ServiceExtensionReqHeader";
import RosterServices, {
  OfferExtensionData,
} from "../../../../../services/RosterServices";
import { useCallback, useEffect, useState } from "react";
import {
  capitalize,
  formatDate,
  // formatDateInDayMonthYear,
  showToast,
} from "../../../../../helpers";
import Loader from "../../../../../components/custom/CustomSpinner";
import {
  ProfessionalDetails,
  ShiftList,
} from "../../../../../types/StoreInitialTypes";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomInput from "../../../../../components/custom/CustomInput";
import ReactDatePicker from "react-datepicker";
import { Form } from "react-router-dom";
import Calendar from "../../../../../assets/images/calendar.svg";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { getJobShifts } from "../../../../../services/JobsServices";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import { ServiceExtensionSchema } from "../../../../../helpers/schemas/ServiceExtensionSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import RosterEmailModal from "./RosterEmailModal";
import CustomMultiDatePicker from "../../../../../components/custom/CustomMultiDatePicker";
import moment from "moment";
import { JobRequestingTimeOffsType } from "../../jobs/ViewAssignment";

type profileModalProps = {
  isOpen: boolean;
  toggle: () => void;
  isEmail: boolean;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  currentStatus: string;
  toggleParent: () => void;
  fetchRoster: () => void;
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

export interface JobAssignmentType {
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

const ServiceExtensionReqModal = ({
  isOpen,
  toggle,
  jobId,
  jobApplicationId,
  jobAssignmentId,
  professionalId,
  facilityId,
  currentStatus,
  isEmail,
  toggleParent,
  fetchRoster,
}: profileModalProps) => {
  const [emailModal, setEmailModal] = useState(false);
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [jobAssignment, setJobAssignment] = useState<JobAssignmentType | null>(
    null
  );
  const [professional, setProfessional] = useState<ProfessionalDetails | null>(
    null
  );
  const [jobDetails, setJobDetails] = useState<RightJobContentData | null>(
    null
  );
  const [shifts, setShifts] = useState<ShiftList[]>([]);
  const [selectedShift, setSelectedShift] = useState<{
    label: string;
    value: number;
  } | null>(null);

  const [extensionStartDate, setExtensionStartDate] = useState<Date | null>(
    null
  );
  const [extensionEndDate, setExtensionEndDate] = useState<Date | null>(null);
  const [timeOffRequest, setTimeOffRequest] = useState<Date[] | string[]>([]);
  const [complianceDueDate, setComplianceDueDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<OfferExtensionData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OfferExtensionData>({
    resolver: yupResolver(ServiceExtensionSchema) as any,
  });

  const handleDate = (data: any, e: any) => {
    if (e.isTyping) {
      setTimeOffRequest([]);
    } else if (data?.length <= 10) {
      const result = data?.map((date: any) =>
        moment(`${date?.year}-${date?.month?.number}-${date?.day}`).format(
          "MM-DD-YYYY"
        )
      );
      setTimeOffRequest(result);
    } else {
      const updatedDates = data.slice(0, 10);
      setTimeOffRequest(updatedDates);
      showToast("error", "Maximum 10 days can be selected");
    }
  };

  const fetch = useCallback(async () => {
    setLoading("loading");

    const fetchData = async (
      apiFunction: () => Promise<any>,
      setter: (data: any) => void,
      useFirstItem: boolean = false
    ) => {
      try {
        const result = await apiFunction();
        setter(useFirstItem ? result.data.data[0] : result.data.data);
      } catch (error: any) {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        showToast("Error fetching data", errorMessage);
        console.error("Error fetching data:", error);
      }
    };

    const apiCalls = [
      () => getJobShifts(),
      () => RosterServices.getJobDetails({ facilityId, jobId }),
      () =>
        RosterServices.fetchProfessionalDetails({
          facilityId,
          professionalId,
          jobId,
        }),
      () =>
        RosterServices.fetchJobAssignment({
          facilityId,
          jobId,
          professionalId,
          jobApplicationId,
          jobAssignmentId,
        }),
    ];

    const setters = [
      setShifts,
      setJobDetails,
      setProfessional,
      setJobAssignment,
    ];
    const useFirstItemFlags = [false, true, true, true];

    (async () => {
      await Promise.allSettled(
        apiCalls.map((apiFunction, index) =>
          fetchData(apiFunction, setters[index], useFirstItemFlags[index])
        )
      );
      setLoading("idle");
    })().catch((error) => {
      showToast("error", "Error fetching data");
      console.error("Error fetching data:", error);
      setLoading("error");
    });
  }, [facilityId, jobId, jobApplicationId, jobAssignmentId, professionalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const submit = async (datas: OfferExtensionData) => {
    if (!selectedShift) {
      showToast("error", "Please select a shift");
      return;
    }

    if (!extensionStartDate || !extensionEndDate) {
      showToast("error", "Please select extension start and end dates");
      return;
    }

    // if (!approvedTimeOff) {
    //   showToast("error", "Please select approved time off");
    //   return;
    // }

    if (!complianceDueDate) {
      showToast("error", "Please select compliance due date");
      return;
    }

    if (extensionStartDate > extensionEndDate) {
      showToast("error", "Extension start date cannot be after end date");
      return;
    }

    if (!jobAssignment?.ShiftStartTime && !jobAssignment?.ShiftEndTime) {
      showToast("error", "Shift start and end times are required");
      return;
    }

    if (!professional?.JobSpeciality?.Id || !professional?.JobProfession?.Id) {
      showToast("error", "Professional speciality and profession are required");
      return;
    }

    const checkValidationErrors = Object.keys(errors).filter(
      (key) => errors[key as keyof OfferExtensionData]
    );

    if (checkValidationErrors.length > 0) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    setLoading("loading");

    try {
      const data: OfferExtensionData = {
        startDate: formatDate(extensionStartDate.toString()),
        endDate: formatDate(extensionEndDate.toString()),
        shiftStartTime: jobAssignment?.ShiftStartTime,
        shiftEndTime: jobAssignment?.ShiftEndTime,
        specialityId: professional?.JobSpeciality.Id,
        professionId: professional?.JobProfession.Id,
        unit: jobAssignment?.Unit,
        shiftId: selectedShift?.value,
        regularHrs: datas.regularHrs,
        overtimeHrs: datas.overtimeHrs,
        totalHrsWeekly: datas.totalHrsWeekly,
        totalDaysOnAssignment: datas.totalDaysOnAssignment,
        gauranteedHours: datas.gauranteedHours,
        complianceDueDate: formatDate(complianceDueDate.toString()),
        notes: datas.notes,
        costCenter: datas.costCenter,
        reqId: datas.reqId,
        payDetails: {
          regularRate: datas.payDetails.regularRate,
          overTimeRate: datas.payDetails.overTimeRate,
          doubleTimeRate: datas.payDetails.doubleTimeRate,
          holidayRate: datas.payDetails.holidayRate,
          chargeRate: datas.payDetails.chargeRate,
          onCallRate: datas.payDetails.onCallRate,
          callBackRate: datas.payDetails.callBackRate,
          travelReimbursement: datas.payDetails.travelReimbursement,
          mealsAndIncidentals: datas.payDetails.mealsAndIncidentals,
          housingStipend: datas.payDetails.housingStipend,
        },
        billingDetails: {
          billRate: datas.billingDetails.billRate,
          overTimeBillRate: datas.billingDetails.overTimeBillRate,
          doubleTimeBillRate: datas.billingDetails.doubleTimeBillRate,
          holidayBillRate: datas.billingDetails.holidayBillRate,
          chargeBillRate: datas.billingDetails.chargeBillRate,
          onCallBillRate: datas.billingDetails.onCallBillRate,
          callBackBillRate: datas.billingDetails.callBackBillRate,
        },
      };

      if (timeOffRequest.length > 0) {
        data.approvedTimeOff = timeOffRequest?.map((item) =>
          moment(item).format("YYYY-MM-DD")
        );
      } else {
        data.approvedTimeOff = [];
      }
      const result = await RosterServices.offerExtension({
        facilityId,
        jobId,
        professionalId,
        jobApplicationId,
        jobAssignmentId,
        data,
      });
      if (result.status === 200) {
        showToast(
          "success",
          result.data.message ||
            "Assignment extension request sent successfully"
        );
        setLoading("idle");
        fetchRoster();
        toggle();
        toggleParent();
      }
    } catch (error: any) {
      const errorMessage = error.response
        ? error.response.data.message
        : error.message;
      showToast("error", errorMessage);
      console.error("Error sending service extension request:", error);
      setLoading("idle");
    }
  };

  const openEmail = async (datas: OfferExtensionData) => {
    if (!selectedShift) {
      showToast("error", "Please select a shift");
      return;
    }

    if (!extensionStartDate || !extensionEndDate) {
      showToast("error", "Please select extension start and end dates");
      return;
    }

    // if (!approvedTimeOff) {
    //   showToast("error", "Please select approved time off");
    //   return;
    // }

    if (!complianceDueDate) {
      showToast("error", "Please select compliance due date");
      return;
    }

    if (extensionStartDate > extensionEndDate) {
      showToast("error", "Extension start date cannot be after end date");
      return;
    }

    if (!jobAssignment?.ShiftStartTime && !jobAssignment?.ShiftEndTime) {
      showToast("error", "Shift start and end times are required");
      return;
    }

    if (!professional?.JobSpeciality?.Id || !professional?.JobProfession?.Id) {
      showToast("error", "Professional speciality and profession are required");
      return;
    }

    const checkValidationErrors = Object.keys(errors).filter(
      (key) => errors[key as keyof OfferExtensionData]
    );

    if (checkValidationErrors.length > 0) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    if (
      timeOffRequest &&
      timeOffRequest.length > 0 &&
      timeOffRequest.some((date) => moment(date) < moment(extensionStartDate))
    ) {
      return showToast(
        "error",
        "Time off request dates cannot be before the start date"
      );
    }

    if (isEmail === true && checkValidationErrors.length === 0) {
      const formData: OfferExtensionData = {
        startDate: formatDate(extensionStartDate.toString()),
        endDate: formatDate(extensionEndDate.toString()),
        shiftStartTime: jobAssignment?.ShiftStartTime,
        shiftEndTime: jobAssignment?.ShiftEndTime,
        specialityId: professional?.JobSpeciality.Id,
        professionId: professional?.JobProfession.Id,
        unit: jobAssignment?.Unit,
        shiftId: selectedShift?.value,
        regularHrs: datas.regularHrs,
        overtimeHrs: datas.overtimeHrs,
        totalHrsWeekly: datas.totalHrsWeekly,
        totalDaysOnAssignment: datas.totalDaysOnAssignment,
        gauranteedHours: datas.gauranteedHours,
        complianceDueDate: formatDate(complianceDueDate.toString()),
        notes: datas.notes,
        costCenter: datas.costCenter,
        reqId: datas.reqId,
        payDetails: {
          regularRate: datas.payDetails.regularRate,
          overTimeRate: datas.payDetails.overTimeRate,
          doubleTimeRate: datas.payDetails.doubleTimeRate,
          holidayRate: datas.payDetails.holidayRate,
          chargeRate: datas.payDetails.chargeRate,
          onCallRate: datas.payDetails.onCallRate,
          callBackRate: datas.payDetails.callBackRate,
          travelReimbursement: datas.payDetails.travelReimbursement,
          mealsAndIncidentals: datas.payDetails.mealsAndIncidentals,
          housingStipend: datas.payDetails.housingStipend,
        },
        billingDetails: {
          billRate: datas.billingDetails.billRate,
          overTimeBillRate: datas.billingDetails.overTimeBillRate,
          doubleTimeBillRate: datas.billingDetails.doubleTimeBillRate,
          holidayBillRate: datas.billingDetails.holidayBillRate,
          chargeBillRate: datas.billingDetails.chargeBillRate,
          onCallBillRate: datas.billingDetails.onCallBillRate,
          callBackBillRate: datas.billingDetails.callBackBillRate,
        },
      };

      if (timeOffRequest) {
        formData.approvedTimeOff = timeOffRequest?.map((item) =>
          moment(item).format("YYYY-MM-DD")
        );
      } else {
        formData.approvedTimeOff = [];
      }
      setFormData(formData);
      // console.log({
      //   startDate: formatDate(extensionStartDate.toString()),
      //   endDate: formatDate(extensionEndDate.toString()),
      //   shiftStartTime: jobAssignment?.ShiftStartTime,
      //   shiftEndTime: jobAssignment?.ShiftEndTime,
      //   specialityId: professional?.JobSpeciality.Id,
      //   professionId: professional?.JobProfession.Id,
      //   unit: jobAssignment?.Unit,
      //   shiftId: selectedShift?.value,
      //   approvedTimeOff: formatDate(approvedTimeOff.toString()),
      //   regularHrs: data.regularHrs,
      //   overtimeHrs: data.overtimeHrs,
      //   totalHrsWeekly: data.totalHrsWeekly,
      //   totalDaysOnAssignment: data.totalDaysOnAssignment,
      //   gauranteedHours: data.gauranteedHours,
      //   complianceDueDate: formatDate(complianceDueDate.toString()),
      //   notes: data.notes,
      //   costCenter: data.costCenter,
      //   payDetails: {
      //     regularRate: data.payDetails.regularRate,
      //     overTimeRate: data.payDetails.overTimeRate,
      //     doubleTimeRate: data.payDetails.doubleTimeRate,
      //     holidayRate: data.payDetails.holidayRate,
      //     chargeRate: data.payDetails.chargeRate,
      //     onCallRate: data.payDetails.onCallRate,
      //     callBackRate: data.payDetails.callBackRate,
      //     mealsAndIncidentals: data.payDetails.mealsAndIncidentals,
      //     housingStipend: data.payDetails.housingStipend,
      //   },
      //   billingDetails: {
      //     billRate: data.billingDetails.billRate,
      //     overTimeBillRate: data.billingDetails.overTimeBillRate,
      //     doubleTimeBillRate: data.billingDetails.doubleTimeBillRate,
      //     holidayBillRate: data.billingDetails.holidayBillRate,
      //     chargeBillRate: data.billingDetails.chargeBillRate,
      //     onCallBillRate: data.billingDetails.onCallBillRate,
      //     callBackBillRate: data.billingDetails.callBackBillRate,
      //   },
      // });
      setEmailModal(true);
      return;
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal isOpen={isOpen} toggle={toggle} centered={true} size="xl">
        <ModalHeader
          toggle={toggle}
          style={{
            position: "sticky",
            top: "0px",
            zIndex: "9999",
            background: "#FFF",
          }}
        >
          Service Extension Offer to Client
        </ModalHeader>
        <ModalBody style={{ height: "auto", overflow: "auto" }}>
          <div className="view-file-wrapper">
            <div>
              <div className="mt-3">
                {professional && (
                  <ServiceExtensionReqHeader
                    professionalId={professionalId}
                    jobId={jobId}
                    professional={professional}
                    currentStatus={currentStatus}
                  />
                )}
              </div>
              <div
                className="offer-wrapper p-3"
                style={{ boxShadow: "0px 2px 2px 0px #00000026" }}
              >
                <Form
                  onSubmit={
                    isEmail ? handleSubmit(openEmail) : handleSubmit(submit)
                  }
                >
                  <Row>
                    <h6 className="mb-3">Candidate Information</h6>

                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Professional Name</Label>
                      <CustomInput
                        value={`${capitalize(
                          professional?.FirstName ? professional?.FirstName : ""
                        )} ${capitalize(
                          professional?.LastName ? professional?.LastName : ""
                        )}`}
                        disabled
                      />
                    </Col>
                    <Col xxl="8" xl="8" lg="6" md="6" className="col-group">
                      <Label className="">Job Title</Label>
                      <CustomInput
                        value={capitalize(
                          jobDetails?.Title ? jobDetails?.Title : ""
                        )}
                        disabled
                      />
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Specialty</Label>
                      <CustomInput
                        disabled
                        value={`${
                          professional?.JobSpeciality
                            ? professional?.JobSpeciality.Speciality
                            : ""
                        }`}
                      />
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Profession</Label>
                      <CustomInput
                        disabled
                        value={`${
                          professional?.JobProfession
                            ? professional?.JobProfession.Profession
                            : ""
                        }`}
                      />
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Unit</Label>
                      <CustomInput
                        className="text-capitalize"
                        value={`${
                          jobAssignment?.Unit ? jobAssignment?.Unit : ""
                        }`}
                        disabled
                      />
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Shift<span className="asterisk">*</span>
                      </Label>
                      <CustomSelect
                        id="selectedShift"
                        name="selectedShift"
                        options={shifts.map((type) => ({
                          label: type.Shift,
                          value: type.Id,
                        }))}
                        noOptionsMessage={() => "No options available"}
                        placeholder="Select Shift"
                        value={selectedShift}
                        onChange={(option) => {
                          setSelectedShift(option);
                        }}
                        isDisabled={false}
                      />
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Service Start Date</Label>
                      <div
                        className="date-range"
                        style={{ backgroundColor: "#F7F8F3" }}
                      >
                        <ReactDatePicker
                          dateFormat="MM/dd/yyyy"
                          isClearable={true}
                          disabled={true}
                          onChange={() => {}}
                          placeholderText="----"
                          customInput={
                            <div className="calendar-wrapper">
                              <CustomInput
                                value={
                                  jobAssignment?.StartDate
                                    ? moment(jobAssignment?.StartDate).format(
                                        "MM-DD-YYYY"
                                      )
                                    : "-"
                                }
                                disabled={true}
                              />
                              <img src={Calendar} className="calendar-icon" />
                            </div>
                          }
                        />
                      </div>
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Service End Date</Label>
                      <div
                        className="date-range"
                        style={{ backgroundColor: "#F7F8F3" }}
                      >
                        <ReactDatePicker
                          dateFormat="MM/dd/yyyy"
                          isClearable={true}
                          disabled={true}
                          onChange={() => {}}
                          placeholderText="----"
                          customInput={
                            <div className="calendar-wrapper">
                              <CustomInput
                                value={
                                  jobAssignment?.EndDate
                                    ? moment(jobAssignment?.EndDate).format(
                                        "MM-DD-YYYY"
                                      )
                                    : "-"
                                }
                                disabled={true}
                              />
                              <img src={Calendar} className="calendar-icon" />
                            </div>
                          }
                        />
                      </div>
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Extension Start Date<span className="asterisk">*</span>
                      </Label>
                      <div className="date-range">
                        <ReactDatePicker
                          dateFormat="MM/dd/yyyy"
                          isClearable={true}
                          disabled={false}
                          selected={extensionStartDate}
                          onChange={(date) => {
                            setExtensionStartDate(date);
                          }}
                          minDate={new Date()}
                          maxDate={
                            new Date(new Date().getFullYear() + 10, 11, 31)
                          }
                          placeholderText="----"
                          customInput={
                            <div className="calendar-wrapper">
                              <CustomInput
                                value={
                                  extensionStartDate
                                    ? moment(
                                        extensionStartDate.toString()
                                      ).format("MM-DD-YYYY")
                                    : ""
                                }
                                disabled={false}
                              />
                              {!extensionStartDate && (
                                <img src={Calendar} className="calendar-icon" />
                              )}
                            </div>
                          }
                        />
                      </div>
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Extension End Date<span className="asterisk">*</span>
                      </Label>
                      <div className="date-range">
                        <ReactDatePicker
                          dateFormat="MM/dd/yyyy"
                          isClearable={true}
                          disabled={false}
                          selected={extensionEndDate}
                          onChange={(date) => {
                            setExtensionEndDate(date);
                          }}
                          minDate={
                            extensionStartDate
                              ? new Date(
                                  extensionStartDate.getTime() +
                                    24 * 60 * 60 * 1000
                                )
                              : new Date(
                                  new Date().getTime() + 24 * 60 * 60 * 1000
                                )
                          }
                          maxDate={
                            new Date(new Date().getFullYear() + 10, 11, 31)
                          }
                          placeholderText="----"
                          customInput={
                            <div className="calendar-wrapper">
                              <CustomInput
                                value={
                                  extensionEndDate
                                    ? moment(
                                        extensionEndDate.toString()
                                      ).format("MM-DD-YYYY")
                                    : ""
                                }
                                disabled={false}
                              />
                              {!extensionEndDate && (
                                <img src={Calendar} className="calendar-icon" />
                              )}
                            </div>
                          }
                        />
                      </div>
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Approved Time Off</Label>
                      {/* <div className="date-range"> */}
                        {/* <ReactDatePicker
                          dateFormat="MM/dd/yyyy"
                          isClearable={true}
                          disabled={false}
                          selected={approvedTimeOff}
                          onChange={(date) => {
                            setApprovedTimeOff(date);
                          }}
                          maxDate={
                            new Date(new Date().getFullYear() + 10, 11, 31)
                          }
                          placeholderText="----"
                          customInput={
                            <div className="calendar-wrapper">
                              <CustomInput
                                value={
                                  approvedTimeOff
                                    ? formatDateInDayMonthYear(
                                        approvedTimeOff.toString()
                                      ).replace(/-/g, "/")
                                    : ""
                                }
                                disabled={false}
                              />
                              {!approvedTimeOff && (
                                <img src={Calendar} className="calendar-icon" />
                              )}
                            </div>
                          }
                        /> */}
                        <CustomMultiDatePicker
                          maxDate={
                            new Date(new Date().getFullYear() + 4, 11, 31)
                          }
                          value={
                            timeOffRequest
                              ? timeOffRequest?.map((item) =>
                                  moment(item).format("MM-DD-YYYY")
                                )
                              : "-"
                          }
                          onChangeDate={handleDate}
                        />
                      {/* </div> */}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Regular Hours<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Regular Hours"
                        invalid={errors.regularHrs}
                        {...register("regularHrs")}
                      />
                      {errors.regularHrs && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.regularHrs.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Overtime Hours<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Overtime Hours"
                        invalid={errors.overtimeHrs}
                        {...register("overtimeHrs")}
                      />
                      {errors.overtimeHrs && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.overtimeHrs.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Total Hours (weekly)<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Total Hours (weekly)"
                        invalid={errors.totalHrsWeekly}
                        {...register("totalHrsWeekly")}
                      />
                      {errors.totalHrsWeekly && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.totalHrsWeekly.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Total Days on Assignment
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        invalid={errors.totalDaysOnAssignment}
                        {...register("totalDaysOnAssignment")}
                        placeholder="Total Days on Assignment"
                        type="number"
                      />
                      {errors.totalDaysOnAssignment && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.totalDaysOnAssignment.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Guaranteed Hours<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Guaranteed Hours"
                        {...register("gauranteedHours")}
                        invalid={errors.gauranteedHours}
                      />
                      {errors.gauranteedHours && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.gauranteedHours.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Compliance Due Date<span className="asterisk">*</span>
                      </Label>
                      <div className="date-range">
                        <ReactDatePicker
                          isClearable={true}
                          disabled={false}
                          selected={complianceDueDate}
                          maxDate={
                            new Date(new Date().getFullYear() + 10, 11, 31)
                          }
                          onChange={(date) => {
                            setComplianceDueDate(date);
                          }}
                          placeholderText="----"
                          customInput={
                            <div className="calendar-wrapper">
                              <CustomInput
                                value={
                                  complianceDueDate
                                    ? moment(
                                        complianceDueDate.toString()
                                      ).format("MM-DD-YYYY")
                                    : ""
                                }
                                disabled={false}
                              />
                              {!complianceDueDate && (
                                <img src={Calendar} className="calendar-icon" />
                              )}
                            </div>
                          }
                        />
                      </div>
                    </Col>
                    <Col xxl="12" xl="12" lg="6" md="6" className="col-group">
                      <Label>Additional Notes</Label>
                      <CustomInput
                        {...register("notes")}
                        invalid={errors.notes}
                      />
                      {errors.notes && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.notes.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <h6>Pay Details</h6>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Regular Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        invalid={errors.payDetails?.regularRate}
                        {...register("payDetails.regularRate")}
                      />
                      {errors.payDetails?.regularRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.regularRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Overtime Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        invalid={errors.payDetails?.overTimeRate}
                        {...register("payDetails.overTimeRate")}
                      />
                      {errors.payDetails?.overTimeRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.overTimeRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Double Time Rate{" "}
                        <span className="california-text">
                          (California Only)<span className="asterisk">*</span>
                        </span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        invalid={errors.payDetails?.doubleTimeRate}
                        {...register("payDetails.doubleTimeRate")}
                      />
                      {errors.payDetails?.doubleTimeRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.doubleTimeRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Holiday Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("payDetails.holidayRate")}
                        invalid={errors.payDetails?.holidayRate}
                      />
                      {errors.payDetails?.holidayRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.holidayRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Charge Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("payDetails.chargeRate")}
                        invalid={errors.payDetails?.chargeRate}
                      />
                      {errors.payDetails?.chargeRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.chargeRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        On-Call Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        invalid={errors.payDetails?.onCallRate}
                        {...register("payDetails.onCallRate")}
                      />
                      {errors.payDetails?.onCallRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.onCallRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Callback Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("payDetails.callBackRate")}
                        invalid={errors.payDetails?.callBackRate}
                      />
                      {errors.payDetails?.callBackRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.callBackRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Travel Reimbursement<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("payDetails.travelReimbursement")}
                        invalid={errors.payDetails?.travelReimbursement}
                      />
                      {errors.payDetails?.travelReimbursement && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.travelReimbursement.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Lodging Stipend (Daily)
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        invalid={errors.payDetails?.housingStipend}
                        {...register("payDetails.housingStipend")}
                      />
                      {errors.payDetails?.housingStipend && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.housingStipend.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Meals & Incidentals Stipend{" "}
                        <span className="california-text"> (Daily)</span>
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("payDetails.mealsAndIncidentals")}
                        invalid={errors.payDetails?.mealsAndIncidentals}
                      />
                      {errors.payDetails?.mealsAndIncidentals && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.payDetails?.mealsAndIncidentals.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <h6>Billing Details</h6>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Bill Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        invalid={errors.billingDetails?.billRate}
                        {...register("billingDetails.billRate")}
                      />
                      {errors.billingDetails?.billRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.billingDetails?.billRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Overtime Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("billingDetails.overTimeBillRate")}
                        invalid={errors.billingDetails?.overTimeBillRate}
                      />
                      {errors.billingDetails?.overTimeBillRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.billingDetails?.overTimeBillRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Double Time Bill Rate{" "}
                        <span className="california-text">
                          (California Only)<span className="asterisk">*</span>
                        </span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        invalid={errors.billingDetails?.doubleTimeBillRate}
                        {...register("billingDetails.doubleTimeBillRate")}
                      />
                      {errors.billingDetails?.doubleTimeBillRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.billingDetails?.doubleTimeBillRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" className="col-group">
                      <Label className="">
                        Holiday Bill Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("billingDetails.holidayBillRate")}
                        invalid={errors.billingDetails?.holidayBillRate}
                      />
                      {errors.billingDetails?.holidayBillRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.billingDetails?.holidayBillRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" className="col-group">
                      <Label className="">
                        Charge Bill Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("billingDetails.chargeBillRate")}
                        invalid={errors.billingDetails?.chargeBillRate}
                      />
                      {errors.billingDetails?.chargeBillRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.billingDetails?.chargeBillRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" className="col-group">
                      <Label className="">
                        On-Call Bill Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("billingDetails.onCallBillRate")}
                        invalid={errors.billingDetails?.onCallBillRate}
                      />
                      {errors.billingDetails?.onCallBillRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.billingDetails?.onCallBillRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" className="col-group">
                      <Label className="">
                        Callback Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0"
                        {...register("billingDetails.callBackBillRate")}
                        invalid={errors.billingDetails?.callBackBillRate}
                      />
                      {errors.billingDetails?.callBackBillRate && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.billingDetails?.callBackBillRate.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">
                        Cost Center{" "}
                        <span className="california-text">(If applicable)</span>
                      </Label>
                      <CustomInput
                        {...register("costCenter")}
                        invalid={errors.costCenter}
                      />
                      {errors.costCenter && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.costCenter.message}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                      <Label className="">Req Id</Label>
                      <CustomInput
                        {...register("reqId")}
                        invalid={errors.reqId}
                      />
                      {errors.reqId && (
                        <FormFeedback style={{ color: "red" }}>
                          {errors.reqId.message}
                        </FormFeedback>
                      )}
                    </Col>
                  </Row>
                  <div className="btn-wrapper">
                    <CustomButton className="primary-btn" type="submit">
                      Submit
                    </CustomButton>
                    <CustomButton className="secondary-btn" onClick={toggle}>
                      Cancel
                    </CustomButton>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {emailModal &&
        professional &&
        jobDetails &&
        jobAssignment &&
        formData && (
          <RosterEmailModal
            isOpen={emailModal}
            toggle={() => setEmailModal(!emailModal)}
            toggleParent={toggle}
            toggleParentParent={toggleParent}
            fetchRosterData={fetchRoster}
            currentProfessional={professional}
            facilityId={facilityId}
            professionalId={professionalId}
            job={jobDetails}
            currentApplicantId={jobApplicationId}
            jobAssignment={jobAssignment}
            jobAssignmentId={jobAssignmentId}
            formData={formData}
          />
        )}
    </>
  );
};

export default ServiceExtensionReqModal;
