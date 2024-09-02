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
import Loader from "../../../components/custom/CustomSpinner";
import {
  WorkHistoryModalDropdown,
  WorkHistoryModalProps,
  WorkHistoryModalRadiobtn,
  WorkHistoryModalType,
} from "../../../types/WorkHistoryModalTypes";
import { Form, useParams } from "react-router-dom";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import CustomInput from "../../../components/custom/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { WorkHistoryModalSchema } from "../../../helpers/schemas/WorkHistoryModalSchema";
import ReactDatePicker from "react-datepicker";
import CustomCheckbox from "../../../components/custom/CustomCheckboxBtn";
import {
  checkAclPermission,
  formatDate,
  formatDateInDayMonthYear,
  showToast,
} from "../../../helpers";
import Calendar from "../../../assets/images/calendar.svg";
import CustomSelect from "../../../components/custom/CustomSelect";
import RadioBtn from "../../../components/custom/CustomRadioBtn";
import { getStates } from "../../../services/user";
import {
  getJobShifts,
  getJobSpecialities,
  getProfessions,
  getProfessionsCategories,
} from "../../../services/JobsServices";
import { getTraumaLevels } from "../../../services/facility";
import { useDispatch, useSelector } from "react-redux";
import {
  LocationList,
  ProfessionList,
  ShiftList,
  SpecialityList,
  TraumaList,
} from "../../../types/StoreInitialTypes";
import {
  getLocationList,
  getProfessionList,
  getShiftList,
  getSpecialityList,
  getTraumaList,
  setLocationList,
  setProfessionList,
  setShiftList,
  setSpecialityList,
  setTraumaList,
  toggleFetchDetails,
} from "../../../store/ProfessionalDetailsSlice";
import {
  BooleanSelectOption,
  SelectOption,
} from "../../../types/FacilityTypes";
import { createWorkHistory } from "../../../services/ProfessionalDetails";
import { toast } from "react-toastify";
import CustomBooleanSelect from "../../../components/custom/CustomBooleanSelect";
import ACL from "../../../components/custom/ACL";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import DropdownImage from "../../../assets/images/dropdown-arrow.svg";
import { ProfessionSubCategoryType } from "../../../types/ProfessionalTypes";

const WorkHistoryModal = ({ isOpen, toggle, fetch }: WorkHistoryModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkHistoryModalType>({
    resolver: yupResolver(WorkHistoryModalSchema) as any,
  });
  const allow = checkAclPermission("professionals", "details", ["GET", "POST"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const dispatch = useDispatch();
  const states: LocationList[] = useSelector(getLocationList);
  const trauma: TraumaList[] = useSelector(getTraumaList);
  const profession: ProfessionList[] = useSelector(getProfessionList);
  const shift: ShiftList[] = useSelector(getShiftList);
  const speciality: SpecialityList[] = useSelector(getSpecialityList);
  const [radionBtnValue, setRadionBtnValue] =
    useState<WorkHistoryModalRadiobtn>({
      selectedAttending: false,
      selectedTeachingFacility: false,
      selectedMagnetFacility: false,
      selectedTraumaFacility: false,
    });
  const params = useParams();
  const [selectedValue, setSelectedValue] = useState<WorkHistoryModalDropdown>({
    selectedState: null,
    selectedProfession: null,
    selectedSpeciality: null,
    selectedTrauma: null,
    selectedChart: null,
    selectedShift: null,
    selectedChargeExperience: null,
  });

  const [specialityId, setSpecialityId] = useState<number>();
  // const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setValue("startDate", date ? date.toString() : "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleEndDateChange = (date: Date) => setEndDate(date);

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue((prevValue: WorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedAttending: e.target.checked,
    }));
    setEndDate(null);
  };

  const handleMagnetFacility = (e: string) =>
    setRadionBtnValue((prevValue: WorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedMagnetFacility: e,
    }));

  const handleTeachingFacility = (e: string) =>
    setRadionBtnValue((prevValue: WorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTeachingFacility: e,
    }));

  const handleTraumaFacility = (e: string) => {
    setRadionBtnValue((prevValue: WorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTraumaFacility: e,
    }));
    setRadionBtnValue((prevValue: WorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTraumaFacility: e,
    }));
  };

  const fetchDropDownValues = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const [states, professions, shifts, trauma] = await Promise.all([
        getStates(),
        getProfessions(),
        // getJobSpecialities(),
        getJobShifts(),
        getTraumaLevels(),
      ]);
      dispatch(setLocationList(states.data?.data));
      dispatch(setProfessionList(professions.data?.data));
      // dispatch(setSpecialityList(specialities.data?.data));
      dispatch(setShiftList(shifts.data?.data));
      dispatch(setTraumaList(trauma.data?.data));
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [dispatch]);

  // const fetchProfession = async () => {
  //   if (selectedCategory) {
  //     const response = await getProfessionsCategories(selectedCategory);

  //     setProfessionCategory(response.data?.data);
  //   }
  // };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getJobSpecialities(specialityId);
        dispatch(setSpecialityList(specialities.data?.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfessionSubcategories = async () => {
    try {
      const professionLength = profession?.length;
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
  //   setProfessionCategory([]);
  // }, [selectedCategory]);

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [profession?.length]);

  useEffect(() => {
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    fetchDropDownValues();
  }, [fetchDropDownValues]);

  const onSubmit = async (data: WorkHistoryModalType) => {
    try {
      // if (!selectedValue.selectedChart) {
      //   return showToast("error", "Please select the charting system");
      // }

      // if (!selectedValue.selectedProfession) {
      //   return showToast("error", "Please select the profession");
      // }

      // if (!selectedValue.selectedShift) {
      //   return showToast("error", "Please select the shift");
      // }

      if (!selectedValue.selectedSpeciality) {
        return showToast("error", "Please select the speciality");
      }

      if (!selectedValue.selectedState) {
        return showToast("error", "Please select the location");
      }

      if (radionBtnValue.selectedTraumaFacility === "true") {
        if (!selectedValue.selectedTrauma) {
          return showToast("error", "Please select the trauma level");
        }
      }

      // if (!startDate) {
      //   return showToast("error", "Please select the start date");
      // }

      if (radionBtnValue.selectedAttending === false && !endDate) {
        return showToast(
          "error",
          "Please select the end date if not currently attending"
        );
      }

      // if (endDate) {
      //   if (endDate < startDate) {
      //     return showToast(
      //       "error",
      //       "End date cannot be smaller than Start date"
      //     );
      //   }
      // }

      if (data.facilityBeds && Number(data.facilityBeds) < 0) {
        return showToast(
          "error",
          "Please enter facility beds greater than or equal to 0"
        );
      }

      if (data.bedsInUnit && Number(data.bedsInUnit) < 0) {
        return showToast(
          "error",
          "Please enter beds in unit greater than or equal to 0"
        );
      }

      const response = await createWorkHistory({
        professionalId: Number(params?.Id),
        startDate: startDate ? formatDate(startDate?.toString()) : "",
        endDate: radionBtnValue.selectedAttending
          ? null
          : endDate && formatDate(endDate?.toString()),
        isCurrentlyWorking: radionBtnValue.selectedAttending,
        facilityName: data?.facilityName,
        stateId: selectedValue.selectedState?.value,
        facilityType: data.facilityType,
        professionId: selectedValue.selectedProfession?.Id,
        specialityId: selectedValue.selectedSpeciality?.value,
        nurseToPatientRatio: data?.nurseToPatientRatio
          ? data?.nurseToPatientRatio
          : null,
        facilityBeds: data?.facilityBeds ? Number(data?.facilityBeds) : null,
        isTeachingFacility: radionBtnValue.selectedTeachingFacility
          ? Boolean(radionBtnValue.selectedTeachingFacility)
          : false,
        bedsInUnit: data?.bedsInUnit ? Number(data?.bedsInUnit) : null,
        isMagnetFacility: radionBtnValue.selectedMagnetFacility
          ? Boolean(radionBtnValue.selectedMagnetFacility)
          : false,
        isTraumaFacility: radionBtnValue.selectedTraumaFacility
          ? Boolean(radionBtnValue.selectedTraumaFacility)
          : false,
        traumaLevelId:
          radionBtnValue.selectedTraumaFacility === "true"
            ? selectedValue.selectedTrauma?.value
            : null,
        additionalInfo: data?.additionalInfo ? data?.additionalInfo : null,
        positionHeld: data?.positionHeld,
        agencyName: data?.agencyName ? data?.agencyName : null,
        isChargeExperience: selectedValue.selectedChargeExperience
          ? selectedValue.selectedChargeExperience?.value
          : null,
        isChartingSystem: selectedValue.selectedChargeExperience
          ? selectedValue.selectedChart?.value
          : null,
        shiftId: selectedValue.selectedShift
          ? selectedValue.selectedShift.value
          : null,
        reasonForLeaving: data?.reasonForLeaving
          ? data?.reasonForLeaving
          : null,
      });

      if (response.status === 201) {
        showToast("success", response?.data?.message);
        toggle();
        fetch();
        dispatch(toggleFetchDetails());
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const chargeOptions: BooleanSelectOption[] = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const chartingSystemOptions: BooleanSelectOption[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const handleStateChange = (selectedOption: SelectOption | null) => {
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedState: selectedOption,
    }));
  };

  // const handleFacilityChange = (selectedOption: SelectOption | null) => {
  //   setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
  //     ...prevValue,
  //     selectedFacility: selectedOption,
  //   }));
  // };

  // const handleProfession = (selectedOption: SelectOption | null) => {
  //   setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
  //     ...prevValue,
  //     selectedProfession: selectedOption,
  //   }));
  // };

  const handleSpecialities = (selectedOption: SelectOption | null) => {
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedSpeciality: selectedOption,
    }));
  };

  const handleTrauma = (selectedOption: SelectOption | null) => {
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedTrauma: selectedOption,
    }));
  };

  const handleChartingSystem = (selectedOption: BooleanSelectOption | null) => {
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedChart: selectedOption,
    }));
  };

  const handleChargeExperience = (
    selectedOption: BooleanSelectOption | null
  ) => {
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedChargeExperience: selectedOption,
    }));
  };

  const handleShiftTime = (selectedOption: SelectOption | null) => {
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedShift: selectedOption,
    }));
  };

  // const handleProfession = (categoryIndex: number) => {
  //   setSelectedCategory(categoryIndex);
  // };

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCategoryProfession(professionItem.Profession);
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedProfession: professionItem,
    }));
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedSpeciality: null,
    }));
    // dispatch({
    //   type: JobsActions.SetSelectedSpecialities,
    //   payload: null,
    // });
    setSpecialityId(professionItem.Id);
    setValue("categoryProfession", professionItem.Profession, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      {loading && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle} className="text-header ps-4">
          Add Work History
        </ModalHeader>
        <ModalBody
          className="programModal history-modal"
          style={{ padding: "20px 30px", height: "750px", overflow: "auto" }}
        >
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <h6 style={{ lineHeight: 1.6 }}>
                If you have been promoted, switched units, or took a new
                position within the same facility please list each position{" "}
                <br /> separately in your profile
              </h6>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Start Date
                  <span className="asterisk">*</span>
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
                        invalid={!!errors.startDate}
                        {...register("startDate")}
                        placeholder="Select Date"
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
                <FormFeedback>{errors.startDate?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  End Date
                  <span className="asterisk">*</span>
                </Label>
                <ReactDatePicker
                  dateFormat={"dd-MM-yyyy"}
                  isClearable={true}
                  disabled={radionBtnValue.selectedAttending}
                  readOnly={radionBtnValue.selectedAttending}
                  minDate={startDate ? startDate : null}
                  placeholderText="--"
                  onChange={handleEndDateChange}
                  onChangeRaw={(e) => e.preventDefault()}
                  selected={radionBtnValue.selectedAttending ? null : endDate}
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
                        disabled={radionBtnValue.selectedAttending}
                        placeholder="Select Date"
                        value={
                          radionBtnValue.selectedAttending
                            ? ""
                            : endDate && endDate
                            ? formatDateInDayMonthYear(endDate?.toString())
                            : ""
                        }
                      />
                      {!endDate && (
                        <img src={Calendar} className="calendar-icon" />
                      )}
                    </div>
                  }
                />
              </Col>
              <Col xxl="12" xl="12" lg="12">
                <div className="d-flex mb-2">
                  <CustomCheckbox
                    disabled={false}
                    checked={radionBtnValue.selectedAttending}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleCheckBoxChange(e)
                    }
                  />
                  <Label className="col-label mb-2 mt-1 text-grey fw-400">
                    Currently Attending
                  </Label>
                </div>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Facility/Agency Name
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Facility/Agency Name"
                  invalid={!!errors.facilityName}
                  {...register("facilityName")}
                />
                <FormFeedback>{errors.facilityName?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Facility Locations
                  <span className="asterisk">*</span>
                </Label>
                <CustomSelect
                  id="State"
                  name="State"
                  value={selectedValue.selectedState}
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
              <Col md="6" className="col-group">
                <Label className="col-label">
                  Select Profession <span className="asterisk">*</span>
                </Label>
                <Menu
                  menuButton={
                    <CustomInput
                      placeholder="Select Profession"
                      invalid={!!errors.categoryProfession}
                      {...register("categoryProfession")}
                      style={{
                        cursor: "pointer",
                        caretColor: "transparent",
                      }}
                      type="text"
                      value={categoryProfession ?? ""}
                    />
                  }
                >
                  {profession?.map((item: any, index: number) => (
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
                {errors?.categoryProfession && (
                  <FormFeedback>
                    {errors?.categoryProfession?.message}
                  </FormFeedback>
                )}
                <img
                  src={DropdownImage}
                  alt="DropdownImage"
                  className="submenu-dropdown"
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
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
                  value={selectedValue.selectedSpeciality}
                  placeholder="Select Speciality"
                  noOptionsMessage={() => "No Speciality Found"}
                  onChange={(speciality) => handleSpecialities(speciality)}
                  isClearable={true}
                  isSearchable={true}
                  isDisabled={!categoryProfession}
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Facility Type
                  <span className="asterisk">*</span>
                </Label>

                <CustomInput
                  placeholder="Facility Type"
                  invalid={!!errors.facilityType}
                  {...register("facilityType")}
                />
                <FormFeedback>{errors.facilityType?.message}</FormFeedback>
                {/* <CustomSelect
                  id="State"
                  name="State"
                  value={selectedValue.selectedFacility}
                  onChange={(facility) => handleFacilityChange(facility)}
                  options={facilityOptions.map(
                    (facility: {
                      value: number;
                      label: string;
                    }): SelectOption => ({
                      value: facility.value,
                      label: facility.label,
                    })
                  )}
                  placeholder="Facility Type"
                  noOptionsMessage={(): string => "No Facility Type Found"}
                  isSearchable={true}
                  isClearable={true}
                /> */}
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Nurse to Patient Ratio
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomInput
                  placeholder="Nurse to Patient Ratio"
                  invalid={!!errors.nurseToPatientRatio}
                  {...register("nurseToPatientRatio")}
                />
                <FormFeedback>
                  {errors.nurseToPatientRatio?.message}
                </FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Facility Beds
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomInput
                  type="number"
                  min={1}
                  placeholder="Facility Beds"
                  invalid={!!errors.facilityBeds}
                  {...register("facilityBeds")}
                />
                <FormFeedback>{errors.facilityBeds?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Beds in Unit
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomInput
                  type="number"
                  min={1}
                  placeholder="Beds in Unit"
                  invalid={!!errors.bedsInUnit}
                  {...register("bedsInUnit")}
                />
                <FormFeedback>{errors.bedsInUnit?.message}</FormFeedback>
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Teaching Facility</Label>
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
                            handleTeachingFacility(value)
                          }
                          selected={radionBtnValue.selectedTeachingFacility?.toString()}
                        />
                      </span>
                    </td>
                  </tbody>
                </table>
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Magnet Facility</Label>
                <table className="w-100">
                  <tbody className="m-4">
                    <td>
                      <span>
                        <RadioBtn
                          options={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" },
                          ]}
                          name=""
                          selected={radionBtnValue.selectedMagnetFacility?.toString()}
                          onChange={(value: string) =>
                            handleMagnetFacility(value)
                          }
                        />
                      </span>
                    </td>
                  </tbody>
                </table>
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Trauma Facility</Label>
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
                            handleTraumaFacility(value)
                          }
                          selected={radionBtnValue.selectedTraumaFacility?.toString()}
                        />
                      </span>
                    </td>
                  </tbody>
                </table>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Trauma Facility Level
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomSelect
                  id="traumaLevel"
                  name="traumaLevel"
                  value={selectedValue.selectedTrauma}
                  onChange={(trauma) => handleTrauma(trauma)}
                  placeholder={"Select Trauma Level"}
                  options={trauma?.map(
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
                  isDisabled={
                    radionBtnValue.selectedTraumaFacility === "false" ||
                    radionBtnValue.selectedTraumaFacility === false
                  }
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">Additional Info</Label>
                <CustomInput
                  placeholder="Additional Info"
                  invalid={!!errors.additionalInfo}
                  {...register("additionalInfo")}
                />
                <FormFeedback>{errors.additionalInfo?.message}</FormFeedback>
              </Col>
              <h5>Position Details</h5>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Position Held
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="Position Held"
                  invalid={!!errors.positionHeld}
                  {...register("positionHeld")}
                />
                <FormFeedback>{errors.positionHeld?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">Agency Name (if applicable)</Label>
                <CustomInput
                  placeholder="Agency Name"
                  invalid={!!errors.agencyName}
                  {...register("agencyName")}
                />
                {errors.agencyName?.message && (
                  <FormFeedback>{errors.agencyName?.message}</FormFeedback>
                )}
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Charge Experience
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomBooleanSelect
                  id="Charge Experience"
                  name="Charge Experience"
                  noOptionsMessage={(): string => "No Charge Experience Found"}
                  value={selectedValue.selectedChargeExperience}
                  options={chargeOptions}
                  onChange={(state) => handleChargeExperience(state)}
                  placeholder="Charge Experience"
                  // isSearchable={true}
                  isClearable={true}
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Charting System
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomBooleanSelect
                  id="Charting System"
                  name="Charting System"
                  value={selectedValue.selectedChart}
                  onChange={(state) => handleChartingSystem(state)}
                  options={chartingSystemOptions.map(
                    (item: BooleanSelectOption): BooleanSelectOption => ({
                      value: item.value,
                      label: item.label,
                    })
                  )}
                  placeholder="Charting System"
                  noOptionsMessage={(): string => "No Charting System Found"}
                  isSearchable={true}
                  isClearable={true}
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Shift
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomSelect
                  id={"shiftTime"}
                  name={"shiftTime"}
                  options={shift?.map(
                    (templateShift: {
                      Id: number;
                      Shift: string;
                    }): { value: number; label: string } => ({
                      value: templateShift?.Id,
                      label: templateShift?.Shift,
                    })
                  )}
                  value={selectedValue.selectedShift}
                  placeholder="Select Shift"
                  noOptionsMessage={() => "No Shift Found"}
                  onChange={(time) => handleShiftTime(time)}
                  isClearable={true}
                  isSearchable={true}
                  menuPlacement="top"
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">
                  Reason for Leaving
                  {/* <span className="asterisk">*</span> */}
                </Label>
                <CustomInput
                  placeholder="Reason for Leaving"
                  invalid={!!errors.reasonForLeaving}
                  {...register("reasonForLeaving")}
                />
                <FormFeedback>{errors.reasonForLeaving?.message}</FormFeedback>
              </Col>
            </Row>
            <ACL
              module="professionals"
              submodule="details"
              action={["GET", "POST"]}
            >
              <Button color="primary primary-btn ms-0 me-2" disabled={!allow}>
                Save
              </Button>
            </ACL>
            <Button color="secondary secondary-btn" onClick={toggle}>
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default WorkHistoryModal;
