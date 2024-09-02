import ReactDatePicker from "react-datepicker";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import moment from "moment";
import CustomCheckbox from "../../../../components/custom/CustomCheckboxBtn";
import CustomSelect from "../../../../components/custom/CustomSelect";
import Calendar from "../../../../assets/images/calendar.svg";
import { WorkHistoryType } from "../../../../types/ProfessionalDetails";
import { showToast } from "../../../../helpers";
import { useForm } from "react-hook-form";
import {
  ProfessionalWorkHistoryModalRadiobtn,
  WorkHistoryModalDropdown,
  WorkHistoryModalType,
} from "../../../../types/WorkHistoryModalTypes";
import { ProfessionalWorkHistoryModalSchema } from "../../../../helpers/schemas/WorkHistoryModalSchema";
import { yupResolver } from "@hookform/resolvers/yup";
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
  getTraumaList,
  setLocationList,
  setProfessionList,
  setShiftList,
  setTraumaList,
} from "../../../../store/ProfessionalDetailsSlice";
import myProfileReducer from "../../../../helpers/reducers/MyProfileReducer";
import { ActionType } from "../../../../types/ProfessionalAuth";
import {
  getProfessionalCategories,
  getProfessionalProfessions,
  getProfessionalSpecialities,
  getProfessionalStates,
} from "../../../../services/ProfessionalAuth";
import {
  BooleanSelectOption,
  SelectOption,
} from "../../../../types/FacilityTypes";
import {
  deleteProfessionalWorkHistory,
  editProfessionalWorkHistory,
  getProfessionalShifts,
  getProfessionalTrauma,
} from "../../../../services/ProfessionalMyProfile";
import { Form } from "react-router-dom";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import CustomBooleanSelect from "../../../../components/custom/CustomBooleanSelect";
import DropdownImage from "../../../../assets/images/dropdown-arrow.svg";
import Loader from "../../../../components/custom/CustomSpinner";
import CustomDeleteBtn from "../../../../components/custom/CustomDeleteBtn";
let professionalId: number;

const ProfessionalWorkHistoryCard = ({
  Id,
  StartDate,
  EndDate,
  AdditionalInfo,
  AgencyName,
  FacilityName,
  State,
  JobProfession,
  JobShift,
  IsCurrentlyWorking,
  IsChargeExperience,
  IsChartingSystem,
  IsMagnetFacility,
  IsTeachingFacility,
  IsTraumaFacility,
  JobSpeciality,
  FacilityBeds,
  FacilityType,
  BedsInUnit,
  NurseToPatientRatio,
  ReasonForLeaving,
  PositionHeld,
  TraumaLevel,
  index,
  fetch,
  setFetchDetails,
}: WorkHistoryType) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
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
  const [speciality, setSpecialityList] = useState<SpecialityList[]>([]);
  const dispatch = useDispatch();
  const [state, reducerDispatch] = useReducer(myProfileReducer, initialState);
  const { selectedState } = state;
  const [edit, setEdit] = useState<boolean>(false);

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
    professionalId = professionItem?.Id;
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedProfession: professionItem,
    }));
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedSpeciality: null,
    }));
    setSpecialityId(professionItem?.Id);
    setSpecialityList([]);
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

  const handleTeachingFacilityNo = (e: string) => {
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTeachingFacility: e === "No" ? false : true,
    }));
  };

  const handleTraumaFacility = (e: ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTraumaFacility: e.target.checked,
    }));
  };

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

        setSpecialityList((prevValue: SpecialityList[]) => {
          return [...prevValue, ...specialities.data?.data];
        });
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
      showToast("error", "Something went wrong");
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
  }, [dispatch, setValue]);

  useEffect(() => {
    fetchDropDownValues();
  }, [fetchDropDownValues]);

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [profession?.length]);

  useEffect(() => {
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    setValue("additionalInfo", AdditionalInfo ? AdditionalInfo : "");
    setValue("agencyName", AgencyName ? AgencyName : "");
    setValue(
      "nurseToPatientRatio",
      NurseToPatientRatio ? NurseToPatientRatio : ""
    );
    setValue("facilityName", FacilityName ? FacilityName : "");
    setValue("positionHeld", PositionHeld ? PositionHeld : "");
    setValue("facilityType", FacilityType ? FacilityType : "");
    setValue("reasonForLeaving", ReasonForLeaving ? ReasonForLeaving : "");
    setValue("bedsInUnit", BedsInUnit ? BedsInUnit?.toString() : "");
    setValue("facilityBeds", FacilityBeds ? FacilityBeds?.toString() : "");
    setStartDate(StartDate ? new Date(StartDate) : null);
    setEndDate(EndDate ? new Date(EndDate) : null);
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => {
      return {
        ...prevValue,
        selectedAttending: IsCurrentlyWorking ? IsCurrentlyWorking : false,
      };
    });
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => {
      return {
        ...prevValue,
        selectedTeachingFacility: IsTeachingFacility
          ? IsTeachingFacility
          : false,
      };
    });
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => {
      return {
        ...prevValue,
        selectedMagnetFacility: IsMagnetFacility ? IsMagnetFacility : false,
      };
    });
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => {
      return {
        ...prevValue,
        selectedTraumaFacility: IsTraumaFacility ? IsTraumaFacility : false,
      };
    });

    reducerDispatch({
      type: ActionType.SetSelectedState,
      payload: {
        value: State ? State?.Id : null,
        label: State ? State?.State : null,
      },
    });
    setCategoryProfession(JobProfession?.Profession);
    setSpecialityId(JobProfession?.Id);
    professionalId = JobProfession?.Id;
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => {
      return {
        ...prevValue,
        selectedSpeciality: {
          value: JobSpeciality?.Id,
          label: JobSpeciality?.Speciality,
        },
      };
    });
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => {
      if (JobShift) {
        return {
          ...prevValue,
          selectedShift: {
            value: JobShift?.Id,
            label: JobShift?.Shift,
          },
        };
      } else {
        return {
          ...prevValue,
          selectedShift: null,
        };
      }
    });
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => {
      if (IsChartingSystem) {
        return {
          ...prevValue,
          selectedChart: {
            value: IsChartingSystem ? IsChartingSystem : false,
            label: IsChartingSystem ? "Yes" : "No",
          },
        };
      } else {
        return {
          ...prevValue,
          selectedChart: null,
        };
      }
    });
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => {
      if (IsChargeExperience) {
        return {
          ...prevValue,
          selectedChargeExperience: {
            value: IsChargeExperience ? IsChargeExperience : false,
            label: IsChargeExperience ? "Yes" : "No",
          },
        };
      } else {
        return {
          ...prevValue,
          selectedChargeExperience: null,
        };
      }
    });
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => {
      if (TraumaLevel) {
        return {
          ...prevValue,
          selectedTrauma: {
            value: TraumaLevel?.Id,
            label: TraumaLevel?.Level,
          },
        };
      } else {
        return {
          ...prevValue,
          selectedTrauma: null,
        };
      }
    });
    setRadionBtnValue((prevValue: ProfessionalWorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTraumaFacility: IsTraumaFacility ? true : false,
    }));
  }, []);

  const chargeOptions: BooleanSelectOption[] = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const chartingSystemOptions: BooleanSelectOption[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const onEditHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEdit((prevValue) => !prevValue);
  };

  const onDeleteHandler = async (Id: number) => {
    try {
      setLoading(true);
      const response = await deleteProfessionalWorkHistory(Id);

      if (response.status === 200) {
        // showToast("success", "Work history deleted successfully");
        if (fetch) {
          fetch();
          setFetchDetails && setFetchDetails((prev) => !prev);
        }
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

  const onSubmit = async () => {
    const facilityBeds = getValues("facilityBeds");
    const bedsInUnit = getValues("bedsInUnit");

    if (!professionalId) {
      return showToast("error", "Please select the profession");
    }

    if (!selectedValue.selectedSpeciality) {
      return showToast("error", "Please select the speciality");
    }

    if (!selectedState) {
      return showToast("error", "Please select the state");
    }

    // if (!selectedCity) {
    //   return showToast("error", "Please select the city");
    // }

    // if (!radionBtnValue.selectedTraumaFacility) {
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

    if (endDate) {
      if (endDate < startDate) {
        return showToast("error", "End date cannot be greater than start date");
      }
    }

    if (facilityBeds && Number(facilityBeds) < 0) {
      return showToast(
        "error",
        "Please enter facility beds greater than or equal to 0"
      );
    }

    if (bedsInUnit && Number(bedsInUnit) < 0) {
      return showToast(
        "error",
        "Please enter beds in unit greater than or equal to 0"
      );
    }

    if (radionBtnValue.selectedAttending === false && !endDate) {
      return showToast(
        "error",
        "Please select the end date if not currently working"
      );
    }

    try {
      const reasonForLeaving =
        getValues("reasonForLeaving") === ""
          ? null
          : getValues("reasonForLeaving");
      const nurseToPatientRatio =
        getValues("nurseToPatientRatio") === ""
          ? null
          : getValues("nurseToPatientRatio");

      const facilityBeds =
        getValues("facilityBeds") === "" ? null : getValues("facilityBeds");
      const bedsInUnit =
        getValues("bedsInUnit") === "" ? null : getValues("bedsInUnit");
      const additionalInfo =
        getValues("additionalInfo") === "" ? null : getValues("additionalInfo");
      const agencyName =
        getValues("agencyName") === "" ? null : getValues("agencyName");
      const response = await editProfessionalWorkHistory({
        startDate: startDate
          ? moment(startDate?.toString()).format("YYYY-MM-DD")
          : "",
        endDate: radionBtnValue.selectedAttending
          ? null
          : endDate && moment(endDate?.toString()).format("YYYY-MM-DD"),
        isCurrentlyWorking: radionBtnValue.selectedAttending,
        facilityName: getValues("facilityName"),
        stateId: selectedState.value,
        facilityType: getValues("facilityType"),
        professionId: specialityId!,
        specialityId: selectedValue.selectedSpeciality?.value,
        nurseToPatientRatio: nurseToPatientRatio,
        facilityBeds: facilityBeds,
        isTeachingFacility: radionBtnValue.selectedTeachingFacility
          ? radionBtnValue.selectedTeachingFacility
          : false,
        bedsInUnit: bedsInUnit,
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
        additionalInfo: additionalInfo,
        positionHeld: getValues("positionHeld"),
        agencyName: agencyName,
        isChargeExperience: selectedValue.selectedChargeExperience
          ? selectedValue.selectedChargeExperience?.value
          : false,
        isChartingSystem: selectedValue.selectedChargeExperience
          ? selectedValue.selectedChart?.value
          : false,
        shiftId: selectedValue.selectedShift
          ? selectedValue.selectedShift.value
          : null,
        reasonForLeaving: reasonForLeaving,
        Id: Id,
      });

      if (response.status === 200) {
        // showToast(
        //   "success",
        //   response?.data?.messag || "Work history edited successfully"
        // );
        if (fetch) {
          fetch();
          setEdit((prevValue) => !prevValue);
        }
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
    <Form>
      {loading && <Loader />}
      <div>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <h2 className="form-small-text scroll-title mb-0">
            Work History {index ? index : ""}
          </h2>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={(e) => onEditHandler(e)}
          >
            <span className="material-symbols-outlined">Edit</span>
          </Button>
          <CustomDeleteBtn onDelete={() => onDeleteHandler(Id)} />
        </div>
        <p className="form-small-text form-text-mw">
          If you have been promoted, switched units, or took a new position
          within the same facility please list each position separately in your
          profile.
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
                disabled={!edit}
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
                      disabled={!edit}
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
                selected={radionBtnValue.selectedAttending ? null : endDate}
                isClearable={true}
                onChange={handleEndDateChange}
                timeIntervals={15}
                dateFormat="h:mm aa"
                className="custom-select-picker-all contract-select"
                disabled={radionBtnValue.selectedAttending || !edit}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      value={
                        radionBtnValue.selectedAttending
                          ? ""
                          : endDate && endDate
                          ? moment(endDate?.toString()).format("MM-DD-YYYY")
                          : ""
                      }
                      placeholder="End Date"
                      disabled={radionBtnValue.selectedAttending || !edit}
                    />
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
                disabled={!edit}
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
                style={{ textTransform: "capitalize" }}
                placeholder="Facility Name"
                id="facility_name"
                invalid={!!errors.facilityName}
                {...register("facilityName")}
                disabled={!edit}
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
                isDisabled={!edit}
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
          <Col sm="6">
            <div className="mb-3">
              <Label for="profession_drp">
                Profession <span className="asterisk">*</span>
              </Label>
              {/* <CustomSelect
                      className="mb-3"
                      value={data[0]}
                      id="profession_drp"
                      placeholder={"Select Profession"}
                      onChange={() => {}}
                      name=""
                      noOptionsMessage={() => ""}
                      options={data}
                    ></CustomSelect> */}
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
                    disabled={!edit}
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
                isDisabled={!categoryProfession || !edit}
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
                style={{ textTransform: "capitalize" }}
                placeholder="Facility Type"
                invalid={!!errors.facilityType}
                {...register("facilityType")}
                disabled={!edit}
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
                disabled={!edit}
              />
              <FormFeedback>{errors.nurseToPatientRatio?.message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label for="facility_beds">Facility Beds</Label>
              <CustomInput
                type="number"
                min={0}
                placeholder="Facility Beds"
                id="facility_beds"
                invalid={!!errors.facilityBeds}
                {...register("facilityBeds")}
                disabled={!edit}
              />
              <FormFeedback>{errors.facilityBeds?.message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label for="beds_in_unit">Beds In Unit</Label>
              <CustomInput
                type="number"
                min={0}
                placeholder="Beds In Unit"
                id="beds_in_unit"
                invalid={!!errors.bedsInUnit}
                {...register("bedsInUnit")}
                disabled={!edit}
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
                className="purple-radio-btn d-flex flex-wrap mb-3"
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
                    disabled={!edit}
                  />{" "}
                  <Label check for="teaching_radio1">
                    {" "}
                    Yes{" "}
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    name="teaching_facility"
                    type="radio"
                    id="teaching_radio2"
                    onChange={() => handleTeachingFacilityNo("No")}
                    checked={!radionBtnValue.selectedTeachingFacility}
                    disabled={!edit}
                  />{" "}
                  <Label check for="teaching_radio2">
                    {" "}
                    No{" "}
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
                    checked={radionBtnValue.selectedMagnetFacility}
                    disabled={!edit}
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
                    disabled={!edit}
                  />{" "}
                  <Label check for="magnet_radio2">
                    {" "}
                    No{" "}
                  </Label>
                </FormGroup>
              </div>
              <div
                className="purple-radio-btn d-flex flex-wrap mb-3"
                style={{ gap: "8px 12px" }}
              >
                <p className="radio-p-label">Trauma Facility</p>
                <FormGroup check>
                  <Input
                    name="trauma_facility"
                    type="radio"
                    id="trauma_radio1"
                    onChange={(e) => handleTraumaFacility(e)}
                    checked={radionBtnValue.selectedTraumaFacility}
                    disabled={!edit}
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
                    disabled={!edit}
                  />{" "}
                  <Label check for="trauma_radio2">
                    {" "}
                    No{" "}
                  </Label>
                </FormGroup>
              </div>
            </div>
          </Col>
          <Col sm="6">
            <div className="mb-3">
              <Label for="trauma_facility_drp">Trauma Facility Level</Label>
              <CustomSelect
                id="trauma_facility_drp"
                name="traumaLevel"
                value={selectedValue.selectedTrauma}
                onChange={(trauma) => handleTrauma(trauma)}
                placeholder="Select Trauma Level"
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
                  radionBtnValue.selectedTraumaFacility === false || !edit
                }
              />
            </div>
          </Col>
          <Col lg="6" sm="12">
            <FormGroup>
              <Label for="additional_info">Additional Info</Label>
              <CustomInput
                style={{ textTransform: "capitalize" }}
                type="text"
                placeholder="Additional Info"
                id="additional_info"
                invalid={!!errors.additionalInfo}
                {...register("additionalInfo")}
                disabled={!edit}
              />
              <FormFeedback>{errors.additionalInfo?.message}</FormFeedback>
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
                style={{ textTransform: "capitalize" }}
                placeholder="Position Held"
                invalid={!!errors.positionHeld}
                {...register("positionHeld")}
                disabled={!edit}
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
                style={{ textTransform: "capitalize" }}
                invalid={!!errors.agencyName}
                {...register("agencyName")}
                disabled={!edit}
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
                noOptionsMessage={(): string => "No Charge Experience Found"}
                value={selectedValue.selectedChargeExperience}
                options={chargeOptions}
                onChange={(state) => handleChargeExperience(state)}
                placeholder="Charge Experience"
                // isSearchable={true}
                isClearable={true}
                className="mb-3"
                isDisabled={!edit}
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
                noOptionsMessage={(): string => "No Charting System Found"}
                isSearchable={true}
                isClearable={true}
                isDisabled={!edit}
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
                isDisabled={!edit}
              />
            </div>
          </Col>
          <Col lg="6" sm="12">
            <FormGroup>
              <Label for="reason_for_leaving">Reason for Leaving</Label>
              <CustomInput
                type="text"
                style={{ textTransform: "capitalize" }}
                placeholder="Reason for leaving"
                id="reason_for_leaving"
                invalid={!!errors.reasonForLeaving}
                {...register("reasonForLeaving")}
                disabled={!edit}
              />
              <FormFeedback>{errors.reasonForLeaving?.message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col className="mb-4">
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "12px" }}
            >
              <Button
                className="blue-gradient-btn mb-0"
                disabled={!edit}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default ProfessionalWorkHistoryCard;
