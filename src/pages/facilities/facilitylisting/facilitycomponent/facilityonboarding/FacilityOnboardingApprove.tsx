import { Form } from "react-router-dom";
import { Col, Row, Modal, ModalBody } from "reactstrap";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../../../assets/images/calendar.svg";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import {
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../../helpers";
import { useState } from "react";
import Loader from "../../../../../components/custom/CustomSpinner";
import FacilityOnboardingServices from "../../../../../services/FacilityOnboardingServices";
import { ProfessionalOnboardingDocumentType } from "../../../../../types/ProfessionalOnboardingTypes";

type ApprovedModalProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  document: ProfessionalOnboardingDocumentType;
  fetchDocuments: () => void;
  fetchList: () => void;
};

const FacilityOnboardingApprove = ({
  isOpen,
  toggle,
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  document,
  fetchDocuments,
  fetchList,
}: ApprovedModalProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(null);
  const [expiryDays, setExpiryDays] = useState<number>();

  const handleEffectiveDate = (date: Date) => {
    setEffectiveDate(date);
  };

  const handleApprove = async () => {
    if (!effectiveDate) {
      return showToast("error", "Please select a date");
    }

    if (document.IsRequired === false && !expiryDays) {
      return showToast("error", "Please add expiry days");
    }

    setLoading("loading");
    try {
      const res = await FacilityOnboardingServices.verifyJobComplianceDocument({
        jobId: jobId,
        facilityId: facilityId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        documentId: document.Id,
        data: {
          approved: true,
          effectiveApprovalDate: effectiveDate
            ? formatDate(effectiveDate?.toString())
            : "",
          expiryDays: document.IsRequired === false ? expiryDays : undefined,
        },
      });
      if (res.status === 200) {
        showToast(
          "success",
          res.data.message || "Document approved successfully"
        );
        fetchDocuments();
        fetchList();
        setLoading("idle");
        toggle();
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "Something went wrong");
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        style={{ width: "25%" }}
      >
        {/* <ModalHeader toggle={toggle}>Confirm Approval</ModalHeader> */}
        <ModalBody style={{ display: "flex", justifyContent: "center" }}>
          <Form>
            <Row>
              <Col md="12" className="col-group">
                <div className="modal-content-center">
                  <h5
                    className="text-center mb-3"
                    style={{ textAlign: "center", marginTop: "10px" }}
                  >
                    Confirm Approval
                  </h5>
                  <p className="edu-card-content text-gery">
                    Add effective date to approve this document.
                  </p>
                  <div className="date-range">
                    <ReactDatePicker
                      minDate={new Date()}
                      dateFormat={"dd-MM-yyyy"}
                      isClearable={true}
                      placeholderText="--"
                      onChange={handleEffectiveDate}
                      selected={effectiveDate}
                      customInput={
                        <div className="custom-calendar-wrapper">
                          <CustomInput
                            placeholder="Select Date"
                            value={
                              effectiveDate && effectiveDate
                                ? formatDateInDayMonthYear(
                                    effectiveDate?.toString()
                                  )
                                : ""
                            }
                          />
                          {!effectiveDate && (
                            <img src={Calendar} className="calendar-icon" />
                          )}
                        </div>
                      }
                    />
                  </div>

                  {document.IsRequired === false && (
                    <div className="date-range mt-4">
                      <CustomInput
                        type="number"
                        placeholder="Expiry Days"
                        value={expiryDays}
                        onChange={(e: { target: { value: any } }) =>
                          setExpiryDays(e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <div style={{ marginBottom: " 10px" }}>
              <CustomButton className="primary-btn" onClick={handleApprove}>
                Confirm{" "}
              </CustomButton>
              <CustomButton className="secondary-btn" onClick={toggle}>
                Cancel
              </CustomButton>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default FacilityOnboardingApprove;
