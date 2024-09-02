import { Row, Col, Label } from "reactstrap";
import Calendar from "../../../../../../assets/images/calendar.svg";
import ReactDatePicker from "react-datepicker";
import { Form } from "react-router-dom";
import { ProfessionalDetails } from "../../../../../../types/StoreInitialTypes";
import { RightJobContentData } from "../../../../../../types/JobsTypes";
import { JobAssignmentType } from "../../../facilitycomponent/roster/ServiceExtensionReqModal";
import CustomInput from "../../../../../../components/custom/CustomInput";
import {
  capitalize,
  formatDateInDayMonthYear,
} from "../../../../../../helpers";
import { RejectedJobAssignmentInfo } from "./RejectedTab";
import moment from "moment";

type RejectedCandidateInformationProps = {
  row: RejectedJobAssignmentInfo;
  professional: ProfessionalDetails;
  jobDetails: RightJobContentData;
  jobAssignment: JobAssignmentType;
};

const RejectedCandidateInformation = ({
  professional,
  jobDetails,
  jobAssignment,
  row,
}: RejectedCandidateInformationProps) => {
  return (
    <>
      <div className="offer-wrapper">
        <Form>
          <Row>
            <h5>Candidate Information</h5>
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
                value={jobDetails?.Title ? capitalize(jobDetails?.Title) : ""}
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Specialty</Label>
              <CustomInput
                disabled
                value={
                  professional?.JobSpeciality
                    ? professional?.JobSpeciality.Speciality
                    : ""
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Profession</Label>
              <CustomInput
                disabled
                value={
                  professional?.JobProfession
                    ? professional?.JobProfession.Profession
                    : ""
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Unit</Label>
              <CustomInput
                className="text-capitalize"
                value={jobAssignment?.Unit ? jobAssignment?.Unit : "-"}
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Shift</Label>
              <CustomInput
                value={capitalize(
                  jobAssignment.JobShift.Shift
                    ? jobAssignment.JobShift.Shift
                    : "-"
                )}
                disabled
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
                          row.JobAssignmentStartDate
                            ? formatDateInDayMonthYear(
                                row.JobAssignmentStartDate
                              ).replace(/-/g, "/")
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
                          row.JobAssignmentEndDate
                            ? formatDateInDayMonthYear(
                                row.JobAssignmentEndDate
                              ).replace(/-/g, "/")
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
                            ? formatDateInDayMonthYear(
                                jobAssignment?.StartDate
                              ).replace(/-/g, "/")
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
                Extension End Date<span className="asterisk">*</span>
              </Label>
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
                            ? formatDateInDayMonthYear(
                                jobAssignment?.EndDate
                              ).replace(/-/g, "/")
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
              <Label className="">Approved Time Off</Label>
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
                          jobAssignment?.JobRequestingTimeOffs
                            ? jobAssignment?.JobRequestingTimeOffs?.map(
                                (item) => moment(item.Date).format("MM-DD-YYYY")
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
              <Label className="">Total Hours (weekly)</Label>
              <CustomInput
                placeholder=""
                disabled
                value={jobAssignment?.TotalHrs ? jobAssignment?.TotalHrs : "-"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Guaranteed Hours</Label>
              <CustomInput
                value={
                  jobAssignment?.GauranteedHrs
                    ? jobAssignment?.GauranteedHrs
                    : "-"
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Compliance Due Date</Label>
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
                          jobAssignment?.ComplianceDueDate
                            ? formatDateInDayMonthYear(
                                jobAssignment?.ComplianceDueDate
                              ).replace(/-/g, "/")
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
            <Col xxl="12" xl="12" lg="6" md="6" className="col-group">
              <Label className="">Additional Notes</Label>
              <CustomInput
                disabled
                className="text-capitalize"
                value={jobAssignment?.Notes ? jobAssignment?.Notes : "-"}
              />
            </Col>
            <h6>Pay Details</h6>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Regular Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.RegularRate
                    ? `${jobAssignment?.RegularRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Overtime Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment.OvertimeRate
                    ? `${jobAssignment?.OvertimeRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Double Time Rate{" "}
                <span className="california-text">(California Only)</span>
              </Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.DoubleTimeRate
                    ? `${jobAssignment?.DoubleTimeRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Holiday Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.HolidayRate
                    ? `${jobAssignment?.HolidayRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Charge Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.ChargeRate
                    ? `${jobAssignment?.ChargeRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">On-Call Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.OnCallRate
                    ? `${jobAssignment?.OnCallRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Callback Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.CallbackRate
                    ? `${jobAssignment?.CallbackRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Meals & Incidentals Stipend (weekly)</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.MealsAndIncidentials
                    ? `${jobAssignment?.MealsAndIncidentials}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Housing Stipend (weekly)</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.HousingStipend
                    ? `${jobAssignment?.HousingStipend}`
                    : "-"
                }
              />
            </Col>
            <h6>Billing Details</h6>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Bill Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.BillRate ? `${jobAssignment?.BillRate}` : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Overtime Bill Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.OvertimeBillRate
                    ? `${jobAssignment?.OvertimeBillRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Double Time Bill Rate{" "}
                <span className="california-text">(California Only)</span>
              </Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.DoubleTimeBillRate
                    ? `${jobAssignment?.DoubleTimeBillRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Holiday Bill Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.HolidayBillRate
                    ? `${jobAssignment?.HolidayBillRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Charge Bill Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.ChargeBillRate
                    ? `${jobAssignment?.ChargeBillRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">On-Call Bill Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.OnCallBillRate
                    ? `${jobAssignment?.OnCallBillRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Callback Bill Rate</Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.CallbackBillRate
                    ? `${jobAssignment?.CallbackBillRate}`
                    : "-"
                }
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Cost Center{" "}
                <span className="california-text">(If applicable)</span>
              </Label>
              <CustomInput
                placeholder=""
                disabled
                value={
                  jobAssignment?.CostCenter
                    ? `${jobAssignment?.CostCenter}`
                    : "-"
                }
              />
            </Col>
            {/* <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Client Req ID #{" "}
                <span className="california-text">(If applicable)</span>
              </Label> */}
            {/* <CustomInput
                placeholder=""
                disabled
                value={
                  isExapndedData
                    ? row.ReqId
                      ? row.ReqId.toUpperCase()
                      : "-"
                    : row.re
                    ? row.JobApplication.JobAssignments[0].ReqId.toUpperCase()
                    : "-"
                }
              /> */}
            {/* </Col> */}
          </Row>
        </Form>
      </div>
    </>
  );
};

export default RejectedCandidateInformation;
