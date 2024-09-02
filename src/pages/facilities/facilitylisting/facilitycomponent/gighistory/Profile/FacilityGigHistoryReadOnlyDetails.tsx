import { Col, Row, Label, Form } from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import Loader from "../../../../../../components/custom/CustomSpinner";
import CustomInput from "../../../../../../components/custom/CustomInput";
import { capitalize, formatPhoneNumber } from "../../../../../../helpers";
import CustomDatePicker from "../../../../../../components/custom/CustomDatePicker";
import { JobTemplate } from "../../../../../../types/JobTemplateTypes";

import { getJobDetails } from "../../../../../../services/JobsServices";
import { ProfessionalDetails } from "../../../../../../types/StoreInitialTypes";
import FacilityGigHistoryServices from "../../../../../../services/FacilityGigHistoryServices";
import { JobRequestingTimeOffsType } from "../../../jobs/ViewAssignment";

type FinalizeOfferProps = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  currentProfessional: ProfessionalDetails;
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

const FacilityGigHistoryReadOnlyDetails = ({
  jobId,
  facilityId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  currentProfessional,
}: FinalizeOfferProps) => {
  const [loading, setLoading] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobTemplate | null>(null);

  const [data, setData] = useState<JobData | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [currentJob, data] = await Promise.all([
      getJobDetails(Number(facilityId), Number(jobId)),
      FacilityGigHistoryServices.getJobAssignment({
        facilityId: Number(facilityId),
        jobId: Number(jobId),
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        jobAssignmentId: jobAssignmentId,
      }),
    ]);

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
                  currentProfessional?.Email ? currentProfessional?.Email : ""
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label>Job Title</Label>
              <CustomInput
                value={capitalize(currentJob?.Title ? currentJob?.Title : "")}
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
                Total Hours<span className="california-text">(Weekly)</span>
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
                value={data?.ComplianceDueDate ? data?.ComplianceDueDate : "-"}
                disabled
              />
            </Col>
            <Col xxl="8" xl="8" lg="6" md="6" className="col-group">
              <Label>Notes</Label>
              <CustomInput value={data?.Notes ? data?.Notes : "-"} disabled />
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
                Housing Stipend <span className="california-text">(Daily)</span>
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
                  data?.MealsAndIncidentials ? data?.MealsAndIncidentials : "-"
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
                value={data?.OvertimeBillRate ? data?.OvertimeBillRate : "-"}
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
                value={data?.CallbackBillRate ? data?.CallbackBillRate : "-"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label>
                Cost Center{" "}
                <span className="california-text">(If Applicable)</span>
              </Label>
              <CustomInput
                disabled
                value={data?.CostCenter ? data?.CostCenter : "-"}
              />
            </Col>

            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label>
                Client Req ID #{" "}
                <span className="california-text">(If Applicable)</span>
              </Label>
              {/* <CustomInput disabled value={slot.ReqId} /> */}
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default FacilityGigHistoryReadOnlyDetails;
