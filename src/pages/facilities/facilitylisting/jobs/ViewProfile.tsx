import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Form,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomDatePicker from "../../../../components/custom/CustomDatePicker";
import Camera from "../../../../assets/images/camera.svg";
import { useCallback, useEffect, useState } from "react";
import { capitalize, formatPhoneNumber } from "../../../../helpers";

import { useParams } from "react-router-dom";
import { fetchApplicantProfessionalDetails } from "../../../../services/ApplicantsServices";
import { getJobDetails } from "../../../../services/JobsServices";
import { getJobAssignment } from "../../../../services/OpeningServices";
import { JobTemplate } from "../../../../types/JobTemplateTypes";
import { ProfessionalDetails } from "../../../../types/StoreInitialTypes";
import { SlotType } from "../../../../types/ApplicantTypes";
import Loader from "../../../../components/custom/CustomSpinner";
import { JobRequestingTimeOffsType } from "./ViewAssignment";

type FinalizeOfferProps = {
  isOpen: boolean;
  toggle: () => void;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  slot: SlotType;
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

const ViewProfile = ({
  isOpen,
  toggle,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  slot,
}: FinalizeOfferProps) => {
  const params = useParams();
  const facilityId = params.fId;
  const jobId = params.jId;
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
        <ModalHeader toggle={toggle}>Offer Details</ModalHeader>
        <ModalBody
          className="viewProfile"
          style={{ height: "800px", overflow: "auto" }}
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
                    {slot.ReqId && (
                      <CustomInput
                        placeholder=""
                        disabled
                        value={`Client Req ID: ${slot.ReqId.toUpperCase()}`}
                        className="in-width input"
                        style={{
                          marginRight: "10px",
                        }}
                      />
                    )}
                  </div>
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
                    value={capitalize(
                      currentProfessional?.JobSpeciality.Speciality ?? "-"
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Profession</Label>
                  <CustomInput
                    value={capitalize(
                      currentProfessional?.JobProfession.Profession ?? "-"
                    )}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Unit</Label>
                  <CustomInput
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
                    value={data?.StartDate ? data?.StartDate : "-"}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>End Date</Label>
                  <CustomDatePicker
                    value={data?.EndDate ? data?.EndDate : "-"}
                    disabled
                  />
                </Col>
                <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                  <Label>Approved Time Off</Label>
                  <CustomDatePicker
                    value={
                      data?.JobRequestingTimeOffs
                        ? data?.JobRequestingTimeOffs?.map((item) => item.Date)
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
                      data?.ComplianceDueDate ? data?.ComplianceDueDate : "-"
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
                    value={
                      slot.JobAssignment && slot.JobAssignment.ReqId
                        ? slot.JobAssignment.ReqId.toUpperCase()
                        : slot.ReqId
                        ? slot.ReqId.toUpperCase()
                        : "--"
                    }
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
      </Modal>
    </>
  );
};

export default ViewProfile;
