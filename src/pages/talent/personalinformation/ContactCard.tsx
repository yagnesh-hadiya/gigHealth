import { Button, Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomSelect from "../../../components/custom/CustomSelect";
import { useEffect, useState } from "react";
import { ActionType, ContactCardProps } from "../../../types/ProfessionalAuth";
import Loader from "../../../components/custom/CustomSpinner";
import {
  getProfessionalCities,
  getProfessionalZipCode,
} from "../../../services/ProfessionalAuth";
import { formatPhoneNumber, showToast } from "../../../helpers";
import { useForm } from "react-hook-form";
import { EmergencyContactType } from "../../../types/PersonalInformation";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmergencyContactSchema } from "../../../helpers/schemas/PersonalInformation";
import { Form } from "react-router-dom";
import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
import {
  deleteEmergencyContact,
  updateEmergencyContact,
} from "../../../services/PersonalInformation";
import { SelectOption } from "../../../types/FacilityTypes";

const ContactCard = ({
  Id,
  Name,
  Phone,
  Address,
  Email,
  State,
  City,
  ZipCode,
  state,
  dispatch,
  index,
  setFetch,
}: ContactCardProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [edit, setEdit] = useState<boolean>(false);
  const [selectedZip, setSelectedZip] = useState<SelectOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmergencyContactType>({
    resolver: yupResolver(EmergencyContactSchema) as any,
  });

  useEffect(() => {
    setValue("address", Address ? Address : "");
    setValue("email", Email ? Email : "");
    setValue("phone", Phone ? formatPhoneNumber(Phone) : "");
    setValue("name", Name ? Name : "");
    setSelectedState({
      value: State?.Id,
      label: State?.State,
    });
    setSelectedCity({
      value: City?.Id,
      label: City?.City,
    });
    setSelectedZip({
      value: ZipCode?.Id,
      label: ZipCode?.ZipCode?.toString(),
    });
  }, []);

  const handleStateChange = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    try {
      if (selectedOption === null) {
        setSelectedState(null);
        setSelectedCity(null);
        setSelectedZip(null);
        return;
      }
      if (selectedOption) {
        setSelectedState({
          value: selectedOption?.value,
          label: selectedOption?.label,
        });
        setSelectedCity(null);
        setSelectedZip(null);

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
        setSelectedCity(null);
        setSelectedZip(null);
        return;
      }
      if (selectedOption) {
        setSelectedCity({
          value: selectedOption?.value,
          label: selectedOption?.label,
        });

        setSelectedZip(null);
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
      setSelectedZip(null);
    }
    if (selectedOption) {
      setSelectedZip({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  };

  const onSubmit = async (data: any) => {
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
      const response = await updateEmergencyContact(EmergencyContactData, Id);
      if (response.status === 200) {
        // showToast(
        //   "success",
        //   "Emergency contact updated successfully" || response.data?.message
        // );
        setFetch((prev) => !prev);
        setEdit((prev) => !prev);
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", "Something went wrong");
    }
  };

  const onDeleteHandler = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await deleteEmergencyContact(Id);

      if (response.status === 200) {
        // showToast(
        //   "success",
        //   "Emergency contact deleted successfully" || response.data?.message
        // );
        setFetch((prev) => !prev);
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
      {loading === "loading" && <Loader />}
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <h2 className="main-title mb-0">
            Emergency Contact {index ? index : ""}
          </h2>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={() => setEdit((prev) => !prev)}
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
        <Row className="mt-3">
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
                  disabled={!edit}
                  style={{ textTransform: "capitalize" }}
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
                  disabled={!edit}
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
                  disabled={!edit}
                  {...register("phone", {
                    onChange: (e) => {
                      const formattedNumber: string = formatPhoneNumber(
                        e.target.value
                      );
                      setValue("phone", formattedNumber);
                    },
                  })}
                />
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
                  disabled={!edit}
                  style={{ textTransform: "capitalize" }}
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
                options={state.states.map(
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
                isDisabled={!edit}
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
                options={state.cities.map(
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
                isDisabled={!selectedState || !edit}
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
                  options={state.zip.map(
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
                  isDisabled={!selectedCity || !edit}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Button
          type="submit"
          className="blue-gradient-btn login-btn register-btn"
          disabled={!edit}
        >
          Save
        </Button>
      </Form>
    </>
  );
};

export default ContactCard;
