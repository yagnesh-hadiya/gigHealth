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
  EditWorkHistoryModalProps,
  WorkHistoryModalDropdown,
  WorkHistoryModalRadiobtn,
  WorkHistoryModalType,
} from "../../../types/WorkHistoryModalTypes";
import { Form } from "react-router-dom";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import CustomInput from "../../../components/custom/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { WorkHistoryModalSchema } from "../../../helpers/schemas/WorkHistoryModalSchema";
import ReactDatePicker from "react-datepicker";
import CustomCheckbox from "../../../components/custom/CustomCheckboxBtn";
import {
  capitalize,
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
} from "../../../store/ProfessionalDetailsSlice";
import {
  BooleanSelectOption,
  SelectOption,
} from "../../../types/FacilityTypes";
import { editWorkHistory } from "../../../services/ProfessionalDetails";
import CustomBooleanSelect from "../../../components/custom/CustomBooleanSelect";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import DropdownImage from "../../../assets/images/dropdown-arrow.svg";
import { ProfessionSubCategoryType } from "../../../types/ProfessionalTypes";

const EditWorkHistoryModal = ({
  id,
  isOpen,
  toggle,
  workHistory,
  fetch,
}: EditWorkHistoryModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkHistoryModalType>({
    resolver: yupResolver(WorkHistoryModalSchema) as any,
  });

  const allow = checkAclPermission("professionals", "details", ["GET", "PUT"]);
  // const facilityOptions: SelectOption[] = [
  //   { label: "Parent", value: 1 },
  //   { label: "Child", value: 2 },
  //   { label: "Stand Alone", value: 3 },
  // ];

  const chargeOptions: BooleanSelectOption[] = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const chartingSystemOptions: BooleanSelectOption[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(workHistory.StartDate)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    workHistory.EndDate ? new Date(workHistory.EndDate) : null
  );

  const dispatch = useDispatch();
  const states: LocationList[] = useSelector(getLocationList);
  const trauma: TraumaList[] = useSelector(getTraumaList);
  const profession: ProfessionList[] = useSelector(getProfessionList);
  const shift: ShiftList[] = useSelector(getShiftList);
  const speciality: SpecialityList[] = useSelector(getSpecialityList);
  const [radionBtnValue, setRadionBtnValue] =
    useState<WorkHistoryModalRadiobtn>({
      selectedAttending: workHistory?.IsCurrentlyWorking,
      selectedTeachingFacility:
        workHistory?.IsTeachingFacility === true ? "true" : "false",
      selectedMagnetFacility:
        workHistory?.IsMagnetFacility === true ? "true" : "false",
      selectedTraumaFacility:
        workHistory?.IsTraumaFacility === true ? "true" : "false",
    });

  const [selectedValue, setSelectedValue] = useState<WorkHistoryModalDropdown>({
    selectedState: {
      value: workHistory?.State?.Id,
      label: `${workHistory?.State?.State}`,
    },
    selectedProfession: {
      value: workHistory?.JobProfession?.Id,
      label: workHistory?.JobProfession?.Profession,
    },
    selectedSpeciality: {
      value: workHistory?.JobSpeciality?.Id,
      label: workHistory?.JobSpeciality?.Speciality,
    },
    selectedTrauma: {
      value: workHistory?.TraumaLevel?.Id,
      label: workHistory?.TraumaLevel?.Level,
    },
    selectedChart: {
      value: workHistory?.IsChartingSystem ? true : false,
      label: workHistory?.IsChartingSystem ? "Yes" : "No",
    },
    selectedShift: {
      value: workHistory.JobShift?.Id,
      label: workHistory.JobShift?.Shift,
    },
    selectedChargeExperience: {
      value: workHistory?.IsChargeExperience ? true : false,
      label: workHistory?.IsChargeExperience ? "Yes" : "No",
    },
  });

  const [specialityId, setSpecialityId] = useState<number>();
  // const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleEndDateChange = (date: Date) => setEndDate(date);
  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRadionBtnValue((prevValue: WorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedAttending: e.target.checked,
    }));

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

  const handleTraumaFacility = (e: string) =>
    setRadionBtnValue((prevValue: WorkHistoryModalRadiobtn) => ({
      ...prevValue,
      selectedTraumaFacility: e,
    }));

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

      if (workHistory) {
        setValue("facilityName", capitalize(workHistory?.FacilityName));
        setValue("nurseToPatientRatio", workHistory?.NurseToPatientRatio);
        setValue("facilityBeds", workHistory?.FacilityBeds?.toString());
        setValue("facilityType", capitalize(workHistory?.FacilityType));
        setValue(
          "bedsInUnit",
          workHistory?.BedsInUnit ? workHistory?.BedsInUnit.toString() : ""
        );
        setValue(
          "additionalInfo",
          workHistory?.AdditionalInfo
            ? capitalize(workHistory?.AdditionalInfo)
            : ""
        );
        setValue(
          "positionHeld",
          workHistory?.PositionHeld ? capitalize(workHistory?.PositionHeld) : ""
        );
        setValue(
          "agencyName",
          workHistory?.AgencyName ? workHistory?.AgencyName : ""
        );
        setValue(
          "reasonForLeaving",
          workHistory?.ReasonForLeaving ? workHistory?.ReasonForLeaving : ""
        );
        setSelectedValue((prevValue: WorkHistoryModalDropdown) => {
          if (workHistory?.JobShift) {
            return {
              ...prevValue,
              selectedShift: {
                value: workHistory?.JobShift?.Id,
                label: workHistory?.JobShift?.Shift,
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
          if (workHistory?.IsChartingSystem) {
            return {
              ...prevValue,
              selectedChart: {
                value: workHistory?.IsChartingSystem
                  ? workHistory?.IsChartingSystem
                  : false,
                label: workHistory?.IsChartingSystem ? "Yes" : "No",
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
          if (workHistory?.TraumaLevel) {
            return {
              ...prevValue,
              selectedTrauma: {
                value: workHistory?.TraumaLevel?.Id,
                label: workHistory?.TraumaLevel?.Level,
              },
            };
          } else {
            return {
              ...prevValue,
              selectedTrauma: null,
            };
          }
        });
        setSelectedValue((prevValue: WorkHistoryModalDropdown) => {
          if (workHistory?.IsChargeExperience) {
            return {
              ...prevValue,
              selectedChargeExperience: {
                value: workHistory?.IsChargeExperience
                  ? workHistory?.IsChargeExperience
                  : false,
                label: workHistory?.IsChargeExperience ? "Yes" : "No",
              },
            };
          } else {
            return {
              ...prevValue,
              selectedChargeExperience: null,
            };
          }
        });
      }
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [dispatch, setValue, workHistory]);

  useEffect(() => {
    fetchDropDownValues();
  }, [fetchDropDownValues]);

  useEffect(() => {
    setCategoryProfession(workHistory?.JobProfession?.Profession);
    setSpecialityId(workHistory?.JobProfession?.Id);
    setSelectedValue((prevSelectedValue: WorkHistoryModalDropdown) => ({
      ...prevSelectedValue,
      selectedProfession: {
        value: workHistory?.JobProfession?.Id,
        label: workHistory?.JobProfession?.Profession,
      },
    }));
  }, []);

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

  const onSubmit = async (data: WorkHistoryModalType) => {
    try {
      // if (!selectedValue.selectedChart) {
      //   return showToast("error", "Please select the charting system");
      // }

      if (!selectedValue.selectedProfession) {
        return showToast("error", "Please select the profession");
      }

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

      if (!startDate) {
        return showToast("error", "Please select the start date");
      }

      if (radionBtnValue.selectedAttending === false && !endDate) {
        return showToast(
          "error",
          "Please select the end date if not currently attending"
        );
      }

      if (endDate) {
        if (endDate < startDate) {
          return showToast(
            "error",
            "End date cannot be smaller than Start date"
          );
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

      const response = await editWorkHistory({
        professionalId: Number(id),
        workHistoryId: Number(workHistory?.Id),
        startDate: formatDate(startDate?.toString()),
        endDate: radionBtnValue.selectedAttending
          ? null
          : endDate && formatDate(endDate?.toString()),
        isCurrentlyWorking: radionBtnValue.selectedAttending,
        facilityName: data?.facilityName,
        stateId: selectedValue.selectedState?.value,
        facilityType: data.facilityType,
        professionId: selectedValue.selectedProfession.value,
        specialityId: selectedValue.selectedSpeciality?.value,
        nurseToPatientRatio: data?.nurseToPatientRatio
          ? data?.nurseToPatientRatio
          : null,
        facilityBeds: data?.facilityBeds ? Number(data?.facilityBeds) : null,
        isTeachingFacility:
          radionBtnValue.selectedTeachingFacility === "true" ? true : false,
        bedsInUnit: data?.bedsInUnit ? Number(data?.bedsInUnit) : null,
        isMagnetFacility:
          radionBtnValue.selectedMagnetFacility === "true" ? true : false,
        isTraumaFacility:
          radionBtnValue.selectedTraumaFacility === "true" ? true : false,
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
        isChartingSystem: selectedValue.selectedChart
          ? selectedValue.selectedChart?.value
          : null,
        shiftId: selectedValue.selectedShift
          ? selectedValue.selectedShift.value
          : null,
        reasonForLeaving: data?.reasonForLeaving
          ? data?.reasonForLeaving
          : null,
      });

      if (response.status === 200) {
        showToast("success", response?.data?.message);
        toggle();
        fetch();
      }
    } catch (error: any) {
      console.error(error);
    }
  };

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
      selectedProfession: {
        value: professionItem.Id,
        label: professionItem.Profession,
      },
    }));
    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
      ...prevValue,
      selectedSpeciality: null,
    }));
    setSpecialityId(professionItem.Id);
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
          Edit Work History
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
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">End Date</Label>
                <ReactDatePicker
                  dateFormat={"dd-MM-yyyy"}
                  isClearable={true}
                  placeholderText="--"
                  disabled={radionBtnValue.selectedAttending}
                  readOnly={radionBtnValue.selectedAttending}
                  minDate={startDate ? startDate : null}
                  onChange={handleEndDateChange}
                  selected={radionBtnValue.selectedAttending ? null : endDate}
                  customInput={
                    <div className="custom-calendar-wrapper">
                      <CustomInput
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
              <Col xxl="12" xl="12" lg="12" className="col-group">
                <div className="d-flex mb-4">
                  <CustomCheckbox
                    disabled={false}
                    checked={radionBtnValue.selectedAttending}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleCheckBoxChange(e)
                    }
                  />
                  <Label className="col-label">Currently Attending</Label>
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
                  clasName="text-capitalize"
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
                  clasName="text-capitalize"
                />
                <FormFeedback>{errors.facilityType?.message}</FormFeedback>
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
                          selected={radionBtnValue.selectedMagnetFacility?.toString()}
                          name={""}
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
                  clasName="text-capitalize"
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
                  clasName="text-capitalize"
                />
                <FormFeedback>{errors.positionHeld?.message}</FormFeedback>
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">Agency Name (if applicable)</Label>
                <CustomInput
                  placeholder="Agency Name"
                  invalid={!!errors.agencyName}
                  {...register("agencyName")}
                  clasName="text-capitalize"
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
                  id="chargeExperience"
                  name="chargeExperience"
                  noOptionsMessage={() => "No Charge Experience Found"}
                  value={selectedValue.selectedChargeExperience}
                  options={chargeOptions}
                  onChange={(value) =>
                    setSelectedValue((prevValue: WorkHistoryModalDropdown) => ({
                      ...prevValue,
                      selectedChargeExperience: value,
                    }))
                  }
                  placeholder="Select Charge Experience"
                  isClearable={true}
                  isSearchable={false}
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
                  clasName="text-capitalize"
                />
                <FormFeedback>{errors.reasonForLeaving?.message}</FormFeedback>
              </Col>
            </Row>
            <Button color="primary primary-btn ms-0" disabled={!allow}>
              Save
            </Button>
            <Button color="secondary secondary-btn" onClick={toggle}>
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditWorkHistoryModal;
