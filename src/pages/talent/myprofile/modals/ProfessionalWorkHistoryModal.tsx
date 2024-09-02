import ReactDatePicker from "react-datepicker";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import Calendar from "../../../../assets/images/calendar.svg";
import moment from "moment";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomCheckbox from "../../../../components/custom/CustomCheckboxBtn";
import CustomSelect from "../../../../components/custom/CustomSelect";
import { ProfessionalWorkHistoryModalProps } from "../../../../types/ProfessionalMyProfile";
import Loader from "../../../../components/custom/CustomSpinner";
import { Form } from "react-router-dom";
import {
  ProfessionalWorkHistoryModalRadiobtn,
  WorkHistoryModalDropdown,
  WorkHistoryModalType,
} from "../../../../types/WorkHistoryModalTypes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfessionalWorkHistoryModalSchema } from "../../../../helpers/schemas/WorkHistoryModalSchema";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import { ProfessionSubCategoryType } from "../../../../types/ProfessionalTypes";
import {
  LocationList,
  ProfessionList,
  ShiftList,
  SpecialityList,
  TraumaList,
} from "../../../../types/StoreInitialTypes";
import { useDispatch, useSelector } from "react-redux";
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
} from "../../../../store/ProfessionalDetailsSlice";
import DropdownImage from "../../../../assets/images/dropdown-arrow.svg";
import {
  BooleanSelectOption,
  SelectOption,
} from "../../../../types/FacilityTypes";
import CustomBooleanSelect from "../../../../components/custom/CustomBooleanSelect";
import { showToast } from "../../../../helpers";
import {
  getProfessionalCategories,
  getProfessionalProfessions,
  getProfessionalSpecialities,
  getProfessionalStates,
} from "../../../../services/ProfessionalAuth";
import {
  createProfessionalWorkHistory,
  getProfessionalShifts,
  getProfessionalTrauma,
} from "../../../../services/ProfessionalMyProfile";
import myProfileReducer from "../../../../helpers/reducers/MyProfileReducer";
import { ActionType } from "../../../../types/ProfessionalAuth";

const ProfessionalWorkHistoryModal = ({
  isOpen,
  toggle,
  fetch,
  setFetchDetails,
}: ProfessionalWorkHistoryModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkHistoryModalType>({
    resolver: yupResolver(ProfessionalWorkHistoryModalSchema) as any,
  });

  const initialState = {
    selectedState: null,
    selectedCity: null,
    selectedZip: null,
    states: [],
    cities: [],
    zip: [],
    selectedQuestion: null,
    bgQuestions: [],
    documents: [],
    uploadedDocuments: [],
    additionalDetails: [],
    gendersList: [],
    federalQuestions: [],
    emergencyContactList: [],
    talentJobDetailsList: [],
    requiredDocsList: [],
  };

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [specialityId, setSpecialityId] = useState<number>();
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const states: LocationList[] = useSelector(getLocationList);
  const trauma: TraumaList[] = useSelector(getTraumaList);
  const profession: ProfessionList[] = useSelector(getProfessionList);
  const shift: ShiftList[] = useSelector(getShiftList);
  const speciality: SpecialityList[] = useSelector(getSpecialityList);
  const dispatch = useDispatch();
  const [state, reducerDispatch] = useReducer(myProfileReducer, initialState);
  const { selectedState } = state;

  const [radionBtnValue, setRadionBtnValue] =
    useState<ProfessionalWorkHistoryModalRadiobtn>({
      selectedAttending: false,
      selectedTeachingFacility: false,
      selectedMagnetFacility: false,
      selectedTraumaFacility: false,
    });
  const [selectedValue, setSelectedValue] = useState<WorkHistoryModalDropdown>({
    selectedState: null,
    selectedProfession: null,
    selectedSpeciality: null,
    selectedTrauma: null,
    selectedChart: null,
    selectedShift: null,
    selectedChargeExperience: null,
  });

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

    setSpecialityId(professionItem?.Id);
  };

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleEndDateChange = (date: Date) => setEndDate(date);

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedAttending: e.target.checked,
    }));
    setEndDate(null);
  };

  const handleMagnetFacility = (e: ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedMagnetFacility: e.target.checked,
    }));
  };

  const handleMagnetFacilityNo = (e: string) =>
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedMagnetFacility: e === "No" ? false : true,
    }));

  const handleTeachingFacility = (e: ChangeEvent<HTMLInputElement>) =>
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTeachingFacility: e.target.checked,
    }));

  const handleTeachingFacilityNo = (e: string) =>
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTeachingFacility: e === "No" ? false : true,
    }));

  const handleTraumaFacility = (e: ChangeEvent<HTMLInputElement>) =>
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTraumaFacility: e.target.checked,
    }));

  const handleTraumaFacilityNo = (e: string) => {
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTraumaFacility: e === "No" ? false : true,
    }));
    if (e === "No") {
      setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
        ...prevValue,
        selectedTrauma: null,
      }));
    }
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

  const handleStateChange = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    try {
      if (selectedOption === null) {
        reducerDispatch({ type: ActionType.SetSelectedState, payload: null });
        reducerDispatch({ type: ActionType.SetSelectedCity, payload: null });
        return;
      }
      if (selectedOption) {
        reducerDispatch({
          type: ActionType.SetSelectedState,
          payload: {
            value: selectedOption.value,
            label: selectedOption.label,
          },
        });

        reducerDispatch({ type: ActionType.SetSelectedCity, payload: null });
        // const stateId: number = selectedOption.value;

        // setLoading(true);
        // const response = await getProfessionalCities(stateId);
        // reducerDispatch({
        //   type: ActionType.SetCities,
        //   payload: response?.data?.data,
        // });
        // setLoading(false);
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

  //   const handleCityChange = async (
  //     selectedOption: { value: number; label: string } | null
  //   ) => {
  //     try {
  //       if (selectedOption === null) {
  //         reducerDispatch({ type: ActionType.SetSelectedCity, payload: null });

  //         return;
  //       }
  //       if (selectedOption) {
  //         reducerDispatch({
  //           type: ActionType.SetSelectedCity,
  //           payload: {
  //             value: selectedOption.value,
  //             label: selectedOption.label,
  //           },
  //         });
  //       }
  //     } catch (error: any) {
  //       console.error(error);
  //       setLoading(false);
  //       showToast(
  //         "error",
  //         error?.response?.data?.message || "Something went wrong"
  //       );
  //     }
  //   };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getProfessionalSpecialities(specialityId);
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
          const response = await getProfessionalCategories(i);
          subCategoriesArray.push(response.data?.data);
        }
        setSubCategories(subCategoriesArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSpecialities = (selectedOption: SelectOption | null) => {
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedSpeciality: selectedOption,
    }));
  };

  const fetchDropDownValues = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const [states, professions, shifts, trauma] = await Promise.all([
        getProfessionalStates(),
        getProfessionalProfessions(),
        getProfessionalShifts(),
        getProfessionalTrauma(),
      ]);
      dispatch(setLocationList(states.data?.data));
      dispatch(setProfessionList(professions.data?.data));
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

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [profession?.length]);

  useEffect(() => {
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    fetchDropDownValues();
  }, [fetchDropDownValues]);

  const chargeOptions: BooleanSelectOption[] = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const chartingSystemOptions: BooleanSelectOption[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const onSubmit = async (data: WorkHistoryModalType) => {
    if (!selectedValue.selectedProfession) {
      return showToast("error", "Please select the profession");
    }

    if (!selectedValue.selectedSpeciality) {
      return showToast("error", "Please select the speciality");
    }

    if (!selectedState) {
      return showToast("error", "Please select the state");
    }

    // if (!radionBtnValue.selectedTraumaFacility === true) {
    //   return showToast("error", "Please choose trauma facility to Yes");
    // }

    if (radionBtnValue.selectedTraumaFacility === true) {
      if (!selectedValue.selectedTrauma) {
        return showToast("error", "Please select the trauma level");
      }
    }

    if (!startDate) {
      return showToast("error", "Please select the start date");
    }

    if (radionBtnValue.selectedAttending === false && !endDate) {
      return showToast(
        "error",
        "Please select the end date if not currently working"
      );
    }

    if (endDate) {
      if (endDate < startDate) {
        return showToast("error", "End date cannot be greater than start date");
      }
    }

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

    try {
      const response = await createProfessionalWorkHistory({
        startDate: startDate
          ? moment(startDate?.toString()).format("YYYY-MM-DD")
          : "",
        endDate: radionBtnValue.selectedAttending
          ? null
          : endDate && moment(endDate?.toString()).format("YYYY-MM-DD"),
        isCurrentlyWorking: radionBtnValue.selectedAttending,
        facilityName: data?.facilityName,
        stateId: selectedState.value,
        facilityType: data.facilityType,
        professionId: selectedValue.selectedProfession.Id,
        specialityId: selectedValue.selectedSpeciality?.value,
        nurseToPatientRatio: data?.nurseToPatientRatio
          ? data?.nurseToPatientRatio
          : null,
        facilityBeds: data?.facilityBeds ? Number(data?.facilityBeds) : null,
        isTeachingFacility: radionBtnValue.selectedTeachingFacility
          ? radionBtnValue.selectedTeachingFacility
          : false,
        bedsInUnit: data?.bedsInUnit ? Number(data?.bedsInUnit) : null,
        isMagnetFacility: radionBtnValue.selectedMagnetFacility
          ? radionBtnValue.selectedMagnetFacility
          : false,
        isTraumaFacility: radionBtnValue.selectedTraumaFacility
          ? radionBtnValue.selectedTraumaFacility
          : false,
        traumaLevelId:
          radionBtnValue.selectedTraumaFacility === true
            ? selectedValue.selectedTrauma?.value
            : null,
        additionalInfo: data?.additionalInfo ? data?.additionalInfo : null,
        positionHeld: data?.positionHeld,
        agencyName: data?.agencyName ? data?.agencyName : null,
        isChargeExperience: selectedValue.selectedChargeExperience
          ? selectedValue.selectedChargeExperience?.value
          : false,
        isChartingSystem: selectedValue.selectedChargeExperience
          ? selectedValue.selectedChart?.value
          : false,
        shiftId: selectedValue.selectedShift
          ? selectedValue.selectedShift.value
          : null,
        reasonForLeaving: data?.reasonForLeaving
          ? data?.reasonForLeaving
          : null,
      });

      if (response.status === 201) {
        // showToast(
        //   "success",
        //   response?.data?.messag || "Work history created successfully"
        // );
        toggle();
        fetch();
        setFetchDetails && setFetchDetails((prev) => !prev);
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
        <ModalBody style={{ padding: "20px 30px", height: "auto" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <p className="form-small-text form-text-mw">
                If you have been promoted, switched units, or took a new
                position within the same facility please list each position
                separately in your profile.
              </p>

              <Row>
                <Col sm="6">
                  <div className="accented-date-picker mb-3">
                    <Label className="">
                      Start Date <span className="asterisk">*</span>
                    </Label>
                    <ReactDatePicker
                      selected={startDate}
                      isClearable={true}
                      onChange={handleStartDateChange}
                      timeIntervals={15}
                      dateFormat="h:mm aa"
                      className="custom-select-picker-all contract-select"
                      customInput={
                        <div className="custom-calendar-wrapper">
                          <CustomInput
                            value={
                              startDate
                                ? moment(startDate.toDateString()).format(
                                    "MM-DD-YYYY"
                                  )
                                : ""
                            }
                            placeholder="Start Date"
                          />
                          {!startDate && (
                            <img src={Calendar} className="calendar-icon" />
                          )}
                        </div>
                      }
                    />
                  </div>
                </Col>
                <Col sm="6">
                  <div className="accented-date-picker mb-3">
                    <Label className="">End Date</Label>
                    <ReactDatePicker
                      minDate={startDate ? startDate : null}
                      selected={
                        radionBtnValue.selectedAttending ? null : endDate
                      }
                      isClearable={true}
                      onChange={handleEndDateChange}
                      timeIntervals={15}
                      disabled={radionBtnValue.selectedAttending}
                      dateFormat="h:mm aa"
                      onChangeRaw={(e) => e.preventDefault()}
                      className="custom-select-picker-all contract-select"
                      customInput={
                        <div className="custom-calendar-wrapper">
                          <CustomInput
                            value={
                              radionBtnValue.selectedAttending
                                ? ""
                                : endDate && endDate
                                ? moment(endDate?.toString()).format(
                                    "MM-DD-YYYY"
                                  )
                                : ""
                            }
                            placeholder="End Date"
                            disabled={radionBtnValue.selectedAttending}
                          />
                          {!endDate ||
                            (radionBtnValue.selectedAttending && (
                              <img src={Calendar} className="calendar-icon" />
                            ))}
                          {!endDate && (
                            <img src={Calendar} className="calendar-icon" />
                          )}
                        </div>
                      }
                    />
                  </div>
                </Col>
                <Col sm="12">
                  <div className="d-flex mb-3 talent-check">
                    <CustomCheckbox
                      disabled={false}
                      checked={radionBtnValue.selectedAttending}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleCheckBoxChange(e)
                      }
                    />
                    <Label
                      for="current_working"
                      className="col-label register-check-lbl"
                    >
                      Currently Working
                    </Label>
                  </div>
                </Col>
                <Col lg="6" md="12">
                  <FormGroup>
                    <Label for="facility_name">
                      Facility Name <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Facility Name"
                      id="facility_name"
                      invalid={!!errors.facilityName}
                      {...register("facilityName")}
                    />
                    <FormFeedback>{errors.facilityName?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <div className="mb-3">
                    <Label for="state_drp">
                      Facility State <span className="asterisk">*</span>
                    </Label>
                    <CustomSelect
                      id="state_drp"
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
                  </div>
                </Col>
                {/* <Col lg="3" md="6">
                  <div className="mb-3">
                    <Label for="city_drp">
                      Facility City <span className="asterisk">*</span>
                    </Label>
                    <CustomSelect
                      id="city_drp"
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
                </Col> */}
                <Col sm="6" style={{ position: "relative" }}>
                  <div className="mb-3">
                    <Label for="profession_drp">
                      Profession <span className="asterisk">*</span>
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
                      {profession?.map((item: any, index: number) => (
                        <SubMenu
                          key={item.Id}
                          label={item.Category}
                          className="sub-menu"
                        >
                          {subCategories &&
                            subCategories[index]?.map(
                              (profItem: {
                                Id: number;
                                Profession: string;
                              }) => (
                                <MenuRadioGroup
                                  dir="top"
                                  key={profItem.Id}
                                  onClick={() =>
                                    handleProfessionCategory(profItem)
                                  }
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
                  </div>
                </Col>
                <Col sm="6">
                  <div className="mb-3">
                    <Label for="facility_drp">
                      Specialty <span className="asterisk">*</span>
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
                      className="mb-3"
                    />
                  </div>
                </Col>
                <Col sm="6">
                  <div className="mb-3">
                    <Label for="facility_type">
                      Facility Type <span className="asterisk">*</span>
                    </Label>
                    {/* <CustomSelect
                      className="mb-3"
                      value={data[0]}
                      id="facility_type"
                      placeholder={"Select Facility Type"}
                      onChange={() => {}}
                      name=""
                      noOptionsMessage={() => ""}
                      options={data}
                    ></CustomSelect> */}
                    <CustomInput
                      placeholder="Facility Type"
                      invalid={!!errors.facilityType}
                      {...register("facilityType")}
                    />
                    <FormFeedback>{errors.facilityType?.message}</FormFeedback>
                  </div>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="nurse_patient_ratio">
                      Nurse to Patient Ratio <span className="asterisk"></span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Nurse to Patient Ratio"
                      id="nurse_patient_ratio"
                      invalid={!!errors.nurseToPatientRatio}
                      {...register("nurseToPatientRatio")}
                    />
                    <FormFeedback>
                      {errors.nurseToPatientRatio?.message}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="facility_beds">Facility Beds</Label>
                    <CustomInput
                      type="number"
                      min={1}
                      placeholder="Facility Beds"
                      id="facility_beds"
                      invalid={!!errors.facilityBeds}
                      {...register("facilityBeds")}
                    />
                    <FormFeedback>{errors.facilityBeds?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="beds_in_unit">Beds In Unit</Label>
                    <CustomInput
                      type="number"
                      min={1}
                      placeholder="Beds In Unit"
                      id="beds_in_unit"
                      invalid={!!errors.bedsInUnit}
                      {...register("bedsInUnit")}
                    />
                    <FormFeedback>{errors.bedsInUnit?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <div
                    className="d-flex align-items-center flex-wrap"
                    style={{ gap: "0px 55px" }}
                  >
                    <div
                      className="purple-radio-btn d-flex flex-wrap mb-3 mt-2"
                      style={{ gap: "8px 12px" }}
                    >
                      <p className="radio-p-label">Teaching Facility</p>
                      <FormGroup check>
                        <Input
                          name="teaching_facility"
                          type="radio"
                          id="teaching_radio1"
                          onChange={(e) => handleTeachingFacility(e)}
                          checked={radionBtnValue.selectedTeachingFacility}
                        />{" "}
                        <Label for="teaching_radio1"> Yes </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          name="teaching_facility"
                          type="radio"
                          id="teaching_radio2"
                          onChange={() => handleTeachingFacilityNo("No")}
                          checked={!radionBtnValue.selectedTeachingFacility}
                        />{" "}
                        <Label check for="teaching_radio2">
                          {" "}
                          No
                        </Label>
                      </FormGroup>
                    </div>
                    <div
                      className="purple-radio-btn d-flex flex-wrap mb-3"
                      style={{ gap: "8px 12px" }}
                    >
                      <p className="radio-p-label">Magnet Facility</p>
                      <FormGroup check>
                        <Input
                          name="magnet_facility"
                          type="radio"
                          id="magnet_radio1"
                          onChange={(e) => handleMagnetFacility(e)}
                        />{" "}
                        <Label check for="magnet_radio1">
                          {" "}
                          Yes{" "}
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          name="magnet_facility"
                          type="radio"
                          id="magnet_radio2"
                          onChange={() => handleMagnetFacilityNo("No")}
                          checked={!radionBtnValue.selectedMagnetFacility}
                        />{" "}
                        <Label check for="magnet_radio2">
                          {" "}
                          No
                        </Label>
                      </FormGroup>
                    </div>
                    <div
                      className="purple-radio-btn d-flex flex-wrap mb-3 mt-2"
                      style={{ gap: "8px 12px" }}
                    >
                      <p className="radio-p-label">Trauma Facility</p>
                      <FormGroup check>
                        <Input
                          name="trauma_facility"
                          type="radio"
                          id="trauma_radio1"
                          onChange={(e) => handleTraumaFacility(e)}
                        />{" "}
                        <Label check for="trauma_radio1">
                          {" "}
                          Yes{" "}
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          name="trauma_facility"
                          type="radio"
                          id="trauma_radio2"
                          onChange={() => handleTraumaFacilityNo("No")}
                          checked={!radionBtnValue.selectedTraumaFacility}
                        />{" "}
                        <Label check for="trauma_radio2">
                          {" "}
                          No
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="mb-3">
                    <Label for="trauma_facility_drp">
                      Trauma Facility Level
                    </Label>
                    <CustomSelect
                      id="trauma_facility_drp"
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
                        radionBtnValue.selectedTraumaFacility === false
                      }
                    />
                  </div>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label for="additional_info">Additional Info</Label>
                    <CustomInput
                      type="text"
                      placeholder="Additional Info"
                      id="additional_info"
                      invalid={!!errors.additionalInfo}
                      {...register("additionalInfo")}
                    />
                    <FormFeedback>
                      {errors.additionalInfo?.message}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <h3 className="scroll-title mb-2" style={{ fontSize: "16px" }}>
                Position Details
              </h3>
              <Row>
                <Col sm="6">
                  <div className="mb-3">
                    <Label for="position_held">
                      Position Held <span className="asterisk">*</span>
                    </Label>
                    {/* <CustomSelect
                      className="mb-3"
                      value={data[0]}
                      id="position_held"
                      placeholder={"Position Held"}
                      onChange={() => {}}
                      name=""
                      noOptionsMessage={() => ""}
                      options={data}
                    ></CustomSelect> */}
                    <CustomInput
                      id="position_held"
                      placeholder="Position Held"
                      invalid={!!errors.positionHeld}
                      {...register("positionHeld")}
                    />
                    <FormFeedback>{errors.positionHeld?.message}</FormFeedback>
                  </div>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="additional_info">
                      Agency Name{" "}
                      <span className="grey_label_text">(If applicable)</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Agency Name"
                      id="additional_info"
                      invalid={!!errors.agencyName}
                      {...register("agencyName")}
                    />
                    <FormFeedback>{errors.agencyName?.message}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <div className="mb-3">
                    <Label for="charge_exp">Charge Experience</Label>
                    <CustomBooleanSelect
                      id="charge_exp"
                      name="Charge Experience"
                      noOptionsMessage={(): string =>
                        "No Charge Experience Found"
                      }
                      value={selectedValue.selectedChargeExperience}
                      options={chargeOptions}
                      onChange={(state) => handleChargeExperience(state)}
                      placeholder="Charge Experience"
                      // isSearchable={true}
                      isClearable={true}
                      className="mb-3"
                    />
                  </div>
                </Col>
                <Col sm="6">
                  <div className="mb-3">
                    <Label for="charting_system">Charting System</Label>
                    {/* <CustomSelect
                      className="mb-3"
                      value={data[0]}
                      id="charting_system"
                      placeholder={"Select Charting System"}
                      onChange={() => {}}
                      name=""
                      noOptionsMessage={() => ""}
                      options={data}
                    ></CustomSelect> */}
                    <CustomBooleanSelect
                      id="charting_system"
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
                      noOptionsMessage={(): string =>
                        "No Charting System Found"
                      }
                      isSearchable={true}
                      isClearable={true}
                    />
                  </div>
                </Col>
                <Col sm="6">
                  <div className="mb-3">
                    <Label for="shift_drp">Shift</Label>
                    <CustomSelect
                      id="shift_drp"
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
                      className="mb-3"
                    />
                  </div>
                </Col>
                <Col lg="6" sm="12">
                  <FormGroup>
                    <Label for="reason_for_leaving">Reason for Leaving</Label>
                    <CustomInput
                      type="text"
                      placeholder="Reason for leaving"
                      id="reason_for_leaving"
                      invalid={!!errors.reasonForLeaving}
                      {...register("reasonForLeaving")}
                    />
                    <FormFeedback>
                      {errors.reasonForLeaving?.message}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col>
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ gap: "12px" }}
                  >
                    <Button className="blue-gradient-btn mb-0">Save</Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProfessionalWorkHistoryModal;
