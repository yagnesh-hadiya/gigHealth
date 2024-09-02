import { Modal, ModalHeader, ModalBody, Label, Button } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import ReactDatePicker from "react-datepicker";
import { useState } from "react";
import moment from "moment";
import Calendar from "../../../assets/images/calendar.svg";
import CustomSelect from "../../../components/custom/CustomSelect";
import { timeOptions } from "../../facilities/facilitylisting/jobs/modals/ApplyProfessionalModal";
import { SelectOption } from "../../../types/FacilityTypes";
import CustomMultiDatePicker from "../../../components/custom/CustomMultiDatePicker";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import { useParams } from "react-router-dom";
import { applyTalentProfessional } from "../../../services/TalentJobs";
import { ConfirmApplyModalProps } from "../../../types/TalentJobs";

const ConfirmApplyModal = ({
  isOpen,
  toggle,
  setFetchDetails,
  toggleThankYouModal,
  toggleDocModal,
}: ConfirmApplyModalProps) => {
  const [startDate, setstartDate] = useState<Date | null>(null);
  const [timeOffRequest, setTimeOffRequest] = useState<string[]>([]);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [bestTimeToSpeak, setBestTimeToSpeak] = useState<SelectOption | null>(
    null
  );
  const params = useParams();
  const jobId = Number(params?.Id);
  toggleDocModal && toggleDocModal();

  const handleDate = (data: any, e: any) => {
    if (e.isTyping) {
      setTimeOffRequest([]);
    } else if (data.length <= 10) {
      const result = data?.map((date: any) =>
        moment(`${date.year}-${date.month.number}-${date.day}`).format(
          "MM-DD-YYYY"
        )
      );
      setTimeOffRequest(result);
    } else {
      const updatedDates = timeOffRequest.slice(0, 10);
      setTimeOffRequest(updatedDates);
      showToast("error", "Maximum 10 days can be selected");
    }
  };

  const onSubmit = async () => {
    const formattedTime = moment(
      `${bestTimeToSpeak?.label}`,
      "HH:mm:ss"
    ).format("HH:mm:ss");

    if (!startDate) {
      return showToast("error", "Please select start date");
    }

    // if (!timeOffRequest || timeOffRequest.length < 1) {
    //   return showToast("error", "Please select time off request");
    // }

    if (
      timeOffRequest &&
      timeOffRequest.length > 0 &&
      timeOffRequest.some((date) => moment(date) < moment(startDate))
    ) {
      return showToast(
        "error",
        "Time off request dates cannot be before the start date"
      );
    }

    if (!bestTimeToSpeak) {
      return showToast("error", "Please select best time to speak");
    }
    try {
      setLoading("loading");
      const applyTalentProfessionalData = {
        startDate: moment(startDate).format("YYYY-MM-DD"),
        requestTimeOff:
          timeOffRequest && timeOffRequest.length > 0
            ? timeOffRequest?.map((date: any) =>
                moment(date).format("YYYY-MM-DD")
              )
            : [],
        bestTimeToSpeak: formattedTime,
      };
      const response = await applyTalentProfessional(
        jobId,
        applyTalentProfessionalData
      );
      if (response.status === 200) {
        showToast("success", "Job applied successfully");
        toggle();
        setFetchDetails && setFetchDetails((prev) => !prev);
        toggleThankYouModal && toggleThankYouModal();
        setBestTimeToSpeak(null);
        setstartDate(null);
        setTimeOffRequest([]);
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <div>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          centered={true}
          size="md"
          wrapClassName="talent-modal-wrapper"
        >
          <ModalHeader toggle={toggle}>Confirm Apply</ModalHeader>
          <ModalBody
            className="dark-modal-body"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="confirm-apply-mdl-wr">
              <div className="accented-date-picker mb-3">
                <Label className="">Available Start Date</Label>
                <span className="asterisk">*</span>
                <ReactDatePicker
                  selected={startDate}
                  minDate={new Date()}
                  onChange={(date) => setstartDate(date)}
                  isClearable={true}
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  className="custom-select-picker-all contract-select"
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        value={
                          startDate
                            ? moment(startDate.toDateString()).format(
                                "MM-DD-YYYY"
                              )
                            : ""
                        }
                        placeholder="Available Start Date"
                      />
                      {!startDate && (
                        <img src={Calendar} className="calendar-icon" />
                      )}
                    </div>
                  }
                />
              </div>

              <div className="mb-3">
                <Label className="">Requested Time Off</Label>{" "}
                <CustomMultiDatePicker
                  value={timeOffRequest}
                  onChangeDate={handleDate}
                  minDate={startDate}
                  startDate={startDate}
                />
              </div>

              <div className="mb-3">
                <Label for="best_time_to_speak" style={{ display: "inline" }}>
                  Best time to speak with a member of our Program Team to review
                  your application. <span>(EST Time Zone)</span>
                </Label>
                <span className="asterisk">*</span>
                <CustomSelect
                  id="best_time_to_speak"
                  name="best_time_to_speak"
                  value={bestTimeToSpeak}
                  placeholder="Select Time"
                  onChange={(time) => setBestTimeToSpeak(time)}
                  noOptionsMessage={(): string => "No Time Found"}
                  options={timeOptions}
                  isClearable={true}
                  isSearchable={true}
                />
              </div>
              <div className="modal-btn-wr mb-3 pt-1">
                <Button
                  className="yellow-btn me-3 mb-0"
                  style={{ height: "34px" }}
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  Confirm & Apply
                </Button>
                <Button
                  outline
                  className="purple-outline-btn mb-0 mobile-btn"
                  style={{ width: "120px" }}
                  onClick={toggle}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default ConfirmApplyModal;
