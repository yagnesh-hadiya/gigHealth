import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Form,
} from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomDatePicker from "../../../components/custom/CustomDatePicker";
import { capitalize, formatPhoneNumber, showToast } from "../../../helpers";
import moment from "moment";
import { getAuthDetails } from "../../../store/ProfessionalAuthStore";
import { useSelector } from "react-redux";
import { authDetails } from "../../../types/StoreInitialTypes";
import { useEffect, useState } from "react";
import { getJobAssignmentDetails } from "../../../services/GigHistoryServices";

interface ViewAssignmentModalProps {
  jobId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  isOpen: boolean;
  toggle: () => void;
}
const ViewAssignmentModal = ({
  isOpen,
  toggle,
  jobId,
  jobApplicationId,
  jobAssignmentId,
}: ViewAssignmentModalProps) => {
  const [assignmentList, setAssignmentList] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading("loading");
        const [detailsResponse] = await Promise.allSettled([
          getJobAssignmentDetails(jobId, jobApplicationId, jobAssignmentId),
        ]);
        if (detailsResponse.status === "fulfilled") {
          setAssignmentList(detailsResponse.value?.data?.data[0]);
        }
      } catch (error: any) {
        console.error(error);
        // setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };

    fetchData().catch((error: any) => {
      console.error("Error fetching data:", error);
      // setLoading("idle");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    });
  }, []);

  const authDetails: authDetails[] = useSelector(getAuthDetails);
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      size="xl"
      onClosed={toggle}
    >
      <ModalHeader toggle={toggle}>View Details</ModalHeader>
      <ModalBody
        className="viewAssignmentViewAssignment"
        style={{
          height: "800px",
          overflow: "auto",
          backgroundColor: "#f7f8f3",
        }}
      >
        <div className="facility-header-wrap p-3">
          <Form>
            <Row>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Facility Name</Label>
                <CustomInput
                  disabled
                  value={capitalize(assignmentList?.Facility?.Name ?? "-")}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Facility Address</Label>
                <CustomInput
                  disabled
                  value={capitalize(assignmentList?.Facility?.Address ?? "-")}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Program Manager</Label>
                <CustomInput
                  disabled
                  value={
                    authDetails[0]?.ProgramManager
                      ? capitalize(
                          authDetails[0]?.ProgramManager.FirstName +
                            " " +
                            authDetails[0]?.ProgramManager.LastName
                        )
                      : "-"
                  }
                />
              </Col>

              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Employment Expert</Label>
                <CustomInput
                  value={
                    authDetails[0]?.EmploymentExpert
                      ? capitalize(
                          authDetails[0]?.EmploymentExpert.FirstName +
                            " " +
                            authDetails[0]?.EmploymentExpert.LastName
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
                    authDetails[0]?.FirstName
                      ? authDetails[0]?.FirstName +
                          " " +
                          authDetails[0]?.LastName
                      : ""
                  )}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Professional Phone Number</Label>
                <CustomInput
                  value={
                    authDetails[0]?.Phone
                      ? formatPhoneNumber(authDetails[0]?.Phone)
                      : ""
                  }
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Professional Email Address</Label>
                <CustomInput
                  value={authDetails[0]?.Email ? authDetails[0]?.Email : ""}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Professional</Label>
                <CustomInput
                  value={capitalize(
                    authDetails[0]?.JobProfession?.Profession ?? ""
                  )}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Unit</Label>
                <CustomInput
                  value={capitalize(assignmentList?.Unit ?? "-")}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Start Date</Label>
                <CustomDatePicker
                  value={
                    assignmentList?.StartDate
                      ? moment(assignmentList?.StartDate).format("MM-DD-YYYY")
                      : "-"
                  }
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">End Date</Label>

                <CustomDatePicker
                  value={
                    assignmentList?.EndDate
                      ? moment(assignmentList?.EndDate).format("MM-DD-YYYY")
                      : "-"
                  }
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Start Time</Label>
                <CustomInput
                  value={
                    assignmentList.ShiftStartTime
                      ? moment(
                          assignmentList?.ShiftStartTime,
                          "HH:mm:ss"
                        ).format("h:mm A")
                      : "-"
                  }
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">End Time</Label>
                <CustomInput
                  value={
                    assignmentList.ShiftEndTime
                      ? moment(assignmentList?.ShiftEndTime, "HH:mm:ss").format(
                          "h:mm A"
                        )
                      : "-"
                  }
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Regular Hours</Label>
                <CustomInput
                  step="0.1"
                  disabled={true}
                  value={assignmentList?.RegularHrs ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Overtime Hours</Label>
                <CustomInput
                  step="0.1"
                  disabled={true}
                  value={assignmentList?.OverTimeHrs ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Total Hours (weekly)</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.TotalHrs ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Total Days on Assignment</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList?.TotalDaysOnAssignment ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Guaranteed Hours</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.GauranteedHrs ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label>Compliance Due Date</Label>

                <CustomDatePicker
                  value={
                    assignmentList?.ComplianceDueDate
                      ? moment(assignmentList?.ComplianceDueDate).format(
                          "MM-DD-YYYY"
                        )
                      : "-"
                  }
                  disabled
                />
              </Col>
              <Col className="col-group">
                <Label className="">Notes</Label>
                <CustomInput
                  type="textarea"
                  disabled={true}
                  value={assignmentList.Notes ?? "-"}
                />
              </Col>
            </Row>
            <div>
              <h6>Pay Details</h6>
            </div>
            <Row>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Regular Rate</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.RegularRate ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Overtime Rate</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.OvertimeRate ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Double Time Rate(california only)</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.DoubleTimeRate ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Holiday Rate</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.HolidayRate ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Charge Rate</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.ChargeRate ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">On-Call Rate</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.OnCallRate ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">CallBack Rate</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.CallbackRate ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Meals & Incidentals Stipend(Daily)</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList.MealsAndIncidentials ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Housing Stipend(Daily)</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList?.HousingStipend ?? "-"}
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Travel Reimbursement Rate</Label>
                <CustomInput
                  disabled={true}
                  value={assignmentList?.TravelReimbursement ?? "-"}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewAssignmentModal;
