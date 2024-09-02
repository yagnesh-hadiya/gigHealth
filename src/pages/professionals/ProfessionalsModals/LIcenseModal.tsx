import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  FormFeedback,
} from "reactstrap";
import {
  LicenseModalProps,
  LicenseModalType,
} from "../../../types/ProfessionalDetails";
import { Form, useParams } from "react-router-dom";
import CustomInput from "../../../components/custom/CustomInput";
import CustomSelect from "../../../components/custom/CustomSelect";
import RadioBtn from "../../../components/custom/CustomRadioBtn";
import { useEffect, useState } from "react";
import {
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../helpers";
import { getStates } from "../../../services/user";
import { SelectOption } from "../../../types/FacilityTypes";
import Loader from "../../../components/custom/CustomSpinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LicenseModalSchema } from "../../../helpers/schemas/LicenseModalSchema";
import ReactDatePicker from "react-datepicker";
import Calendar from "../../../assets/images/calendar.svg";
import { createProfessionalLicence } from "../../../services/ProfessionalDetails";
import { toggleFetchDetails } from "../../../store/ProfessionalDetailsSlice";
import { useDispatch } from "react-redux";

const LicenseModal = ({ isOpen, toggle, setFetchData }: LicenseModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LicenseModalType>({
    resolver: yupResolver(LicenseModalSchema) as any,
  });

  const [states, setStates] = useState<
    { Id: number; State: string; Code: string }[]
  >([]);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [compactStatus, setCompactStatus] = useState<string>("");
  const params = useParams();
  const dispatch = useDispatch();

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleCompactStatus = (value: string) => setCompactStatus(value);

  const fetchState = async () => {
    try {
      const response = await getStates();
      setStates(response.data?.data);
    } catch (error: any) {
      console.error(error);
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

      setLoading(true);
      const response = await createProfessionalLicence(
        Number(params?.Id),
        name,
        licenseNumber,
        startDate && startDate ? formatDate(startDate?.toString()) : "",
        compactStatus === "true" ? true : false,
        selectedState?.value
      );
      showToast(
        "success",
        "License created successfully" || response.data?.message
      );
      setLoading(false);
      setFetchData((prevState) => !prevState);
      dispatch(toggleFetchDetails());
      reset();
      setSelectedState(null);
      setCompactStatus("");
      setStartDate(null);
      toggle();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleCancel = () => {
    toggle();
    reset();
    setSelectedState(null);
    setCompactStatus("");
    setStartDate(null);
  };

  return (
    <>
      {loading && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="lg"
        onClosed={handleCancel}
      >
        <ModalHeader toggle={toggle}>Medical License</ModalHeader>
        <ModalBody className="programModal">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  License Type
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Licence Type"
                  invalid={!!errors.name}
                  {...register("name")}
                />
                <FormFeedback>{errors.name?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  License State
                  <span className="asterisk">*</span>
                </Label>
                <CustomSelect
                  id="State"
                  name="State"
                  value={selectedState}
                  onChange={(state) => handleStateChange(state)}
                  options={states.map(
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
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Number
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Number"
                  invalid={!!errors.licenseNumber}
                  {...register("licenseNumber")}
                />
                <FormFeedback>{errors.licenseNumber?.message}</FormFeedback>
              </Col>
              <Col xxl="3" xl="3" lg="3" md="6" className="col-group">
                <Label className="">
                  Expiration Date
                  <span className="asterisk">*</span>
                </Label>
                <ReactDatePicker
                  dateFormat={"dd-MM-yyyy"}
                  isClearable={true}
                  placeholderText="--"
                  onChange={handleStartDateChange}
                  minDate={new Date()}
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
              </Col>
              <Col xxl="3" xl="3" lg="3" md="6" className="col-group">
                <Label className="">Active Compact Status</Label>
                <table className="w-100">
                  <tbody className="m-4">
                    <td>
                      <span>
                        <RadioBtn
                          options={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" },
                          ]}
                          name={""}
                          onChange={(value: string) =>
                            handleCompactStatus(value)
                          }
                          selected={compactStatus}
                        />
                      </span>
                    </td>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Button color="primary primary-btn ms-0">Save</Button>
            <Button color="secondary secondary-btn" onClick={handleCancel}>
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default LicenseModal;
