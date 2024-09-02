import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomSelect from "../../../../components/custom/CustomSelect";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Calendar from "../../../../assets/images/calendar.svg";
import { useForm } from "react-hook-form";
import { LicenseModalType } from "../../../../types/ProfessionalDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { LicenseModalSchema } from "../../../../helpers/schemas/LicenseModalSchema";
import { formatDateInDayMonthYear, showToast } from "../../../../helpers";
import { SelectOption } from "../../../../types/FacilityTypes";
import { getProfessionalStates } from "../../../../services/ProfessionalAuth";
import { createLicence } from "../../../../services/ProfessionalMyProfile";
import Loader from "../../../../components/custom/CustomSpinner";
import { Form } from "react-router-dom";
import { ProfessionalLicenseModalProps } from "../../../../types/ProfessionalMyProfile";

const ProfessionalLicenseModal = ({
  isOpen,
  toggle,
  fetch,
  setFetchDetails,
}: ProfessionalLicenseModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LicenseModalType>({
    resolver: yupResolver(LicenseModalSchema) as any,
  });

  const [states, setStates] = useState<
    { Id: number; State: string; Code: string }[]
  >([]);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [compactStatus, setCompactStatus] = useState<string>("");

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleCompactStatus = (value: string) => setCompactStatus(value);

  const fetchState = async () => {
    try {
      setLoading("loading");
      const response = await getProfessionalStates();
      setStates(response.data?.data);
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
  useEffect(() => {
    fetchState();
  }, []);

  const handleStateChange = (selectedOption: SelectOption | null) => {
    setSelectedState(
      selectedOption && {
        value: selectedOption?.value,
        label: selectedOption?.label,
      }
    );
  };

  const onSubmit = async (data: LicenseModalType) => {
    const { name, licenseNumber } = data;

    try {
      if (!selectedState) {
        return showToast("error", "Please select license state");
      }

      if (!startDate) {
        return showToast("error", "Please select expiration date");
      }

      if (!compactStatus) {
        return showToast("error", "Please select compact status");
      }

      setLoading("loading");
      await createLicence(
        name,
        licenseNumber,
        startDate && startDate
          ? moment(startDate?.toString()).format("YYYY-MM-DD")
          : "",
        compactStatus === "true" ? true : false,
        selectedState?.value
      );
      // showToast(
      //   "success",
      //   "License created successfully" || response.data?.message
      // );
      if (fetch && toggle) {
        fetch();
        setFetchDetails && setFetchDetails((prev) => !prev);
        toggle();
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
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle} className="text-header ps-4">
          Add License
        </ModalHeader>
        <ModalBody style={{ padding: "20px 30px", height: "auto" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="license_type">
                    License Type <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    type="text"
                    placeholder="License Type"
                    id="license_type"
                    invalid={!!errors.name}
                    {...register("name")}
                  />
                  <FormFeedback>{errors.name?.message}</FormFeedback>
                </FormGroup>
              </Col>
              <Col sm="6">
                <div className="mb-3">
                  <Label for="state_drp">
                    License State <span className="asterisk">*</span>
                  </Label>
                  <CustomSelect
                    className="mb-3"
                    value={selectedState}
                    onChange={(state) => handleStateChange(state)}
                    options={states?.map(
                      (state: {
                        Id: number;
                        State: string;
                        Code: string;
                      }): { value: number; label: string } => ({
                        value: state?.Id,
                        label: `${state?.State} (${state?.Code})`,
                      })
                    )}
                    placeholder="License State"
                    noOptionsMessage={(): string => "No State Found"}
                    isSearchable={true}
                    isClearable={true}
                    id={"state_drp"}
                    name={"state_drp"}
                  />
                </div>
              </Col>
              <Col xl="6" lg="6" sm="6">
                <FormGroup>
                  <Label for="license_type">
                    Number <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    type="text"
                    placeholder="License Number"
                    id="license_type"
                    invalid={!!errors.licenseNumber}
                    {...register("licenseNumber")}
                  />
                  <FormFeedback>{errors.licenseNumber?.message}</FormFeedback>
                </FormGroup>
              </Col>
              <Col xl="3" lg="6" sm="6">
                <div className="accented-date-picker mb-3">
                  <Label className="">
                    Date Started <span className="asterisk">*</span>
                  </Label>
                  <ReactDatePicker
                    dateFormat={"dd-MM-yyyy"}
                    isClearable={true}
                    placeholderText="--"
                    onChange={handleStartDateChange}
                    selected={startDate}
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          placeholder="Expiration Date"
                          value={
                            startDate && startDate
                              ? formatDateInDayMonthYear(startDate?.toString())
                              : ""
                          }
                        />
                        {!startDate && (
                          <img src={Calendar} className="calendar-icon" />
                        )}
                      </div>
                    }
                  />
                </div>
              </Col>
              <Col xl="3" lg="6" sm="6">
                <div className="mb-3">
                  <Label className="">Active Compact Status</Label>
                  <div
                    className="d-flex mt-2 purple-radio-btn"
                    style={{ gap: "10px 16px" }}
                  >
                    <FormGroup check>
                      <Input
                        name="active_compact_status"
                        type="radio"
                        id="compact_status1"
                        onChange={() => handleCompactStatus("true")}
                      />{" "}
                      <Label check for="compact_status1">
                        {" "}
                        Yes{" "}
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Input
                        name="active_compact_status"
                        type="radio"
                        id="compact_status2"
                        onChange={() => handleCompactStatus("false")}
                      />{" "}
                      <Label check for="compact_status2">
                        {" "}
                        No{" "}
                      </Label>
                    </FormGroup>
                  </div>
                </div>
              </Col>
              <Col sm={12}>
                <div
                  className="d-flex align-items-center mb-2"
                  style={{ gap: "12px" }}
                >
                  <Button className="blue-gradient-btn mb-0">Save</Button>
                </div>
              </Col>
              {/* <Col sm="12">
                <div className="talent-file-picker">
                    <FormGroup>
                    <div className="file-picker-wrapper">
                        <div className="file-picker-label-wrapper">
                        <Label for="exampleFile" className="file-picker-label">
                            Upload File
                        </Label>
                        </div>
                    
                        <p className="file-para">
                        Supported Formats: doc, docx, pdf, upto 2 MB
                        </p>
                        <CustomInput
                        id="exampleFile"
                        value=""
                        type="file"
                        accept=".doc, .docx, .pdf, .heic, .jpeg, .jpg, .png"
                        style={{ display: "none" }}
                        
                        />
                    </div>
                    </FormGroup>
                </div>
            </Col>
            <Col sm={12}>
                <div className="mb-3">
                    <Button outline className="purple-outline-btn mb-0 sm-height">Add More Licenses</Button>  
                </div> 
            </Col> */}
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProfessionalLicenseModal;
