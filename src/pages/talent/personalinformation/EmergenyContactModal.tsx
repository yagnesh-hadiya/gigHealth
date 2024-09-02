import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomSelect from "../../../components/custom/CustomSelect";
import { useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import {
  CreateEmergencyContactType,
  EmergencyContactModalProps,
} from "../../../types/PersonalInformation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmergencyContactSchema } from "../../../helpers/schemas/PersonalInformation";
import { formatPhoneNumber, showToast } from "../../../helpers";
import { ActionType } from "../../../types/ProfessionalAuth";
import {
  getProfessionalCities,
  getProfessionalZipCode,
} from "../../../services/ProfessionalAuth";
import { Form } from "react-router-dom";
import { createEmergencyContact } from "../../../services/PersonalInformation";

const EmergencyContactModal = ({
  isOpen,
  toggle,
  state,
  dispatch,
  setFetch,
}: EmergencyContactModalProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const { selectedState, selectedCity, selectedZip } = state;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateEmergencyContactType>({
    resolver: yupResolver(EmergencyContactSchema) as any,
  });

  const handleStateChange = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    try {
      if (selectedOption === null) {
        dispatch({ type: ActionType.SetSelectedState, payload: null });
        dispatch({ type: ActionType.SetSelectedCity, payload: null });
        dispatch({ type: ActionType.SetSelectedZip, payload: null });
        return;
      }
      if (selectedOption) {
        dispatch({
          type: ActionType.SetSelectedState,
          payload: {
            value: selectedOption.value,
            label: selectedOption.label,
          },
        });

        dispatch({ type: ActionType.SetSelectedCity, payload: null });
        dispatch({ type: ActionType.SetSelectedZip, payload: null });
        const stateId: number = selectedOption.value;

        setLoading("loading");
        const response = await getProfessionalCities(stateId);
        dispatch({
          type: ActionType.SetCities,
          payload: response?.data?.data,
        });
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

  const handleCityChange = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    try {
      if (selectedOption === null) {
        dispatch({ type: ActionType.SetSelectedCity, payload: null });
        dispatch({ type: ActionType.SetSelectedZip, payload: null });

        return;
      }
      if (selectedOption) {
        dispatch({
          type: ActionType.SetSelectedCity,
          payload: { value: selectedOption.value, label: selectedOption.label },
        });

        dispatch({ type: ActionType.SetSelectedZip, payload: null });
        const cityId: number = selectedOption.value;

        setLoading("loading");
        const response = await getProfessionalZipCode(cityId);

        dispatch({ type: ActionType.SetZip, payload: response?.data?.data });
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

  const handleZipChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: ActionType.SetSelectedZip, payload: null });
    }
    dispatch({ type: ActionType.SetSelectedZip, payload: selectedOption });
  };

  const onSubmit = async (data: CreateEmergencyContactType) => {
    if (!selectedState) {
      return showToast("error", "Please select the state");
    }

    if (!selectedCity) {
      return showToast("error", "Please select the city");
    }

    if (!selectedZip) {
      return showToast("error", "Please select the zip");
    }

    try {
      const phoneNumber = data?.phone.replace(/-/g, "");

      const EmergencyContactData = {
        name: data?.name,
        email: data?.email,
        phone: phoneNumber,
        address: data?.address,
        stateId: selectedState?.value,
        cityId: selectedCity?.value,
        zipCodeId: selectedZip?.value,
      };

      setLoading("loading");
      const response = await createEmergencyContact(EmergencyContactData);
      if (response.status === 201) {
        // showToast(
        //   "success",
        //   "Emergency contact created successfully" || response.data?.message
        // );
        setFetch((prev) => !prev);
        toggle();
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", "Something went wrong");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="lg"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle} className="text-header ps-4">
          Add Emergency Contact
        </ModalHeader>
        <ModalBody style={{ padding: "20px 20px", height: "auto" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col lg="6" sm="6">
                <FormGroup>
                  <Label for="contact_person_name">
                    Contact Person Name <span className="asterisk">*</span>
                  </Label>
                  <Col>
                    <CustomInput
                      type="text"
                      placeholder="Contact Person Name"
                      id="contact_person_name"
                      invalid={!!errors.name}
                      {...register("name")}
                    />
                    <FormFeedback>{errors.name?.message}</FormFeedback>
                  </Col>
                </FormGroup>
              </Col>
              <Col lg="6" sm="6">
                <FormGroup>
                  <Label for="email_add">
                    Email Address <span className="asterisk">*</span>
                  </Label>
                  <Col>
                    <CustomInput
                      type="email"
                      placeholder="Email Address"
                      id="email_add"
                      invalid={!!errors.email}
                      {...register("email")}
                    />
                    <FormFeedback>{errors.email?.message}</FormFeedback>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg="6" sm="6">
                <FormGroup>
                  <Label for="phone_no">
                    Phone <span className="asterisk">*</span>
                  </Label>
                  <Col>
                    <CustomInput
                      type="text"
                      placeholder="Phone Number"
                      id="phone_no"
                      invalid={!!errors.phone}
                      {...register("phone", {
                        onChange: (e) => {
                          const formattedNumber: string = formatPhoneNumber(
                            e.target.value
                          );
                          setValue("phone", formattedNumber);
                        },
                      })}
                    />
                    <FormFeedback>{errors.phone?.message}</FormFeedback>
                  </Col>
                </FormGroup>
              </Col>
              <Col lg="6" md="6" sm="12">
                <FormGroup>
                  <Label for="add_txt">
                    Address <span className="asterisk">*</span>
                  </Label>
                  <Col>
                    <CustomInput
                      type="text"
                      placeholder="Address"
                      id="add_txt"
                      invalid={!!errors.address}
                      {...register("address")}
                    />
                    <FormFeedback>{errors.address?.message}</FormFeedback>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg="4" md="6" sm="12">
                <div className="mb-3">
                  <Label for="state_drp">
                    State <span className="asterisk">*</span>
                  </Label>
                  <CustomSelect
                    id="State"
                    name="State"
                    value={selectedState}
                    onChange={(state) => handleStateChange(state)}
                    options={state?.states?.map(
                      (state: {
                        Id: number;
                        State: string;
                        Code: string;
                      }): { value: number; label: string } => ({
                        value: state?.Id,
                        label: `${state?.State} (${state?.Code})`,
                      })
                    )}
                    placeholder="Select State"
                    noOptionsMessage={(): string => "No State Found"}
                    isSearchable={true}
                    isClearable={true}
                  />
                </div>
              </Col>
              <Col lg="4" md="6" sm="6">
                <div className="mb-3">
                  <Label for="city_drp">
                    City <span className="asterisk">*</span>
                  </Label>
                  <CustomSelect
                    id="City"
                    name="City"
                    value={selectedCity}
                    onChange={(city) => handleCityChange(city)}
                    options={state?.cities?.map(
                      (city: {
                        Id: number;
                        City: string;
                      }): { value: number; label: string } => ({
                        value: city?.Id,
                        label: city?.City,
                      })
                    )}
                    placeholder="Select City"
                    noOptionsMessage={(): string => "No City Found"}
                    isClearable={true}
                    isSearchable={true}
                    isDisabled={!selectedState}
                  />
                </div>
              </Col>
              <Col lg="4" md="6" sm="6">
                <FormGroup>
                  <Label for="zip_code">
                    Zip Code <span className="asterisk">*</span>
                  </Label>
                  <Col>
                    <CustomSelect
                      id="Zip"
                      name="Zip"
                      value={selectedZip}
                      onChange={(zipcode) => handleZipChange(zipcode)}
                      options={state?.zip?.map(
                        (zipCode: {
                          Id: number;
                          ZipCode: string;
                        }): { value: number; label: string } => ({
                          value: zipCode?.Id,
                          label: zipCode?.ZipCode,
                        })
                      )}
                      placeholder="Select Zip"
                      noOptionsMessage={(): string => "No Zip Found"}
                      isClearable={true}
                      isSearchable={true}
                      isDisabled={!selectedCity}
                    />
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <Button
              type="submit"
              className="blue-gradient-btn login-btn register-btn"
            >
              Save
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EmergencyContactModal;
