import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomSelect from "../../../../components/custom/CustomSelect";
import { MouseEvent, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../../assets/images/calendar.svg";
import { Form } from "react-router-dom";
import { showToast } from "../../../../helpers";
import moment from "moment";
import {
  deleteProfessionalLicense,
  editLicence,
} from "../../../../services/ProfessionalMyProfile";
import { LicenseModalType } from "../../../../types/ProfessionalDetails";
import { SelectOption } from "../../../../types/FacilityTypes";
import { getProfessionalStates } from "../../../../services/ProfessionalAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { LicenseModalSchema } from "../../../../helpers/schemas/LicenseModalSchema";
import { useForm } from "react-hook-form";
import Loader from "../../../../components/custom/CustomSpinner";
import { ProfessionalLicenseCardProps } from "../../../../types/ProfessionalMyProfile";
import CustomDeleteBtn from "../../../../components/custom/CustomDeleteBtn";

const ProfessionalLicenseCard = ({
  Id,
  Name,
  Expiry,
  LicenseNumber,
  IsActiveCompact,
  State,
  index,
  fetch,
  setFetchDetails,
}: ProfessionalLicenseCardProps) => {
  const {
    register,
    handleSubmit,
    setValue,
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
  const [edit, setEdit] = useState<boolean>(false);

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
      await editLicence(
        Id,
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
      //   "License edited successfully" || response.data?.message
      // );
      if (fetch) {
        fetch();
        setEdit((prevEdit) => !prevEdit);
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

  const onDeleteHandler = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await deleteProfessionalLicense(Id);
      if (response.status === 200) {
        // showToast("success", "License deleted successfully");
        if (fetch) {
          fetch();
          setFetchDetails && setFetchDetails((prev) => !prev);
        }
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEditHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEdit((prevValue) => !prevValue);
  };

  useEffect(() => {
    setValue("licenseNumber", LicenseNumber);
    setValue("name", Name);
    setSelectedState({
      value: State?.Id,
      label: State?.State,
    });
    setCompactStatus(IsActiveCompact?.toString());
    setStartDate(new Date(Expiry));
  }, []);

  return (
    <>
      {loading === "loading" && <Loader />}
      <Form>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <p className="scroll-title mb-0" style={{ fontSize: "16px" }}>
            License {index ? index : ""}
          </p>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={(e) => onEditHandler(e)}
          >
            <span className="material-symbols-outlined">Edit</span>
          </Button>
          <CustomDeleteBtn
            onDelete={() => {
              if (Id) {
                onDeleteHandler(Id);
              }
            }}
          />
        </div>
        {/* <h2 className="form-small-text scroll-title mb-0">
          License {index ? index : ""}
        </h2>
        <Button
          type="button"
          className="dt-talent-btn"
          onClick={(e) => onEditHandler(e)}
        >
          <span className="material-symbols-outlined">Edit</span>
        </Button>
        <CustomDeleteBtn
          onDelete={() => {
            if (Id) {
              onDeleteHandler(Id);
            }
          }}
        /> */}
        <Row className="mt-3">
          <Col sm="6">
            <FormGroup>
              <Label for="license_type">
                License Type <span className="asterisk">*</span>
              </Label>
              <CustomInput
                type="text"
                placeholder="License Type"
                id="license_type"
                disabled={!edit}
                invalid={!!errors.name}
                {...register("name")}
                style={{ textTransform: "capitalize" }}
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
                isDisabled={!edit}
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
                disabled={!edit}
                invalid={!!errors.licenseNumber}
                {...register("licenseNumber")}
                style={{ textTransform: "capitalize" }}
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
                disabled={!edit}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      placeholder="Expiration Date"
                      value={
                        startDate && startDate
                          ? moment(startDate?.toString()).format("MM-DD-YYYY")
                          : ""
                      }
                      disabled={!edit}
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
            <div className="mb-3 purple-radio-btn">
              <Label className="">Active Compact Status</Label>
              <div className="d-flex mt-2" style={{ gap: "10px 16px" }}>
                <FormGroup check>
                  <Input
                    name="active_compact_status"
                    type="radio"
                    id="compact_status1"
                    onChange={() => handleCompactStatus("true")}
                    checked={compactStatus === "true"}
                    disabled={!edit}
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
                    checked={!(compactStatus === "true")}
                    disabled={!edit}
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
            <div className="mb-3">
              <Button
                className="blue-gradient-btn mb-4"
                disabled={!edit}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
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
    </>
  );
};

export default ProfessionalLicenseCard;
