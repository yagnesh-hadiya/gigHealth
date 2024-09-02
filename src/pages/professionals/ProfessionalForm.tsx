import { Form, Link, useNavigate } from "react-router-dom";
import { Col, Label, Row } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import CustomSelect from "../../components/custom/CustomSelect";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formatPhoneNumber, showToast } from "../../helpers";
import { getCities, getStates, getZipCode } from "../../services/user";
import { ProfessionalSchema } from "../../helpers/schemas/ProfessionalSchema";
import {
  ProfessionalFormType,
  ProfessionCategoryType,
  ProfessionSubCategoryType,
} from "../../types/ProfessionalTypes";
import { addProfessional } from "../../services/ProfessionalServices";
import CustomMultiSelect from "../../components/custom/CustomMultiSelect";
import Loader from "../../components/custom/CustomSpinner";
import { SelectOption } from "../../types/FacilityTypes";
import {
  getJobSpecialities,
  getProfessions,
  getProfessionsCategories,
} from "../../services/JobsServices";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import DropdownImage from "../../assets/images/dropdown-arrow.svg";

const ProfessionalForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalFormType>({
    resolver: yupResolver(ProfessionalSchema) as any,
  });

  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedZip, setSelectedZip] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [states, setStates] = useState<
    { Id: number; State: string; Code: string }[]
  >([]);
  const [professionCategory, setProfessionCategory] = useState<
    ProfessionCategoryType[]
  >([]);
  const [selectedProfessionCategory, setSelectedProfessionCategory] = useState<{
    Id: number;
    Profession: string;
  } | null>(null);
  const [speciality, setSpeciality] = useState<
    { Id: number; Speciality: string }[]
  >([]);
  const [selectedSpeciality, setSeletctedSpeciality] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [cities, setCities] = useState<{ Id: number; City: string }[]>([]);
  const [zip, setZip] = useState<{ Id: number; ZipCode: string }[]>([]);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const [experience, setExperience] = useState<number>();

  const [preferredLocations, setPreferredLocations] = useState<
    { value: number; label: string }[]
  >([]);

  const [specialityId, setSpecialityId] = useState<number>();
  // const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

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
          value: selectedOption.value,
          label: selectedOption.label,
        });
        setSelectedCity(null);
        setSelectedZip(null);
        const stateId: number = selectedOption.value;
        setLoading("loading");
        const response = await getCities(stateId);
        setCities(response?.data?.data);
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

  const stateOptions = states.map((state) => ({
    value: state.Id,
    label: `${state.State} (${state.Code})`,
  }));

  const handleCityChange = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      setSelectedCity(null);
      setSelectedZip(null);
    } else {
      setLoading("loading");
      setSelectedCity(selectedOption);
      try {
        if (selectedOption?.value) {
          setSelectedZip(null);
          const data = await getZipCode(selectedOption?.value);
          setZip(data.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
      getZip();
      setLoading("idle");
    }
  };

  const fetchStateAndCities = async () => {
    try {
      const statesResponse = await getStates();
      setStates(statesResponse?.data?.data);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getZip = async () => {
    try {
      if (selectedCity?.value) {
        const data = await getZipCode(selectedCity?.value);
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfessionCategories = async () => {
    try {
      const professionData = await getProfessions();
      setProfessionCategory(professionData.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchProfession = async () => {
  //   try {
  //     if (selectedCategory) {
  //       const response = await getProfessionsCategories(selectedCategory);

  //       setProfession(response.data?.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getJobSpecialities(specialityId);
        setSpeciality(specialities.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfessionSubcategories = async () => {
    try {
      const professionLength = professionCategory?.length;
      if (professionLength > 0) {
        const subCategoriesArray = [];
        for (let i = 1; i <= professionLength; i++) {
          const response = await getProfessionsCategories(i);
          subCategoriesArray.push(response.data?.data);
        }
        setSubCategories(subCategoriesArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   fetchProfession();
  //   setProfession([]);
  // }, [selectedCategory]);

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [professionCategory?.length]);

  useEffect(() => {
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    fetchStateAndCities();
    fetchProfessionCategories();
  }, []);

  const onSubmit = async (data: ProfessionalFormType) => {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      experience,
    }: ProfessionalFormType = data;

    const numberNoHyphens = phone.replace(/-/g, "");

    if (!selectedState?.value) {
      showToast("error", "Please select state");
      return;
    }
    if (!selectedCity?.value) {
      showToast("error", "Please select city");
      return;
    }

    if (!selectedZip) {
      showToast("error", "Please select zip code");
      return;
    }

    if (!selectedProfessionCategory) {
      showToast("error", "Please select profession");
      return;
    }

    if (!selectedSpeciality) {
      showToast("error", "Please select speciality");
      return;
    }

    if (!data.experience) {
      return showToast("error", "Experience is required");
    }

    if (!(preferredLocations.length > 0)) {
      return showToast("error", "Please select the preferred locations");
    }

    try {
      setLoading("loading");
      const professional = await addProfessional(
        firstName,
        lastName,
        email,
        numberNoHyphens,
        address,
        selectedState?.value,
        selectedCity?.value,
        selectedZip.value,
        selectedProfessionCategory?.Id,
        selectedSpeciality.value,
        experience,
        preferredLocations.map((location) => location.value)
      );
      showToast(
        "success",
        "Professional created successfully" || professional?.data?.message
      );
      setTimeout(() => {
        navigate("/professionals");
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

  const handleZipChange = (selectedOption: SelectOption | null) => {
    setSelectedZip(
      selectedOption && {
        value: selectedOption.value,
        label: selectedOption.label,
      }
    );
  };

  // const handleProfession = (categoryIndex: number) => {
  //   setSelectedCategory(categoryIndex);
  // };

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCategoryProfession(professionItem.Profession);
    setSeletctedSpeciality(null);
    setSpecialityId(professionItem.Id);
    setSelectedProfessionCategory(professionItem);
  };

  const handleSpecialities = (selectedOption: SelectOption | null) => {
    setSeletctedSpeciality(
      selectedOption && {
        value: selectedOption.value,
        label: selectedOption.label,
      }
    );
  };

  return (
    <>
      <h2 className="page-content-header">Basic Information</h2>
      {loading === "loading" && <Loader />}
      <Form>
        <Row>
          <Col xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              First Name <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="firstName"
              placeholder="First Name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <label className="text-danger text-sm-center">
                {errors.firstName.message}
              </label>
            )}
          </Col>
          <Col xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Last Name <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="lastName"
              placeholder="Last Name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <label className="text-danger text-sm-center">
                {errors.lastName.message}
              </label>
            )}
          </Col>
          <Col xl="4" lg="4" md="6" className="col-group">
            <Label>
              Phone <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="Phone"
              placeholder="Phone Number"
              {...register("phone", {
                onChange: (e) => {
                  const formattedNumber: string = formatPhoneNumber(
                    e.target.value
                  );
                  setValue("phone", formattedNumber);
                },
              })}
            />
            {errors.phone && (
              <label className="text-danger text-sm-center">
                {errors.phone.message}
              </label>
            )}
          </Col>
          <Col xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Email <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <label className="text-danger text-sm-center">
                {errors.email.message}
              </label>
            )}
          </Col>
          <h2 className="page-content-header">Address</h2>
          <Col xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Address Line <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="address"
              placeholder="Address"
              {...register("address")}
            />
            {errors.address && (
              <label className="text-danger text-sm-center">
                {errors.address.message}
              </label>
            )}
          </Col>
          <Col xl="4" lg="4" md="6" className="col-group">
            <Label>
              State <span className="asterisk">*</span>
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
              placeholder="Select State"
              noOptionsMessage={(): string => "No State Found"}
              isSearchable={true}
              isClearable={true}
              // {...register("stateId")}
            />
          </Col>
          <Col xl="2" lg="4" md="6" className="col-group">
            <Label>
              City <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id="City"
              name="City"
              value={selectedCity}
              onChange={(city) => handleCityChange(city)}
              options={cities.map(
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
          </Col>
          <Col xl="2" lg="4" md="6" className="col-group">
            <Label className="">
              Zip Code <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id="Zip"
              name="Zip"
              value={
                selectedZip
                  ? { value: selectedZip.value, label: selectedZip.label }
                  : null
              }
              onChange={(zipcode) => handleZipChange(zipcode)}
              options={zip.map(
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
            {errors.zipCodeId && (
              <label className="text-danger text-sm-center">
                {errors.zipCodeId?.message}
              </label>
            )}
          </Col>
          <h2 className="page-content-header">Other</h2>
          <Col md="4" className="col-group">
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
                  type="text"
                  value={
                    categoryProfession
                      ? categoryProfession
                      : "Select Profession"
                  }
                />
              }
            >
              {professionCategory?.map((item: any, index: number) => (
                <SubMenu
                  key={item.Id}
                  label={item.Category}
                  className="sub-menu"
                >
                  {subCategories &&
                    subCategories[index]?.map(
                      (profItem: { Id: number; Profession: string }) => (
                        <MenuRadioGroup
                          dir="top"
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
              ))}
            </Menu>
            <img
              src={DropdownImage}
              alt="DropdownImage"
              className="submenu-dropdown"
            />
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Speciality
              <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id={"specialities"}
              name={"specialities"}
              options={speciality?.map(
                (templateSpeciality: {
                  Id: number;
                  Speciality: string;
                }): { value: number; label: string } => ({
                  value: templateSpeciality?.Id,
                  label: templateSpeciality?.Speciality,
                })
              )}
              value={selectedSpeciality}
              placeholder="Select Speciality"
              noOptionsMessage={() => "No Speciality Found"}
              onChange={(speciality) => handleSpecialities(speciality)}
              isClearable={true}
              isSearchable={true}
              isDisabled={!categoryProfession}
            />
          </Col>
          <Col xl="4" lg="6" md="6" className="col-group">
            <Label>
              Experience <span className="asterisk">*</span>
            </Label>
            <CustomInput
              type="number"
              value={experience}
              placeholder="Experience"
              {...register("experience")}
              onChange={(e: { target: { value: any } }) =>
                setExperience(Number(e.target.value))
              }
              min={0}
              max={30}
            />
          </Col>
          <Col xl="4" lg="4" md="6" className="col-group">
            <Label>
              Preferred Locations <span className="asterisk">*</span>
            </Label>
            <CustomMultiSelect
              options={stateOptions}
              value={preferredLocations}
              onChange={(selectedOptions: any) => {
                if (selectedOptions === null) {
                  setPreferredLocations([]);
                  return;
                } else {
                  setPreferredLocations(selectedOptions);
                }
              }}
            />
          </Col>
        </Row>
        <div className="btn-wrapper">
          <button
            className="primary-btn border-0 me-2"
            onClick={handleSubmit(onSubmit)}
            disabled={loading === "loading"}
          >
            Save
          </button>
          <Link to="/professionals">
            <CustomButton className="secondary-btn">Cancel</CustomButton>
          </Link>
        </div>
      </Form>
    </>
  );
};

export default ProfessionalForm;
