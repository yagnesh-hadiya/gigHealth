import { Form, Link, useNavigate, useParams } from "react-router-dom";
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
  EditFacilityList,
  FacilityState,
  FacilityType,
  SelectOption,
} from "../../types/FacilityTypes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editFacilitySchema } from "../../helpers/schemas/FacilitySchema";
import {
  capitalize,
  formatPhoneNumber,
  getFileExtension,
  handleSelect,
  showToast,
} from "../../helpers";
import {
  editFacility,
  editImageToBucket,
  getContractTypes,
  getFacilityCities,
  getFacilityId,
  getFacilityListData,
  getFacilityRoles,
  getFacilityStatuses,
  getFacilityZipCode,
  getHealthSystemId,
  getProgramManagers,
  getServiceTypes,
  getStateLocations,
  getTraumaLevels,
  gethealthSystemName,
} from "../../services/facility";
import Loader from "../../components/custom/CustomSpinner";
import Camera from "../../assets/images/camera.svg";
import facilityReducer from "../../helpers/reducers/FacilityReducer";

const EditFacility = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FacilityType>({
    resolver: yupResolver(editFacilitySchema) as any,
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
    selectedHealth,
    selectedCity,
    selectedProgramManager,
    selectedRole,
    selectedRole2,
    selectedZip,
    selectedFacilityType,
    teachingHospital,
    facilityId,
  } = state;

  const [data, setData] = useState<EditFacilityList>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const facilityDataId = useParams();
  const [editImage, setEditImage] = useState<File | undefined>();
  const [imageURL, setImageURL] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  // let setSystemHealthId: number | undefined;
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

  const getFacilityData = async () => {
    try {
      setLoading(true);
      const facilityData = await getFacilityListData(
        Number(facilityDataId?.userId)
      );
      setData(facilityData?.data?.data[0]);
      setLoading(false);

      const imageUrlFromApi = facilityData?.data?.data[0]?.ImageUrl;
      if (imageUrlFromApi) {
        setImageURL(imageUrlFromApi);
        setImageLoading(false);
      } else {
        setImageURL(Camera);
        setImageLoading(false);
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

  useEffect(() => {
    getFacilityData();
  }, []);

  useEffect(() => {
    const setValues = () => {
      if (data) {
        setImageURL(data?.ImageUrl || "");
        setValue("name", capitalize(data?.Name || ""));
        setValue("type", data?.FacilityType?.Type || "");
        setValue(
          "healthSystemName",
          capitalize(data?.FacilityHealthSystem?.Name || "")
        );
        setValue("isTeachingHospital", data?.IsTeachingHospital || false);
        setValue("totalTalent", data?.TalentCountOnAssignment || 0);
        setValue("totalBedCount", data?.BedCount || 0);
        setValue("hospitalPhone", formatPhoneNumber(data?.HospitalPhone || ""));
        setValue("address", data?.Address || "");
        setValue("internalNotes", data?.InternalNotes || "");
        setValue("requirements", data?.Requiremnts || "");

        // Primary Contact
        setValue(
          "primaryContact.firstName",
          data?.PrimaryContact?.FirstName || ""
        );
        setValue(
          "primaryContact.lastName",
          data?.PrimaryContact?.LastName || ""
        );
        setValue("primaryContact.title", data?.PrimaryContact?.Title || "");
        setValue("primaryContact.email", data?.PrimaryContact?.Email || "");
        setValue(
          "primaryContact.mobile",
          formatPhoneNumber(data?.PrimaryContact?.Phone || "")
        );
        setValue("primaryContact.fax", data?.PrimaryContact?.Fax || "");

        // Secondary Contact
        setValue(
          "secondaryContact.firstName",
          data?.SecondaryContact?.FirstName || ""
        );
        setValue(
          "secondaryContact.lastName",
          data?.SecondaryContact?.LastName || ""
        );
        setValue("secondaryContact.title", data?.SecondaryContact?.Title || "");
        setValue("secondaryContact.email", data?.SecondaryContact?.Email || "");
        setValue(
          "secondaryContact.mobile",
          formatPhoneNumber(data?.SecondaryContact?.Phone || "")
        );
        setValue("secondaryContact.fax", data?.SecondaryContact?.Fax || "");

        dispatch({
          type: ActionTypes.SetSelectedFacility,
          payload: data.FacilityStatus
            ? {
              value: data?.FacilityStatus?.Id,
              label: data?.FacilityStatus?.Status,
            }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedState,
          payload: data.State
            ? { value: data?.State?.Id, label: data?.State?.State }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedCity,
          payload: data.City
            ? { value: data?.City?.Id, label: data?.City?.City }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedZip,
          payload: data.ZipCode
            ? { value: data?.ZipCode?.Id, label: data?.ZipCode?.ZipCode }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedProgramManager,
          payload: data.ProgramManager
            ? {
              value: data?.ProgramManager?.Id,
              label: `${capitalize(
                data?.ProgramManager?.FirstName
              )} ${capitalize(data.ProgramManager?.LastName)}`,
            }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedTrauma,
          payload: data.TraumaLevel
            ? { value: data?.TraumaLevel?.Id, label: data?.TraumaLevel?.Level }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedService,
          payload: data.ServiceType
            ? { value: data?.ServiceType?.Id, label: data?.ServiceType?.Type }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedContract,
          payload: data.ContractType
            ? { value: data?.ContractType?.Id, label: data?.ContractType?.Type }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedHealth,
          payload: data?.ParentHealthSystem
            ? {
              value: data?.ParentHealthSystem?.Id,
              label: capitalize(data?.ParentHealthSystem?.Name),
            }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedRole,
          payload: data?.PrimaryContact?.FacilityRole
            ? {
              value: data?.PrimaryContact?.FacilityRole?.Id,
              label: data?.PrimaryContact?.FacilityRole?.Role,
            }
            : null,
        });
        dispatch({
          type: ActionTypes.SetTeachingHospital,
          payload: data?.IsTeachingHospital?.toString(),
        });
        dispatch({
          type: ActionTypes.SetSelectedRole2,
          payload: data?.SecondaryContact?.FacilityRole
            ? {
              value: data?.SecondaryContact?.FacilityRole?.Id,
              label: data?.SecondaryContact?.FacilityRole?.Role,
            }
            : null,
        });
        dispatch({
          type: ActionTypes.SetSelectedFacilityType,
          payload: data.FacilityType?.Type,
        });
      }
    };
    setValues();
  }, [data]);

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
        // setSelectedState({
        //     value: selectedOption.value,
        //     label: selectedOption.label,
        // });

        dispatch({ type: ActionTypes.SetSelectedCity, payload: null });
        // setSelectedCity(null);
        const stateId: number = selectedOption.value;

        setLoading(true);
        const response = await getFacilityCities(stateId);
        dispatch({
          type: ActionTypes.SetCities,
          payload: response?.data?.data,
        });
        // setCities(response?.data?.data);
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
        // setSelectedCity(null);
        // setSelectedZip(null);
        return;
      }
      if (selectedOption) {
        dispatch({
          type: ActionTypes.SetSelectedCity,
          payload: { value: selectedOption.value, label: selectedOption.label },
        });
        // setSelectedCity({
        //     value: selectedOption.value,
        //     label: selectedOption.label
        // });

        dispatch({ type: ActionTypes.SetSelectedZip, payload: null });
        // setSelectedZip(null);
        const cityId: number = selectedOption.value;

        setLoading(true);
        const response = await getFacilityZipCode(cityId);
        dispatch({ type: ActionTypes.SetZip, payload: response?.data?.data });
        // setZip(response?.data?.data);
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
      // setSelectedZip(null);
    }
    dispatch({ type: ActionTypes.SetSelectedZip, payload: selectedOption });
    // setSelectedZip(selectedOption);
  };

  const handleHealthSystemNameChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: ActionTypes.SetSelectedHealth, payload: null });
      // setSelectedHealth(null);
    }
    dispatch({ type: ActionTypes.SetSelectedHealth, payload: selectedOption });
    dispatch({
      type: ActionTypes.SetSystemHealthId,
      payload: selectedOption?.value,
    });
    // setSelectedHealth(selectedOption);
    // setSystemHealthId(selectedOption?.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (selectedFacilityType === "child") {
        try {
          const response = await gethealthSystemName();
          dispatch({
            type: ActionTypes.SetHealthSystem,
            payload: response?.data?.data,
          });
          dispatch({
            type: ActionTypes.SetSelectedHealth,
            payload: data?.ParentHealthSystem
              ? {
                value: data?.ParentHealthSystem?.Id,
                label: capitalize(data?.ParentHealthSystem?.Name),
              }
              : null,
          });
          // setHealthSystem(response?.data?.data);
          // setSelectedHealth(data?.ParentHealthSystem ? { value: data?.ParentHealthSystem?.Id, label: capitalize(data?.ParentHealthSystem?.Name) } : null);
        } catch (error: any) {
          console.error(error);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        }
      } else if (selectedFacilityType === "parent") {
        try {
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
          // setFacilityId(facilityId?.data?.data[0]?.nextId);
          // setSystemHealthId(healthSystemId?.data?.data[0]?.nextId);
        } catch (error: any) {
          console.error(error);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        }
      } else if (selectedFacilityType === "standalone") {
        dispatch({ type: ActionTypes.SetSelectedHealth, payload: null });
        // setSelectedHealth(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedFacilityType]);

  const maxFileSize = 2;
  const validFileExtensions = { facilityPicture: ["jpg", "jpeg", "png"] };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage: File | undefined = e.target.files?.[0];

    if (selectedImage) {
      const fileExtension = getFileExtension(selectedImage);
      if (fileExtension !== undefined) {
        if (
          !fileExtension ||
          !validFileExtensions.facilityPicture.includes(fileExtension)
        ) {
          showToast("error", "Supported formats are only .jpg, .jpeg, .png");
          return;
        }
      }
      const fileSizeMb: number = selectedImage.size / (1024 * 1024);
      if (fileSizeMb > maxFileSize) {
        showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
        return;
      }
      setEditImage(selectedImage);
    }
  };

  // useEffect(() => {
  //     if (editImage) {
  //         const fileExtension = getFileExtension(editImage);
  //         if (fileExtension !== undefined) {
  //             if (!fileExtension || !validFileExtensions.facilityPicture?.includes(fileExtension)) {
  //                 showToast('error', 'Supported formats are only .jpg, .jpeg, .png');
  //                 return;
  //             }
  //         }

  //         const fileSizeMb: number = editImage?.size / (1024 * 1024);
  //         if (fileSizeMb > maxFileSize) {
  //             showToast('error', `File size exceeds the maximum limit of ${maxFileSize} MB`);
  //             return
  //         }
  //     }
  // }, [editImage]);

  const onSubmit = async (datas: FacilityType) => {
    datas.facilityId = Number(facilityId);
    datas.parentHealthSystemId = data?.ParentHealthSystem?.Id
      ? data?.ParentHealthSystem?.Id
      : data?.FacilityHealthSystem?.Id;
    datas.isTeachingHospital = teachingHospital == "true";
    datas.type = selectedFacilityType;
    datas.statusId = selectedFacility?.value ?? null;
    if (!datas.statusId) {
      showToast("error", "Please select facility status");
      selectedFacilityType;
    }

    datas.traumaLevelId = selectedTrauma?.value ?? null;
    if (!datas.traumaLevelId) {
      showToast("error", "Please select trauma level");
      return;
    }

    datas.contractTypeId = selectedContract?.value ?? null;
    if (!datas.contractTypeId) {
      showToast("error", "Please select contract type");
      return;
    }

    datas.serviceTypeId = selectedService?.value ?? null;
    if (!datas.serviceTypeId) {
      showToast("error", "Please select service type");
      return;
    }

    datas.stateId = selectedState?.value ?? null;
    if (!datas.stateId) {
      showToast("error", "Please select state");
      return;
    }

    datas.cityId = selectedCity?.value ?? null;
    if (!datas.cityId) {
      showToast("error", "Please select city");
      return;
    }

    datas.zipCodeId = selectedZip?.value ?? null;
    if (!datas.zipCodeId) {
      showToast("error", "Please select zip");
      return;
    }

    datas.facilityId = selectedFacility?.value ?? null;
    if (!datas.facilityId) {
      showToast("error", "Please select facility status");
      return;
    }

    datas.programManagerId = selectedProgramManager?.value ?? null;
    if (datas.secondaryContact) {
      datas.secondaryContact.facilityRoleId = selectedRole2?.value ?? null;
    }

    const healthSystemName: string =
      selectedFacilityType === "parent"
        ? datas.healthSystemName
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
      datas.healthSystemName = "";
    }

    const phone: string = datas.hospitalPhone.replace(/\D/g, "");
    const requirements: string = datas.requirements;
    const internalNotes: string = datas.internalNotes;
    const primaryFirstName: string | undefined =
      datas.primaryContact?.firstName;
    const primaryLastName: string | undefined = datas.primaryContact?.lastName;
    const primaryTitle: string | undefined = datas.primaryContact?.title;
    const primaryEmail: string | undefined = datas.primaryContact?.email;
    const primaryPhone: string | undefined =
      datas.primaryContact?.mobile.replace(/\D/g, "");
    const primaryFax: string | null | undefined = datas.primaryContact?.fax;
    const primaryFacilityRole: number | null =
      (datas.primaryContact.facilityRoleId = selectedRole?.value ?? null);
    const secondaryFirstName: string | undefined =
      datas.secondaryContact?.firstName;
    const secondaryLastName: string | undefined =
      datas.secondaryContact?.lastName;
    const secondaryTitle: string | undefined = datas.secondaryContact?.title;
    const secondaryEmail: string | undefined = datas.secondaryContact?.email;
    const secondaryPhone: string | undefined =
      datas.secondaryContact?.mobile.replace(/\D/g, "");
    const secondaryFax: string | null | undefined = datas.secondaryContact?.fax;
    const secondaryFacilityRole: number | null =
      (datas.secondaryContact.facilityRoleId = selectedRole2?.value ?? null);

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
      const requiredPrimaryContactFields: (keyof typeof datas.primaryContact)[] =
        ["firstName", "lastName", "title", "email", "mobile", "facilityRoleId"];
      const isAllPrimaryContactsFilled: boolean =
        requiredPrimaryContactFields.every(
          (field): boolean => !!datas.primaryContact?.[field]
        );

      if (!isAllPrimaryContactsFilled) {
        showToast("error", "Please fill all fields of the primary contact");
        return;
      }
    }

    if (isSecondaryContactFilled) {
      const requiredSecondaryContactFields: (keyof typeof datas.secondaryContact)[] =
        ["firstName", "lastName", "title", "email", "mobile", "facilityRoleId"];
      const isAllSecondaryContactFieldsFilled: boolean =
        requiredSecondaryContactFields.every(
          (field): boolean => !!datas.secondaryContact?.[field]
        );

      if (!isAllSecondaryContactFieldsFilled) {
        showToast(
          "error",
          "Error: Please fill all fields of the secondary contact"
        );
        return;
      }
    }
    try {
      setLoading(true);
      const user: any = await editFacility(
        Number(facilityDataId?.userId),
        datas?.name,
        datas?.statusId,
        datas?.type,
        datas?.parentHealthSystemId,
        datas?.isTeachingHospital,
        datas?.totalTalent,
        datas?.totalBedCount,
        datas?.traumaLevelId,
        datas?.contractTypeId,
        datas?.programManagerId,
        phone,
        datas?.serviceTypeId,
        datas?.address,
        datas?.stateId,
        datas?.cityId,
        datas?.zipCodeId,
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
        "Facility edited successfully" || user?.data?.message
      );
      setTimeout(() => {
        navigate("/facility");
      }, 1500);
      if (editImage) {
        const upload = await editImageToBucket(
          Number(facilityDataId?.userId),
          editImage
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
            ? "Facility Image edit failed"
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
        <span>Edit Facility</span>
      </div>
      <CustomMainCard>
        <h2 className="page-content-header">Facility Details</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {loading && <Loader />}
          <div className="d-flex" style={{ gap: "20px" }}>
            <div className="facility-camera-wrapper facility-add-camera  position-relative">
              {editImage && (
                <img
                  src={URL.createObjectURL(editImage)}
                  alt="camera-img"
                  width="140"
                  height="140"
                  className="file-camera-img w-100"
                />
              )}
              {imageLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Loader />
                </div>
              )}

              {!imageLoading && imageURL && !editImage && (
                <img
                  src={`${imageURL}`}
                  alt="facilityPicture"
                  className="file-camera-img w-100 h-100"
                />
              )}

              {!imageLoading && !imageURL && !editImage && (
                <img
                  src={Camera}
                  alt="camera-img"
                  className="file-camera-img"
                  width={"54"}
                  height={"54"}
                />
              )}

              <CustomInput
                id="facilityPicture"
                title={"Click here to upload"}
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleImageUpload(e)
                }
              />
            </div>

            <Row className="w-100">
              <Col xxl="2" xl="4" lg="4" md="4" className="col-group">
                <Label className="">Facility ID</Label>
                <CustomInput
                  id="facilityId"
                  value={
                    facilityDataId
                      ? `FID-${Number(facilityDataId?.userId)}`
                      : ""
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
                  noOptionsMessage={(): string => "No Facility Status Found"}
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
                      selected={teachingHospital ?? "true"}
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
                      disabled={true}
                      options={[
                        { label: "Parent", value: "parent" },
                        { label: "Child", value: "child" },
                        { label: "Stand Alone", value: "standalone" },
                      ]}
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
                      : data?.ParentHealthSystem?.Id
                        ? `HSID-${data?.ParentHealthSystem?.Id}`
                        : data?.FacilityHealthSystem?.Id
                          ? `HSID-${data?.FacilityHealthSystem?.Id}`
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
                <Label>Health System Name</Label>
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
                    isDisabled={
                      selectedFacilityType === "standalone" ||
                      selectedFacilityType === "child"
                    }
                  />
                )}
              </Col>
              <Col xxl="5" xl="4" lg="6" md="4" className="col-group">
                <Label className="">
                  Total Talent on Assignment <span className="asterisk">*</span>
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
                noOptionsMessage={(): string => "No Contract Found"}
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
              <Label className="">Service Type</Label>
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
            <Col xxl="4" xl="4" lg="3" md="6" className="col-group">
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
            <Col xxl="4" xl="4" lg="3" md="6" className="col-group">
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

export default EditFacility;
