import { Form, Link, useNavigate } from "react-router-dom";
import CustomMainCard from "../../components/custom/CustomCard";
import { Col, FormFeedback, Label, Row } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import CustomSelect from "../../components/custom/CustomSelect";
import RadioBtn from "../../components/custom/CustomRadioBtn";
import CustomTextArea from "../../components/custom/CustomTextarea";
import { useEffect, useReducer, useState } from "react";
import {
  ActionTypes,
  FacilityRadioBtn,
  FacilityState,
  FacilityType,
  SelectOption,
} from "../../types/FacilityTypes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addFacilitySchema } from "../../helpers/schemas/FacilitySchema";
import {
  capitalize,
  formatPhoneNumber,
  getFileExtension,
  handleSelect,
  showToast,
} from "../../helpers";
import {
  addFacility,
  getContractTypes,
  getFacilityCities,
  getFacilityId,
  getFacilityRoles,
  getFacilityStatuses,
  getFacilityZipCode,
  getHealthSystemId,
  getProgramManagers,
  getServiceTypes,
  getStateLocations,
  getTraumaLevels,
  gethealthSystemName,
  uploadImageToBucket,
} from "../../services/facility";
import Loader from "../../components/custom/CustomSpinner";
import FacilityImageUpload from "./FacilityImageUpload";
import facilityReducer from "../../helpers/reducers/FacilityReducer";

const AddNewFacility = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FacilityType>({
    resolver: yupResolver(addFacilitySchema) as any,
  });

  const initialState: FacilityState = {
    selectedFacility: null,
    selectedContract: null,
    selectedService: null,
    selectedTrauma: null,
    selectedState: null,
    selectedCity: null,
    selectedProgramManager: null,
    selectedRole: null,
    selectedRole2: null,
    selectedZip: null,
    selectedHealth: null,
    selectedFacilityType: "parent",
    teachingHospital: "true",
    facilityId: 0,
    systemHealthId: 0,
    facility: [],
    contracts: [],
    services: [],
    traumas: [],
    states: [],
    cities: [],
    programManagers: [],
    roles: [],
    zip: [],
    healthSystem: [],
  };

  const [state, dispatch] = useReducer(facilityReducer, initialState);
  const {
    selectedFacility,
    selectedContract,
    selectedService,
    selectedTrauma,
    selectedState,
    selectedCity,
    selectedProgramManager,
    selectedRole,
    selectedRole2,
    selectedZip,
    selectedHealth,
    selectedFacilityType,
    teachingHospital,
    facilityId,
    systemHealthId,
  } = state;
  const facilityType: FacilityRadioBtn = [
    { label: "Parent", value: "parent" },
    { label: "Child", value: "child" },
    { label: "Stand Alone", value: "standalone" },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | undefined>();
  const navigate = useNavigate();

  const getFacilityStatus = async () => {
    try {
      setLoading(true);
      const facilitiesStatus = await getFacilityStatuses();
      dispatch({
        type: ActionTypes.SetFacility,
        payload: facilitiesStatus?.data?.data,
      });
      // setFacility(facilitiesStatus?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getContractType = async () => {
    try {
      setLoading(true);
      const contracts = await getContractTypes();
      dispatch({
        type: ActionTypes.SetContracts,
        payload: contracts?.data?.data,
      });
      // setContracts(contracts?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getServiceType = async () => {
    try {
      setLoading(true);
      const service = await getServiceTypes();
      dispatch({ type: ActionTypes.SetServices, payload: service?.data?.data });
      // setServices(service?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getTraumaLevel = async () => {
    try {
      setLoading(true);
      const traumas = await getTraumaLevels();
      dispatch({ type: ActionTypes.SetTraumas, payload: traumas?.data?.data });
      // setTraumas(traumas?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getStates = async () => {
    try {
      setLoading(true);
      const states = await getStateLocations();
      dispatch({ type: ActionTypes.SetStates, payload: states?.data?.data });
      // setStates(states?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getRoles = async () => {
    try {
      setLoading(true);
      const roles = await getFacilityRoles();
      dispatch({ type: ActionTypes.SetRoles, payload: roles?.data?.data });
      // setRoles(roles?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getProgramManager = async () => {
    try {
      setLoading(true);
      const managers = await getProgramManagers();
      dispatch({
        type: ActionTypes.SetProgramManagers,
        payload: managers?.data?.data,
      });
      // setProgramManagers(managers?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    getFacilityStatus();
    getContractType();
    getServiceType();
    getTraumaLevel();
    getStates();
    getProgramManager();
    getRoles();
  }, []);

  const handleFacilityStatus = (selectedOption: SelectOption | null) => {
    handleSelect(selectedOption, dispatch, ActionTypes.SetSelectedFacility);
  };

  const handleContract = (selectedOption: SelectOption | null) => {
    handleSelect(selectedOption, dispatch, ActionTypes.SetSelectedContract);
  };

  const handleService = (selectedOption: SelectOption | null) => {
    handleSelect(selectedOption, dispatch, ActionTypes.SetSelectedService);
  };

  const handleTrauma = (selectedOption: SelectOption | null) => {
    handleSelect(selectedOption, dispatch, ActionTypes.SetSelectedTrauma);
  };

  const handleStateChange = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    try {
      if (selectedOption === null) {
        dispatch({ type: ActionTypes.SetSelectedState, payload: null });
        dispatch({ type: ActionTypes.SetSelectedCity, payload: null });
        dispatch({ type: ActionTypes.SetSelectedZip, payload: null });
        // setSelectedState(null);
        // setSelectedCity(null);
        // setSelectedZip(null);
        return;
      }
      if (selectedOption) {
        dispatch({
          type: ActionTypes.SetSelectedState,
          payload: { value: selectedOption.value, label: selectedOption.label },
        });

        dispatch({ type: ActionTypes.SetSelectedCity, payload: null });
        // setSelectedCity(null);
        const stateId: number = selectedOption.value;

        setLoading(true);
        const response = await getFacilityCities(stateId);
        dispatch({
          type: ActionTypes.SetCities,
          payload: response?.data?.data,
        });
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
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
        dispatch({ type: ActionTypes.SetSelectedCity, payload: null });
        dispatch({ type: ActionTypes.SetSelectedZip, payload: null });

        return;
      }
      if (selectedOption) {
        dispatch({
          type: ActionTypes.SetSelectedCity,
          payload: { value: selectedOption.value, label: selectedOption.label },
        });

        dispatch({ type: ActionTypes.SetSelectedZip, payload: null });
        const cityId: number = selectedOption.value;

        setLoading(true);
        const response = await getFacilityZipCode(cityId);
        dispatch({ type: ActionTypes.SetZip, payload: response?.data?.data });
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleProgramManagerChange = (selectedOption: SelectOption | null) => {
    handleSelect(
      selectedOption,
      dispatch,
      ActionTypes.SetSelectedProgramManager
    );
  };

  const handleRoleChange = (selectedOption: SelectOption | null) => {
    handleSelect(selectedOption, dispatch, ActionTypes.SetSelectedRole);
  };

  const handleRoleChange2 = (selectedOption: SelectOption | null) => {
    handleSelect(selectedOption, dispatch, ActionTypes.SetSelectedRole2);
  };

  const handleZipChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: ActionTypes.SetSelectedZip, payload: null });
    }
    dispatch({ type: ActionTypes.SetSelectedZip, payload: selectedOption });
  };

  const handleHealthSystemNameChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: ActionTypes.SetSelectedHealth, payload: null });
    }
    dispatch({ type: ActionTypes.SetSelectedHealth, payload: selectedOption });

    dispatch({
      type: ActionTypes.SetSystemHealthId,
      payload: selectedOption?.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFacilityType === "child") {
        try {
          setLoading(true);
          const response = await gethealthSystemName();
          dispatch({
            type: ActionTypes.SetHealthSystem,
            payload: response?.data?.data,
          });

          if (response && response.data.data.length > 0) {
            const firstHealthSystem = {
              value: response.data.data[0].Id,
              label: capitalize(response.data.data[0].Name),
            };

            dispatch({
              type: ActionTypes.SetSelectedHealth,
              payload: firstHealthSystem,
            });

            dispatch({
              type: ActionTypes.SetSystemHealthId,
              payload: firstHealthSystem?.value,
            });
            handleHealthSystemNameChange(firstHealthSystem);
          } else {
            dispatch({ type: ActionTypes.SetSystemHealthId, payload: "" });
          }
        } catch (error: any) {
          console.error(error);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        } finally {
          setLoading(false);
        }
      }
      return;
    };

    fetchData();
  }, [selectedFacilityType]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFacilityType === "parent") {
        try {
          setLoading(true);
          const facilityId = await getFacilityId();
          const healthSystemId = await getHealthSystemId();

          dispatch({
            type: ActionTypes.SetFacilityId,
            payload: facilityId?.data?.data[0]?.nextId,
          });
          dispatch({
            type: ActionTypes.SetSystemHealthId,
            payload: healthSystemId?.data?.data[0]?.nextId,
          });
          setLoading(false);
        } catch (error: any) {
          console.error(error);
          setLoading(false);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        }
      }
      return;
    };

    fetchData();
  }, [selectedFacilityType]);

  useEffect(() => {
    if (selectedFacilityType === "standalone") {
      dispatch({ type: ActionTypes.SetSelectedHealth, payload: null });
    }
    return;
  }, [selectedFacilityType]);

  const maxFileSize = 2;
  const validFileExtensions = { facilityPicture: ["jpg", "jpeg", "png"] };

  const handleImageUpload = (e: File) => {
    const selectedImage: File | undefined = e;

    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  useEffect(() => {
    if (image) {
      const fileExtension = getFileExtension(image);
      if (fileExtension !== undefined) {
        if (
          !fileExtension ||
          !validFileExtensions.facilityPicture?.includes(fileExtension)
        ) {
          return showToast(
            "error",
            "Supported formats are only .jpg, .jpeg, .png"
          );
        }
      }

      const fileSizeMb: number = image?.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
      }
    }
  }, [image]);

  const onSubmit = async (data: FacilityType) => {
    data.facilityId = Number(facilityId);
    data.parentHealthSystemId = systemHealthId;
    data.isTeachingHospital = teachingHospital === "true";
    data.type = selectedFacilityType;
    data.statusId = selectedFacility?.value ?? null;
    if (!data.statusId) {
      showToast("error", "Please select facility status");
      return;
    }

    data.traumaLevelId = selectedTrauma?.value ?? null;
    if (!data.traumaLevelId) {
      showToast("error", "Please select trauma level");
      return;
    }

    data.contractTypeId = selectedContract?.value ?? null;
    if (!data.contractTypeId) {
      showToast("error", "Please select contract type");
      return;
    }

    data.serviceTypeId = selectedService?.value ?? null;
    if (!data.serviceTypeId) {
      showToast("error", "Please select service type");
      return;
    }

    data.stateId = selectedState?.value ?? null;
    if (!data.stateId) {
      showToast("error", "Please select state");
      return;
    }

    data.cityId = selectedCity?.value ?? null;
    if (!data.cityId) {
      showToast("error", "Please select city");
      return;
    }

    data.zipCodeId = selectedZip?.value ?? null;
    if (!data.zipCodeId) {
      showToast("error", "Please select zip");
      return;
    }

    data.programManagerId = selectedProgramManager?.value ?? null;
    if (data.secondaryContact) {
      data.secondaryContact.facilityRoleId = selectedRole2?.value ?? null;
    }

    const healthSystemName: string =
      selectedFacilityType === "parent"
        ? data.healthSystemName
        : selectedHealth?.label ?? "";
    if (selectedFacilityType === "parent" && !healthSystemName) {
      showToast("error", "Health System Name is required");
      return;
    }

    if (
      selectedFacilityType === "parent" &&
      (typeof healthSystemName !== "string" ||
        !/^[a-zA-Z' ]+$/.test(healthSystemName))
    ) {
      showToast(
        "error",
        "Health System Name is not valid. Please use only letters and spaces."
      );
      return;
    }

    if (
      selectedFacilityType === "parent" &&
      (healthSystemName.length < 3 || healthSystemName.length > 150)
    ) {
      showToast(
        "error",
        "HealthSystemName must be between 2 to 150 characters"
      );
      return;
    }

    if (selectedFacilityType === "standalone") {
      data.healthSystemName = "";
    }

    const phone: string = data.hospitalPhone.replace(/\D/g, "");
    const requirements: string = data.requirements;
    const internalNotes: string = data.internalNotes;
    const primaryFirstName: string | undefined = data.primaryContact?.firstName;
    const primaryLastName: string | undefined = data.primaryContact?.lastName;
    const primaryTitle: string | undefined = data.primaryContact?.title;
    const primaryEmail: string | undefined = data.primaryContact?.email;
    const primaryPhone: string | undefined =
      data.primaryContact?.mobile.replace(/\D/g, "");
    const primaryFax: string | null | undefined = data.primaryContact?.fax || null;
    const primaryFacilityRole: number | null =
      (data.primaryContact.facilityRoleId = selectedRole?.value ?? null);
    const secondaryFirstName: string | undefined =
      data.secondaryContact?.firstName;
    const secondaryLastName: string | undefined =
      data.secondaryContact?.lastName;
    const secondaryTitle: string | undefined = data.secondaryContact?.title;
    const secondaryEmail: string | undefined = data.secondaryContact?.email;
    const secondaryPhone: string | undefined =
      data.secondaryContact?.mobile.replace(/\D/g, "");
    const secondaryFax: string | null | undefined = data.secondaryContact?.fax || null;
    const secondaryFacilityRole: number | null =
      (data.secondaryContact.facilityRoleId = selectedRole2?.value ?? null);

    const isPrimaryContactFilled: boolean = !!(
      primaryFirstName ||
      primaryLastName ||
      primaryTitle ||
      primaryEmail ||
      primaryPhone ||
      primaryFacilityRole
    );
    const isSecondaryContactFilled: boolean = !!(
      secondaryFirstName ||
      secondaryLastName ||
      secondaryTitle ||
      secondaryEmail ||
      secondaryPhone ||
      secondaryFacilityRole
    );

    if (isPrimaryContactFilled) {
      const requiredPrimaryContactFields: (keyof typeof data.primaryContact)[] =
        ["firstName", "lastName", "title", "email", "mobile", "facilityRoleId"];
      const isAllPrimaryContactsFilled: boolean =
        requiredPrimaryContactFields.every(
          (field): boolean => !!data.primaryContact?.[field]
        );

      if (!isAllPrimaryContactsFilled) {
        showToast("error", "Please fill all fields of the primary contact");
        return;
      }
    }

    if (isSecondaryContactFilled) {
      const requiredSecondaryContactFields: (keyof typeof data.secondaryContact)[] =
        ["firstName", "lastName", "title", "email", "mobile", "facilityRoleId"];
      const isAllSecondaryContactFieldsFilled: boolean =
        requiredSecondaryContactFields.every(
          (field): boolean => !!data.secondaryContact?.[field]
        );

      if (!isAllSecondaryContactFieldsFilled) {
        showToast("error", "Please fill all fields of the secondary contact");
        return;
      }
    }

    try {
      setLoading(true);
      const user: any = await addFacility(
        data?.name,
        data?.statusId,
        data?.type,
        data?.parentHealthSystemId,
        data?.isTeachingHospital,
        data?.totalTalent,
        data?.totalBedCount,
        data?.traumaLevelId,
        data?.contractTypeId,
        data?.programManagerId,
        phone,
        data?.serviceTypeId,
        data?.address,
        data?.stateId,
        data?.cityId,
        data?.zipCodeId,
        healthSystemName,
        internalNotes,
        requirements,
        primaryFirstName,
        primaryLastName,
        primaryTitle,
        primaryEmail,
        primaryPhone,
        primaryFax,
        primaryFacilityRole,
        secondaryFirstName,
        secondaryLastName,
        secondaryTitle,
        secondaryEmail,
        secondaryPhone,
        secondaryFax,
        secondaryFacilityRole,
        isPrimaryContactFilled,
        isSecondaryContactFilled
      );
      setLoading(false);
      showToast(
        "success",
        "Facility created successfully" || user?.data?.message
      );
      setTimeout(() => {
        navigate("/facility");
      }, 1500);
      if (image) {
        const upload = await uploadImageToBucket(
          Number(user?.data?.data[0]?.id),
          image
        );
        if (upload?.status === 200) {
          return true;
        } else {
          console.error(upload);
          return showToast("error", "Failed to upload facility image");
        }
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message
            ? "Facility Image upload failed"
            : "Something went wrong"
      );
    }
  };

  return (
    <>
      <div className="navigate-wrapper">
        <Link to="/facility" className="link-btn">
          Facilities
        </Link>
        <span> / </span>
        <span>Add New Facility</span>
      </div>
      <CustomMainCard>
        <h2 className="page-content-header">Facility Details</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {loading && <Loader />}
          <div className="d-flex" style={{ gap: '20px' }}>
            <div>
              <FacilityImageUpload
                image={image}
                imageURL=""
                onImageUpload={(e: File) => handleImageUpload(e)}
              />
            </div>

            <Row className="w-100">
              <Col xxl="2" xl="4" lg="4" md="4" className="col-group">
                <Label className="">Facility ID</Label>
                <CustomInput
                  value={
                    state?.facilityId ? `FID-${state?.facilityId}` : ""
                  }
                  invalid={!!errors.facilityId}
                  {...register("facilityId")}
                  disabled={true}
                />
                <FormFeedback>{errors.facilityId?.message}</FormFeedback>
              </Col>
              <Col xxl="2" xl="4" lg="4" md="4" className="col-group">
                <Label className="text-nowrap">
                  Facility Status <span className="asterisk">*</span>
                </Label>
                <CustomSelect
                  id="facilityStatus"
                  name="facilityStatus"
                  value={selectedFacility}
                  onChange={(locationStatus) =>
                    handleFacilityStatus(locationStatus)
                  }
                  placeholder={"Select Status"}
                  options={state.facility.map(
                    (facilities: {
                      Id: number;
                      Status: string;
                    }): { value: number; label: string } => ({
                      value: facilities?.Id,
                      label: facilities?.Status,
                    })
                  )}
                  noOptionsMessage={(): string =>
                    "No Facility Status Found"
                  }
                  isClearable={true}
                  isSearchable={true}
                  className="custom-select-placeholder users-header-select"
                />
              </Col>


              <Col xxl="3" xl="4" lg="4" md="4" className="col-group">
                <Label className="">
                  Facility Name <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="FacilityName"
                  placeholder="Facility Name"
                  invalid={!!errors.name}
                  {...register("name")}
                />
                <FormFeedback>{errors.name?.message}</FormFeedback>
              </Col>
              <Col xxl="5" xl="8" lg="8" md="12">
                <Row>
                  <Col
                    xxl="4"
                    xl="4"
                    lg="4"
                    md="6"
                    className="col-group"
                    style={{ marginBottom: "0px" }}
                  >
                    <Label className="teaching-radio-btn">
                      Teaching Hospital
                    </Label>
                    <RadioBtn
                      options={[
                        { label: "Yes", value: "true" },
                        { label: "No", value: "false" },
                      ]}
                      selected={teachingHospital}
                      {...register("isTeachingHospital")}
                      onChange={(value: string) =>
                        dispatch({
                          type: ActionTypes.SetTeachingHospital,
                          payload: value,
                        })
                      }
                    />
                    <FormFeedback>
                      {errors.isTeachingHospital?.message}
                    </FormFeedback>
                  </Col>
                  <Col
                    xxl="8"
                    xl="8"
                    lg="8"
                    md="6"
                    className="col-group"
                    style={{ marginBottom: "0px" }}
                  >
                    <Label>Facility Type</Label>
                    <RadioBtn
                      options={facilityType}
                      selected={selectedFacilityType}
                      {...register("type")}
                      onChange={(value: string) =>
                        dispatch({
                          type: ActionTypes.SetSelectedFacilityType,
                          payload: value,
                        })
                      }
                    />
                    <FormFeedback>{errors.type?.message}</FormFeedback>
                  </Col>
                </Row>
              </Col>
              <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
                <Label className="">Health System ID</Label>
                <CustomInput
                  value={
                    selectedFacilityType === "standalone"
                      ? ""
                      : systemHealthId
                        ? `HSID-${systemHealthId}`
                        : ""
                  }
                  invalid={!!errors.parentHealthSystemId}
                  {...register("parentHealthSystemId")}
                  disabled={true}
                />
                <FormFeedback>
                  {errors.parentHealthSystemId?.message}
                </FormFeedback>
              </Col>

              <Col xxl="3" xl="4" lg="6" md="4" className="col-group">
                <Label>
                  Health System Name <span className="asterisk">*</span>
                </Label>
                {selectedFacilityType === "parent" ? (
                  <>
                    <CustomInput
                      id="HealthSystemName"
                      placeholder="Health System Name"
                      invalid={!!errors.healthSystemName}
                      {...register("healthSystemName")}
                    />
                    <FormFeedback>
                      {errors.healthSystemName?.message}
                    </FormFeedback>
                  </>
                ) : (
                  <CustomSelect
                    id={"healthSystemName"}
                    name={"healthSystemName"}
                    className="custom-select-placeholder"
                    value={selectedHealth}
                    onChange={(healthSystem) =>
                      handleHealthSystemNameChange(healthSystem)
                    }
                    options={state.healthSystem.map(
                      (health: {
                        Id: number;
                        Name: string;
                        Facilities: { Id: number; Name: string };
                      }): { value: number; label: string } => ({
                        value: health?.Id,
                        label: capitalize(health?.Name),
                      })
                    )}
                    noOptionsMessage={(): string =>
                      "No Health Systems available"
                    }
                    placeholder={"Health System Name"}
                    isSearchable={true}
                    isDisabled={selectedFacilityType === "standalone"}
                  />
                )}
              </Col>

              <Col xxl="5" xl="4" lg="6" md="4" className="col-group">
                <Label>
                  Total Talent on Assignment
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="TotalTalent"
                  placeholder="Total Talent"
                  invalid={!!errors.totalTalent}
                  {...register("totalTalent")}
                />
                <FormFeedback>{errors.totalTalent?.message}</FormFeedback>
              </Col>
            </Row>

          </div>

          <Row>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Total Bed Count</Label>
              <CustomInput
                id="TotalBedCount"
                placeholder="Total Bed Count"
                invalid={!!errors.totalBedCount}
                {...register("totalBedCount")}
              />
              <FormFeedback>{errors.totalBedCount?.message}</FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label>
                Trauma Level <span className="asterisk">*</span>
              </Label>
              <CustomSelect
                id="traumaLevel"
                name="traumaLevel"
                value={selectedTrauma}
                onChange={(trauma) => handleTrauma(trauma)}
                placeholder={"Select Trauma Level"}
                options={state.traumas.map(
                  (trauma: {
                    Id: number;
                    Level: string;
                  }): { value: number; label: string } => ({
                    value: trauma?.Id,
                    label: trauma?.Level,
                  })
                )}
                noOptionsMessage={(): string => "No Trauma Found"}
                isClearable={true}
                isSearchable={true}
                className="custom-select-placeholder"
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Contract Type</Label>
              <CustomSelect
                id="contractType"
                name="contractType"
                value={selectedContract}
                onChange={(contract) => handleContract(contract)}
                placeholder={"Select Contract Type"}
                options={state.contracts.map(
                  (contract: {
                    Id: number;
                    Type: string;
                  }): { value: number; label: string } => ({
                    value: contract?.Id,
                    label: contract?.Type,
                  })
                )}
                noOptionsMessage={(): string => "No Contract Found"}
                isClearable={true}
                isSearchable={true}
                className="custom-select-placeholder"
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label>Assign Program Manager</Label>
              <CustomSelect
                id="programManager"
                name="programManager"
                value={selectedProgramManager}
                onChange={(manager) => handleProgramManagerChange(manager)}
                placeholder={"Select Program Manager"}
                options={state.programManagers.map(
                  (manager: {
                    Id: number;
                    FirstName: string;
                    LastName: string;
                  }): { value: number; label: string } => ({
                    value: manager?.Id,
                    label: `${capitalize(manager?.FirstName)} ${capitalize(
                      manager.LastName
                    )}`,
                  })
                )}
                noOptionsMessage={(): string => "No Program Manager Found"}
                isClearable={true}
                isSearchable={true}
                className="custom-select-placeholder"
              />
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">Hospital Phone Number</Label>
              <CustomInput
                id="PhoneNumber"
                placeholder="Phone Number"
                invalid={!!errors.hospitalPhone}
                {...register("hospitalPhone", {
                  onChange: (e) => {
                    const formattedNumber: string = formatPhoneNumber(
                      e.target.value
                    );
                    setValue("hospitalPhone", formattedNumber);
                  },
                })}
              />
              <FormFeedback>{errors.hospitalPhone?.message}</FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
                Service Type <span className="asterisk">*</span>
              </Label>
              <CustomSelect
                id="serviceType"
                name="serviceType"
                value={selectedService}
                onChange={(service) => handleService(service)}
                placeholder={"Select Service Type"}
                options={state.services.map(
                  (service: {
                    Id: number;
                    Type: string;
                  }): { value: number; label: string } => ({
                    value: service?.Id,
                    label: service?.Type,
                  })
                )}
                noOptionsMessage={(): string => "No Contract Found"}
                isClearable={true}
                isSearchable={true}
                className="custom-select-placeholder"
              />
            </Col>
            <Col xxl="12" className="col-group">
              <Label>Facility Requirements</Label>
              <CustomTextArea
                id="requirements"
                invalid={!!errors.requirements}
                {...register("requirements")}
              />
              <FormFeedback>{errors.requirements?.message}</FormFeedback>
            </Col>
            <Col xxl="12" className="col-group">
              <Label className="">Internal Facility Notes</Label>
              <CustomTextArea
                id=""
                invalid={!!errors.internalNotes}
                {...register("internalNotes")}
              />
              <FormFeedback>{errors.internalNotes?.message}</FormFeedback>
            </Col>
            <h2 className="page-content-header">Address</h2>
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
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
            <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
              <Label className="">
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
            </Col>
            <Col xxl="2" xl="2" lg="3" md="6" className="col-group">
              <Label className="">
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
            </Col>
            <Col xxl="2" xl="2" lg="3" md="6" className="col-group">
              <Label className="">
                Zip Code <span className="asterisk">*</span>
              </Label>
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
            <h2 className="page-content-header">Primary Point Of Contact</h2>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">First Name</Label>
              <CustomInput
                id="FirstName"
                placeholder="First Name"
                invalid={!!errors.primaryContact?.firstName}
                {...register("primaryContact.firstName")}
              />
              <FormFeedback>
                {errors.primaryContact?.firstName?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Last Name</Label>
              <CustomInput
                id="LastName"
                placeholder="Last Name"
                invalid={!!errors.primaryContact?.lastName}
                {...register("primaryContact.lastName")}
              />
              <FormFeedback>
                {errors.primaryContact?.lastName?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Title</Label>
              <CustomInput
                id="Title"
                placeholder="Title"
                invalid={!!errors.primaryContact?.title}
                {...register("primaryContact.title")}
              />
              <FormFeedback>
                {errors.primaryContact?.title?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Email Address</Label>
              <CustomInput
                id="Email"
                placeholder="Email"
                invalid={!!errors.primaryContact?.email}
                {...register("primaryContact.email")}
              />
              <FormFeedback>
                {errors.primaryContact?.email?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Phone Number</Label>
              <CustomInput
                id="Phone"
                placeholder="Phone Number"
                invalid={!!errors.primaryContact?.mobile}
                {...register("primaryContact.mobile", {
                  onChange: (e) => {
                    const formattedNumber: string = formatPhoneNumber(
                      e.target.value
                    );
                    setValue("primaryContact.mobile", formattedNumber);
                  },
                })}
              />
              <FormFeedback>
                {errors.primaryContact?.mobile?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Fax</Label>
              <CustomInput
                id="Fax"
                placeholder="Fax"
                invalid={!!errors.primaryContact?.fax}
                {...register("primaryContact.fax")}
              />
              <FormFeedback>
                {errors.primaryContact?.fax?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Role</Label>
              <CustomSelect
                id="Role1"
                name="Role1"
                value={selectedRole}
                onChange={(role) => handleRoleChange(role)}
                options={state.roles.map(
                  (role: {
                    Id: number;
                    Role: string;
                  }): { value: number; label: string } => ({
                    value: role?.Id,
                    label: role?.Role,
                  })
                )}
                placeholder="Select Role"
                noOptionsMessage={(): string => "No Role Found"}
                isClearable={true}
                isSearchable={true}
                menuPlacement="top"
              />
            </Col>
            <h2 className="page-content-header">Secondary Point Of Contact</h2>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">First Name</Label>
              <CustomInput
                id="FirstName"
                placeholder="First Name"
                invalid={!!errors.secondaryContact?.firstName}
                {...register("secondaryContact.firstName")}
              />
              <FormFeedback>
                {errors.secondaryContact?.firstName?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Last Name</Label>
              <CustomInput
                id="LastName"
                placeholder="Last Name"
                invalid={!!errors.secondaryContact?.lastName}
                {...register("secondaryContact.lastName")}
              />
              <FormFeedback>
                {errors.secondaryContact?.lastName?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Title</Label>
              <CustomInput
                id="Title"
                placeholder="Title"
                invalid={!!errors.secondaryContact?.title}
                {...register("secondaryContact.title")}
              />
              <FormFeedback>
                {errors.secondaryContact?.title?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Email Address</Label>
              <CustomInput
                id="Email"
                placeholder="Email"
                invalid={!!errors.secondaryContact?.email}
                {...register("secondaryContact.email")}
              />
              <FormFeedback>
                {errors.secondaryContact?.email?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Phone Number</Label>
              <CustomInput
                id="Phone"
                placeholder="Phone Number"
                invalid={!!errors.secondaryContact?.mobile}
                {...register("secondaryContact.mobile", {
                  onChange: (e) => {
                    const formattedNumber: string = formatPhoneNumber(
                      e.target.value
                    );
                    setValue("secondaryContact.mobile", formattedNumber);
                  },
                })}
              />
              <FormFeedback>
                {errors.secondaryContact?.mobile?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Fax</Label>
              <CustomInput
                id="Fax"
                placeholder="Fax"
                invalid={!!errors.secondaryContact?.fax}
                {...register("secondaryContact.fax")}
              />
              <FormFeedback>
                {errors.secondaryContact?.fax?.message}
              </FormFeedback>
            </Col>
            <Col xxl="4" xl="4" lg="4" md="4" className="col-group">
              <Label className="">Role</Label>
              <CustomSelect
                id="Role2"
                name="Role2"
                value={selectedRole2}
                onChange={(role) => handleRoleChange2(role)}
                options={state.roles.map(
                  (role: {
                    Id: number;
                    Role: string;
                  }): { value: number; label: string } => ({
                    value: role?.Id,
                    label: role?.Role,
                  })
                )}
                placeholder="Select Role"
                noOptionsMessage={(): string => "No Role Found"}
                isClearable={true}
                isSearchable={true}
                menuPlacement="top"
              />
            </Col>
          </Row>
          <div className="btn-wrapper">
            <CustomButton className="primary-btn">Save</CustomButton>
            <Link to="/facility">
              <CustomButton className="secondary-btn">Cancel</CustomButton>
            </Link>
          </div>
        </Form>
      </CustomMainCard>
    </>
  );
};

export default AddNewFacility;
