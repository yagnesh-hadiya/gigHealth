import { Row, Col, Label } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import CustomDatePicker from "../../../../../components/custom/CustomDatePicker";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import { formatDate, formatPhoneNumber } from "../../../../../helpers";
import Loader from "../../../../../components/custom/CustomSpinner";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import CustomBooleanSelect from "../../../../../components/custom/CustomBooleanSelect";
import { fetchGetJobSubmission } from "../../../../../services/ApplicantsServices";
import moment from "moment";

type ReadOnlyCoverPageDetailsTypes = {
  currentApplicantId: number;
  facilityId: number;
  jobId: number;
  professionalId: number;
  toggle: () => void;
  professionalDetails: ProfessionalDetails | null;
  job: RightJobContentData;
};

type JobShift = {
  Id: number;
  Shift: string;
};

type SubmittedByUser = {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
};

type JobRequestingTimeOff = {
  Id: number;
  Date: string;
};

export type JobSubmission = {
  Id: number;
  Unit: string;
  AvailableStartDate: string;
  TotalYoe: number;
  TotalYoeInUnit: number;
  TravelExperience: boolean;
  TraumeExperience: boolean;
  TeachingHospitalExperience: boolean;
  EmrExperience: boolean;
  Notes: string;
  RemoveLogo: boolean;
  AddSsn: boolean;
  AddDob: boolean;
  IsPdfGenerated: boolean;
  IsPdfGenerationStarted: boolean;
  IsPdfGeneartionFailed: boolean;
  JobShift: JobShift;
  SubmittedByUser: SubmittedByUser;
  JobRequestingTimeOffs: JobRequestingTimeOff[];
};

const ReadOnlyCoverPageDetails = ({
  currentApplicantId,
  facilityId,
  jobId,
  professionalId,
  job,
  toggle,
  professionalDetails,
}: ReadOnlyCoverPageDetailsTypes) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [submission, setSubmission] = useState<JobSubmission | null>(null);

  const fetch = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await fetchGetJobSubmission({
        facilityId: facilityId,
        jobId: jobId,
        professionalId: professionalId,
        currentApplicantId: currentApplicantId,
      });
      if (res.status === 200) {
        setSubmission(res.data.data[0]);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
    }
  }, [facilityId, jobId, professionalId, currentApplicantId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      {professionalDetails === null && loading === "loading" && <Loader />}
      <div className="offer-wrapper px-4">
        <Form>
          <Row>
            <h5>Candidate Information</h5>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">First Name</Label>
              <CustomInput
                className="text-capitalize"
                value={
                  professionalDetails?.FirstName
                    ? professionalDetails?.FirstName
                    : ""
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Last Name</Label>
              <CustomInput
                className="text-capitalize"
                value={
                  professionalDetails?.LastName
                    ? professionalDetails?.LastName
                    : ""
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Phone Number</Label>
              <CustomInput
                disabled
                value={formatPhoneNumber(
                  professionalDetails?.Phone ? professionalDetails?.Phone : ""
                )}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Email Address</Label>
              <CustomInput
                value={
                  professionalDetails?.Email ? professionalDetails?.Email : ""
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">SSN#</Label>
              <CustomInput
                value={professionalDetails?.Ssn ? professionalDetails?.Ssn : ""}
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Date Of Birth</Label>
              <CustomDatePicker
                value={
                  professionalDetails?.Dob
                    ? formatDate(professionalDetails?.Dob)
                    : ""
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Address</Label>
              <CustomInput
                className="text-capitalize"
                value={
                  professionalDetails?.Address
                    ? professionalDetails?.Address
                    : ""
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="2" lg="6" md="6" className="col-group">
              <Label className="">State</Label>

              <CustomInput
                value={
                  professionalDetails?.State
                    ? professionalDetails?.State.State
                    : ""
                }
                disabled
              />
            </Col>
            <Col xxl="2" xl="2" lg="6" md="6" className="col-group">
              <Label className="">City</Label>
              <CustomInput
                value={
                  professionalDetails?.City
                    ? professionalDetails?.City.City
                    : ""
                }
                disabled
              />
            </Col>
            <Col xxl="2" xl="2" lg="6" md="6" className="col-group">
              <Label className="">Zip Code</Label>
              <CustomInput
                value={
                  professionalDetails?.ZipCode
                    ? professionalDetails?.ZipCode.ZipCode
                    : ""
                }
                disabled
              />
            </Col>

            <h6>Submission Information</h6>
            <Col xxl="8" xl="8" lg="6" md="6" className="col-group">
              <Label className="">Facility Submitting To</Label>
              <CustomInput
                className="text-capitalize"
                value={job.Facility ? job.Facility.Name : ""}
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Unit</Label>
              <CustomInput
                className="text-capitalize"
                value={submission?.Unit ? submission?.Unit : ""}
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Available Start Date</Label>
              <CustomInput
                value={
                  submission?.AvailableStartDate &&
                  submission?.AvailableStartDate
                    ? formatDate(submission?.AvailableStartDate?.toString())
                    : ""
                }
                disabled
              />
              {/* <ReactDatePicker
                dateFormat={"dd-MM-yyyy"}
                isClearable={true}
                placeholderText="--"
                onChange={handleStartDateChange}
                minDate={new Date()}
                selected={startDate}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      placeholder="Select Date"
                      value={
                        startDate && startDate
                          ? formatDate(startDate?.toString())
                          : ""
                      }
                    />
                    {!startDate && (
                      <img src={Calendar} className="calendar-icon" />
                    )}
                  </div>
                }
              /> */}
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Shift</Label>
              <CustomInput
                value={submission?.JobShift ? submission?.JobShift.Shift : ""}
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Requesting Time Off</Label>
              <CustomInput
                value={
                  submission?.JobRequestingTimeOffs &&
                  submission?.JobRequestingTimeOffs.length > 0
                    ? submission?.JobRequestingTimeOffs?.map((date) =>
                        moment(date.Date).format("MM-DD-YYYY")
                      )
                    : ""
                }
                disabled
              />
            </Col>

            <h6>Candidate Summary</h6>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Total Years of Experience</Label>
              <CustomInput
                value={submission?.TotalYoe ? submission?.TotalYoe : ""}
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Years of Experience in Unit Submitting</Label>
              <CustomInput
                value={
                  submission?.TotalYoeInUnit ? submission?.TotalYoeInUnit : ""
                }
                disabled
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Travel Experience</Label>
              <CustomBooleanSelect
                isDisabled={true}
                id="travel-experience"
                name="travel-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder=""
                value={
                  submission?.TravelExperience
                    ? {
                        value: true,
                        label: "Yes",
                      }
                    : {
                        value: false,
                        label: "No",
                      }
                }
                onChange={(option) => console.log(option)}
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Trauma Experience</Label>
              <CustomBooleanSelect
                isDisabled={true}
                id="trauma-experience"
                name="trauma-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder=""
                value={
                  submission?.TraumeExperience
                    ? { value: true, label: "Yes" }
                    : { value: false, label: "No" }
                }
                onChange={(option) => console.log(option)}
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Teaching Hospital Experience</Label>
              <CustomBooleanSelect
                isDisabled={true}
                id="teaching-hospital-experience"
                name="teaching-hospital-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder=""
                value={
                  submission?.TeachingHospitalExperience
                    ? { value: true, label: "Yes" }
                    : { value: false, label: "No" }
                }
                onChange={(option) => console.log(option)}
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">EMR Experience</Label>
              <CustomBooleanSelect
                isDisabled={true}
                id="emr-experience"
                name="emr-experience"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                placeholder=""
                value={
                  submission?.EmrExperience
                    ? { value: true, label: "Yes" }
                    : { value: false, label: "No" }
                }
                onChange={(option) => console.log(option)}
                noOptionsMessage={() => "No Category Found"}
              />
            </Col>
          </Row>
          <div>
            <h6>Additional Notes</h6>
          </div>
          <Row>
            <Col xxl="12" xl="12" lg="12" className="col-group">
              <Label className="">Notes</Label>
              <CustomTextArea
                disabled
                className="text-capitalize"
                value={submission?.Notes ? submission?.Notes : ""}
              />
            </Col>
          </Row>
        </Form>

        <div style={{ marginLeft: "0px" }}>
          {/* <CustomButton
            className="primary-btn ms-0"
            style={{ marginLeft: "0px" }}
            onClick={toggle}
          >
            Generate Submission
          </CustomButton> */}
          {/* <CustomButton className="primary-btn">Submit</CustomButton> */}
          <CustomButton className="secondary-btn" onClick={toggle}>
            Cancel
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default ReadOnlyCoverPageDetails;
