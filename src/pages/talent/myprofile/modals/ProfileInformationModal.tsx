import { useEffect, useState } from "react";
import {
  ProfessionalFormType,
  ProfessionCategoryType,
  ProfessionSubCategoryType,
} from "../../../../types/ProfessionalTypes";
import { showToast, formatPhoneNumber, capitalize } from "../../../../helpers";
import {
  getProfessionalCategories,
  getProfessionalCities,
  getProfessionalProfessions,
  getProfessionalSpecialities,
  getProfessionalStates,
  getProfessionalZipCode,
} from "../../../../services/ProfessionalAuth";
import { SelectOption } from "../../../../types/FacilityTypes";
import { editProfessionalProfile } from "../../../../services/ProfessionalMyProfile";
import { Form, Link } from "react-router-dom";
import {
  Col,
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomButton from "../../../../components/custom/CustomBtn";
import CustomSelect from "../../../../components/custom/CustomSelect";
import CustomMultiSelect from "../../../../components/custom/CustomMultiSelect";
import Loader from "../../../../components/custom/CustomSpinner";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import DropdownImage from "../../../../assets/images/dropdown-arrow.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfessionalSchema } from "../../../../helpers/schemas/ProfessionalSchema";
import { ProfileInformationModalProps } from "../../../../types/ProfessionalMyProfile";

const ProfileInformationModal = ({
  authDetails,
  isOpen,
  toggle,
  fetch,
}: ProfileInformationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfessionalFormType>({
    resolver: yupResolver(ProfessionalSchema) as any,
  });

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
  const [preferredLocations, setPreferredLocations] = useState<
    { value: number; label: string }[]
  >([]);
  //   const [professionalStatuses, setProfessionalStatuses] = useState<
  //     ProfessionalStatusType[]
  //   >([]);
  const [currentStatus, setCurrentStatus] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const [specialityId, setSpecialityId] = useState<number>();
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
        const response = await getProfessionalCities(stateId);
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
          const data = await getProfessionalZipCode(selectedOption?.value);
          setZip(data.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading("idle");
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

  const handleSpecialities = (selectedOption: SelectOption | null) => {
    setSeletctedSpeciality(
      selectedOption && {
        value: selectedOption.value,
        label: selectedOption.label,
      }
    );
  };

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCategoryProfession(professionItem.Profession);
    setSeletctedSpeciality(null);
    setSpecialityId(professionItem.Id);
    setSelectedProfessionCategory(professionItem);
  };

  const fetchStateAndCities = async () => {
    try {
      const statesResponse = await getProfessionalStates();
      const citiesResponse = await getProfessionalCities(
        authDetails?.State?.Id
      );
      const zipCodeResponse = await getProfessionalZipCode(
        authDetails?.City?.Id
      );
      setStates(statesResponse?.data?.data);
      setCities(citiesResponse?.data?.data);
      setZip(zipCodeResponse?.data?.data);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const fetchProfessionCategories = async () => {
    try {
      const professionData = await getProfessionalProfessions();
      setProfessionCategory(professionData.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getProfessionalSpecialities(specialityId);
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
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [specialityId, professionCategory?.length]);

  useEffect(() => {
    fetchProfessionCategories();
    fetchStateAndCities();
    setValue(
      "firstName",
      capitalize(authDetails ? authDetails?.FirstName : "")
    );
    setValue("lastName", capitalize(authDetails ? authDetails?.LastName : ""));
    setValue("phone", formatPhoneNumber(authDetails ? authDetails?.Phone : ""));
    setValue("email", authDetails ? authDetails?.Email : "");
    setValue("address", authDetails ? authDetails?.Address : "");
    setSelectedState({
      value: authDetails?.State.Id,
      label: `${authDetails?.State.State} `,
    });
    setCategoryProfession(authDetails?.JobProfession.Profession);
    setSpecialityId(authDetails?.JobProfession.Id);
    setSelectedCity({
      value: authDetails?.City.Id,
      label: authDetails?.City.City,
    });
    setSelectedZip({
      value: authDetails?.ZipCode.Id,
      label: authDetails?.ZipCode.ZipCode,
    });
    setSelectedProfessionCategory({
      Id: authDetails?.JobProfession.Id,
      Profession: authDetails?.JobProfession.Profession,
    });
    setSeletctedSpeciality({
      value: authDetails?.JobSpeciality.Id,
      label: authDetails?.JobSpeciality.Speciality,
    });
    // setSelectedSpeciality({
    //   value: data[0].JobSpeciality.Id,
    //   label: data[0].JobSpeciality.Speciality,
    // });
    setValue("experience", authDetails?.Experience);
    setCurrentStatus({
      value: authDetails?.ProfessionalStatus.Id,
      label: authDetails?.ProfessionalStatus.Status,
    });
    setPreferredLocations(
      authDetails?.PreferredLocations.map((State: any) => ({
        value: State.StateId,
        label: `${State.State.State}`,
      }))
    );
  }, []);

  const stateOptions = states?.map((state) => ({
    value: state.Id,
    label: `${state.State} (${state.Code})`,
  }));

  const onSubmit = async (data: ProfessionalFormType) => {
    const { firstName, lastName, phone, email, address }: ProfessionalFormType =
      data;

    const numberNoHyphens = phone.replace(/-/g, "");

    if (!selectedState?.value) {
      showToast("error", "Please select a state");
      return;
    }
    if (!selectedCity?.value) {
      showToast("error", "Please select a city");
      return;
    }

    if (!data?.experience && data?.experience === 0) {
      showToast("error", "Please enter experience");
      return;
    }

    if (!selectedZip?.value) {
      showToast("error", "Please select a zip code");
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

    if (!currentStatus?.value) {
      showToast("error", "Please select status");
      return;
    }

    if (preferredLocations.length === 0) {
      showToast("error", "Please select preferred locations");
      return;
    }

    if (data?.experience < 0) {
      return showToast("error", "Please enter only positive value");
    }

    try {
      setLoading("loading");
      const user = await editProfessionalProfile(
        firstName,
        lastName,
        email,
        numberNoHyphens,
        address,
        selectedState?.value,
        selectedCity?.value,
        selectedZip?.value,
        selectedProfessionCategory?.Id,
        selectedSpeciality.value,
        Number(data?.experience),
        currentStatus?.value,
        preferredLocations.map((location) => location.value)
      );
      showToast(
        "success",
        "Professional updated successfully" || user?.data?.message
      );
      fetch();
      toggle();
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
        // style={{
        //   width: "1000px",
        // }}
      >
        <ModalHeader toggle={toggle} className="text-header ps-4">
          Edit Professional
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xl="4" lg="6" md="6" className="col-group">
                <Label className="">
                  First Name <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="FirstName"
                  placeholder="First Name"
                  invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                <FormFeedback>{errors.firstName?.message}</FormFeedback>
              </Col>
              <Col xl="4" lg="6" md="6" className="col-group">
                <Label>
                  Last Name <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="LastName"
                  placeholder="Last Name"
                  invalid={!!errors.lastName}
                  {...register("lastName")}
                />
                <FormFeedback>{errors.lastName?.message}</FormFeedback>
              </Col>
              <Col xl="4" lg="6" md="6" className="col-group">
                <Label>
                  Phone <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="Phone"
                  placeholder="Phone Number"
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
              <Col xl="4" lg="6" md="6" className="col-group">
                <Label className="">
                  Email Address <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="Email"
                  placeholder="Email"
                  invalid={!!errors.email}
                  {...register("email")}
                />
                <FormFeedback>{errors.email?.message}</FormFeedback>
              </Col>
              <h2 className="page-content-header">Address</h2>
              <Col xl="4" lg="6" md="6" className="col-group">
                <Label className="">
                  Address Line <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="Address"
                  placeholder="Address"
                  invalid={!!errors.address}
                  {...register("address")}
                />
                <FormFeedback>{errors.address?.message}</FormFeedback>
              </Col>
              <Col xl="4" lg="6" md="6" className="col-group">
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
                />
              </Col>
              <Col xl="2" lg="3" md="6" className="col-group">
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
              <Col xl="2" lg="3" md="6" className="col-group">
                <Label className="">
                  Zip Code <span className="asterisk">*</span>
                </Label>
                <CustomSelect
                  id="Zip"
                  name="Zip"
                  value={selectedZip}
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
                <FormFeedback>{errors.zipCodeId?.message}</FormFeedback>
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
                  invalid={!!errors.experience}
                  {...register("experience")}
                  min={0}
                />
                <FormFeedback>{errors.experience?.message}</FormFeedback>
              </Col>
              {/* <Col xl="2" lg="6" md="6" className="col-group">
                <Label>
                  Professional Status<span className="asterisk">*</span>
                </Label>
                <CustomSelect
                  id="status"
                  name="status"
                  value={currentStatus}
                  onChange={(currentStatus) => setCurrentStatus(currentStatus)}
                  options={professionalStatuses.map(
                    (speciality: {
                      Id: number;
                      Status: string;
                    }): {
                      value: number;
                      label: string;
                    } => ({
                      value: speciality?.Id,
                      label: `${speciality?.Status}`,
                    })
                  )}
                  placeholder="Select Status"
                  noOptionsMessage={(): string => "No Status Found"}
                  isClearable={true}
                  isSearchable={true}
                  isDisabled={
                    currentStatus?.label === "Active" ||
                    currentStatus?.label === "Assigned"
                  }
                />
              </Col> */}
              <Col xl="4" lg="6" md="6" className="col-group">
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
              <CustomButton className="primary-btn me-2">Save</CustomButton>
              <Link to="">
                <CustomButton
                  className="secondary-btn"
                  onClick={() => toggle()}
                >
                  Cancel
                </CustomButton>
              </Link>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProfileInformationModal;
