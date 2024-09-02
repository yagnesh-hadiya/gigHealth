import { Row, Col, Label } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import Calendar from "../../../../../assets/images/calendar.svg";
import ReactDatePicker from "react-datepicker";
import { useState } from "react";
import { Form } from "react-router-dom";

const AssignmentContent = () => {
  const [selectedShift] = useState({ value: 1, label: "Day" });

  const shift = [
    { value: 1, label: "Day" },
    { value: 2, label: "Night" },
  ];

  return (
    <>
      <div className="offer-wrapper">
        <Form>
          <Row>
            <h6>Job Shared Details</h6>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Facility Name</Label>
              <CustomInput value="American Health Center" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Facility Location</Label>
              <CustomInput value="New American Health, NY" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Facility Address</Label>
              <CustomInput
                disabled
                value="155 Willis Avenue Mac, Holly Hill, FL 31175"
              />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Program Manager</Label>
              <CustomInput disabled value="Franks Domnic" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Employment Expert</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Professional Name</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Professional Phone Number</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Professional Email Address</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Job Title</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Specialty</Label>
              <div
                className="date-range"
                style={{ backgroundColor: "#F7F8F3" }}
              >
                <CustomInput value="Mike Williams" disabled />
              </div>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Profession</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Unit</Label>
              <CustomInput placeholder="" disabled value="-" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Shift</Label>
              <CustomSelect
                id="paymentterm"
                name="paymentterm"
                options={shift.map((type) => ({
                  label: type.label,
                  value: type.value,
                }))}
                noOptionsMessage={() => "No options available"}
                placeholder=""
                value={selectedShift}
                onChange={(option) => {
                  console.log(option);
                }}
                isDisabled={true}
              />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Start Date</Label>
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
                      <CustomInput value="01/14/2024" disabled={true} />
                      <img src={Calendar} className="calendar-icon" />
                    </div>
                  }
                />
              </div>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">End Date</Label>
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
                      <CustomInput value="01/14/2024" disabled={true} />
                      <img src={Calendar} className="calendar-icon" />
                    </div>
                  }
                />
              </div>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
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
                      <CustomInput value="01/14/2024" disabled={true} />
                      <img src={Calendar} className="calendar-icon" />
                    </div>
                  }
                />
              </div>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Regular Hours</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Overtime Hours</Label>
              <CustomInput
                disabled
                value="155 Willis Avenue Mac, Holly Hill, FL 31175"
              />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">
                Total Hours <span className="california-text">(Weekly)</span>
              </Label>
              <CustomInput disabled value="Franks Domnic" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Total Days on Assignment</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Guaranteed Hours</Label>
              <CustomInput value="Mike Williams" disabled />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
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
                      <CustomInput value="01/14/2024" disabled={true} />
                      <img src={Calendar} className="calendar-icon" />
                    </div>
                  }
                />
              </div>
            </Col>
            <Col xxl="8" xl="8" lg="4" className="col-group">
              <Label className="">Additional Notes</Label>
              <CustomInput disabled value="Franks Domnic" />
            </Col>
            <h6>Pay Details</h6>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Regular Rate</Label>
              <CustomInput placeholder="" disabled value="$ 2000.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Overtime Rate</Label>
              <CustomInput placeholder="" disabled value="$ 25.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">
                Double Time Rate{" "}
                <span className="california-text">(California Only)</span>
              </Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Holiday Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Charge Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">On-Call Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Callback Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">
                Meals & Incidentals Stipend{" "}
                <span className="california-text">(Weekly)</span>
              </Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">
                Lodging Stipend{" "}
                <span className="california-text">(Weekly)</span>
              </Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <h6>Billing Details</h6>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Bill Rate</Label>
              <CustomInput placeholder="" disabled value="$ 2000.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Overtime Bill Rate</Label>
              <CustomInput placeholder="" disabled value="$ 25.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">
                Double Time Rate{" "}
                <span className="california-text">(California Only)</span>
              </Label>
              <CustomInput placeholder="" disabled value="$ 35.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Holiday Bill Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Charge Bill Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">Callback Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">On-Call Bill Rate</Label>
              <CustomInput placeholder="" disabled value="$200.00" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">
                Cost Center{" "}
                <span className="california-text">(If applicable)</span>
              </Label>
              <CustomInput placeholder="" disabled value="" />
            </Col>
            <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
              <Label className="">
                Client Req ID #{" "}
                <span className="california-text">(If applicable)</span>
              </Label>
              <CustomInput placeholder="" disabled value="" />
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AssignmentContent;
