import { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import ConfirmModal from "../mainHome/ConfirmModal";
import {
  capitalize,
  formatDateString,
  formatPhoneNumber,
  showToast,
} from "../../../helpers";
import moment from "moment";
import { useSelector } from "react-redux";
import { getAuthDetails } from "../../../store/ProfessionalAuthStore";
import DeclineModal from "../mainHome/DeclineModal";
import CongratulationModal from "../mainHome/CongratulationModal";
import DeclineFinalModal from "../mainHome/DeclineFinalModal";
import { acceptJob, declineJob } from "../../../services/HomeServices";
interface propsOfferDetails {
  isOpen: boolean;
  toggle: () => void;
  offeredData?: OfferedList;
}

const OfferDetailsModal = ({
  isOpen,
  toggle,
  offeredData,
}: propsOfferDetails) => {
  const authDetails = useSelector(getAuthDetails);
  const [modal, setModal] = useState<boolean>(false);
  const [declineModal, setDeclineModal] = useState<boolean>(false);
  const [finalModal, setFinalModal] = useState<boolean>(false);
  const [finalDeclineModal, setFinalDeclineModal] = useState<boolean>(false);
  const handleConfirmModal = () => {
    setModal((prev) => !prev);
  };
  const handleDeclineModal = () => {
    setDeclineModal((prev) => !prev);
  };

  const handleSubmitAccept = async () => {
    try {
      const response = await acceptJob(
        offeredData?.Job?.Id ?? 0,
        offeredData?.JobApplicationId ?? 0,
        offeredData?.Id ?? 0
      );
      if (response.status === 200) {
        setFinalModal((prev) => !prev);
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleSubmitDecline = async () => {
    try {
      const response = await declineJob(
        offeredData?.Job?.Id ?? 0,
        offeredData?.JobApplicationId ?? 0,
        offeredData?.Id ?? 0
      );
      if (response.status === 200) {
        setFinalDeclineModal((prev) => !prev);
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  const titleMessage = (val: string) => {
    if (val === "Offered") {
      return `Congratulations, you received an offer from ”${capitalize(
        offeredData?.Facility?.Name ?? ""
      )}”`;
    } else if (val === "Extension Offered") {
      return `You received an offer from ”${capitalize(
        offeredData?.Facility?.Name ?? ""
      )}”`;
    } else if (val === "Pending Updated Placement") {
      return `You received a pending updated placement from ”${capitalize(
        offeredData?.Facility?.Name ?? ""
      )}”`;
    } else if (val === "Pending Updated Extension Placement") {
      return `You received a pending updated extension placement from ”${capitalize(
        offeredData?.Facility?.Name ?? ""
      )}”`;
    }
  };
  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        wrapClassName="talent-modal-wrapper offer-details"
        scrollable={true}
      >
        <ModalHeader toggle={toggle}>Offer Details</ModalHeader>
        <ModalBody className="offer-details-mdl-body">
          <div className="offer-details-mdl-wrapper">
            <p className="mdl-purple-text">
              {titleMessage(offeredData?.JobApplicationStatus?.Status ?? "")}
            </p>
            <div className="offer-details-flex">
              <div className="common-details left-side">
                <p className="side-title mb-2">Job Details</p>
                <div className="d-flex mobile-wrap m-b-12 align-items-center gap-10">
                  <p
                    className="mdl-purple-text text-start mb-0 text-capitalize"
                    style={{ fontSize: "18px", letterSpacing: "-0.01em" }}
                  >
                    {offeredData?.Job?.Title}
                  </p>
                  <div className="list-badge me-2">
                    Job ID: {offeredData?.Id}
                  </div>
                </div>
                <div className="information-flex">
                  <div className="info-wr">
                    <p className="key">Facility Name</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">
                        corporate_fare
                      </span>
                      <p className="value text-capitalize">
                        {offeredData?.Facility?.Name}
                      </p>
                    </div>
                  </div>
                  <div className="info-wr">
                    <p className="key">Location</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      <p className="value  text-capitalize">
                        {offeredData?.Facility?.Address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="information-flex">
                  <div className="info-wr">
                    <p className="key">Start & End Date</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">today</span>
                      <p className="value">
                        {formatDateString(offeredData?.StartDate ?? "")} -{" "}
                        {formatDateString(offeredData?.EndDate ?? "")}
                      </p>
                    </div>
                  </div>
                  <div className="info-wr">
                    <p className="key">Shift Details</p>
                    <div className="d-flex flex-wrap align-items-center gap-8">
                      <div className="d-flex align-items-center gap-10">
                        <span className="material-symbols-outlined">
                          light_mode
                        </span>
                        <p className="value">
                          {offeredData?.JobShift?.Shift} Shift
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-10">
                        <span className="material-symbols-outlined">
                          schedule
                        </span>
                        <p className="value">
                          {offeredData?.ShiftStartTime
                            ? moment(
                                offeredData?.ShiftStartTime,
                                "HH:mm:ss"
                              ).format("h:mm A")
                            : "-"}{" "}
                          -{" "}
                          {offeredData?.ShiftEndTime
                            ? moment(
                                offeredData?.ShiftEndTime,
                                "HH:mm:ss"
                              ).format("h:mm A")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="information-flex">
                  <div className="info-wr">
                    <p className="key">Hours Per Week</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">
                        schedule
                      </span>
                      <p className="value">{offeredData?.TotalHrs} Hours</p>
                    </div>
                  </div>
                  <div className="info-wr">
                    <p className="key">Guaranteed Hours</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">
                        schedule
                      </span>
                      <p className="value">
                        {offeredData?.GauranteedHrs} Hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className="information-flex">
                  <div className="info-wr">
                    <p className="key">Duration</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                      <p className="value">
                        {offeredData?.Job?.ContractLength ?? "-"} Weeks
                      </p>
                    </div>
                  </div>
                  <div className="info-wr">
                    <p className="key">Approved Time Off</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">today</span>
                      {offeredData &&
                      offeredData?.JobRequestingTimeOffs &&
                      offeredData?.JobRequestingTimeOffs?.length > 0 ? (
                        <p className="value">
                          {offeredData?.JobRequestingTimeOffs
                            ? offeredData.JobRequestingTimeOffs.map(
                                (item: { Date: moment.MomentInput }) =>
                                  moment(item.Date).format("MM-DD-YYYY")
                              ).join(", ")
                            : "-"}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="information-flex">
                  <div className="info-wr">
                    <p className="key">Profession</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">badge</span>
                      <p className="value">
                        {offeredData?.JobProfession?.Profession}
                      </p>
                    </div>
                  </div>
                  <div className="info-wr">
                    <p className="key">Specialty</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">grade</span>
                      <p className="value">
                        {offeredData?.JobSpeciality?.Speciality}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="information-flex">
                  <div className="info-wr">
                    <p className="key">Unit</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">living</span>
                      <p className="value">{offeredData?.Unit}</p>
                    </div>
                  </div>
                  <div className="info-wr">
                    <p className="key">Compliance Due Date</p>
                    <div className="d-flex align-items-center gap-8">
                      <span className="material-symbols-outlined">today</span>
                      <p className="value">
                        {formatDateString(offeredData?.ComplianceDueDate ?? "")}
                      </p>
                    </div>
                  </div>
                </div>
                {authDetails && authDetails[0]?.ProgramManager && (
                  <div
                    className="information-flex"
                    style={{ gridTemplateColumns: "100%" }}
                  >
                    <div className="info-wr">
                      <p className="key">Program Manager</p>
                      <div className="d-flex align-items-center gap-10-20 flex-wrap">
                        <div className="d-flex align-items-center gap-10">
                          <span className="material-symbols-outlined">
                            person
                          </span>
                          <p className="value">
                            {capitalize(
                              authDetails[0]?.ProgramManager.FirstName +
                                " " +
                                authDetails[0]?.ProgramManager.LastName
                            )}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-10">
                          <span className="material-symbols-outlined">
                            call
                          </span>
                          <p className="value">
                            {formatPhoneNumber(
                              authDetails[0]?.ProgramManager.Phone
                            )}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-10">
                          <span className="material-symbols-outlined">
                            mail
                          </span>
                          <p className="value">
                            {authDetails[0]?.ProgramManager.Email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {authDetails && authDetails[0]?.EmploymentExpert && (
                  <div
                    className="information-flex mb-0 pb-0 border-0"
                    style={{ gridTemplateColumns: "100%" }}
                  >
                    <div className="info-wr">
                      <p className="key">Employment Expert</p>
                      <div className="d-flex align-items-center gap-10-20 flex-wrap">
                        <div className="d-flex align-items-center gap-10">
                          <span className="material-symbols-outlined">
                            person
                          </span>
                          <p className="value">
                            {capitalize(
                              authDetails[0]?.EmploymentExpert.FirstName +
                                " " +
                                authDetails[0]?.EmploymentExpert.LastName
                            )}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-10">
                          <span className="material-symbols-outlined">
                            call
                          </span>
                          <p className="value">
                            {formatPhoneNumber(
                              authDetails[0]?.EmploymentExpert.Phone
                            )}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-10">
                          <span className="material-symbols-outlined">
                            mail
                          </span>
                          <p className="value">
                            {authDetails[0]?.EmploymentExpert.Email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="common-details right-side">
                <p className="side-title mb-2">Pay Package</p>
                <p
                  className="mdl-purple-text text-start m-b-12"
                  style={{ fontSize: "22px", letterSpacing: "-0.01em" }}
                >
                  ${offeredData?.TotalGrossPay.toFixed(2)}
                  <span style={{ fontSize: "14px", fontWeight: "400" }}>
                    /week
                  </span>
                </p>

                <div className="listing-wrapper">
                  <div className="listing-flex">
                    <p>Regular Hourly Rate</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.RegularRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="listing-flex">
                    <p>Overtime Hourly Rate</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.OvertimeRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="listing-flex">
                    <p>Lodging Stipend</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.HousingStipend.toFixed(2)}
                    </p>
                  </div>
                  <div className="listing-flex">
                    <p>Meals & Incidentals Stipend</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.MealsAndIncidentials.toFixed(2)}
                    </p>
                  </div>
                  <div className="listing-flex">
                    <p>Holiday Rate</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.HolidayRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="listing-flex">
                    <p>On-Call Rate</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.OnCallRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="listing-flex">
                    <p>Call Back Rate</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.CallbackRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="listing-flex border-0">
                    <p>Travel Reimbursement</p>
                    <p style={{ fontWeight: "600" }}>
                      ${offeredData?.TravelReimbursement?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="button-wrapper">
                  <Button
                    className="green-btn me-3 mb-3 w-100"
                    onClick={handleConfirmModal}
                  >
                    Accept Offer
                  </Button>
                  <Button
                    outline
                    className="red-outline-btn mb-2 w-100"
                    onClick={handleDeclineModal}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {modal && (
        <ConfirmModal
          isOpen={modal}
          toggle={() => setModal((prev) => !prev)}
          onSubmit={handleSubmitAccept}
        />
      )}
      {finalModal && (
        <CongratulationModal
          isOpen={finalModal}
          toggle={() => {
            setFinalModal((prev) => !prev);
            setModal((prev) => !prev);
            toggle();
          }}
        />
      )}
      {declineModal && (
        <DeclineModal
          isOpen={declineModal}
          toggle={() => setDeclineModal((prev) => !prev)}
          onSubmit={() => handleSubmitDecline()}
        />
      )}
      {finalDeclineModal && (
        <DeclineFinalModal
          isOpen={finalDeclineModal}
          toggle={() => {
            setDeclineModal((prev) => !prev);
            setFinalDeclineModal((prev) => !prev);
            toggle();
          }}
        />
      )}
    </div>
  );
};

export default OfferDetailsModal;
