import { Form, Link, NavLink, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../../../components/custom/CustomBtn";
import {
  Col,
  FormFeedback,
  Label,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomDatePicker from "../../../../../components/custom/CustomDatePicker";
import {
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import CustomRichTextEditor from "../../../../../components/custom/CustomTextEditor";
import {
  ApiDocumentData,
  ForamttedDocumentData,
  JobActions,
  JobType,
  TimeOptions,
} from "../../../../../types/JobTemplateTypes";
import {
  capitalize,
  customStyles,
  formatDate,
  initialStateValue,
  showToast,
  timeOptions,
} from "../../../../../helpers";
import {
  createJobTemplate,
  getDocumentsList,
  getJobStatus,
  getJobTemplate,
  getJobTemplateComplianceDetails,
  getJobTemplateComplianceList,
  getJobTemplateEmploymentType,
  getJobTemplateJobStatus,
  getJobTemplateProfessions,
  getJobTemplateScrubColor,
  // getJobTemplateSpecialities,
  getListJobTemplate,
} from "../../../../../services/JobTemplate";
import Loader from "../../../../../components/custom/CustomSpinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { JobTemplateSchema } from "../../../../../helpers/schemas/JobTemplateSchema";
import jobTemplateReducer from "../../../../../helpers/reducers/JobTemplateReducer";
import Select from "react-select";
import {
  getFacilityJobShifts,
  getFacilityListData,
} from "../../../../../services/facility";
import { FacilityActiveComponentProps } from "../../../../../types";
import { FacilityActiveComponentContext } from "../../../../../helpers/context/FacilityActiveComponent";
import ACL from "../../../../../components/custom/ACL";
import { Menu, MenuItem, SubMenu, MenuRadioGroup } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import {
  getJobSpecialities,
  getProfessionsCategories,
} from "../../../../../services/JobsServices";
import DropdownImage from "../../../../../assets/images/dropdown-arrow.svg";
import { ProfessionSubCategoryType } from "../../../../../types/ProfessionalTypes";
let professionId: number = 0;

const CreateTemplate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<JobType>({
    resolver: yupResolver(JobTemplateSchema) as any,
  });

  const [state, dispatch] = useReducer(jobTemplateReducer, initialStateValue);
  const {
    selectedTemplate,
    // selectedProfession,
    selectedShiftTime,
    selectedSpecialities,
    selectedContractStartDate,
    selectedJobStatus,
    selectedEmploymentType,
    selectedScrub,
    complianceDetails,
    selectedShiftStart,
    selectedShiftEnd,
    selectedChecklist,
    facilityName,
    programManager,
  } = state;
  const [activeLink, setActiveLink] = useState<string>("#item-1");
  const [loading, setLoading] = useState<boolean>(false);
  const facilityDataId = useParams();

  const [content, setContent] = useState<string>("");

  const navigate = useNavigate();
  const { setActiveComponent } = useContext<FacilityActiveComponentProps>(
    FacilityActiveComponentContext
  );

  const [specialityId, setSpecialityId] = useState<number>();
  // const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    ProfessionSubCategoryType[][]
  >([]);

  const hrsPerWeek = watch("contractDetails.hrsPerWeek");
  const hourlyRate = watch("pay.hourlyRate");
  const overtimeHrsPerWeek = watch("contractDetails.overtimeHrsPerWeek");
  const overtimeRate = watch("pay.overtimeRate");
  // const holidayRate = watch("pay.holidayRate");
  const daysOnAssignment = watch("contractDetails.daysOnAssignment");
  const housingStipend = watch("pay.housingStipend");
  const mealsAndIncidentals = watch("pay.mealsAndIncidentals");

  const parseAndValidate = (value: any) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return 0;
    }
    return parsedValue;
  };

  const validatedHrsPerWeek = parseAndValidate(hrsPerWeek);
  const validatedHourlyRate = parseAndValidate(hourlyRate);
  const validatedOvertimeHrsPerWeek = parseAndValidate(overtimeHrsPerWeek);
  const validatedOvertimeRate = parseAndValidate(overtimeRate);
  // const validatedHolidayRate = parseAndValidate(holidayRate);
  const validatedDaysOnAssignment = parseAndValidate(daysOnAssignment);
  const validatedHousingStipend = parseAndValidate(housingStipend);
  const validatedMealsAndIncidentals = parseAndValidate(mealsAndIncidentals);

  const totalGrossPay =
    validatedHrsPerWeek * validatedHourlyRate +
    validatedOvertimeHrsPerWeek * validatedOvertimeRate +
    // validatedHolidayRate * validatedDaysOnAssignment +
    validatedHousingStipend * validatedDaysOnAssignment +
    validatedMealsAndIncidentals * validatedDaysOnAssignment;

  const formatComplianceData = (
    data: ApiDocumentData[]
  ): { [key: string]: ForamttedDocumentData[] } => {
    try {
      if (!data) return {};

      const formattedData: { [key: string]: ForamttedDocumentData[] } = {};

      data.forEach((item: ApiDocumentData) => {
        const category = item?.DocumentCategory?.Category;
        if (formattedData[category]) {
          formattedData[category].push({
            id: item.DocumentMaster.Id,
            documentname: item.DocumentMaster.Type,
            description: item.DocumentMaster.Type,
            priority: item.Priority,
            expiryDays: item.ExpiryDurationDays,
            internalUse: item.IsInternalUse,
          });
        } else {
          formattedData[category] = [
            {
              id: item.DocumentMaster.Id,
              documentname: item.DocumentMaster.Type,
              description: item.DocumentMaster.Type,
              priority: item.Priority,
              expiryDays: item.ExpiryDurationDays,
              internalUse: item.IsInternalUse,
            },
          ];
        }
      });

      return formattedData;
    } catch (error) {
      console.error(error);
      return {};
    }
  };
  let formattedData = formatComplianceData(
    complianceDetails?.ComplianceDocuments
  );
  const [activeTab, setActiveTab] = useState<string>(
    Object.keys(formattedData)[0] || ""
  );

  const getListDetails = async () => {
    try {
      setLoading(true);
      const jobTemplate = await getListJobTemplate(Number(facilityDataId?.Id));
      dispatch({
        type: JobActions.SetTemplate,
        payload: jobTemplate?.data?.data,
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
  };

  // const getTemplateSpecialities = async () => {
  //   try {
  //     setLoading(true);
  //     const specialities = await getJobTemplateSpecialities(professionId);
  //     dispatch({
  //       type: JobActions.SetSpeciality,
  //       payload: specialities?.data?.data,
  //     });
  //     setLoading(false);
  //   } catch (error: any) {
  //     console.error(error);
  //     setLoading(false);
  //     showToast(
  //       "error",
  //       error?.response?.data?.message || "Something went wrong"
  //     );
  //   }
  // };

  const getTemplateProfessions = async () => {
    try {
      setLoading(true);
      const response = await getJobTemplateProfessions();
      dispatch({
        type: JobActions.SetProfession,
        payload: response?.data?.data,
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
  };

  const getTemplateStatus = async () => {
    try {
      setLoading(true);
      const status = await getJobTemplateJobStatus(Number(facilityDataId?.Id));
      dispatch({ type: JobActions.SetJobStatus, payload: status?.data?.data });
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

  const getTemplateScrubColor = async () => {
    try {
      setLoading(true);
      const scrubColor = await getJobTemplateScrubColor(
        Number(facilityDataId?.Id)
      );
      dispatch({ type: JobActions.SetScrub, payload: scrubColor?.data?.data });
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

  const getTemplateComplianceList = async () => {
    try {
      setLoading(true);
      const list = await getJobTemplateComplianceList(
        Number(facilityDataId?.Id)
      );
      dispatch({
        type: JobActions.SetComplianceList,
        payload: list?.data?.data,
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
  };

  const getTemplateEmploymentType = async () => {
    try {
      setLoading(true);
      const employment = await getJobTemplateEmploymentType(
        Number(facilityDataId?.Id)
      );
      dispatch({
        type: JobActions.SetEmploymentType,
        payload: employment?.data?.data,
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
  };

  const getFacilityData = async () => {
    try {
      const facilityData = await getFacilityListData(
        Number(facilityDataId?.Id)
      );

      dispatch({
        type: JobActions.SetFacilityName,
        payload: facilityData?.data?.data[0]?.Name,
      });
      dispatch({
        type: JobActions.SetProgramManager,
        payload: facilityData.data.data[0].ProgramManager?.FirstName
          ? `${capitalize(
              facilityData?.data?.data[0]?.ProgramManager?.FirstName
            )} ${capitalize(
              facilityData?.data?.data[0]?.ProgramManager?.LastName
            )}`
          : ``,
      });
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const getFacilityShifts = async () => {
    try {
      const facilityData = await getFacilityJobShifts(
        Number(facilityDataId?.Id)
      );
      dispatch({
        type: JobActions.SetShiftTime,
        payload: facilityData?.data?.data,
      });
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  // const fetchProfession = async () => {
  //   if (selectedCategory) {
  //     const response = await getProfessionsCategories(selectedCategory);

  //     setProfession(response.data?.data);
  //   }
  // };

  const fetchSpecialities = async () => {
    try {
      if (specialityId) {
        const specialities = await getJobSpecialities(specialityId);
        dispatch({
          type: JobActions.SetSpeciality,
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
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.8 }
    );

    const sections = document.querySelectorAll(".mb-3");

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [state.profession?.length]);

  useEffect(() => {
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    if (selectedChecklist === null) {
      dispatch({ type: JobActions.SetComplianceDetails, payload: null });
      dispatch({ type: JobActions.SetDocumentList, payload: null });
      return;
    }
    const getTemplateComplianceDetails = async () => {
      try {
        setLoading(true);
        const details = await getJobTemplateComplianceDetails(
          Number(facilityDataId?.Id),
          selectedChecklist?.Id
        );
        const list = await getDocumentsList(Number(facilityDataId?.Id));
        dispatch({
          type: JobActions.SetComplianceDetails,
          payload: details?.data?.data[0],
        });
        dispatch({
          type: JobActions.SetDocumentList,
          payload: list?.data?.data,
        });
        const tabList: string = list?.data?.data[0]?.Category;
        setActiveTab(tabList);
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
    getTemplateComplianceDetails();
    return;
  }, [selectedChecklist]);

  useEffect(() => {
    if (selectedTemplate === null) {
      return dispatch({ type: JobActions.SetSelectedTemplate, payload: null });
    }

    const getTemplate = async () => {
      try {
        setLoading(true);
        const template = await getJobTemplate(
          Number(facilityDataId?.Id),
          selectedTemplate?.Id
        );
        const templateData = template?.data?.data[0];
        // dispatch({ type: JobActions.SetJobTemplate, payload: template?.data?.data });
        setValue("title", capitalize(templateData?.Title));
        setValue("billRate", templateData?.BillRate);
        setValue("minYearsOfExperience", templateData?.MinYearsExperience);
        setValue("noOfOpenings", templateData?.NoOfOpenings);
        setValue("contractDetails.hrsPerWeek", templateData?.HrsPerWeek);
        setValue(
          "contractDetails.shiftStartTime",
          templateData?.ShiftStartTime
        );
        setValue(
          "contractDetails.overtimeHrsPerWeek",
          templateData?.OvertimeHrsPerWeek
        );
        setValue(
          "contractDetails.daysOnAssignment",
          templateData?.DaysOnAssignment
        );
        setValue("pay.doubleTimeRate", templateData?.DoubleTimeRate);
        setValue("location", capitalize(templateData?.Location));
        setValue("deptUnit", templateData?.DeptUnit);
        setValue("internalJobNotes", templateData?.InternalNotes);
        setValue("contractDetails.noOfShifts", templateData?.NoOfShifts);
        setValue(
          "contractDetails.contractLength",
          templateData?.ContractLength
        );

        setValue("pay.holidayRate", templateData?.HolidayRate);
        setValue("pay.housingStipend", templateData?.HousingStipend);
        setValue("pay.mealsAndIncidentals", templateData?.MealsAndIncidentals);
        setValue("pay.hourlyRate", templateData?.RegularHourlyRate);
        setValue("pay.travelReimbursement", templateData?.TravelReimbursement);
        setValue(
          "pay.compensationComments",
          templateData?.CompensationComments
        );
        setValue("pay.onCallRate", templateData?.OnCallRate);
        setValue("pay.callBackRate", templateData?.CallBackRate);
        setValue("pay.overtimeRate", templateData?.OvertimeRate);
        setValue("contract", templateData?.Contract);
        setContent(templateData?.Description);
        // dispatch({
        //   type: JobActions.SetFeaturedJob,
        //   payload: templateData?.IsFeaturedJob,
        // });
        // setValue("isFeaturedJob", templateData?.IsFeaturedJob);
        setValue("jobType", capitalize(templateData?.JobType));
        dispatch({
          type: JobActions.SetSelectedShiftTime,
          payload: templateData?.JobShift,
        });
        dispatch({
          type: JobActions.SetSelectedScrub,
          payload: templateData?.ScrubColor,
        });
        dispatch({
          type: JobActions.SetSelectedJobStatus,
          payload: templateData?.JobStatus,
        });
        dispatch({
          type: JobActions.SetSelectedContract,
          payload: templateData?.Contract,
        });
        // dispatch({
        //   type: JobActions.SetSelectedProfession,
        //   payload: templateData?.JobProfession,
        // });
        setCategoryProfession(templateData?.JobProfession.Profession);
        professionId = templateData?.JobProfession.Id;
        setSpecialityId(templateData?.JobProfession.Id);
        dispatch({
          type: JobActions.SetSelectedSpecialities,
          payload: templateData?.JobSpeciality,
        });
        dispatch({
          type: JobActions.SetSelectedEmploymentType,
          payload: templateData?.EmploymentType,
        });
        dispatch({
          type: JobActions.SetSelectedShiftStart,
          payload: templateData?.ShiftStartTime,
        });
        dispatch({
          type: JobActions.SetSelectedShiftEnd,
          payload: templateData?.ShiftEndTime,
        });
        // dispatch({
        //   type: JobActions.SetFeaturedJob,
        //   payload: templateData?.IsFeaturedJob,
        // });
        formattedData = formatComplianceData(
          templateData?.ComplianceChecklist?.ComplianceDocuments
        );
        dispatch({
          type: JobActions.SetSelectedChecklist,
          payload: {
            Id: templateData?.ComplianceChecklist?.Id,
            Name: capitalize(templateData?.ComplianceChecklist?.Name),
          },
        });

        //shift start time
        const shiftStart: TimeOptions | undefined = timeOptions.find(
          (time: TimeOptions) => time.value === templateData?.ShiftStartTime
        );
        dispatch({
          type: JobActions.SetSelectedShiftStart,
          payload: shiftStart,
        });

        // shift end time
        const shiftEnd: TimeOptions | undefined = timeOptions.find(
          (time: TimeOptions) => time.value === templateData?.ShiftEndTime
        );
        dispatch({ type: JobActions.SetSelectedShiftEnd, payload: shiftEnd });

        // contract start date
        dispatch({
          type: JobActions.SetSelectedContractStart,
          payload: new Date(templateData?.ContractStartDate),
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
    };
    getTemplate();
  }, [selectedTemplate]);

  const getTemplateJobStatus = async () => {
    try {
      setLoading(true);
      const jobStatus = await getJobStatus(Number(facilityDataId?.Id));
      dispatch({
        type: JobActions.SetJobStatus,
        payload: jobStatus?.data?.data,
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
  };

  const handleScrubColor = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedScrub, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedScrub,
        payload: {
          Id: selectedOption?.value,
          Color: selectedOption?.label,
        },
      });
    }
  };

  // const handleProfession = (
  //   selectedOption: { value: number; label: string } | null
  // ) => {
  //   if (selectedOption === null) {
  //     dispatch({ type: JobActions.SetSelectedProfession, payload: null });
  //     return;
  //   }

  //   if (selectedOption) {
  //     dispatch({
  //       type: JobActions.SetSelectedProfession,
  //       payload: {
  //         Id: selectedOption?.value,
  //         Profession: selectedOption?.label,
  //       },
  //     });
  //   }
  // };

  // const handleProfession = (categoryIndex: number) => {
  //   setSelectedCategory(categoryIndex);
  // };

  const handleProfessionCategory = (professionItem: {
    Id: number;
    Profession: string;
  }) => {
    setCategoryProfession(professionItem.Profession);
    dispatch({
      type: JobActions.SetSelectedSpecialities,
      payload: null,
    });
    setSpecialityId(professionItem.Id);
    professionId = professionItem.Id;
  };

  const handleEmployementType = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedEmploymentType, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedEmploymentType,
        payload: {
          Id: selectedOption?.value,
          Type: selectedOption?.label,
        },
      });
    }
  };

  const handleJobStatus = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedJobStatus, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedJobStatus,
        payload: {
          Id: selectedOption?.value,
          Status: selectedOption?.label,
        },
      });
    }
  };

  const handleSpecialities = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedSpecialities, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedSpecialities,
        payload: {
          Id: selectedOption?.value,
          Speciality: selectedOption?.label,
        },
      });
    }
  };

  const handleJobTemplate = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedTemplate, payload: null });
      setContent("");
      dispatch({ type: JobActions.SetSelectedScrub, payload: null });
      dispatch({ type: JobActions.SetSelectedJobStatus, payload: null });
      dispatch({ type: JobActions.SetSelectedContract, payload: null });
      dispatch({ type: JobActions.SetSelectedSpecialities, payload: null });
      // dispatch({ type: JobActions.SetSelectedProfession, payload: null });
      dispatch({ type: JobActions.SetSelectedEmploymentType, payload: null });
      dispatch({ type: JobActions.SetSelectedShiftStart, payload: null });
      dispatch({ type: JobActions.SetSelectedShiftEnd, payload: null });
      // dispatch({ type: JobActions.SetFeaturedJob, payload: null });
      dispatch({ type: JobActions.SetSelectedChecklist, payload: null });
      dispatch({ type: JobActions.SetSelectedShiftStart, payload: null });
      dispatch({ type: JobActions.SetSelectedShiftEnd, payload: null });
      dispatch({ type: JobActions.SetShiftStart, payload: null });
      dispatch({ type: JobActions.SetSelectedContractStart, payload: null });
      dispatch({ type: JobActions.SetSelectedShiftTime, payload: null });
      reset();

      getListJobTemplate(Number(facilityDataId?.Id))
        .then((jobTemplate) => {
          dispatch({
            type: JobActions.SetTemplate,
            payload: jobTemplate?.data?.data,
          });
          // dispatch({ type: JobActions.SetChecklist, payload: null });
          return;
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedTemplate,
        payload: {
          Id: selectedOption?.value,
          Title: selectedOption?.label,
        },
      });
    }
  };

  const handleCheckList = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedChecklist, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedChecklist,
        payload: {
          Id: selectedOption?.value,
          Name: capitalize(selectedOption?.label),
        },
      });
    }
  };

  // const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   dispatch({ type: JobActions.SetFeaturedJob, payload: e.target.checked });
  // };

  const handleShiftStartTime = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedShiftStart, payload: null });
      dispatch({ type: JobActions.SetSelectedShiftEnd, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedShiftStart,
        payload: {
          value: selectedOption?.value,
          label: selectedOption?.label,
        },
      });
    }
  };

  const handleShiftEndTime = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedShiftEnd, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedShiftEnd,
        payload: {
          value: selectedOption?.value,
          label: selectedOption?.label,
        },
      });
    }

    if (selectedShiftStart) {
      const startTime = selectedShiftStart.value;
      const endTime = selectedOption.value;

      if (endTime > startTime) {
        dispatch({
          type: JobActions.SetSelectedShiftEnd,
          payload: selectedOption,
        });
      } else {
        dispatch({ type: JobActions.SetSelectedShiftEnd, payload: null });
        return showToast("error", "End time must be greater than start time");
      }
    }
  };

  const handleShiftTime = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobActions.SetSelectedShiftTime, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobActions.SetSelectedShiftTime,
        payload: {
          Id: selectedOption?.value,
          Shift: selectedOption?.label,
        },
      });
    }
  };

  const handleTogglebar = (categoryKey: string) => {
    setActiveTab(categoryKey);
  };

  const handleStartDateChange = (date: Date) => {
    dispatch({ type: JobActions.SetSelectedContractStart, payload: date });
  };

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleLinkClick = (itemId: SetStateAction<string>) => {
    setActiveLink(itemId);
  };

  const handleCancel = () => {
    setActiveComponent("Job Templates");
    navigate(`/facility/${Number(facilityDataId?.Id)}`);
  };

  useEffect(() => {
    getFacilityData();
    getListDetails();
    getTemplateProfessions();
    getTemplateStatus();
    getTemplateScrubColor();
    getTemplateComplianceList();
    getTemplateEmploymentType();
    getTemplateJobStatus();
    getFacilityShifts();
  }, []);

  const onSubmit = async (data: JobType) => {
    data.description = content;
    // data.isFeaturedJob = featuredJob;
    data.employementTypeId = selectedEmploymentType?.Id;
    data.scrubColorId = selectedScrub?.Id;
    data.professionId = professionId;
    data.jobStatusId = selectedJobStatus?.Id;
    data.specialityId = selectedSpecialities?.Id;
    data.complianceChecklistId = selectedChecklist?.Id;
    data.contractDetails.shiftStartTime = selectedShiftStart?.value;
    data.contractDetails.shiftEndTime = selectedShiftEnd?.value;
    data.contractDetails.startDate = formatDate(selectedContractStartDate);
    data.contractDetails.shiftId = selectedShiftTime?.Id;

    if (!professionId) {
      return showToast("error", "Please select profession");
    }

    if (!selectedSpecialities) {
      return showToast("error", "Please select specialities");
    }

    if (!selectedJobStatus) {
      return showToast("error", "Please select job status");
    }

    if (!selectedEmploymentType) {
      return showToast("error", "Please select employment type");
    }

    if (!selectedScrub) {
      return showToast("error", "Please select scrub");
    }

    if (!selectedShiftStart) {
      return showToast("error", "Please select shift start time");
    }

    if (!selectedShiftEnd) {
      return showToast("error", "Please select shift end time");
    }

    if (!selectedContractStartDate) {
      return showToast("error", "Please select shift start date");
    }

    if (!selectedChecklist) {
      return showToast("error", "Please select checklist");
    }

    if (!selectedShiftTime) {
      return showToast("error", "Please select shift time");
    }

    if (!content) {
      return showToast("error", "Description is required");
    } else if (typeof content !== "string") {
      return showToast("error", "Description should be of type string");
    } else if (content.length < 2 || content.length > 10000) {
      return showToast(
        "error",
        "Description must be between 2 to 10000 characters"
      );
    }

    try {
      setLoading(true);
      const template = await createJobTemplate({
        facilityId: Number(facilityDataId?.Id),
        title: data.title,
        billRate: data.billRate,
        professionId: data.professionId,
        jobStatusId: data.jobStatusId,
        specialityId: data.specialityId,
        minYearsOfExperience: data.minYearsOfExperience,
        contract: data.contract,
        jobType: data.jobType,
        noOfOpenings: data.noOfOpenings,
        location: data.location,
        deptUnit: data.deptUnit,
        employementTypeId: data.employementTypeId,
        scrubColorId: data.scrubColorId,
        description: content,
        internalJobNotes: data.internalJobNotes,
        // isFeaturedJob: data.isFeaturedJob,
        complianceChecklistId: data.complianceChecklistId,
        postToWebsite: selectedChecklist.PostToWebsite,
        pay: {
          holidayRate: data.pay.holidayRate,
          housingStipend: data.pay.housingStipend,
          mealsAndIncidentals: data.pay.mealsAndIncidentals,
          hourlyRate: data.pay.hourlyRate,
          travelReimbursement: data.pay.travelReimbursement,
          compensationComments: data.pay.compensationComments,
          overtimeRate: data.pay.overtimeRate,
          onCallRate: data.pay.onCallRate,
          callBackRate: data.pay.callBackRate,
          doubleTimeRate: data.pay.doubleTimeRate,
        },
        contractDetails: {
          startDate: data.contractDetails?.startDate,
          shiftStartTime: data?.contractDetails?.shiftStartTime,
          shiftEndTime: data?.contractDetails?.shiftEndTime,
          noOfShifts: data.contractDetails.noOfShifts,
          contractLength: data.contractDetails.contractLength,
          hrsPerWeek: data.contractDetails.hrsPerWeek,
          shiftId: data?.contractDetails?.shiftId,
          daysOnAssignment: data.contractDetails.daysOnAssignment,
          overtimeHrsPerWeek: data.contractDetails.overtimeHrsPerWeek,
        },
      });

      showToast(
        "success",
        "Job Template Created Successfully" || template?.data?.message
      );

      setLoading(false);
      setTimeout(() => {
        navigate(`/facility/${Number(facilityDataId?.Id)}`);
        setActiveComponent("Job Templates");
      }, 1500);
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
      <div className="navigate-wrapper d-flex justify-content-between">
        <div>
          <Link to="/facility/:id/details" className="link-btn">
            Manage Users
          </Link>
          <Link to="/facility/:id/details" className="link-btn">
            <span> / {facilityName ? capitalize(facilityName) : "--"}</span>
          </Link>
          <span> / </span>
          <span>Create New Job Template</span>
        </div>
        <div className="create-template-btn">
          <Link to={`/facility/${Number(facilityDataId?.Id)}`}>
            <CustomButton className="secondary-btn" onClick={handleCancel}>
              Back to Job templates
            </CustomButton>
          </Link>
        </div>
      </div>
      <div className="sidebar-section-wrapper">
        <div className="leftside">
          <nav
            id="navbar-example3"
            className="facility-sidebar facility-sidebar-template ps-0 h-100 flex-column align-items-stretch border-end pt-3"
          >
            <div style={{ height: "calc(100vh - 140px)", overflow: "auto" }}>
              <nav className="nav nav-pills flex-column facility__li-box mx-3">
                <a
                  className={`nav-link ${
                    activeLink === "#item-1" ? "active" : ""
                  }`}
                  href="#item-1"
                  onClick={() => handleLinkClick("#item-1")}
                >
                  Basic Job Details
                </a>
                <a
                  className={`nav-link ${
                    activeLink === "#item-2" ? "active" : ""
                  }`}
                  href="#item-2"
                  onClick={() => handleLinkClick("#item-2")}
                >
                  Core Information
                </a>
                <a
                  className={`nav-link ${
                    activeLink === "#item-3" ? "active" : ""
                  }`}
                  href="#item-3"
                  onClick={() => handleLinkClick("#item-3")}
                >
                  Job Description
                </a>
                <a
                  className={`nav-link ${
                    activeLink === "#item-4" ? "active" : ""
                  }`}
                  href="#item-4"
                  onClick={() => handleLinkClick("#item-4")}
                >
                  Internal Job Notes
                </a>
                <a
                  className={`nav-link ${
                    activeLink === "#item-5" ? "active" : ""
                  }`}
                  href="#item-5"
                  onClick={() => handleLinkClick("#item-5")}
                >
                  Contract Details
                </a>
                <a
                  className={`nav-link ${
                    activeLink === "#item-6" ? "active" : ""
                  }`}
                  href="#item-6"
                  onClick={() => handleLinkClick("#item-6")}
                >
                  Pay Package
                </a>
                <a
                  className={`nav-link ${
                    activeLink === "#item-7" ? "active" : ""
                  }`}
                  href="#item-7"
                  onClick={() => handleLinkClick("#item-7")}
                >
                  Additional Pay Details
                </a>
                {/* <a
                  className={`nav-link ${
                    activeLink === "#item-8" ? "active" : ""
                  }`}
                  href="#item-8"
                  onClick={() => handleLinkClick("#item-8")}
                >
                  Featured Job
                </a> */}
                <a
                  className={`nav-link ${
                    activeLink === "#item-9" ? "active" : ""
                  }`}
                  href="#item-9"
                  onClick={() => handleLinkClick("#item-9")}
                >
                  Compliance Checklist
                </a>
              </nav>
            </div>
          </nav>
        </div>
        {/* template cards */}
        <div className="rightside">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {loading && <Loader />}
            <div
              className="template-card-wrapper scrollspy-example-2"
              data-bs-spy="scroll"
              data-bs-target="#navbar-example3"
              data-bs-offset="0"
            >
              <div className="mb-3" id="item-1">
                <CustomMainCard className="h-100 job-template-cards">
                  <h1 className="list-page-header">Basic Job Details</h1>
                  <Row>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Job Title <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Job Title"
                        invalid={!!errors.title}
                        {...register("title")}
                      />
                      <FormFeedback>{errors.title?.message}</FormFeedback>
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Select Facility <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        value={capitalize(facilityName)}
                        disabled={true}
                      />
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Select/Use Job Template
                      </Label>
                      <CustomSelect
                        id={"jobTemplate"}
                        name={"jobTemplate"}
                        options={state.jobTemplate.map(
                          (template: {
                            Id: number;
                            Title: string;
                          }): { value: number; label: string } => ({
                            value: template?.Id,
                            label: capitalize(template?.Title),
                          })
                        )}
                        value={
                          selectedTemplate
                            ? {
                                value: selectedTemplate?.Id,
                                label: selectedTemplate?.Title,
                              }
                            : null
                        }
                        placeholder="Select Template"
                        noOptionsMessage={() => "No Template Found"}
                        onChange={(job) => handleJobTemplate(job)}
                        isClearable={true}
                        isSearchable={true}
                        menuPlacement={"top"}
                      />
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Bill Rate <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$0.00"
                        invalid={!!errors.billRate}
                        {...register("billRate")}
                      />
                      <FormFeedback>{errors.billRate?.message}</FormFeedback>
                    </Col>
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-2">
                <CustomMainCard className="h-100">
                  <h1 className="list-page-header">Core Information</h1>
                  <Row>
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
                        {state.profession?.map(
                          (
                            item: { Id: number; Category: string },
                            index: number
                          ) => (
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
                        options={state.speciality.map(
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
                        noOptionsMessage={() => "No Speciality Found"}
                        onChange={(speciality) =>
                          handleSpecialities(speciality)
                        }
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={!categoryProfession}
                      />
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Minimum Years of Experience{" "}
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Minimum Years of Experience"
                        invalid={!!errors.minYearsOfExperience}
                        {...register("minYearsOfExperience")}
                      />
                      <FormFeedback>
                        {errors.minYearsOfExperience?.message}
                      </FormFeedback>
                    </Col>
                    {/* <Col md="6" className="col-group">
                      <Label className="col-label">
                        Contract <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Contract"
                        invalid={!!errors.contract}
                        {...register("contract")}
                      />
                      <FormFeedback>{errors.contract?.message}</FormFeedback>
                    </Col> */}
                    <Col md="6" lg="3" className="col-group">
                      <Label className="col-label">
                        Job Type <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Job Type"
                        invalid={!!errors.jobType}
                        {...register("jobType")}
                      />
                      <FormFeedback>{errors.jobType?.message}</FormFeedback>
                    </Col>
                    <Col md="6" lg="3" className="col-group">
                      <Label className="col-label">
                        Number of Openings<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Number of Openings "
                        invalid={!!errors.noOfOpenings}
                        {...register("noOfOpenings")}
                      />
                      <FormFeedback>
                        {errors.noOfOpenings?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Job Status <span className="asterisk">*</span>
                      </Label>
                      <CustomSelect
                        id={"jobStatus"}
                        name={"jobStatus"}
                        options={state.jobStatus.map(
                          (templateStatus: {
                            Id: number;
                            Status: string;
                          }): { value: number; label: string } => ({
                            value: templateStatus?.Id,
                            label: templateStatus?.Status,
                          })
                        )}
                        value={
                          selectedJobStatus
                            ? {
                                value: selectedJobStatus?.Id,
                                label: selectedJobStatus?.Status,
                              }
                            : null
                        }
                        placeholder="Select Job Status "
                        noOptionsMessage={() => "No Job Status Found"}
                        onChange={(jobStatus) => handleJobStatus(jobStatus)}
                        isClearable={true}
                        isSearchable={true}
                      />
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Location <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Location"
                        invalid={!!errors.location}
                        {...register("location")}
                      />
                      <FormFeedback>{errors.location?.message}</FormFeedback>
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Dept. Unit <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Dept. Unit"
                        invalid={!!errors.deptUnit}
                        {...register("deptUnit")}
                      />
                      <FormFeedback>{errors.deptUnit?.message}</FormFeedback>
                    </Col>
                    <Col md="6" lg="3" className="col-group">
                      <Label className="col-label">
                        Program Manager <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        value={programManager}
                        placeholder=""
                        disabled
                      />
                    </Col>
                    {/* <Col md="3" className="col-group">
                                            <Label className="col-label">
                                                Source <span className="asterisk">*</span>
                                            </Label>
                                            <CustomInput
                                                placeholder="Source" disabled
                                            />
                                        </Col> */}
                    <Col md="6" lg="3" className="col-group">
                      <Label className="col-label">
                        Employment Type <span className="asterisk">*</span>
                      </Label>
                      <CustomSelect
                        id={"employmentType"}
                        name={"employmentType"}
                        options={state.employmentType.map(
                          (templateEmployment: {
                            Id: number;
                            Type: string;
                          }): { value: number; label: string } => ({
                            value: templateEmployment?.Id,
                            label: templateEmployment?.Type,
                          })
                        )}
                        placeholder="Select EmploymentType "
                        value={
                          selectedEmploymentType
                            ? {
                                value: selectedEmploymentType?.Id,
                                label: selectedEmploymentType?.Type,
                              }
                            : null
                        }
                        noOptionsMessage={() => "No EmploymentType Found"}
                        onChange={(employment) =>
                          handleEmployementType(employment)
                        }
                        isClearable={true}
                        isSearchable={true}
                        menuPlacement="top"
                      />
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Select Scrub Color <span className="asterisk">*</span>
                      </Label>
                      <CustomSelect
                        id={"scrubColor"}
                        name={"scrubColor"}
                        value={
                          selectedScrub
                            ? {
                                value: selectedScrub?.value,
                                label: selectedScrub?.Color,
                              }
                            : null
                        }
                        options={state.scrub.map(
                          (templateScrub: {
                            Id: number;
                            Color: string;
                          }): { value: number; label: string } => ({
                            value: templateScrub?.Id,
                            label: templateScrub?.Color,
                          })
                        )}
                        placeholder="Select Scrub Color"
                        noOptionsMessage={() => "No Scrub Color"}
                        onChange={(scrub) => handleScrubColor(scrub)}
                        isClearable={true}
                        isSearchable={true}
                        menuPlacement="top"
                      />
                    </Col>
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-3">
                <CustomMainCard className="h-100">
                  <h1 className="list-page-header">Job Description</h1>
                  <CustomRichTextEditor
                    content={content}
                    handleChange={handleChange}
                    // invalid={!!errors.description}
                    // {...register('description')}
                  />
                  {/* <FormFeedback>{errors.description?.message}</FormFeedback> */}
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-4">
                <CustomMainCard className="h-100">
                  <h1 className="list-page-header">Internal Job Notes</h1>
                  <Row>
                    <Col md="12" className="col-group">
                      <Label className="col-label">
                        Job Notes <span className="asterisk">*</span>
                      </Label>
                      <CustomTextArea
                        invalid={!!errors.internalJobNotes}
                        {...register("internalJobNotes")}
                      />
                    </Col>
                    {/* <FormFeedback>{errors.internalJobNotes?.message}</FormFeedback> */}
                    <span className="invalid-jobnotes-msg">
                      {errors.internalJobNotes?.message}
                    </span>
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-5">
                <CustomMainCard className="h-100 contract-details-card">
                  <h1 className="list-page-header">Contract Details</h1>
                  <Row>
                    <Col xl="3" md="6" lg="4" className="col-group">
                      <Label className="col-label">
                        Select Start Date <span className="asterisk">*</span>
                      </Label>
                      <CustomDatePicker
                        date={selectedContractStartDate}
                        onSelectDate={handleStartDateChange}
                      />
                    </Col>
                    <Col xl="3" md="6" lg="4" className="col-group">
                      <Label className="col-label">
                        Shift Start Time <span className="asterisk">*</span>
                      </Label>
                      <Select
                        styles={customStyles}
                        className="custom-select-picker-all contract-select"
                        placeholder="Shift Start Time"
                        options={timeOptions}
                        value={selectedShiftStart}
                        onChange={(time) => handleShiftStartTime(time)}
                        isClearable={true}
                        isSearchable={true}
                        noOptionsMessage={() => "No Start Time Found"}
                      />
                    </Col>
                    <Col xl="3" md="6" lg="4" className="col-group">
                      <Label className="col-label">
                        Shift End Time <span className="asterisk">*</span>
                      </Label>
                      <Select
                        styles={customStyles}
                        className="custom-select-picker-all"
                        placeholder="Shift End Time"
                        options={timeOptions}
                        value={selectedShiftEnd}
                        onChange={(time) => handleShiftEndTime(time)}
                        isClearable={true}
                        isSearchable={true}
                        noOptionsMessage={() => "No End Time Found"}
                        isDisabled={!selectedShiftStart}
                      />
                    </Col>
                    <Col xl="3" md="6" lg="4" className="col-group">
                      <Label className="col-label">
                        Number of Shift <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Number of Shift"
                        invalid={!!errors.contractDetails?.noOfShifts}
                        {...register("contractDetails.noOfShifts")}
                      />
                      <FormFeedback>
                        {errors.contractDetails?.noOfShifts?.message}
                      </FormFeedback>
                    </Col>
                    <Col xl="3" md="6" lg="4" className="col-group">
                      <Label className="col-label">
                        Contract Length (Weeks){" "}
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Contract Length"
                        invalid={!!errors.contractDetails?.contractLength}
                        {...register("contractDetails.contractLength")}
                      />
                      <FormFeedback>
                        {errors.contractDetails?.contractLength?.message}
                      </FormFeedback>
                    </Col>
                    {/* <Col xl="3" md="6" lg="4" className="col-group">
                      <Label className="col-label">
                        Hours Per Week <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Hours Per Week"
                        invalid={!!errors.contractDetails?.hrsPerWeek}
                        {...register("contractDetails.hrsPerWeek")}
                      />
                      <FormFeedback>
                        {errors.contractDetails?.hrsPerWeek?.message}
                      </FormFeedback>
                    </Col> */}
                    <Col xl="3" md="6" lg="4" className="col-group">
                      <Label className="col-label">
                        Shift Time <span className="asterisk">*</span>
                      </Label>
                      <CustomSelect
                        // placeholder="Shift Time"
                        // invalid={!!errors.contractDetails?.shiftTime}
                        // {...register('contractDetails.shiftTime')}
                        id={"shiftTime"}
                        name={"shiftTime"}
                        options={state.shiftTime.map(
                          (templateShift: {
                            Id: number;
                            Shift: string;
                          }): { value: number; label: string } => ({
                            value: templateShift?.Id,
                            label: templateShift?.Shift,
                          })
                        )}
                        value={
                          selectedShiftTime
                            ? {
                                value: selectedShiftTime?.Id,
                                label: selectedShiftTime?.Shift,
                              }
                            : null
                        }
                        placeholder="Select Shift"
                        noOptionsMessage={() => "No Shift Found"}
                        onChange={(time) => handleShiftTime(time)}
                        isClearable={true}
                        isSearchable={true}
                      />
                      {/* <FormFeedback>{errors.contractDetails?.shiftTime?.message}</FormFeedback> */}
                    </Col>
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-6">
                <CustomMainCard className="h-100">
                  <h1 className="list-page-header">Pay Package</h1>
                  <Row>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Regular Hours <span className="asterisk">*</span>
                      </Label>

                      <CustomInput
                        placeholder="Regular Hours"
                        type="number"
                        invalid={!!errors?.contractDetails?.hrsPerWeek}
                        {...register("contractDetails.hrsPerWeek")}
                      />
                      <FormFeedback>
                        {errors?.contractDetails?.hrsPerWeek?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">Overtime Hours</Label>
                      <CustomInput
                        placeholder="Overtime Hours"
                        type="number"
                        invalid={!!errors?.contractDetails?.overtimeHrsPerWeek}
                        {...register("contractDetails.overtimeHrsPerWeek")}
                      />
                      <FormFeedback>
                        {errors.contractDetails?.overtimeHrsPerWeek?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Total Hours <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="0"
                        value={
                          Number(watch("contractDetails.hrsPerWeek")) +
                          Number(watch("contractDetails.overtimeHrsPerWeek"))
                        }
                        // onChange={(e: any) => setTotalHours(e.target.value)}
                        disabled
                      />
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Regular Rate <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.hourlyRate}
                        {...register("pay.hourlyRate")}
                      />
                      <FormFeedback>
                        {errors.pay?.hourlyRate?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Overtime Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.overtimeRate}
                        {...register("pay.overtimeRate")}
                      />
                      <FormFeedback>
                        {errors.pay?.overtimeRate?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Lodging Stipend (Daily){" "}
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.housingStipend}
                        {...register("pay.housingStipend")}
                      />
                      <FormFeedback>
                        {errors.pay?.housingStipend?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Meals & Incidentals Stipend (Daily)
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.mealsAndIncidentals}
                        {...register("pay.mealsAndIncidentals")}
                      />
                      <FormFeedback>
                        {errors.pay?.mealsAndIncidentals?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Days on Assignment <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Days on Assignment"
                        invalid={!!errors.contractDetails?.daysOnAssignment}
                        {...register("contractDetails.daysOnAssignment")}
                      />
                      <FormFeedback>
                        {errors.contractDetails?.daysOnAssignment?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Total Gross Pay (Weekly)
                        <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Gross Pay"
                        // onChange={(e: any) => setGrosspay(e.target.value)}
                        value={
                          // Number(watch("contractDetails.hrsPerWeek")) *
                          //   Number(watch("pay.hourlyRate")) +
                          // Number(watch("contractDetails.overtimeHrsPerWeek")) *
                          //   Number(watch("pay.overtimeRate")) +
                          // Number(watch("pay.holidayRate")) *
                          //   Number(watch("contractDetails.daysOnAssignment")) +
                          // Number(watch("pay.housingStipend")) *
                          //   Number(watch("contractDetails.daysOnAssignment")) +
                          // Number(watch("pay.mealsAndIncidentals")) *
                          //   Number(watch("contractDetails.daysOnAssignment"))
                          totalGrossPay?.toFixed(2)
                        }
                        disabled
                      />
                    </Col>
                    <Col
                      md="6"
                      lg="4"
                      xl="3"
                      style={{
                        flex: 1,
                      }}
                    >
                      <Label className="col-label">Compensation Comments</Label>
                      <CustomInput
                        placeholder="Compensation Comments"
                        invalid={!!errors.pay?.compensationComments}
                        {...register("pay.compensationComments")}
                      />
                      <FormFeedback>
                        {errors.pay?.compensationComments?.message}
                      </FormFeedback>
                    </Col>
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-7">
                <CustomMainCard className="h-100">
                  <h1 className="list-page-header">Additional Pay Details</h1>
                  <Row>
                    <Col md="6" lg="3" className="col-group">
                      <Label className="col-label">
                        Holiday Rate <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.holidayRate}
                        {...register("pay.holidayRate")}
                      />
                      <FormFeedback>
                        {errors.pay?.holidayRate?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="3" className="col-group">
                      <Label className="col-label">
                        On-Call Rate <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.onCallRate}
                        {...register("pay.onCallRate")}
                      />
                      <FormFeedback>
                        {errors.pay?.onCallRate?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" lg="6" className="col-group">
                      <Label className="col-label">
                        Call Back Rate<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.callBackRate}
                        {...register("pay.callBackRate")}
                      />
                      <FormFeedback>
                        {errors.pay?.callBackRate?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Double Time Pay Rate{" "}
                        <span style={{ color: "#717B9E" }}>
                          (California Only)
                        </span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.doubleTimeRate}
                        {...register("pay.doubleTimeRate")}
                      />
                      <FormFeedback>
                        {errors.pay?.doubleTimeRate?.message}
                      </FormFeedback>
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Travel Reimbursement<span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="$ 0.00"
                        invalid={!!errors.pay?.travelReimbursement}
                        {...register("pay.travelReimbursement")}
                      />
                      <FormFeedback>
                        {errors.pay?.travelReimbursement?.message}
                      </FormFeedback>
                    </Col>
                  </Row>
                </CustomMainCard>
              </div>
              {/* <div className="mb-3" id="item-8">
                <CustomMainCard className="h-100 featured-job-wrapper">
                  <h1 className="list-page-header">Featured Job</h1>
                  <p className="para-text">
                    If the job is marked as featured then it would be displayed
                    at the top in the applicant's search results.
                  </p>
                  <div className="d-flex">
                    <CustomCheckbox
                      disabled={false}
                      checked={featuredJob}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleCheckBoxChange(e)
                      }
                    />
                    <Label className="col-label">Featured Job</Label>
                  </div>
                </CustomMainCard>
              </div> */}
              <div className="mb-2" id="item-9">
                <CustomMainCard className="h-100 featured-job-wrapper">
                  <h1 className="list-page-header">Compliance Checklist</h1>
                  <Row>
                    <Col md="12" lg="6" className="col-group">
                      <Label className="col-label">
                        Select checklist that required to apply job
                      </Label>
                      <CustomSelect
                        id={"checklist"}
                        name={"checklist"}
                        options={state.complianceList.map(
                          (checklist: {
                            Id: number;
                            Name: string;
                          }): { value: number; label: string } => ({
                            value: checklist?.Id,
                            label: capitalize(checklist?.Name),
                          })
                        )}
                        value={
                          selectedChecklist
                            ? {
                                value: selectedChecklist?.Id,
                                label: selectedChecklist?.Name,
                              }
                            : null
                        }
                        placeholder="Select Checklist"
                        noOptionsMessage={() => "No Checklist Found"}
                        onChange={(scrub) => handleCheckList(scrub)}
                        isClearable={true}
                        isSearchable={true}
                        menuPlacement="top"
                      />
                    </Col>
                    <div className="tab-wrapper">
                      {
                        <Nav tabs>
                          {state.documentList?.map(
                            (category: { Id: number; Category: string }) => (
                              <NavItem key={category?.Id}>
                                <NavLink
                                  className={
                                    activeTab === category?.Category
                                      ? "show"
                                      : ""
                                  }
                                  onClick={() =>
                                    handleTogglebar(category?.Category)
                                  }
                                  to={""}
                                >
                                  {category?.Category}
                                </NavLink>
                              </NavItem>
                            )
                          )}
                        </Nav>
                      }
                      {selectedChecklist && selectedChecklist?.Name && (
                        <TabContent activeTab={activeTab}>
                          {Object.keys(formattedData).length > 0 && (
                            <>
                              <h3 className="template-document-heading">
                                Documents {activeTab} for the job
                              </h3>
                              {Object.keys(formattedData).map(
                                (categoryKey: string) => (
                                  <TabPane
                                    key={categoryKey}
                                    tabId={categoryKey}
                                  >
                                    {formattedData[categoryKey].map(
                                      (item: any, index: number) => (
                                        <ol
                                          className="para-text"
                                          key={item?.id}
                                        >
                                          <p
                                            key={item?.id}
                                            style={{ marginTop: "10px" }}
                                          >
                                            {index + 1}.{" "}
                                            {capitalize(item?.documentname)}
                                          </p>
                                        </ol>
                                      )
                                    )}
                                  </TabPane>
                                )
                              )}
                            </>
                          )}
                        </TabContent>
                      )}
                    </div>
                    <div className="btn-wrapper">
                      <ACL
                        submodule={""}
                        module={"jobs"}
                        action={["GET", "POST"]}
                      >
                        <CustomButton className="primary-btn">
                          Save Template
                        </CustomButton>
                      </ACL>
                      <Link onClick={handleCancel} to={""}>
                        <CustomButton className="secondary-btn">
                          Cancel
                        </CustomButton>
                      </Link>
                    </div>
                  </Row>
                </CustomMainCard>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateTemplate;
