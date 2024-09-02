import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Form,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomDatePicker from "../../../../components/custom/CustomDatePicker";
import CustomButton from "../../../../components/custom/CustomBtn";
import { useCallback, useEffect, useState } from "react";
import { capitalize, formatPhoneNumber } from "../../../../helpers";

import {
  getJobAssignment,
  placeJobAssignment,
} from "../../../../services/OpeningServices";
import { fetchApplicantProfessionalDetails } from "../../../../services/ApplicantsServices";
import { getJobDetails } from "../../../../services/JobsServices";
import { JobTemplate } from "../../../../types/JobTemplateTypes";
import { ProfessionalDetails } from "../../../../types/StoreInitialTypes";
import { SlotType } from "../../../../types/ApplicantTypes";
import Loader from "../../../../components/custom/CustomSpinner";
import Camera from "../../../../assets/images/camera.svg";
import { getStatusColor } from "../../../../constant/StatusColors";
import moment from "moment";
import { JobRequestingTimeOffsType } from "./ViewAssignment";

type FinalizeOfferProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  slot: SlotType;
  fetchJobAssignments: () => void;
  status: string;
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

interface JobProfession {
  Id: number;
  Profession: string;
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
  MealsAndIncidentials: number;
  HousingStipend: number;
  BillRate: number;
  OvertimeBillRate: number;
  DoubleTimeBillRate: number;
  HolidayBillRate: number;
  ChargeBillRate: number;
  OnCallBillRate: number;
  CallbackBillRate: number;
  TravelReimbursement: number;
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

const FinalizeOffer = ({
  isOpen,
  toggle,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  slot,
  fetchJobAssignments,
  facilityId,
  jobId,
  status,
}: FinalizeOfferProps) => {
  const [loading, setLoading] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobTemplate | null>(null);
  const [currentProfessional, setCurrentProfessional] =
    useState<ProfessionalDetails | null>(null);
  const [data, setData] = useState<JobData | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [currentProfessional, currentJob, data] = await Promise.all([
      fetchApplicantProfessionalDetails({
        facilityId: Number(facilityId),
        jobId: Number(jobId),
        professionalId: professionalId,
      }),
      getJobDetails(Number(facilityId), Number(jobId)),
      getJobAssignment({
        facilityId: Number(facilityId),
        jobId: Number(jobId),
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
      }),
    ]);

    setCurrentProfessional(currentProfessional.data.data[0]);
    setCurrentJob(currentJob.data.data[0]);
    setData(data.data.data[0]);
    setLoading(false);
  }, [facilityId, jobId, professionalId, jobApplicationId, jobAssignmentId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const place = async () => {
    setLoading(true);
    try {
      const res = await placeJobAssignment({
        facilityId: Number(facilityId),
        jobId: Number(jobId),
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
      });
      if (res.status === 200) {
        setLoading(false);
        fetchJobAssignments();
        toggle();
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        <ModalHeader toggle={toggle}>Finalize Offer</ModalHeader>
        <ModalBody
          className="viewProfile"
          style={{ height: "600px", overflow: "auto" }}
        >
          <div className="facility-header-wrap p-2 mb-3">
            <div>
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
                      value={`PID-${professionalId.toString()}`}
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
                    {slot.JobAssignment.ReqId && (
                      <CustomInput
                        placeholder=""
                        disabled
                        value={`Req ID: ${slot.JobAssignment.ReqId.toUpperCase()}`}
                        className="in-width input"
                        style={{
                          marginRight: "10px",
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center select-view">
                  <span style={{ marginRight: "5px" }}>
                    {" "}
                    Application Status:
                  </span>
                  <span
                    style={{
                      color: getStatusColor(status),
                      borderColor: getStatusColor(status),
                      marginLeft: "10px",
                      border: "1px solid",
                      padding: "0.8rem 0.5rem",
                      borderRadius: "5px",
                      backgroundColor: "#fafafa",
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
                  <Label>Specialty</Label>
                  <CustomInput
                    value={capitalize(data?.JobSpeciality.Speciality ?? "-")}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Profession</Label>
                  <CustomInput
                    value={capitalize(data?.JobProfession.Profession ?? "-")}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Unit</Label>
                  <CustomInput
                    className="text-capitalize"
                    value={capitalize(data?.Unit ? data?.Unit : "-")}
                    disabled
                  />
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Shift</Label>
                  <CustomInput
                    value={capitalize(
                      data?.JobShift?.Shift ? data?.JobShift?.Shift : "-"
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Start Date</Label>
                  <CustomDatePicker
                    value={
                      data?.StartDate
                        ? moment(data?.StartDate).format("MM-DD-YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>End Date</Label>
                  <CustomDatePicker
                    value={
                      data?.EndDate
                        ? moment(data?.EndDate).format("MM-DD-YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Approved Time Off</Label>
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
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Regular Hours</Label>
                  <CustomInput
                    value={data?.RegularHrs ? data?.RegularHrs : "-"}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Overtime Hours</Label>
                  <CustomInput
                    value={data?.OverTimeHrs ? data?.OverTimeHrs : "-"}
                    disabled
                  />
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>
                    Total Hours{" "}
                    <span className="california-text">(Weekly)</span>
                  </Label>
                  <CustomInput
                    value={data?.TotalHrs ? data?.TotalHrs : "-"}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Total Days on Assignment</Label>
                  <CustomInput
                    value={
                      data?.TotalDaysOnAssignment
                        ? data?.TotalDaysOnAssignment
                        : "-"
                    }
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Guaranteed Hours</Label>
                  <CustomInput
                    value={data?.GauranteedHrs ? data?.GauranteedHrs : "-"}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Compliance Due Date</Label>
                  <CustomDatePicker
                    value={
                      data?.ComplianceDueDate
                        ? moment(data?.ComplianceDueDate).format("MM-DD-YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Col>
                <Col xxl="8" xl="8" lg="6" md="6" className="col-group">
                  <Label>Notes</Label>
                  <CustomInput
                    className="text-capitalize"
                    value={data?.Notes ? data?.Notes : "-"}
                    disabled
                  />
                </Col>
              </Row>
              <div>
                <h6>Pay Details</h6>
              </div>

              <Row>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Regular Rate</Label>
                  <CustomInput
                    value={data?.RegularRate ? data?.RegularRate : "-"}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Overtime Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.OvertimeRate ? data?.OvertimeRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>
                    Double Time Rate{" "}
                    <span className="california-text">(California Only)</span>
                  </Label>
                  <CustomInput
                    disabled
                    value={data?.DoubleTimeRate ? data?.DoubleTimeRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Holiday Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.HolidayRate ? data?.HolidayRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Charge Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.ChargeRate ? data?.ChargeRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>On-Call Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.OnCallRate ? data?.OnCallRate : "-"}
                  />
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>CallBack Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.CallbackRate ? data?.CallbackRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Travel Reimbursement</Label>
                  <CustomInput
                    disabled
                    value={data?.TravelReimbursement ? data?.TravelReimbursement : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>
                    Housing Stipend{" "}
                    <span className="california-text">(Daily)</span>
                  </Label>
                  <CustomInput
                    disabled
                    value={data?.HousingStipend ? data?.HousingStipend : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>
                    Meals & Incidentals Stipend{" "}
                    <span className="california-text">(Daily)</span>
                  </Label>
                  <CustomInput
                    disabled
                    value={
                      data?.MealsAndIncidentials
                        ? data?.MealsAndIncidentials
                        : "-"
                    }
                  />
                </Col>
              </Row>
              <div>
                <h6>Billing Details</h6>
              </div>
              <Row>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Bill Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.BillRate ? data?.BillRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Overtime Bill Rate</Label>
                  <CustomInput
                    disabled
                    value={
                      data?.OvertimeBillRate ? data?.OvertimeBillRate : "-"
                    }
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>
                    Double Time Rate{" "}
                    <span className="california-text">(California Only)</span>
                  </Label>
                  <CustomInput
                    disabled
                    value={
                      data?.DoubleTimeBillRate ? data?.DoubleTimeBillRate : "-"
                    }
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Holiday Bill Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.HolidayBillRate ? data?.HolidayBillRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Charge Bill Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.ChargeBillRate ? data?.ChargeBillRate : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>On-Call Bill Rate</Label>
                  <CustomInput
                    disabled
                    value={data?.OnCallBillRate ? data?.OnCallBillRate : "-"}
                  />
                </Col>

                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>CallBack Rate</Label>
                  <CustomInput
                    disabled
                    value={
                      data?.CallbackBillRate ? data?.CallbackBillRate : "-"
                    }
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>
                    Cost Center{" "}
                    <span className="california-text">(If applicable)</span>
                  </Label>
                  <CustomInput
                    disabled
                    value={data?.CostCenter ? data?.CostCenter : "-"}
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>
                    Client Req ID #{" "}
                    <span className="california-text">(If applicable)</span>
                  </Label>
                  <CustomInput
                    disabled
                    value={slot.JobAssignment.ReqId?.toUpperCase()}
                  />
                </Col>
              </Row>

              {/* <Row>

                  <Col md='12' className="col-group">
                    <Label>
                      Select Termination By
                    </Label>
                    <CustomSelect
                      id="termination"
                      styles={activityModalDropdown}
                      name="termination"
                      placeholder="Select"
                      noOptionsMessage={() => "No Category Found"}
                      isClearable={true}
                      isSearchable={true}
                      options={roleOption}
                      onChange={handleCategoryChange}
                      value={selectedCategory}
                    />
                  </Col>

                </Row>
                <Row>
                  <Col md='12' className="col-group">
                    <Label>Notes</Label>
                    <CustomTextArea disabled={false} id="notesTextArea"
                      placeholder="Notes" />
                  </Col>
                </Row> */}
            </Form>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-start">
          <div style={{ marginLeft: "0px" }}>
            <CustomButton
              className="primary-btn"
              style={{ marginLeft: "0px" }}
              onClick={place}
            >
              Finalize Offer
            </CustomButton>
            <CustomButton className="secondary-btn" onClick={toggle}>
              Cancel
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FinalizeOffer;