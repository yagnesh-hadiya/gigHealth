import Building from "../../../../assets/images/building.svg";
import Locations from "../../../../assets/images/location.svg";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomSelect from "../../../../components/custom/CustomSelect";
import Box from "../../../../assets/images/blueIcon.png";
import CustomMainCard from "../../../../components/custom/CustomCard";
import { Nav, NavItem, TabContent, TabPane } from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import CustomButton from "../../../../components/custom/CustomBtn";
import {
  capitalize,
  checkAclPermission,
  formatDateInDayMonthYear,
  showToast,
} from "../../../../helpers";
import { JobsActions, RightJobContentData } from "../../../../types/JobsTypes";
import ReactQuill from "react-quill";
import {
  ApiDocumentData,
  ForamttedDocumentData,
} from "../../../../types/JobTemplateTypes";
import {
  getDocumentCategories,
  getJobStatuses,
  updateJobStatus,
} from "../../../../services/JobsServices";
import Loader from "../../../../components/custom/CustomSpinner";
import { jobsCustomStyle } from "./JobsSelectStyles";
import jobsReducer from "../../../../helpers/reducers/JobsReducer";
import { jobsInitialStateValue } from "../../../../types";
import ACL from "../../../../components/custom/ACL";
import ApplyProfessionalModal from "./modals/ApplyProfessionalModal";
import { removeActiveMenu } from "../../../../helpers/tokens";

const RightJobCard = ({
  Id,
  Title,
  Facility,
  Location,
  JobProfession,
  JobSpeciality,
  ContractLength,
  ContractStartDate,
  NoOfOpenings,
  MinYearsExperience,
  TotalGrossPay,
  BillRate,
  ShiftStartTime,
  ShiftEndTime,
  HrsPerWeek,
  NoOfShifts,
  Description,
  RegularHourlyRate,
  HousingStipend,
  MealsAndIncidentals,
  HolidayRate,
  OnCallRate,
  TravelReimbursement,
  CreatedOn,
  CompChecklist,
  JobStatus,
  JobShift,
  OvertimeRate,
  CallBackRate,
  OvertimeHrsPerWeek,
  DaysOnAssignment,
  ApplicantCount,
  DoubleTimeRate,
}: RightJobContentData) => {
  const [documentList, SetDocumentList] = useState<ApiDocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [state, dispatch] = useReducer(jobsReducer, jobsInitialStateValue);
  const [selectedJobStatus, SetSelectedJobStatus] = useState<{
    value: number;
    label: string;
  } | null>(
    JobStatus ? { value: JobStatus?.Id, label: JobStatus?.Status } : null
  );
  const navigate = useNavigate();
  const allow = checkAclPermission("jobs", "", ["GET", "PUT"]);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    Promise.all([getDocumentCategories(), getJobStatuses()])
      .then(([categories, statuses]) => {
        SetDocumentList(categories?.data?.data);
        dispatch({
          type: JobsActions.SetJobStatus,
          payload: statuses.data?.data,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showToast("error", error?.message || "Something went wrong");
      });
  }, []);

  useEffect(() => {
    SetSelectedJobStatus(
      JobStatus ? { value: JobStatus?.Id, label: JobStatus?.Status } : null
    );
  }, [JobStatus, JobStatus?.Status]);

  const formatComplianceData = (data: any) => {
    try {
      if (!data) return {};

      const formattedData: { [key: string]: ForamttedDocumentData[] } = {};
      const categoryMap: { [key: number]: string } = {
        3: "Required to Start",
        2: "Required to Submit",
        1: "Required to Apply",
      };

      data.forEach((item: ApiDocumentData) => {
        const categoryId: number | undefined = item?.DocumentCategory?.Id;
        const category: string = categoryMap[categoryId];

        if (formattedData[category]) {
          formattedData[category].push({
            id: item.DocumentMaster?.Id,
            documentname: item.DocumentMaster?.Type,
            description: item.DocumentMaster?.Type,
            priority: item.Priority,
            expiryDays: item.ExpiryDurationDays,
            internalUse: item.IsInternalUse,
          });
        } else {
          formattedData[category] = [
            {
              id: item.DocumentMaster.Id,
              documentname: item.DocumentMaster?.Type,
              description: item.DocumentMaster?.Type,
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
  const formattedData: { [key: string]: ForamttedDocumentData[] } =
    formatComplianceData(CompChecklist?.CompDocuments);
  const [activeTab, setActiveTab] = useState<string>(
    Object.keys(formattedData)[1]
  );

  const handleTogglebar = (categoryKey: string) => {
    setActiveTab(categoryKey);
  };

  const datas = [
    {
      key: "Regular Hourly Rate",
      content: `(${RegularHourlyRate}/hr x ${HrsPerWeek} hrs/week)`,
      // content: "",
      value: `${
        RegularHourlyRate && HrsPerWeek
          ? (RegularHourlyRate * HrsPerWeek).toFixed(2)
          : ""
      }`,
    },
    {
      key: "OverTime Hourly Rate",
      content: `(${OvertimeRate}/hr x ${OvertimeHrsPerWeek} hrs/week)`,
      value: `${
        OvertimeRate && OvertimeHrsPerWeek
          ? (OvertimeRate * OvertimeHrsPerWeek).toFixed(2)
          : ""
      }`,
    },
    {
      key: "Lodging Stipend",
      content: `(${HousingStipend}/day x ${DaysOnAssignment} days)`,
      value: `${
        HousingStipend && DaysOnAssignment
          ? (HousingStipend * DaysOnAssignment).toFixed(2)
          : ""
      }`,
    },
    {
      key: "Meals & Incidentals Stipend",
      content: `(${MealsAndIncidentals}/day x ${DaysOnAssignment} days)`,
      value: `${
        MealsAndIncidentals && DaysOnAssignment
          ? (MealsAndIncidentals * DaysOnAssignment).toFixed(2)
          : ""
      }`,
    },
    {
      key: "Total Gross Pay",
      content: `(${HrsPerWeek + OvertimeHrsPerWeek} hrs/week)`,
      value: `${
        TotalGrossPay && TotalGrossPay ? TotalGrossPay?.toFixed(2) : ""
      }`,
      isTotal: true,
    },
  ];

  const additionalData = [
    {
      key: "Holiday Rate",
      value: `${HolidayRate && HolidayRate ? HolidayRate : ""}`,
    },
    {
      key: "On-Call Rate",
      value: `${OnCallRate && OnCallRate ? OnCallRate : ""}`,
    },
    {
      key: "Call Back Rate",
      content: "",
      value: `${CallBackRate && CallBackRate ? CallBackRate : ""}`,
    },
    {
      key: "Double Time Rate",
      content: `(California Only)`,
      value: `${DoubleTimeRate && DoubleTimeRate ? `${DoubleTimeRate}` : "-"}`,
    },
    {
      key: "Travel Reimbursement",
      value: `${
        TravelReimbursement && TravelReimbursement ? TravelReimbursement : ""
      }`,
    },
  ];

  const handleJobStatus = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      SetSelectedJobStatus(null);
      return;
    }

    if (selectedOption) {
      SetSelectedJobStatus({
        value: selectedOption?.value,
        label: selectedOption?.label,
      });

      updateJobStatus(Facility?.Id, Id, selectedOption?.value)
        .then((response) => {
          showToast(
            "success",
            "JobStatus Updated Successfully" || response?.data?.message
          );
        })
        .catch((error) => {
          console.error(error);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        });
    }
  };

  const handleViewJob = () => {
    removeActiveMenu();
    navigate(
      {
        pathname: `/view/facility/${Facility.Id}/job/${Id}`,
      },
      {
        state: {
          facilityId: Facility?.Id,
        },
      }
    );
  };

  const handleEditJob = () => {
    navigate(
      {
        pathname: `/facility/${Facility?.Id}/jobs/edit/${Id}`,
      },
      {
        state: {
          facilityId: Facility?.Id,
        },
      }
    );
  };

  return (
    <>
      {loading ? (
        <Loader styles={{ left: "25%", top: "20%" }} />
      ) : (
        <>
          <div className="right-job">
            <CustomMainCard className="right-content-header-wrapper">
              <div className="job-temp-header">
                <div className="d-flex gap-2 custome-select-wr align-items-center ps-0 flex-wrap">
                  <h4 style={{ marginBottom: "0px" }}>{capitalize(Title)}</h4>
                  <CustomInput
                    className="header-input"
                    disabled={true}
                    value={`JID-${Id ? Id : ""}`}
                  />
                  <ACL submodule={""} module={"jobs"} action={["GET", "PUT"]}>
                    <CustomSelect
                      styles={jobsCustomStyle}
                      id={"jobStatus"}
                      name={"jobStatus"}
                      className="custom-select-placeholder custom-select-job "
                      options={state.jobStatus?.map(
                        (job: {
                          Id: number;
                          Status: string;
                        }): { value: number; label: string } => ({
                          value: job?.Id,
                          label: job?.Status,
                        })
                      )}
                      value={
                        selectedJobStatus
                          ? {
                              value: selectedJobStatus?.value,
                              label: selectedJobStatus?.label,
                            }
                          : null
                      }
                      placeholder="Select Job Status "
                      isClearable={false}
                      isSearchable={false}
                      noOptionsMessage={() => "No Job Status Found"}
                      onChange={(jobStatus) => handleJobStatus(jobStatus)}
                      isDisabled={!allow}
                    />
                  </ACL>
                </div>
                <p>
                  <span className="dollar-amount">
                    $ {TotalGrossPay?.toFixed(2)}
                  </span>
                  <span className="week">/weeksss</span>
                </p>
              </div>
              <div className="d-flex justify-content-between details-content ps-0 mt-2">
                <div className="box-img-wrapper d-flex">
                  <div>
                    <img src={Box} alt="box" className="box-img" />
                  </div>
                  <div className="ps-3">
                    <div className="d-flex align-items-center mt-2 mb-3">
                      <img src={Building} className="right-sidebar-img" />
                      <span className="hospital-detail-text me-2">
                        {capitalize(Facility?.Name)}
                      </span>
                      <img src={Locations} className="right-sidebar-img" />
                      <span className="hospital-detail-text text-capitalize">
                        {Location}
                      </span>
                    </div>
                    <div className="mt-2 d-flex flex-wrap">
                      <div className="d-flex me-2">
                        <p className="temp-details">Profession:</p>
                        <p className="temp-answer text-nowrap">
                          {JobProfession?.Profession}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p className="temp-details">Speciality:</p>
                        <p className="temp-answer text-nowrap">
                          {JobSpeciality?.Speciality}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p className="temp-details text-nowrap">Start Date:</p>
                        <p className="temp-answer text-nowrap">
                          {formatDateInDayMonthYear(ContractStartDate)}{" "}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p className="temp-details">Contract:</p>
                        <p className="temp-answer text-nowrap">
                          {ContractLength} Weeks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bill-rate bill-rate-rightcard text-nowrap">
                  Bill Rate.{" "}
                  <span className="bill-rate-rating">
                    $ {BillRate?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="d-flex hospital-more-details flex-wrap">
                <p>
                  <span className="temp-details text-nowrap">Experience:</span>
                  <span className="temp-answer text-nowrap">
                    {" "}
                    {MinYearsExperience} Years{" "}
                  </span>
                </p>
                <p>
                  <span className="temp-details text-nowrap">Openings:</span>
                  <span className="temp-answer text-nowrap">
                    {" "}
                    {NoOfOpenings}
                  </span>
                </p>
                <p>
                  <span className="temp-details text-nowrap">
                    Job Applicants:
                  </span>
                  <span className="temp-answer text-nowrap">
                    {" "}
                    {ApplicantCount ? ApplicantCount : "-"}
                  </span>
                </p>
                <p>
                  <span className="temp-details text-nowrap last-child">
                    Date Posted:
                  </span>
                  <span className="temp-answer text-nowrap">
                    {" "}
                    {formatDateInDayMonthYear(CreatedOn)}
                  </span>
                </p>
              </div>
              <div className="right-card-buttons">
                <hr />
                <div className="right-buttons">
                  <ACL submodule={""} module={"jobs"} action={["GET", "POST"]}>
                    <CustomButton
                      className="professional-button"
                      onClick={() => toggle()}
                    >
                      Apply Professional
                    </CustomButton>
                  </ACL>
                  <ACL submodule={""} module={"jobs"} action={["GET", "PUT"]}>
                    <CustomButton
                      className="professional-button"
                      onClick={handleEditJob}
                    >
                      Edit Job
                    </CustomButton>
                  </ACL>
                  <ACL submodule={""} module={"jobs"} action={["GET", "GET"]}>
                    <CustomButton className="view-job" onClick={handleViewJob}>
                      View Job
                    </CustomButton>
                  </ACL>
                </div>
              </div>
            </CustomMainCard>
            <CustomMainCard className="job-desc-card  main-card-wrapper card mt-3">
              <div className="job-description">
                <h3>Job Description</h3>
                <div className="react-quill-wr mb-2">
                  <ReactQuill
                    value={Description}
                    modules={{ toolbar: [] }}
                    readOnly
                    theme="snow"
                  />
                </div>
                <p>
                  <span className="job-description-key">Profession:</span>{" "}
                  <span className="job-description-value">
                    {JobProfession?.Profession}
                  </span>
                </p>
                <p>
                  <span className="job-description-key">Speciality:</span>{" "}
                  <span className="job-description-value">
                    {JobSpeciality?.Speciality}
                  </span>
                </p>
              </div>
              <div className="contract-details">
                <h3 className="contract-heading">Contract Details</h3>
                <div className="contract-content">
                  <p className="content-key d-flex">
                    Start Date:{" "}
                    <span className="content-value">
                      {formatDateInDayMonthYear(ContractStartDate)}
                    </span>
                  </p>
                </div>
                <div className="contract-content d-flex">
                  <p className="content-key d-flex me-4">
                    Shift:{" "}
                    <span className="content-value">{JobShift?.Shift}</span>
                  </p>
                  <p className="content-key d-flex">
                    Shift Time:{" "}
                    <span className="content-value">
                      {ShiftStartTime} to {ShiftEndTime}
                    </span>
                  </p>
                </div>
                <div className="contract-content d-flex">
                  <p className="content-key d-flex me-4">
                    Contract Length:{" "}
                    <span className="content-value">
                      {ContractLength} Weeks
                    </span>
                  </p>
                  <p className="content-key d-flex">
                    Hours Per Week:{" "}
                    <span className="content-value">{HrsPerWeek} Hours</span>
                  </p>
                </div>
                <div className="contract-content">
                  <p className="content-key d-flex">
                    Number of Shifts:{" "}
                    <span className="content-value">{NoOfShifts}</span>
                  </p>
                </div>
              </div>
              <div className="pay-package px-0">
                <h3 className="package-header">Pay Package</h3>
                <table className="package-table">
                  <tbody className="tbody">
                    {datas.map((item, index) => (
                      <tr key={index}>
                        <td
                          className={`package-key ${
                            item.isTotal ? "gross-pay" : ""
                          } > `}
                        >
                          <span className={`package-key-content`}>
                            {" "}
                            {item.key}
                          </span>
                          {item.content && (
                            <span className="bill-rate p-1">
                              {item.content}
                            </span>
                          )}
                        </td>
                        <td
                          className={`package-value ${
                            item.isTotal ? "gross-pay" : ""
                          }`}
                        >
                          <span>
                            {item.value != null && !isNaN(Number(item.value))
                              ? `$${Number(item.value).toFixed(2)}`
                              : "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pay-package px-0">
                <h3 className="package-header">Additional Pay Details</h3>
                <table className="package-table">
                  <tbody className="tbody">
                    {additionalData.map((item, index) => (
                      <tr key={index}>
                        <td className="package-key">
                          <span className="package-key-content">
                            {item.key}
                          </span>
                          {item.content && (
                            <span className="bill-rate p-1">
                              {item.content}
                            </span>
                          )}
                        </td>
                        <td className="package-value">
                          <span className="package-value">
                            {item.value != null && !isNaN(Number(item.value))
                              ? `$${Number(item.value).toFixed(2)}`
                              : "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="tab-wrapper compliance-wrapper px-0">
                <h3 className="compliance-heading">Compliance Checklist</h3>
                {documentList?.length > 0 && (
                  <Nav tabs>
                    {documentList?.map((category: any) => {
                      return (
                        <NavItem key={category?.Id}>
                          <NavLink
                            className={
                              activeTab === category?.Category ? "show" : ""
                            }
                            onClick={() => handleTogglebar(category?.Category)}
                            to={""}
                          >
                            {category?.Category}
                          </NavLink>
                        </NavItem>
                      );
                    })}
                  </Nav>
                )}
                {formattedData && (
                  <TabContent activeTab={activeTab}>
                    {Object.keys(formattedData).length > 0 && (
                      <>
                        <h3 className="template-document-heading">
                          Documents {activeTab} for the job
                        </h3>
                        {Object.keys(formattedData).map(
                          (categoryKey: string) => (
                            <TabPane key={categoryKey} tabId={categoryKey}>
                              {formattedData[categoryKey].map(
                                (item: any, index: number) => (
                                  <ol className="para-text" key={item?.id}>
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
              {modal && (
                <ApplyProfessionalModal
                  modal={modal}
                  toggle={toggle}
                  facilityId={Facility?.Id}
                  jobId={Id}
                />
              )}
            </CustomMainCard>
          </div>
        </>
      )}
    </>
  );
};

export default RightJobCard;
