import { Form } from "react-router-dom";
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomButton from "../../../../../components/custom/CustomBtn";
import {
  customStyles,
  formatDateInDayMonthYear,
  formatDateByYearMonthDate,
  showToast,
} from "../../../../../helpers";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import CustomInput from "../../../../../components/custom/CustomInput";
import Calendar from "../../../../../assets/images/calendar.svg";
import ProfessionalSelect from "./ProfessionalSelect";
import { applyProfessional } from "../../../../../services/ProfessionalServices";
import { toast } from "react-toastify";
// import DatePicker from "react-multi-date-picker";
import CustomMultiDatePicker from "../../../../../components/custom/CustomMultiDatePicker";
import moment from "moment";
import Loader from "../../../../../components/custom/CustomSpinner";

type ApplyProfessionalModalProps = {
  modal: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
};

export const timeOptions = [
  { value: 0, label: "00:00" },
  { value: 0.3, label: "00:30" },
  { value: 1, label: "01:00" },
  { value: 1.3, label: "01:30" },
  { value: 2, label: "02:00" },
  { value: 2.3, label: "02:30" },
  { value: 3, label: "03:00" },
  { value: 3.3, label: "03:30" },
  { value: 4, label: "04:00" },
  { value: 4.3, label: "04:30" },
  { value: 5, label: "05:00" },
  { value: 5.3, label: "05:30" },
  { value: 6, label: "06:00" },
  { value: 6.3, label: "06:30" },
  { value: 7, label: "07:00" },
  { value: 7.3, label: "07:30" },
  { value: 8, label: "08:00" },
  { value: 8.3, label: "08:30" },
  { value: 9, label: "09:00" },
  { value: 9.3, label: "09:30" },
  { value: 10, label: "10:00" },
  { value: 10.3, label: "10:30" },
  {
    value: 11,
    label: "11:00",
  },
  { value: 11.3, label: "11:30" },
  { value: 12, label: "12:00" },
  { value: 12.3, label: "12:30" },
  { value: 13, label: "13:00" },
  { value: 13.3, label: "13:30" },
  {
    value: 14,
    label: "14:00",
  },
  { value: 14.3, label: "14:30" },
  { value: 15, label: "15:00" },
  { value: 15.3, label: "15:30" },
  { value: 16, label: "16:00" },
  { value: 16.3, label: "16:30" },
  {
    value: 17,
    label: "17:00",
  },
  { value: 17.3, label: "17:30" },
  { value: 18, label: "18:00" },
  { value: 18.3, label: "18:30" },
  { value: 19, label: "19:00" },
  { value: 19.3, label: "19:30" },
  {
    value: 20,
    label: "20:00",
  },
  { value: 20.3, label: "20:30" },
  { value: 21, label: "21:00" },
  { value: 21.3, label: "21:30" },
  { value: 22, label: "22:00" },
  { value: 22.3, label: "22:30" },
  { value: 23, label: "23:00" },
];

const ApplyProfessionalModal = ({
  modal,
  toggle,
  facilityId,
  jobId,
}: ApplyProfessionalModalProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [currentProfessional, setCurrentProfessional] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  // const [timeOffRequest, setTimeOffRequest] = useState<Date | null>(null);
  const [bestTimeToSpeak, setBestTimeToSpeak] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [timeOffRequest, setTimeOffRequest] = useState<string[]>([]);
  // const dateTimeRef = useRef<any>();

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
      const updatedDates = data.slice(0, 10);
      setTimeOffRequest(updatedDates);
      showToast("error", "Maximum 10 days can be selected");
    }
  };

  const handleApplyProfessional = async () => {
    if (!currentProfessional) {
      return showToast("error", "Please select professional");
    }

    if (!startDate) {
      return showToast("error", "Please select start date");
    }

    // if (!timeOffRequest || timeOffRequest.length < 1) {
    //   return showToast("error", "Please select time off request");
    // }

    if (!bestTimeToSpeak) {
      return showToast("error", "Please select best time to speak");
    }

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

    try {
      const formattedTime = moment(
        `${bestTimeToSpeak?.label}`,
        "HH:mm:ss"
      ).format("HH:mm:ss");

      setLoading("loading");
      const res = await applyProfessional({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: Number(currentProfessional?.value),
        startDate: formatDateByYearMonthDate(startDate?.toDateString()),
        requestTimeOff:
          timeOffRequest.length > 0
            ? timeOffRequest?.map((date: any) =>
                moment(date).format("YYYY-MM-DD")
              )
            : [],
        bestTimeToSpeak: formattedTime,
        notes: notes,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        setLoading("idle");
        toggle();
      }
    } catch (error: any) {
      setLoading("error");
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal isOpen={modal} toggle={toggle} centered={true} size="lg">
        <ModalHeader toggle={toggle}> Add Professional</ModalHeader>
        <ModalBody className="professional-modal-body h-100">
          <Form>
            <Row>
              <Col md="12" lg="12" className="col-group">
                <Label className="col-label">Select Profession</Label>
                <ProfessionalSelect
                  currentProfessional={currentProfessional}
                  setCurrentProfessional={setCurrentProfessional}
                />
              </Col>
            </Row>
            <Row>
              <Col md="6" lg="6" className="col-group">
                <Label>Start Date</Label>
                <ReactDatePicker
                  selected={startDate}
                  minDate={new Date()}
                  onChange={(date) => {
                    setStartDate(date);
                    // setTimeOffRequest(null);
                  }}
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  className="custom-select-picker-all contract-select"
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        value={
                          startDate
                            ? formatDateInDayMonthYear(startDate.toDateString())
                            : ""
                        }
                        placeholder="Start Date"
                      />
                      <img src={Calendar} className="calendar-icon" />
                    </div>
                  }
                />
              </Col>
              <Col md="6" lg="6" className="col-group">
                <Label>Time Off Request</Label>
                {/* <ReactDatePicker
                  selected={timeOffRequest}
                  minDate={
                    startDate
                      ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                  }
                  onChange={(date) => setTimeOffRequest(date)}
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="custom-select-picker-all contract-select"
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        value={
                          timeOffRequest
                            ? formatDateInDayMonthYear(
                                timeOffRequest.toDateString()
                              )
                            : ""
                        }
                        placeholder="Select Date"
                      />
                      <img src={Calendar} className="calendar-icon" />
                    </div>
                  }
                /> */}
                <CustomMultiDatePicker
                  value={timeOffRequest}
                  onChangeDate={handleDate}
                  startDate={startDate}
                  minDate={startDate}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12" className="col-group">
                <Label>
                  Best time to speak with a member of our Program Team
                </Label>
                <CustomSelect
                  id="Time"
                  name="Time"
                  styles={customStyles}
                  value={bestTimeToSpeak}
                  className="custom-select-picker-all contract-select"
                  placeholder="Select Time"
                  options={timeOptions}
                  onChange={(time) => {
                    setBestTimeToSpeak(time);
                  }}
                  isClearable={true}
                  isSearchable={true}
                  noOptionsMessage={(): string => "No Time Found"}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12" className="col-group">
                <Label>Notes</Label>
                <CustomTextArea
                  disabled={false}
                  id="notesTextArea"
                  className="fixed-height-textarea"
                  placeholder="Notes"
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNotes(e.target.value)
                  }
                />
              </Col>
            </Row>
            <div className="btn-wrapper">
              <CustomButton
                className="job-header-button me-2"
                onClick={handleApplyProfessional}
                disabled={loading === "loading"}
              >
                Apply Professional
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

export default ApplyProfessionalModal;
