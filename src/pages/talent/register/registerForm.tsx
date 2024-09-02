import { Form, useNavigate } from "react-router-dom";
import { Button, Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomSelect from "../../../components/custom/CustomSelect";
import { useEffect, useReducer, useState } from "react";
import CustomCheckbox from "../../../components/custom/CustomCheckbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfessionalRegisterFormSchema } from "../../../helpers/schemas/ProfessionalResgisterFormSchema";
import {
  ActionType,
  ProfessionalRegisterFormState,
  ProfessionalRegisterFormType,
} from "../../../types/ProfessionalAuth";
import { formatPhoneNumber, showToast } from "../../../helpers";
import professionalFormReducer from "../../../helpers/reducers/ProfessionalFormReducer";
import Loader from "../../../components/custom/CustomSpinner";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import DropdownImage from "../../../assets/images/dropdown-arrow.svg";
import { ProfessionSubCategoryType } from "../../../types/ProfessionalTypes";
import CustomMultiSelect from "../../../components/custom/CustomMultiSelect";
import {
  getProfessionalCategories,
  getProfessionalCities,
  getProfessionalProfessions,
  getProfessionalSpecialities,
  getProfessionalStates,
  getProfessionalZipCode,
  registerProfessional,
} from "../../../services/ProfessionalAuth";
let professionId: number = 0;

const registerForm = () => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalRegisterFormType>({
    resolver: yupResolver(ProfessionalRegisterFormSchema),
  });

  const initialState: ProfessionalRegisterFormState = {
    selectedState: null,
    selectedCity: null,
    selectedZip: null,
    selectedProfession: null,
    selectedSpecialities: null,
    isChecked: false,
    states: [],
    cities: [],
    zip: [],
    profession: [],
    speciality: [],
    preferredLocations: null,
  };

  const [state, dispatch] = useReducer(professionalFormReducer, initialState);
  const {
    selectedState,
    selectedCity,
    selectedZip,
    selectedSpecialities,
    isChecked,
  } = state;

  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [specialityId, setSpecialityId] = useState<number>();
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "newPassword":
        setShowNewPassword((prevValue) => !prevValue);
        break;
      case "confirmNewPassword":
        setShowConfirmNewPassword((prevValue) => !prevValue);
        break;
      default:
        break;
    }
  };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getProfessionalSpecialities(specialityId);
        dispatch({
          type: ActionType.SetSpeciality,
          payload: specialities?.data?.data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfessionSubcategories = async () => {
    try {
      const professionLength = state.profession?.length;
      if (professionLength > 0) {
        const subCategoriesArray = [];
        for (let i = 1; i <= professionLength; i++) {
          const response = await getProfessionalCategories(i);
          subCategoriesArray.push(response.data?.data);
        }
        setSubCategories(subCategoriesArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchValues = async () => {
      const [state, profession] = await Promise.all([
        getProfessionalStates(),
        getProfessionalProfessions(),
      ]);

      dispatch({ type: ActionType.SetState, payload: state.data?.data });
      dispatch({
        type: ActionType.SetProfession,
        payload: profession.data?.data,
      });
    };

    fetchValues();
    fetchSpecialities();
    fetchProfessionSubcategories();
  }, [specialityId, state.profession?.length]);

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCategoryProfession(professionItem.Profession);
    dispatch({
      type: ActionType.SetSelectedSpecialities,
      payload: null,
    });
    setSpecialityId(professionItem?.Id);
    professionId = professionItem?.Id;
  };

  const handleSpecialities = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: ActionType.SetSelectedSpecialities, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: ActionType.SetSelectedSpecialities,
        payload: {
          Id: selectedOption?.value,
          Speciality: selectedOption?.label,
        },
      });
    }
  };
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

  const onSubmit = async (data: ProfessionalRegisterFormType) => {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      experience,
      password,
      confirmPassword,
    }: ProfessionalRegisterFormType = data;
    if (!experience) {
      return showToast("error", "Experience is required");
    }

    const experienceValue = Number(experience);
    if (experienceValue < 1 || experienceValue > 50) {
      return showToast("error", "Experience should be between 1 and 50 years");
    }

    if (!selectedState) {
      return showToast("error", "Please select state");
    }

    if (!selectedCity) {
      return showToast("error", "Please select city");
    }

    if (!selectedZip) {
      return showToast("error", "Please select zip");
    }

    if (!professionId) {
      return showToast("error", "Please select profession");
    }

    if (!selectedSpecialities) {
      return showToast("error", "Please select speciality");
    }

    if (!state.preferredLocations) {
      return showToast("error", "Please select the preferred locations");
    }

    if (
      password !== confirmPassword &&
      password.length !== confirmPassword.length
    ) {
      return showToast("error", "Password does not match");
    }

    const phoneNumber = phone.replace(/-/g, "");
    try {
      const response = await registerProfessional(
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        selectedState.value,
        selectedCity.value,
        selectedZip.value,
        professionId,
        selectedSpecialities?.Id,
        Number(experience),
        state.preferredLocations?.map(
          (location: { value: number }) => location.value
        ),
        password
      );
      showToast(
        "success",
        response.data?.message || "Professional registered successfully"
      );
      setTimeout(() => {
        navigate("/talent/login");
      }, 1500);
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

  const stateOptions = state.states?.map(
    (state: { Id: number; State: string; Code: string }) => ({
      value: state.Id,
      label: `${state.State} (${state.Code})`,
    })
  );

  return (
    <div className="register-form-wr">
      <Form onSubmit={handleSubmit(onSubmit)}>
        {loading === "loading" && <Loader />}
        <Row>
          <Col sm={12}>
            <h3>Personal Information</h3>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <Label for="first_name">
                First Name <span className="asterisk">*</span>
              </Label>
              <Col>
                <CustomInput
                  type="text"
                  placeholder="First Name"
                  id="firstName"
                  {...register("firstName")}
                  invalid={!!errors.firstName}
                />
                <FormFeedback>{errors.firstName?.message}</FormFeedback>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <Label for="last_name">
                Last Name <span className="asterisk">*</span>
              </Label>
              <Col>
                <CustomInput
                  type="text"
                  placeholder="Last Name"
                  id="lastName"
                  {...register("lastName")}
                  invalid={!!errors.lastName}
                />
                <FormFeedback>{errors.lastName?.message}</FormFeedback>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <Label for="email_add">
                Email Address <span className="asterisk">*</span>
              </Label>
              <Col>
                <CustomInput
                  type="email"
                  placeholder="Email Address"
                  id="email"
                  {...register("email")}
                  invalid={!!errors.email}
                />
                <FormFeedback>{errors.email?.message}</FormFeedback>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <Label for="PhoneNumber">
                Phone Number <span className="asterisk">*</span>
              </Label>
              <Col>
                <CustomInput
                  type="text"
                  placeholder="Phone Number"
                  id="PhoneNumber"
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
          <Col sm={12}>
            <h3 className="mt-2">Permanent Residence</h3>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <Label for="add_txt">
                Address <span className="asterisk">*</span>
              </Label>
              <Col>
                <CustomInput
                  type="text"
                  placeholder="Address"
                  id="address"
                  {...register("address")}
                  invalid={!!errors.address}
                />
                <FormFeedback>{errors.address?.message}</FormFeedback>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
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
              />
            </div>
          </Col>
          <Col sm={6}>
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
                isDisabled={!selectedState}
              />
            </div>
          </Col>
          <Col sm={6}>
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
                  isDisabled={!selectedCity}
                />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={12}>
            <h3 className="mt-2">Preferred Job Locations</h3>
          </Col>
          <Col sm={12}>
            <div className="mb-3">
              <Label for="location_drp">
                {" "}
                Locations <span className="asterisk">*</span>
              </Label>
              <CustomMultiSelect
                options={stateOptions}
                value={state.preferredLocations}
                onChange={(selectedOptions: any) => {
                  if (selectedOptions === null) {
                    dispatch({
                      type: ActionType.SetPreferredLocations,
                      payload: null,
                    });
                    return;
                  } else {
                    dispatch({
                      type: ActionType.SetPreferredLocations,
                      payload: selectedOptions,
                    });
                  }
                }}
              />
            </div>
          </Col>
          <Col sm={12}>
            <h3>Professional Information</h3>
          </Col>
          <Col md="6" className="col-group custom-sub-menu">
            <Label className="col-label">
              Select Profession <span className="asterisk">*</span>
            </Label>
            <Menu
              menuButton={
                <CustomInput
                  style={{
                    cursor: "pointer",
                    caretColor: "transparent",
                  }}
                  className="custom-input"
                  type="text"
                  value={
                    categoryProfession
                      ? categoryProfession
                      : "Select Profession"
                  }
                />
              }
            >
              {state.profession?.map(
                (item: { Id: number; Category: string }, index: number) => (
                  <SubMenu
                    key={item.Id}
                    label={item.Category}
                    className="sub-menu"
                  >
                    {subCategories &&
                      subCategories[index]?.map(
                        (profItem: { Id: number; Profession: string }) => (
                          <MenuRadioGroup
                            key={profItem.Id}
                            onClick={() => handleProfessionCategory(profItem)}
                          >
                            <MenuItem
                              value={profItem.Profession}
                              className="sub-menu-item"
                            >
                              {profItem.Profession}
                            </MenuItem>
                          </MenuRadioGroup>
                        )
                      )}
                  </SubMenu>
                )
              )}
            </Menu>
            <img
              src={DropdownImage}
              alt="DropdownImage"
              className="submenu-dropdown"
            />
          </Col>
          <Col md="6" className="col-group">
            <Label className="col-label">
              Select Specialties <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id={"specialities"}
              name={"specialities"}
              options={state.speciality?.map(
                (templateSpeciality: {
                  Id: number;
                  Speciality: string;
                }): { value: number; label: string } => ({
                  value: templateSpeciality?.Id,
                  label: templateSpeciality?.Speciality,
                })
              )}
              value={
                selectedSpecialities
                  ? {
                      value: selectedSpecialities?.Id,
                      label: selectedSpecialities?.Speciality,
                    }
                  : null
              }
              placeholder="Select Speciality"
              noOptionsMessage={(): string => "No Speciality Found"}
              onChange={(speciality) => handleSpecialities(speciality)}
              isClearable={true}
              isSearchable={true}
              isDisabled={!categoryProfession}
            />
          </Col>
          <Col sm={6}>
            <div className="mb-3">
              <Label for="exp_drp">
                {" "}
                Years of Experience <span className="asterisk">*</span>
              </Label>
              <CustomInput
                placeholder="Years of Experience"
                id="experience"
                type="number"
                min={0}
                max={50}
                {...register("experience")}
                invalid={!!errors.experience}
              />
              <FormFeedback>{errors.experience?.message}</FormFeedback>
            </div>
          </Col>
          <Col sm={12}>
            <h3>Password</h3>
          </Col>
          <Col sm={6}>
            {/* <FormGroup>
              <Label for="register_password">Password</Label>
              <Col>
                <CustomInput
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password"
                  id="register_password"
                  {...register("password")}
                  invalid={!!errors.password}
                />
                <Button
                  color="link"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="transparent-btn show-pwd-btn"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </Button>
                <FormFeedback>{errors.password?.message}</FormFeedback>
              </Col>
            </FormGroup>
          </Col> */}
            <div className="mb-3">
              <Label for="register_password">
                Password <span className="asterisk">*</span>
              </Label>
              <div className="password-input-wr">
                <CustomInput
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password"
                  id="register_password"
                  {...register("password")}
                  invalid={!!errors.password}
                />
                <Button
                  color="link"
                  className="transparent-btn show-pwd-btn"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </Button>
                <FormFeedback>{errors.password?.message}</FormFeedback>
              </div>
            </div>
          </Col>
          <Col sm={6}>
            {/* <FormGroup>
              <Label for="confirm_password">Confirm Password</Label>
              <Col>
                <CustomInput
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  id="confirm_password"
                  {...register("confirmPassword")}
                  invalid={!!errors.confirmPassword}
                />
                <Button
                  color="link"
                  onClick={() => togglePasswordVisibility("confirmNewPassword")}
                  className="transparent-btn show-pwd-btn"
                >
                  {showConfirmNewPassword ? "Hide" : "Show"}
                </Button>
                <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
              </Col>
            </FormGroup> */}
            <div className="mb-3">
              <Label for="confirm_password">
                Confirm Password <span className="asterisk">*</span>
              </Label>
              <div className="password-input-wr">
                <CustomInput
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  id="confirm_password"
                  {...register("confirmPassword")}
                  invalid={!!errors.confirmPassword}
                />
                <Button
                  color="link"
                  className="transparent-btn show-pwd-btn"
                  onClick={() => togglePasswordVisibility("confirmNewPassword")}
                >
                  {showConfirmNewPassword ? "Hide" : "Show"}
                </Button>
                <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
              </div>
            </div>
          </Col>
        </Row>
        <div className="d-flex mb-3 talent-check">
          <CustomCheckbox
            onChange={(e) =>
              dispatch({
                type: ActionType.SetIsChecked,
                payload: e.target.checked,
              })
            }
            id="policy_check"
            disabled={false}
          />
          <Label for="policy_check" className="col-label register-check-lbl">
            I have read and agree to <span>terms of use</span>
            <span>, privacy policy</span> and <span>communication outline</span>
            .
          </Label>
        </div>

        <Button
          disabled={!isChecked}
          type="submit"
          className="blue-gradient-btn login-btn register-btn"
        >
          Register Now
        </Button>
      </Form>
    </div>
  );
};

export default registerForm;
