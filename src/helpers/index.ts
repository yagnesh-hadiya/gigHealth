import { toast } from "react-toastify";
import { ActionTypes, SelectOption } from "../types/FacilityTypes";
import { Allows, Permissions } from "../types/AuthTypes";
import { Dispatch } from "react";
import { TimeOptions } from "../types/JobTemplateTypes";

type DebounceFunction = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) => (...args: T) => void;

export const debounce: DebounceFunction = (fn, delay) => {
  let timerId: any;
  return (...params) => {
    clearTimeout(timerId);
    timerId = setTimeout(fn, delay, ...params);
  };
};

export const showToast = debounce(
  (type: string, message: string | undefined) => {
    if (type.toLowerCase() === "success") {
      toast.success(message || "Success", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    } else if (type.toLowerCase() === "error") {
      toast.error(message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    }
  },
  1000
);

export const isUserAuthenticated = () => {
  const token: string | null = localStorage.getItem("access-token");
  return !!token;
};

export const capitalize = (str: string): string => {
  return str
    .split(" ")
    .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatPhoneNumber = (inputNumber: string): string => {
  if (!inputNumber) {
    return "";
  }

  const cleaned: string = inputNumber.replace(/\D/g, "").slice(0, 10);
  const match = cleaned.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return `${match[1]}${match[2] ? `-${match[2]}` : ""}${
      match[3] ? `-${match[3]}` : ""
    }`;
  }
  return cleaned;
};

export const handleSelect = (
  selectedOption: SelectOption | null,
  dispatch: Dispatch<{ type: ActionTypes; payload: any }>,
  actionType: ActionTypes
) => {
  if (selectedOption === null) {
    dispatch({ type: actionType, payload: null });
    return;
  }

  if (selectedOption) {
    dispatch({
      type: actionType,
      payload: {
        value: selectedOption.value,
        label: selectedOption.label,
      },
    });
  }
};

export const setAclPermissions = (allows: Allows[]) => {
  localStorage.setItem("acl-permissions", JSON.stringify(allows));
};

export const getAclPermissions = (): Allows[] | null => {
  try {
    const permissions = localStorage.getItem("acl-permissions");
    if (!permissions) {
      return null;
    }

    return JSON.parse(permissions);
  } catch (error) {
    console.error("Error while getting permissions", error);
    return null;
  }
};

export const deleteAclPermissions = () => {
  localStorage.removeItem("acl-permissions");
};

export const checkAclPermission = (
  module: string,
  submodule: string | null,
  action: Permissions[]
) => {
  try {
    const allows: Allows[] | null = getAclPermissions();
    if (!allows) {
      return false;
    }

    for (const allow of allows) {
      if (allow.module === module) {
        if (
          !submodule &&
          action.every((item) => allow.permissions.includes(item))
        ) {
          return true;
        }

        if (submodule && allow.permissions.includes("GET")) {
          for (const sub of allow.submodules!) {
            if (sub.module === submodule) {
              if (action.every((item) => sub.permissions.includes(item))) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error("Error while checking permissions", error);
    return false;
  }
};

export const getFileExtension = (file: File | undefined) => {
  const fileExtension: string | undefined = file?.name
    ?.split(".")
    ?.pop()
    ?.toLowerCase();
  return fileExtension;
};

export const timeOptions: TimeOptions[] = [
  { label: "00:00:00", value: "00:00:00" },
  { label: "01:00:00", value: "01:00:00" },
  { label: "02:00:00", value: "02:00:00" },
  { label: "03:00:00", value: "03:00:00" },
  { label: "04:00:00", value: "04:00:00" },
  { label: "05:00:00", value: "05:00:00" },
  { label: "06:00:00", value: "06:00:00" },
  { label: "07:00:00", value: "07:00:00" },
  { label: "08:00:00", value: "08:00:00" },
  { label: "09:00:00", value: "09:00:00" },
  { label: "10:00:00", value: "10:00:00" },
  { label: "11:00:00", value: "11:00:00" },
  { label: "12:00:00", value: "12:00:00" },
  { label: "13:00:00", value: "13:00:00" },
  { label: "14:00:00", value: "14:00:00" },
  { label: "15:00:00", value: "15:00:00" },
  { label: "16:00:00", value: "16:00:00" },
  { label: "17:00:00", value: "17:00:00" },
  { label: "18:00:00", value: "18:00:00" },
  { label: "19:00:00", value: "19:00:00" },
  { label: "20:00:00", value: "20:00:00" },
  { label: "21:00:00", value: "21:00:00" },
  { label: "22:00:00", value: "22:00:00" },
  { label: "23:00:00", value: "23:00:00" },
];

export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const day: string = date.getDate().toString().padStart(2, "0");
  const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const year: number = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const ucFirstChar = (str: string) => {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getTextContent = (htmlString: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export const formatDate = (date: string) => {
  const selectedStartDate = new Date(date);
  const year = selectedStartDate.getFullYear();
  const month = (selectedStartDate.getMonth() + 1).toString().padStart(2, "0");
  const day = selectedStartDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const initialStateValue = {
  selectedTemplate: null,
  selectedProfession: null,
  selectedSpecialities: null,
  selectedContract: null,
  selectedJobStatus: null,
  selectedEmploymentType: null,
  selectedScrub: null,
  selectedShiftStart: null,
  selectedShiftEnd: null,
  selectedChecklist: null,
  selectedComplianceList: null,
  scrub: [],
  profession: [],
  employmentType: [],
  jobStatus: [],
  speciality: [],
  jobTemplate: [],
  contract: [],
  complianceDetails: [],
  complianceList: [],
  featuredJob: false,
  facilityName: "",
  cardDetails: [],
  shiftStartTime: null,
  shiftEndTime: null,
  programManager: "",
  selectedContractStartDate: "",
  documentList: [],
  selectedShiftTime: null,
  shiftTime: [],
  search: "",
};

export const customStyles = {
  control: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    width: "100%",
    border: state.isFocused ? "1px solid #DDDDEA" : "1px solid #DDDDEA",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    background: state.isFocused ? "#fff" : "#fff",
    color: state.isFocused ? "#474D6A" : "#262638",
    cursor: "pointer",
    maxHeight: "200px",
    "&:hover": {},
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#717B9E",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#262638",
    fontSize: "14px",
  }),
};

export const daysAssignment: { label: string; value: number }[] = [
  { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
];

export const checkDuplicateReqIds = (data: string[]) => {
  const seen: string[] = [];
  for (let item of data) {
    if (seen.includes(item)) {
      return showToast("error", "Requisition Id cannot be same");
    }

    seen.push(item);
  }

  return false;
};

export type leftJobContentInitialValues = {
  selectedProfession: null;
};

export const formatDateInDayMonthYear = (date: string) => {
  const selectedStartDate = new Date(date);
  const year: number = selectedStartDate.getFullYear();
  const month: string = (selectedStartDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const day: string = selectedStartDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${month}-${day}-${year}`;
  return formattedDate;
};

export const formatDateByYearMonthDate = (date: string) => {
  const selectedStartDate = new Date(date);
  const year: number = selectedStartDate.getFullYear();
  const month: string = (selectedStartDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const day: string = selectedStartDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const facilityjobCustomStyles = {
  control: (provided: any) => ({
    ...provided,
    width: "100%",
    minHeight: "26px",
    boxShadow: "none",
    backgroundColor: "#639A35",
    padding: "0 4px",
  }),
  option: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    background: state.isFocused ? "#fff" : "#fff",
    color: state.isFocused ? "#474D6A" : "#262638",
    cursor: "pointer",
    maxHeight: "200px",
    "&:hover": {},
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#fff",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    margin: "0px",
    fontSize: "14px",
    color: "#fff",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    background: "#639A35",
    height: "28px",
    padding: "0px 1px",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: "26px",
    "&:hover": { color: "#fff" },
  }),
  menu: (provided: any) => ({
    ...provided,
    width: "auto",
    minWidth: "100%",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    padding: "0px",
    color: "#fff",
    ":hover": {
      color: "#fff",
    },
  }),
  dropdownIndicator: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    padding: "0px 0px",
    color: state.isFocused ? "#fff" : "#fff",
    ":hover": {
      color: "#fff",
    },
  }),
};

export const notecustomStyles = {
  control: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    width: "100%",
    border: state.isFocused ? "1px solid #DDDDEA" : "1px solid #DDDDEA",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    background: state.isFocused ? "#fff" : "#fff",
    color: state.isFocused ? "#474D6A" : "#262638",
    cursor: "pointer",
    maxHeight: "200px",
    "&:hover": {},
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#717B9E",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#262638",
    fontSize: "14px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

export const optioncustomStyles = {
  control: (provided: any) => ({
    ...provided,
    width: "120px",
    backgroundColor: "#7F47DD",
    color: "#fff",
    border: "none",
    boxShadow: "none",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#fff",
    textAlign: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#fff",
  }),
  option: (provided: any) => ({
    ...provided,
    backgroundColor: "#fff",
    color: "#000",
    ":hover": {
      backgroundColor: "#fff",
      color: "#000",
    },
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

export const activityModalDropdown = {
  dropdownIndicator: (base: any) => ({
    ...base,
    "&::after": {
      content: '""',
      borderTop: "5px solid",
      borderRight: "5px solid transparent",
      borderLeft: "5px solid transparent",
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
    },
    svg: {
      display: "none",
    },
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    display: "none",
  }),
};
export const headerDropdown = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    //  height: '34px',
    border: "1px solid #5E9B2D",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "#5E9B2D" : "#262638",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid #5E9B2D",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
  }),
};

export const headerPurpleDropdown = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    //  height: '34px',
    border: "1px solid #7F47DD",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "#7F47DD" : "#262638",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid #7F47DD",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
  }),
};
export const headerRosterDropdown = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    //  height: '34px',
    // border: "1px solid #CF990E",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "#CF990E" : "#262638",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid #CF990E",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#CF990E",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#CF990E",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#CF990E",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#CF990E",
  }),
};
const getOptionStyles = (base: any, state: { data: { label: string } }) => {
  if (state.data.label === "Terminate") {
    return {
      ...base,
      color: "#E74C3C",
      // position:'relative',
      zIndex: -1,
      backgroundColor: "#FFF",
      cursor: "pointer",
      ":active": {
        ...base[":active"],
        backgroundColor: "#FFF",
        color: "#E74C3C",
      },
    };
  }
  return base;
};

export const rostercustomStyles = {
  ...optioncustomStyles,
  option: (base: any, state: { data: { label: string } }) =>
    getOptionStyles(base, state),
  control: (provided: any) => ({
    ...provided,
    width: "120px",
    backgroundColor: "#7F47DD",
    color: "#fff",
    border: "none",
    boxShadow: "none",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#fff",
    textAlign: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  menu: (provided: any) => ({
    ...provided,
    //  backgroundColor: '#fff',
    // zIndex: 1000,
  }),

  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};
export const offerDropdown = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    //  height: '34px',
    border: "1px solid #7F47DD",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "#7F47DD" : "#262638",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid #7F47DD",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
  }),
};

export const rosterHeader = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    border: "1px solid #CF990E",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "#CF990E" : "#262638",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid #CF990E",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#CF990E",
    fontSize: "14px",
    "&:hover": {
      color: "#CF990E",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#CF990E",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#CF990E",
    "&:hover": {
      color: "#CF990E",
    },
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#CF990E",
    "&:hover": {
      color: "#CF990E",
    },
  }),
};
const getStyleForOption = (provided: any, state: any) => ({
  ...provided,
  color: state.data.label === "Approve Extension" ? "green" : "#000",
  backgroundColor: "#fff",
  cursor: "pointer",
  textAlign: "start",
  ":hover": {
    ...provided[":hover"],
    color: state.data.label === "Approve Extension" ? "darkgreen" : "#000",
    backgroundColor: "#fff",
  },
});

export const expandeddropdownStyles = {
  control: (provided: any) => ({
    ...provided,
    width: "120px",
    backgroundColor: "#7F47DD",
    color: "#fff",
    border: "none",
    boxShadow: "none",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#fff",
    textAlign: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  menu: (provided: any) => ({
    ...provided,
    width: "150px",
  }),
  option: getStyleForOption,
  // option: (provided: any) => ({
  //   ...provided,
  //   backgroundColor: '#fff',
  //   textAlign:'start',
  //   color:'#000' ,
  //   ':hover': {
  //     backgroundColor: '#fff',
  //     color: '#000',
  //   },
  // }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};
export const emaildropdownStyles = {
  option: (provided: any) => ({
    ...provided,
    width: "670px",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: "16px",
    width: "300px",
    border: "none",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    border: "none",
    borderColor: state.isFocused ? "none" : provided.borderColor,
    boxShadow: state.isFocused ? "none" : provided.boxShadow,
    "&:hover": {
      borderColor: state.isFocused ? "none" : provided.borderColor,
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    width: "670px",
    overflow: "hidden",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#717B9E",
  }),
};
export const appliedJObDropdown = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    //  height: '34px',
    border: "1px solid rgba(113, 123, 158, 0.50)",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "rgba(113, 123, 158, 0.50)" : "#262638",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid rgba(113, 123, 158, 0.50)",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "rgba(113, 123, 158, 0.50)",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "rgba(113, 123, 158, 0.50)",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "rgba(113, 123, 158, 0.50)",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#CF990E",
  }),
};
export const assignmentOrangecustomStyles = {
  ...optioncustomStyles,
  option: (base: any, state: { data: { label: string } }) =>
    getOptionStyles(base, state),
  control: (provided: any) => ({
    ...provided,
    width: "120px",
    background: "transperant",
    color: "#7F47DD",
    border: "none",
    boxShadow: "none",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
    textAlign: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
  }),
  menu: (provided: any) => ({
    ...provided,
    //  backgroundColor: '#fff',
    // zIndex: 1000,
  }),

  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#7F47DD",
    "&:hover": {
      color: "#7F47DD",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};
export const maxFileSize: number = 2;
export const validFileExtensions = { facilityPicture: ["jpg", "jpeg", "png"] };
export const validLicenseExtensions = {
  profilePictrue: ["jpg", "jpeg", "png"],
};
export const submissionHeaderDropdowns = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    //  height: '34px',
    border: "1px solid #5E9B2D",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "#5E9B2D" : "#e74c3c",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid #5E9B2D",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#5E9B2D",
  }),
};