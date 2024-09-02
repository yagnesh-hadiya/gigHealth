import {
  Form,
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CustomButton from "../../../../components/custom/CustomBtn";
import {
  Button,
  Col,
  FormFeedback,
  Label,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import CustomMainCard from "../../../../components/custom/CustomCard";
import {
  ChangeEvent,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import CustomSelect from "../../../../components/custom/CustomSelect";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomRichTextEditor from "../../../../components/custom/CustomTextEditor";
import CustomTextArea from "../../../../components/custom/CustomTextarea";
import CustomDatePicker from "../../../../components/custom/CustomDatePicker";
import CustomCheckbox from "../../../../components/custom/CustomCheckbox";
import CustomEditBtn from "../../../../components/custom/CustomEditBtn";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ContractModal from "./ContractModal";
import Loader from "../../../../components/custom/CustomSpinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { JobsSchema } from "../../../../helpers/schemas/JobsSchema";
import { useForm } from "react-hook-form";
import {
  JobsActions,
  JobsFacility,
  JobsTypes,
} from "../../../../types/JobsTypes";
import {
  capitalize,
  customStyles,
  formatDate,
  showToast,
  timeOptions,
  ucFirstChar,
} from "../../../../helpers";
import {
  FacilityActiveComponentProps,
  jobsInitialStateValue,
} from "../../../../types";
import { FacilityActiveComponentContext } from "../../../../helpers/context/FacilityActiveComponent";
import {
  getActiveContract,
  getComplianceDetails,
  getComplianceList,
  getDocumentCategories,
  getEmploymentType,
  getFacilityList,
  getJobShifts,
  getJobSpecialities,
  getJobStatuses,
  getJobTemplateDetails,
  getJobTemplateList,
  getNextJobId,
  getProfessions,
  getScrubColor,
  createJob,
  saveJobTemplate,
  getProfessionsCategories,
} from "../../../../services/JobsServices";
import jobsReducer from "../../../../helpers/reducers/JobsReducer";
import {
  ApiDocumentData,
  ForamttedDocumentData,
  TimeOptions,
} from "../../../../types/JobTemplateTypes";
import Select from "react-select";
import { getListJobTemplate } from "../../../../services/JobTemplate";
import ACL from "../../../../components/custom/ACL";
import { Menu, MenuItem, SubMenu, MenuRadioGroup } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import DropdownImage from "../../../../assets/images/dropdown-arrow.svg";
import { ProfessionSubCategoryType } from "../../../../types/ProfessionalTypes";
let professionId: number = 0;

const AddNewJob = () => {
  const {
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm<JobsTypes>({
    resolver: yupResolver(JobsSchema) as any,
  });

  const [state, dispatch] = useReducer(jobsReducer, jobsInitialStateValue);
  const {
    facility,
    formattedReqId,
    postToWebsite,
    activeContract,
    jobId,
    complianceList,
    selectedFacility,
    selectedTemplate,
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
    programManager,
  } = state;

  const [activeLink, setActiveLink] = useState("#item-1");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setActiveComponent } = useContext<FacilityActiveComponentProps>(
    FacilityActiveComponentContext
  );

  const [content, setContent] = useState<string>("");
  const [jobData, setJobData] = useState<any>([]);
  const openingsRef: number = watch("noOfOpenings");
  const [reqIds, setReqIds] = useState<string[]>([]);
  const [editedJobIndex, setEditedJobIndex] = useState<number | null>(null);
  const [template, setJobTemplate] = useState<boolean>(false);
  const facId = useLocation();
  const [specialityId, setSpecialityId] = useState<number>();

  // const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [categoryProfession, setCategoryProfession] = useState<string>("");
  // const [profession, setProfession] = useState<null | []>([]);
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

  const toggle = () => setModal(!modal);

  const handleNoOfOpeningsChange = () => {
    const numberOfOpenings: number = openingsRef;
    if (numberOfOpenings > 100) {
      return showToast(
        "error",
        "Please enter Number of openings less than or equal to 100"
      );
    }

    const initialReqIds: string[] = Array(numberOfOpenings).fill("");
    setReqIds(initialReqIds);

    const newJobData = [];
    for (let index: number = 0; index < numberOfOpenings; index++) {
      newJobData.push({
        id: jobId ? jobId : "",
        header: `${
          initialReqIds[index] === undefined
            ? `JID${jobId}-${index + 1}`
            : `JID${jobId}-${index + 1}`
        }`,
        middleSection: `${jobId ? `JID${jobId}-${index + 1}` : ""}`,
      });
    }
    setJobData(newJobData);
  };

  const formatComplianceData = (
    data: ApiDocumentData[]
  ): { [key: string]: ForamttedDocumentData[] } => {
    try {
      if (!data) return {};

      const formattedData: { [key: string]: ForamttedDocumentData[] } = {};

      data.forEach((item: ApiDocumentData) => {
        const category: string = item?.DocumentCategory?.Category;
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
  let formattedData: { [key: string]: ForamttedDocumentData[] } =
    formatComplianceData(complianceDetails?.ComplianceDocuments);
  const [activeTab, setActiveTab] = useState<string>(
    Object.keys(formattedData)[0] || ""
  );

  const formatRequistionId = (data: string[]) => {
    if (!data) return [];

    const newData = [];
    for (let i: number = 0; i < data.length; i++) {
      if (data[i] !== "") {
        newData.push({
          slotNumber: i + 1,
          reqId: data[i],
        });
      }
    }
    return newData;
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
        dispatch({
          type: JobsActions.SetSpeciality,
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
    fetchSpecialities();
  }, [specialityId]);

  useEffect(() => {
    handleNoOfOpeningsChange();
  }, [openingsRef]);

  useEffect(() => {
    Promise.all([
      getFacilityList(),
      getProfessions(),
      getJobStatuses(),
      getEmploymentType(),
      getScrubColor(),
      getJobShifts(),
    ])
      .then((response) => {
        const [
          facilityList,
          professions,
          statuses,
          employmentType,
          scrubColor,
          shifts,
        ] = response;
        dispatch({
          type: JobsActions.SetFacility,
          payload: facilityList?.data?.data,
        });
        dispatch({
          type: JobsActions.SetProfession,
          payload: professions?.data?.data,
        });
        dispatch({
          type: JobsActions.SetJobStatus,
          payload: statuses?.data?.data,
        });
        dispatch({
          type: JobsActions.SetEmploymentType,
          payload: employmentType?.data?.data,
        });
        dispatch({
          type: JobsActions.SetScrub,
          payload: scrubColor?.data?.data,
        });
        dispatch({
          type: JobsActions.SetShiftTime,
          payload: shifts?.data?.data,
        });
      })
      .catch((error: any) => {
        console.error(error);
        showToast("error", error?.message || "Something went wrong");
      });
  }, []);

  useEffect(() => {
    fetchProfessionSubcategories();
  }, [state.profession?.length]);

  useEffect(() => {
    if (facId.state?.facilityId && facility && facility?.length > 0) {
      const facilityList = facility?.filter(
        (item: JobsFacility) => item?.Id == facId.state?.facilityId
      );
      dispatch({
        type: JobsActions.SetSelectedFacility,
        payload: {
          Id: facilityList[0]?.Id,
          Speciality: capitalize(facilityList[0]?.Name),
        },
      });
      return;
    } else if (!facId.state) {
      dispatch({ type: JobsActions.SetSelectedFacility, payload: null });
      return;
    }
  }, [facId.state?.facilityId, facility]);

  useEffect(() => {
    if (selectedFacility) {
      const pm = facility.find(
        (item: JobsFacility): boolean => item.Id === selectedFacility?.Id
      );

      if (pm.ProgramManager?.FirstName && pm.ProgramManager?.LastName) {
        dispatch({
          type: JobsActions.SetProgramManager,
          payload: `${ucFirstChar(pm?.ProgramManager?.FirstName)} ${ucFirstChar(
            pm?.ProgramManager?.LastName
          )}`,
        });
      } else {
        dispatch({ type: JobsActions.SetProgramManager, payload: "" });
      }

      Promise.all([
        getNextJobId(selectedFacility?.Id),
        getComplianceList(selectedFacility?.Id),
        getJobTemplateList(selectedFacility?.Id),
      ])
        .then(([nextJobId, complianceList, template]) => {
          dispatch({
            type: JobsActions.SetJobId,
            payload: nextJobId?.data?.data[0]?.nextId,
          });
          dispatch({
            type: JobsActions.SetComplianceList,
            payload: complianceList?.data?.data,
          });
          dispatch({
            type: JobsActions.SetJobTemplate,
            payload: template?.data?.data,
          });
          setJobTemplate(true);
        })
        .catch((error: any) => {
          console.error(error);
          showToast("error", error?.message || "Something went wrong");
        });

      getActiveContract(selectedFacility?.Id)
        .then((activeContract) => {
          dispatch({
            type: JobsActions.SetActiveContract,
            payload: activeContract?.data?.data,
          });
        })
        .catch((error: any) => {
          console.error(error);
          dispatch({ type: JobsActions.SetActiveContract, payload: [] });
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        });
    }
  }, [selectedFacility]);

  useEffect(() => {
    const setTemplate = state.jobTemplate?.filter(
      (item: { Id: number }) => item?.Id === facId.state?.templateId
    );

    if (state.jobTemplate && setTemplate.length > 0) {
      dispatch({
        type: JobsActions.SetSelectedTemplate,
        payload: {
          Id: setTemplate[0]?.Id,
          Title: capitalize(setTemplate[0]?.Title),
        },
      });
    }
  }, [facId.state?.templateId, template]);

  useEffect(() => {
    if (selectedChecklist === null) {
      dispatch({ type: JobsActions.SetComplianceDetails, payload: null });
      dispatch({ type: JobsActions.SetDocumentList, payload: null });
      return;
    }
    const getJobsComplianceDetails = async () => {
      try {
        setLoading(true);
        const details = await getComplianceDetails(
          selectedFacility?.Id,
          selectedChecklist?.Id
        );
        const list = await getDocumentCategories();
        dispatch({
          type: JobsActions.SetComplianceDetails,
          payload: details?.data?.data[0],
        });
        dispatch({
          type: JobsActions.SetDocumentList,
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
    getJobsComplianceDetails();
    return;
  }, [selectedChecklist, selectedFacility?.Id]);

  useEffect(() => {
    if (selectedTemplate === null) {
      dispatch({ type: JobsActions.SetSelectedTemplate, payload: null });
      dispatch({ type: JobsActions.SetSelectedChecklist, payload: null });
      return;
    }

    const getTemplate = async () => {
      try {
        setLoading(true);
        const template = await getJobTemplateDetails(
          selectedFacility?.Id,
          selectedTemplate?.Id
        );
        const templateData = template?.data?.data[0];
        // dispatch({ type: JobsActions.SetJobTemplate, payload: template?.data?.data });
        setValue("title", capitalize(templateData?.Title));
        setValue("billRate", templateData?.BillRate);
        setValue(
          "contractDetails.daysOnAssignment",
          templateData?.DaysOnAssignment
        );
        setValue(
          "contractDetails.overtimeHrsPerWeek",
          templateData?.OvertimeHrsPerWeek
        );
        setValue("minYearsOfExperience", templateData?.MinYearsExperience);
        setValue("noOfOpenings", templateData?.NoOfOpenings);
        setValue("contractDetails.hrsPerWeek", templateData?.HrsPerWeek);
        setValue(
          "contractDetails.shiftStartTime",
          templateData?.ShiftStartTime
        );
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

        setValue("pay.doubleTimeRate", templateData?.DoubleTimeRate);
        setValue(
          "contractDetails.daysOnAssignment",
          templateData?.DaysOnAssignment
        );
        setValue("pay.travelReimbursement", templateData?.TravelReimbursement);
        setValue(
          "pay.compensationComments",
          templateData?.CompensationComments
        );
        setValue("pay.onCallRate", templateData?.OnCallRate);
        setValue("pay.callBackRate", templateData?.CallBackRate);
        setValue("pay.overtimeRate", templateData?.OvertimeRate);
        setContent(templateData?.Description);
        setValue("jobType", capitalize(templateData?.JobType));
        dispatch({
          type: JobsActions.SetSelectedShiftTime,
          payload: templateData?.JobShift,
        });
        dispatch({
          type: JobsActions.SetSelectedScrub,
          payload: templateData?.ScrubColor,
        });
        dispatch({
          type: JobsActions.SetSelectedJobStatus,
          payload: templateData?.JobStatus,
        });
        dispatch({
          type: JobsActions.SetSelectedContract,
          payload: templateData?.Contract,
        });
        dispatch({
          type: JobsActions.SetSelectedSpecialities,
          payload: templateData?.JobSpeciality,
        });
        // dispatch({
        //   type: JobsActions.SetSelectedProfession,
        //   payload: templateData?.JobProfession,
        // });
        setCategoryProfession(templateData?.JobProfession.Profession);
        professionId = templateData?.JobProfession.Id;
        setSpecialityId(templateData?.JobProfession.Id);
        dispatch({
          type: JobsActions.SetSelectedEmploymentType,
          payload: templateData?.EmploymentType,
        });
        dispatch({
          type: JobsActions.SetSelectedShiftStart,
          payload: templateData?.ShiftStartTime,
        });
        dispatch({
          type: JobsActions.SetSelectedShiftEnd,
          payload: templateData?.ShiftEndTime,
        });
        formattedData = formatComplianceData(
          templateData?.ComplianceChecklist?.ComplianceDocuments
        );
        dispatch({
          type: JobsActions.SetSelectedChecklist,
          payload: {
            Id: templateData?.ComplianceChecklist?.Id,
            Name: capitalize(templateData?.ComplianceChecklist?.Name),
          },
        });

        // shift start time
        const shiftStart: TimeOptions | undefined = timeOptions.find(
          (time: TimeOptions) => time.value === templateData?.ShiftStartTime
        );
        dispatch({
          type: JobsActions.SetSelectedShiftStart,
          payload: shiftStart,
        });

        // shift end time
        const shiftEnd: TimeOptions | undefined = timeOptions.find(
          (time: TimeOptions) => time.value === templateData?.ShiftEndTime
        );
        dispatch({ type: JobsActions.SetSelectedShiftEnd, payload: shiftEnd });

        // contract start date
        dispatch({
          type: JobsActions.SetSelectedContractStart,
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

    if (selectedTemplate !== null) {
      getTemplate();
      getListJobTemplate(selectedFacility?.Id)
        .then((jobTemplate) => {
          dispatch({
            type: JobsActions.SetTemplate,
            payload: jobTemplate?.data?.data,
          });
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
    }
  }, [selectedTemplate]);

  const handleScrubColor = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedScrub, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedScrub,
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
  //     dispatch({ type: JobsActions.SetSelectedProfession, payload: null });
  //     return;
  //   }

  //   if (selectedOption) {
  //     dispatch({
  //       type: JobsActions.SetSelectedProfession,
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
      type: JobsActions.SetSelectedSpecialities,
      payload: null,
    });
    setSpecialityId(professionItem.Id);
    professionId = professionItem.Id;
  };

  const handleEmployementType = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedEmploymentType, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedEmploymentType,
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
      dispatch({ type: JobsActions.SetSelectedJobStatus, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedJobStatus,
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
      dispatch({ type: JobsActions.SetSelectedSpecialities, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedSpecialities,
        payload: {
          Id: selectedOption?.value,
          Speciality: selectedOption?.label,
        },
      });
    }
  };

  const handleFacility = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedFacility, payload: null });
      dispatch({ type: JobsActions.SetSelectedTemplate, payload: null });
      dispatch({ type: JobsActions.SetActiveContract, payload: null });
      dispatch({ type: JobsActions.SetSelectedChecklist, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedFacility,
        payload: {
          Id: selectedOption?.value,
          Speciality: selectedOption?.label,
        },
      });
      dispatch({ type: JobsActions.SetSelectedTemplate, payload: null });
      dispatch({ type: JobsActions.SetSelectedChecklist, payload: null });
    }
  };

  const handleJobTemplate = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedTemplate, payload: null });
      setContent("");
      dispatch({ type: JobsActions.SetSelectedScrub, payload: null });
      dispatch({ type: JobsActions.SetSelectedJobStatus, payload: null });
      dispatch({ type: JobsActions.SetSelectedContract, payload: null });
      dispatch({ type: JobsActions.SetSelectedSpecialities, payload: null });
      // dispatch({ type: JobsActions.SetSelectedProfession, payload: null });
      dispatch({ type: JobsActions.SetSelectedEmploymentType, payload: null });
      dispatch({ type: JobsActions.SetSelectedShiftStart, payload: null });
      dispatch({ type: JobsActions.SetSelectedShiftEnd, payload: null });
      dispatch({ type: JobsActions.SetSelectedChecklist, payload: null });
      dispatch({ type: JobsActions.SetSelectedShiftStart, payload: null });
      dispatch({ type: JobsActions.SetSelectedShiftEnd, payload: null });
      dispatch({ type: JobsActions.SetShiftStart, payload: null });
      dispatch({ type: JobsActions.SetSelectedContractStart, payload: null });
      dispatch({ type: JobsActions.SetSelectedShiftTime, payload: null });
      dispatch({ type: JobsActions.SetComplianceList, payload: null });
      dispatch({ type: JobsActions.SetComplianceDetails, payload: null });
      reset();

      return;
    }

    if (selectedOption) {
      setLoading(true);
      getListJobTemplate(selectedFacility?.Id)
        .then((jobTemplate) => {
          dispatch({
            type: JobsActions.SetJobTemplate,
            payload: jobTemplate?.data?.data,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        });

      dispatch({
        type: JobsActions.SetSelectedTemplate,
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
      dispatch({ type: JobsActions.SetSelectedChecklist, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedChecklist,
        payload: {
          Id: selectedOption?.value,
          Name: capitalize(selectedOption?.label),
        },
      });
    }
  };

  const handleWebsiteCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({ type: JobsActions.SetPostToWebsite, payload: e.target.checked });
  };

  const handleShiftStartTime = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedShiftStart, payload: null });
      dispatch({ type: JobsActions.SetSelectedShiftEnd, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedShiftStart,
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
      dispatch({ type: JobsActions.SetSelectedShiftEnd, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedShiftEnd,
        payload: {
          value: selectedOption?.value,
          label: selectedOption?.label,
        },
      });
    }

    if (selectedShiftStart) {
      const startTime = selectedShiftStart.value;
      const endTime: string = selectedOption.value;

      if (endTime > startTime) {
        dispatch({
          type: JobsActions.SetSelectedShiftEnd,
          payload: selectedOption,
        });
      } else {
        dispatch({ type: JobsActions.SetSelectedShiftEnd, payload: null });
        return showToast("error", "End time must be greater than start time");
      }
    }
  };

  const handleShiftTime = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedShiftTime, payload: null });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedShiftTime,
        payload: {
          Id: selectedOption?.value,
          Shift: selectedOption?.label,
        },
      });
    }
  };

  // const handleDaysOnAssignment = (selectedOption: { value: number, label: string } | null) => {
  //     if (selectedOption === null) {
  //         dispatch({ type: JobsActions.SetSelectedDaysOnAssignment, payload: null });
  //         return;
  //     }

  //     if (selectedOption) {
  //         dispatch({
  //             type: JobsActions.SetSelectedDaysOnAssignment,
  //             payload: {
  //                 value: selectedOption?.value,
  //                 label: selectedOption?.label,
  //             }
  //         });
  //     }
  // }

  const handleTogglebar = (categoryKey: string) => {
    setActiveTab(categoryKey);
  };

  const handleStartDateChange = (date: Date) => {
    dispatch({ type: JobsActions.SetSelectedContractStart, payload: date });
  };

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleLinkClick = (itemId: SetStateAction<string>) => {
    setActiveLink(itemId);
  };

  const handleCancel = () => {
    setActiveComponent("Jobs");
    navigate(`/jobs`);
  };

  const handleChangeReqId = (e: { target: { value: string } }) => {
    if (editedJobIndex !== null) {
      const updatedReqIds: string[] = [...reqIds];
      updatedReqIds[editedJobIndex] = e.target.value;
      setReqIds(updatedReqIds);
    }
  };

  const handleCancelReqId = () => {
    toggle();
  };

  const handleSaveReqId = () => {
    let errorFound: boolean = false;

    for (let i: number = 0; i < reqIds.length; i++) {
      if (jobId?.toString() === reqIds[i]) {
        const updatedReqIds: string[] = reqIds.map((reqId: string) =>
          jobId?.toString() === reqId ? "" : reqId
        );
        setReqIds(updatedReqIds);
        errorFound = true;
        break;
      }
    }

    if (errorFound) {
      showToast("error", "JobId and RequisitionId should be different");
      toggle();
      return;
    }

    const updatedJobData = jobData.map(
      (
        job: { id: number; header: string; middleSection: string },
        index: number
      ) => {
        if (index === editedJobIndex) {
          return {
            ...job,
            header: reqIds[index] ? `${reqIds[index]}` : "REQ",
          };
        }
        return job;
      }
    );

    setJobData(updatedJobData);
    setEditedJobIndex(null);

    const datas = formatRequistionId(reqIds);
    dispatch({ type: JobsActions.SetFormattedReqId, payload: datas });
    toggle();
  };

  const handleEdit = (index: number) => {
    setEditedJobIndex(index);
    toggle();
  };

  const handleSaveTemplate = async (data: JobsTypes) => {
    if (!selectedFacility) {
      return showToast("error", "Pleae select facility");
    }

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

    const specialityId: number = selectedSpecialities?.Id;
    const jobStatusId: number = selectedJobStatus?.Id;
    const employementTypeId: number = selectedEmploymentType?.Id;
    const scrubColorId: number = selectedScrub?.Id;
    const postToWebsite: boolean = state.postToWebsite;
    const complianceChecklistId: number = selectedChecklist?.Id;
    const shiftId: number = selectedShiftTime?.Id;
    const shiftStartTime: string = selectedShiftStart?.value;
    const shiftEndTime: string = selectedShiftEnd?.value;
    const startDate: Date | string = formatDate(selectedContractStartDate);

    try {
      setLoading(true);
      const template = await saveJobTemplate({
        facilityId: selectedFacility?.Id,
        title: data.title,
        billRate: data.billRate,
        professionId: professionId,
        jobStatusId: jobStatusId,
        specialityId: specialityId,
        minYearsOfExperience: data.minYearsOfExperience,
        contract: data.contract,
        jobType: data.jobType,
        noOfOpenings: data.noOfOpenings,
        location: data.location,
        deptUnit: data.deptUnit,
        employementTypeId: employementTypeId,
        scrubColorId: scrubColorId,
        description: content,
        internalJobNotes: data.internalJobNotes,
        complianceChecklistId: complianceChecklistId,
        postToWebsite: postToWebsite,
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
          startDate: startDate,
          shiftStartTime: shiftStartTime,
          shiftEndTime: shiftEndTime,
          noOfShifts: data.contractDetails.noOfShifts,
          contractLength: data.contractDetails.contractLength,
          hrsPerWeek: data.contractDetails.hrsPerWeek,
          shiftId: shiftId,
          daysOnAssignment: data.contractDetails.daysOnAssignment,
          overtimeHrsPerWeek: data.contractDetails.overtimeHrsPerWeek,
        },
      });
      if (template.status === 201) {
        showToast(
          "success",
          "Jobs Template Created Successfully" || template?.data?.message
        );
        setLoading(false);
        navigate(`/jobs`);
        setActiveComponent("Jobs");
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

  const handlePublish = async (data: JobsTypes) => {
    if (!selectedFacility) {
      return showToast("error", "Pleae select facility");
    }

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

    const seen: string[] = [];
    for (const item of reqIds) {
      const lowerItem: string = item.toLowerCase();

      for (const jid of jobData) {
        if (lowerItem === jid.middleSection.toLowerCase()) {
          return showToast("error", "Requisition Id and Job Id cannot be same");
        }
      }

      if (
        seen.some((value: string): boolean => value.toLowerCase() === lowerItem)
      ) {
        return showToast("error", "Requisition Id cannot be same");
      }

      if (item !== "") {
        if (item.length < 2 || item.length > 100) {
          return showToast(
            "error",
            "reqIds must be between 2 to 100 characters"
          );
        }
        seen.push(item);
      }
    }

    const specialityId: number = selectedSpecialities?.Id;
    const jobStatusId: number = selectedJobStatus?.Id;
    const employementTypeId: number = selectedEmploymentType?.Id;
    const scrubColorId: number = selectedScrub?.Id;
    const postToWebsite: boolean = state.postToWebsite;
    const complianceChecklistId: number = selectedChecklist?.Id;
    const shiftId: number = selectedShiftTime?.Id;
    const shiftStartTime: string = selectedShiftStart?.value;
    const shiftEndTime: string = selectedShiftEnd?.value;
    const startDate: Date | string = formatDate(selectedContractStartDate);

    try {
      setLoading(true);
      const template = await createJob({
        facilityId: selectedFacility?.Id,
        title: data.title,
        billRate: data.billRate,
        professionId: professionId,
        jobStatusId: jobStatusId,
        specialityId: specialityId,
        minYearsOfExperience: data.minYearsOfExperience,
        contract: data.contract,
        jobType: data.jobType,
        noOfOpenings: data.noOfOpenings,
        location: data.location,
        deptUnit: data.deptUnit,
        employementTypeId: employementTypeId,
        scrubColorId: scrubColorId,
        description: content,
        internalJobNotes: data.internalJobNotes,
        complianceChecklistId: complianceChecklistId,
        postToWebsite: postToWebsite,
        pay: {
          holidayRate: data.pay.holidayRate,
          housingStipend: data.pay.housingStipend,
          mealsAndIncidentals: data.pay.mealsAndIncidentals,
          hourlyRate: data.pay.hourlyRate,
          overtimeRate: data.pay.overtimeRate,
          travelReimbursement: data.pay.travelReimbursement,
          compensationComments: data.pay.compensationComments,
          onCallRate: data.pay.onCallRate,
          callBackRate: data.pay.callBackRate,
          doubleTimeRate: data.pay.doubleTimeRate
            ? data.pay.doubleTimeRate
            : undefined,
        },
        contractDetails: {
          startDate: startDate,
          shiftStartTime: shiftStartTime,
          shiftEndTime: shiftEndTime,
          noOfShifts: data.contractDetails.noOfShifts,
          contractLength: data.contractDetails.contractLength,
          hrsPerWeek: data.contractDetails.hrsPerWeek,
          shiftId: shiftId,
          daysOnAssignment: data.contractDetails.daysOnAssignment,
          overtimeHrsPerWeek: data.contractDetails.overtimeHrsPerWeek
            ? data.contractDetails.overtimeHrsPerWeek
            : undefined,
        },
        reqIds: formattedReqId,
      });
      showToast(
        "success",
        "Jobs Created Successfully" || template?.data?.message
      );

      if (template.status === 201) {
        setLoading(false);
        navigate(`/jobs`);
        setActiveComponent("Jobs");
      }
    } catch (error: any) {
      console.error(error);
      if (error?.response?.data?.errors[0]) {
        showToast("error", error?.response?.data?.errors[0]);
        setLoading(false);
      }
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
          <Link to="/jobs" className="link-btn">
            Jobs
          </Link>
          <span> / </span>
          <span>Add New Job</span>
        </div>
      </div>
      <div className="sidebar-section-wrapper">
        <div className="leftside">
          <CustomMainCard className="h-100 z-0 border-0">
            <nav
              id="navbar-example3"
              className="facility-sidebar  facility-sidebar-template ps-0 h-100 flex-column align-items-stretch border-end"
            >
              <div style={{ height: "calc(100vh - 140px)", overflow: "auto" }}>
                <nav className="nav nav-pills flex-column facility__li-box mx-3 mt-3">
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
                  <a
                    className={`nav-link ${
                      activeLink === "#item-10" ? "active" : ""
                    }`}
                    href="#item-10"
                    onClick={() => handleLinkClick("#item-10")}
                  >
                    Client Req ID's
                  </a>
                </nav>
              </div>
            </nav>
          </CustomMainCard>
        </div>
        <div className="rightside">
          <Form>
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
                      <CustomSelect
                        id={"facilityId"}
                        name={"facilityId"}
                        options={facility?.map(
                          (fac: {
                            Id: number;
                            Name: string;
                          }): { value: number; label: string } => ({
                            value: fac?.Id,
                            label: capitalize(fac?.Name),
                          })
                        )}
                        value={
                          selectedFacility
                            ? {
                                value: selectedFacility?.Id,
                                label: selectedFacility?.Speciality,
                              }
                            : null
                        }
                        placeholder="Select Facility"
                        noOptionsMessage={(): string => "No Facility Found"}
                        onChange={(fac) => handleFacility(fac)}
                        isClearable={true}
                        isSearchable={true}
                      />
                    </Col>
                    <Col md="3" className="col-group">
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
                    <Col md="3" className="col-group">
                      <Label className="col-label">
                        Contract ID <span className="asterisk">*</span>
                      </Label>
                      {/* <CustomInput placeholder="Job Title" className="contract-id" value={'FCON0001'} onclick={toggle} disabled={true} /> */}
                      <ContractModal
                        ContractId={activeContract ? activeContract[0]?.Id : ""}
                        ContactName={
                          activeContract ? activeContract[0]?.ContactName : ""
                        }
                        ContactNumber={
                          activeContract ? activeContract[0]?.ContactNumber : ""
                        }
                        PaymentTerm={
                          activeContract ? activeContract[0]?.PaymentTerm : null
                        }
                        WorkWeek={
                          activeContract ? activeContract[0]?.WorkWeek : ""
                        }
                        SuperAdminFee={
                          activeContract ? activeContract[0]?.SuperAdminFee : ""
                        }
                        NonBillableOrientation={
                          activeContract
                            ? activeContract[0]?.NonBillableOrientation
                            : ""
                        }
                        HolidayMultiplier={
                          activeContract
                            ? activeContract[0]?.HolidayMultiplier
                            : ""
                        }
                        IncludedHolidays={
                          activeContract
                            ? activeContract[0]?.IncludedHolidays
                            : ""
                        }
                        HolidayBillingRules={
                          activeContract
                            ? activeContract[0]?.HolidayBillingRules
                            : ""
                        }
                        OvertimeMultiplier={
                          activeContract
                            ? activeContract[0]?.OvertimeMultiplier
                            : ""
                        }
                        OvertimeThreshold={
                          activeContract
                            ? activeContract[0]?.OvertimeThreshold
                            : ""
                        }
                        OnCallRate={
                          activeContract ? activeContract[0]?.OnCallRate : ""
                        }
                        CallBackMultiplier={
                          activeContract
                            ? activeContract[0]?.CallBackMultiplier
                            : ""
                        }
                        TimeRoundingGuidelines={
                          activeContract
                            ? activeContract[0]?.TimeRoundingGuidelines
                            : ""
                        }
                        SpecialBillingDetails={
                          activeContract
                            ? activeContract[0]?.SpecialBillingDetails
                            : ""
                        }
                        GauranteedHrs={
                          activeContract ? activeContract[0]?.GauranteedHrs : ""
                        }
                        MissedPunchPayrollProcess={
                          activeContract
                            ? activeContract[0]?.MissedPunchPayrollProcess
                            : ""
                        }
                        CostCenters={
                          activeContract ? activeContract[0]?.CostCenters : ""
                        }
                        KronosTimeCodes={
                          activeContract
                            ? activeContract[0]?.KronosTimeCodes
                            : ""
                        }
                        ContractDocuments={
                          activeContract
                            ? activeContract[0]?.ContractDocuments
                            : []
                        }
                      />
                    </Col>
                    <Col md="6" className="col-group">
                      <Label className="col-label">
                        Select/Use Job Template
                      </Label>
                      <CustomSelect
                        id={"jobTemplate"}
                        name={"jobTemplate"}
                        options={state.jobTemplate?.map(
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
                        noOptionsMessage={(): string => "No Template Found"}
                        onChange={(job) => handleJobTemplate(job)}
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={!selectedFacility}
                      />
                    </Col>
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-2">
                <CustomMainCard className="h-100">
                  <h1 className="list-page-header">Core Information</h1>
                  <Row>
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
                        Number of Openings <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Number of Openings "
                        disabled={!selectedFacility}
                        // value={openings}
                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOpenings(e.target.value)}
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
                        options={state.jobStatus?.map(
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
                        noOptionsMessage={(): string => "No Job Status Found"}
                        onChange={(jobStatus) => handleJobStatus(jobStatus)}
                        isClearable={true}
                        isSearchable={true}
                      />
                    </Col>
                    <Col md="6" lg="6" className="col-group">
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
                    {/* <Col md="3" className="col-group">
                                            <Label className="col-label">
                                                Cost Center
                                            </Label>
                                            <CustomInput
                                                placeholder="Cost Center"
                                                disabled
                                            invalid={!!errors.costcenter}
                                            {...register('costcenter')}
                                            />
                                             <FormFeedback>{errors.costcenter?.message}</FormFeedback>
                                        </Col> */}
                    <Col md="6" lg="3" className="col-group">
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
                        value={
                          !selectedFacility ||
                          programManager === undefined ||
                          programManager === null
                            ? ""
                            : programManager
                        }
                        placeholder=""
                        disabled
                      />
                    </Col>
                    <Col md="6" lg="6" className="col-group">
                      <Label className="col-label">
                        Source
                        {/* <span className="asterisk">*</span> */}
                      </Label>
                      <CustomInput
                        value={!selectedFacility ? "" : `JID-${jobId}`}
                        placeholder=""
                        disabled
                      />
                    </Col>
                    <Col md="6" lg="3" className="col-group">
                      <Label className="col-label">
                        Employment Type <span className="asterisk">*</span>
                      </Label>
                      <CustomSelect
                        id={"employmentType"}
                        name={"employmentType"}
                        options={state.employmentType?.map(
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
                        noOptionsMessage={(): string =>
                          "No EmploymentType Found"
                        }
                        onChange={(employment) =>
                          handleEmployementType(employment)
                        }
                        isClearable={true}
                        isSearchable={true}
                        menuPlacement="top"
                      />
                    </Col>
                    <Col md="6" lg="3" className="col-group">
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
                        options={state.scrub?.map(
                          (templateScrub: {
                            Id: number;
                            Color: string;
                          }): { value: number; label: string } => ({
                            value: templateScrub?.Id,
                            label: templateScrub?.Color,
                          })
                        )}
                        placeholder="Select Scrub Color"
                        noOptionsMessage={(): string => "No Scrub Color"}
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
                  <h1 className="list-page-header">
                    Job Description <span className="asterisk">*</span>
                  </h1>
                  <CustomRichTextEditor
                    content={content}
                    handleChange={handleChange}
                  />
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
                      <span className="invalid-jobnotes-msg">
                        {errors.internalJobNotes?.message}
                      </span>
                    </Col>
                    {/* <FormFeedback>{errors.internalJobNotes?.message}</FormFeedback> */}
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-5">
                <CustomMainCard
                  className="h-100 contract-details-card"
                  style={{ overflowY: "unset" }}
                >
                  <h1 className="list-page-header">Contract Details</h1>
                  <Row>
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Select Start Date <span className="asterisk">*</span>
                      </Label>
                      <CustomDatePicker
                        className="custom-input"
                        date={selectedContractStartDate}
                        onSelectDate={handleStartDateChange}
                        placeholder="Select Start Date"
                      />
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
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
                        noOptionsMessage={(): string => "No Start Time Found"}
                      />
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
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
                        noOptionsMessage={(): string => "No End Time Found"}
                        isDisabled={!selectedShiftStart}
                      />
                    </Col>
                    <Col md="6" lg="4" xl="3" className="col-group">
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
                    <Col md="6" lg="4" xl="3" className="col-group">
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
                    {/* <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Hours Per Week <span className="asterisk">*</span>
                      </Label>days on assignment
                      <CustomInput
                        placeholder="Hours Per Week"
                        invalid={!!errors.contractDetails?.hrsPerWeek}
                        {...register("contractDetails.hrsPerWeek")}
                      />
                      <FormFeedback>
                        {errors.contractDetails?.hrsPerWeek?.message}
                      </FormFeedback>
                    </Col> */}
                    <Col md="6" lg="4" xl="3" className="col-group">
                      <Label className="col-label">
                        Shift Time <span className="asterisk">*</span>
                      </Label>
                      <CustomSelect
                        id={"shiftTime"}
                        name={"shiftTime"}
                        options={state.shiftTime?.map(
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
                        noOptionsMessage={(): string => "No Shift Found"}
                        onChange={(time) => handleShiftTime(time)}
                        isClearable={true}
                        isSearchable={true}
                      />
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
                        inputMode="numeric"
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
                        type="number"
                        placeholder="Overtime Hours"
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
                        Gross Pay <span className="asterisk">*</span>
                      </Label>
                      <CustomInput
                        placeholder="Gross Pay"
                        // onChange={(e: any) => setGrosspay(e.target.value)}
                        value={totalGrossPay?.toFixed(2)}
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
                        type="number"
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
              <div className="mb-3" id="item-8">
                <CustomMainCard className="h-100 featured-job-wrapper">
                  <h1 className="list-page-header">Job Settings</h1>
                  {/* <p className="para-text">
                    If the job is marked as featured then it would be displayed
                    at the top in the applicant's search results.
                  </p> */}
                  <div className="d-flex">
                    {/* <CustomCheckbox
                      disabled={false}
                      checked={featuredJob}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleCheckBoxChange(e)
                      }
                    />
                    <Label className="col-label me-4">Featured Job</Label> */}
                    <CustomCheckbox
                      disabled={false}
                      checked={postToWebsite}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleWebsiteCheckboxChange(e)
                      }
                    />
                    <Label className="col-label">Post to Website</Label>
                  </div>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-9">
                <CustomMainCard className="h-100 featured-job-wrapper">
                  <h1 className="list-page-header">
                    Compliance Checklist <span className="asterisk">*</span>
                  </h1>
                  <Row>
                    <Col md="12" lg="6" className="col-group">
                      <Label className="col-label">
                        Select checklist that required to apply job
                      </Label>
                      <CustomSelect
                        id={"checklist"}
                        name={"checklist"}
                        options={complianceList?.map(
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
                        noOptionsMessage={(): string => "No Checklist Found"}
                        onChange={(scrub) => handleCheckList(scrub)}
                        isClearable={true}
                        isSearchable={true}
                        menuPlacement="top"
                        isDisabled={!selectedFacility}
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
                  </Row>
                </CustomMainCard>
              </div>
              <div className="mb-3" id="item-10">
                <CustomMainCard className="h-100 featured-job-wrapper">
                  {openingsRef &&
                    selectedFacility &&
                    openingsRef >= 1 &&
                    openingsRef <= 100 && (
                      <>
                        <h1 className="list-page-header">
                          Client Req ID's / Job Openings
                        </h1>
                        <div className="job-opening">
                          <div className="job-headings d-flex g-2">
                            <h5 className="heading-first">Job ID</h5>
                            <h5 className="heading-second">Req ID</h5>
                          </div>
                          {jobData.map((job: any, index: number) => (
                            <div
                              className="job-card-wrapper job-box"
                              key={index}
                            >
                              <div className="job-card job-innerCard">
                                <div className="left-section">
                                  <span className="job-id">
                                    JID{job.id}-{index + 1}
                                  </span>
                                  <Button
                                    onClick={() => handleEdit(index)}
                                    className="header-input job-input"
                                  >
                                    {job.header}
                                  </Button>
                                </div>
                                <h5 className="job-id middle-section">
                                  {job.middleSection}
                                </h5>
                                <CustomEditBtn
                                  onEdit={() => handleEdit(index)}
                                />
                              </div>
                              {/* Render the modal only for the edited job */}
                              {editedJobIndex === index && (
                                <Modal
                                  isOpen={modal}
                                  toggle={toggle}
                                  centered
                                  style={{ maxWidth: "400px", width: "100%" }}
                                >
                                  <ModalHeader toggle={toggle}>
                                    Edit Client Req ID
                                  </ModalHeader>
                                  <ModalBody>
                                    <div className="job-client-modal">
                                      <div>
                                        <h3 className="client-modal-heading">
                                          Client Req ID
                                        </h3>
                                        <CustomInput
                                          placeholder={`JID${jobId}-${
                                            editedJobIndex + 1
                                          }`}
                                          value={reqIds[index]}
                                          onChange={handleChangeReqId}
                                        />
                                      </div>
                                    </div>
                                    <div className="job-client-buttons">
                                      <CustomButton
                                        className="job-header-button me-2"
                                        onClick={handleSaveReqId}
                                      >
                                        Save
                                      </CustomButton>
                                      <Link onClick={handleCancelReqId} to={""}>
                                        <CustomButton className="secondary-btn">
                                          Cancel
                                        </CustomButton>
                                      </Link>
                                    </div>
                                  </ModalBody>
                                </Modal>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  <div className="btn-wrapper">
                    {activeContract && activeContract.length > 0 && (
                      <ACL
                        submodule={""}
                        module={"jobs"}
                        action={["GET", "POST"]}
                      >
                        <CustomButton
                          className="publish-btn"
                          onClick={handleSubmit(handlePublish)}
                        >
                          Publish
                        </CustomButton>
                      </ACL>
                    )}
                    <ACL
                      submodule={""}
                      module={"jobs" || "facilities"}
                      action={["GET", "POST"]}
                    >
                      <CustomButton
                        className="primary-btn"
                        onClick={handleSubmit(handleSaveTemplate)}
                      >
                        Save As Template
                      </CustomButton>
                    </ACL>
                    <Link onClick={handleCancel} to={""}>
                      <CustomButton className="secondary-btn">
                        Cancel
                      </CustomButton>
                    </Link>
                  </div>
                </CustomMainCard>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddNewJob;
