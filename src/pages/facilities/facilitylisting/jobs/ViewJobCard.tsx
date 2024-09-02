import Building from "../../../../assets/images/building.svg";
import Locations from "../../../../assets/images/location.svg";
import CustomInput from "../../../../components/custom/CustomInput";
import CustomSelect from "../../../../components/custom/CustomSelect";
import Box from "../../../../assets/images/blueIcon.png";
import CustomMainCard from "../../../../components/custom/CustomCard";
import { Nav, NavItem, TabContent, TabPane } from "reactstrap";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useReducer } from "react";
import ACL from "../../../../components/custom/ACL";
import ApplyProfessionalModal from "./modals/ApplyProfessionalModal";

const ViewJobCard = ({
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
  const [state, dispatch] = useReducer(jobsReducer, jobsInitialStateValue);
  const [selectedJobStatus, SetSelectedJobStatus] = useState<{
    value: number;
    label: string;
  } | null>(
    JobStatus ? { value: JobStatus?.Id, label: JobStatus?.Status } : null
  );

  const [documentList, SetDocumentList] = useState<ApiDocumentData[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const allow = checkAclPermission("jobs", "", ["GET", "PUT"]);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDocumentCategories(), getJobStatuses()])
      .then(([categories, statuses]) => {
        SetDocumentList(categories.data?.data);
        dispatch({
          type: JobsActions.SetJobStatus,
          payload: statuses?.data?.data,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        showToast("error", error?.message || "Something went wrong");
      });
    // getDocumentCategories().then((response) => {
    //     SetDocumentList(response?.data?.data);
    //     setLoading(false);
    // }).catch((error) => {
    //     console.error(error);
    //     setLoading(false);
    //     showToast('error', error?.response?.data?.message || 'Something went wrong');
    // })
  }, []);

  useEffect(() => {
    SetSelectedJobStatus(
      JobStatus ? { value: JobStatus?.Id, label: JobStatus?.Status } : null
    );
  }, [JobStatus]);

  // let additionalData: { key: string; content?: string; value: string }[] = [];

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

  useEffect(() => {
    setActiveTab(Object.keys(formattedData)[1]);
  }, [Object.keys(formattedData)[1]]);

  const handleTogglebar = (categoryKey: string) => {
    setActiveTab(categoryKey);
  };

  return (
    <>
      {
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              <CustomMainCard className="view-content-header-wrapper job-details-header px-4">
                <div className="job-temp-header ">
                  <div className="d-flex gap-2 custome-select-wr align-items-center flex-wrap">
                    {Title && (
                      <h4 style={{ marginBottom: "0px" }}>
                        {capitalize(Title)}
                      </h4>
                    )}
                    {Id && (
                      <CustomInput
                        className="header-input"
                        disabled={true}
                        defaultValue={`JID-${Id ? Id : ""}`}
                      />
                    )}
                    {JobStatus && (
                      <ACL
                        submodule={""}
                        module={"jobs"}
                        action={["GET", "PUT"]}
                      >
                        <CustomSelect
                          styles={jobsCustomStyle}
                          id={"jobStatus"}
                          name={"jobStatus"}
                          className="custom-select-placeholder custom-select-job"
                          isDisabled={!allow}
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
                          isSearchable={false}
                          noOptionsMessage={() => "No Job Status Found"}
                          onChange={(jobStatus) => handleJobStatus(jobStatus)}
                        />
                      </ACL>
                    )}
                  </div>
                  {TotalGrossPay && (
                    <p>
                      <span className="dollar-amount">
                        ${TotalGrossPay?.toFixed(2)}
                      </span>
                      <span className="week">/week</span>
                    </p>
                  )}
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div className="d-flex">
                    {Box && (
                      <div className="box-img-wrapper">
                        <img src={Box} alt="box" className="box-img" />
                      </div>
                    )}
                    {Building &&
                      Facility &&
                      Locations &&
                      JobProfession &&
                      JobSpeciality &&
                      ContractLength && (
                        <div className="details-content view-job-content">
                          <div className="d-flex">
                            <img src={Building} className="right-sidebar-img" />
                            <p className="hospital-detail-text">
                              {capitalize(Facility?.Name)}
                            </p>
                            <img
                              src={Locations}
                              className="right-sidebar-img"
                            />
                            <p className="hospital-detail-text">
                              {capitalize(Location)}
                            </p>
                          </div>
                          <div className="mt-2 d-flex flex-wrap align-items-center">
                            <div className="d-flex">
                              <p className="temp-details">Profession:</p>
                              <p className="temp-answer">
                                {JobProfession?.Profession}
                              </p>
                            </div>
                            <div className="d-flex">
                              <p className="temp-details">Speciality:</p>
                              <p className="temp-answer">
                                {JobSpeciality?.Speciality}
                              </p>
                            </div>
                            <div className="d-flex">
                              <p className="temp-details">Start Date:</p>
                              <p className="temp-answer">
                                {formatDateInDayMonthYear(ContractStartDate)}{" "}
                              </p>
                            </div>
                            <div className="d-flex">
                              <p className="temp-details">Contract:</p>
                              <p className="temp-answer">
                                {ContractLength} Weeks
                              </p>
                            </div>

                            {MinYearsExperience &&
                              NoOfOpenings &&
                              CreatedOn && (
                                <>
                                  <div className="d-flex hospital-more-details flex-wrap">
                                    <p>
                                      <span className="temp-details">
                                        Experience:
                                      </span>
                                      <span className="temp-answer">
                                        {" "}
                                        {MinYearsExperience} Years{" "}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="d-flex hospital-more-details flex-wrap">
                                    <p>
                                      <span className="temp-details">
                                        Openings:
                                      </span>
                                      <span className="temp-answer">
                                        {" "}
                                        {NoOfOpenings}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="d-flex hospital-more-details flex-wrap">
                                    <p>
                                      <span className="temp-details">
                                        Job Applicants:
                                      </span>
                                      <span className="temp-answer">
                                        {" "}
                                        {ApplicantCount}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="d-flex hospital-more-details flex-wrap">
                                    <p>
                                      <span className="temp-details last-child">
                                        Date Posted:
                                      </span>
                                      <span className="temp-answer">
                                        {" "}
                                        {formatDateInDayMonthYear(CreatedOn)}
                                      </span>
                                    </p>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>
                      )}
                  </div>
                  {BillRate && (
                    <div className="">
                      <div className="bill-rate text-nowrap">
                        Bill Rate.{" "}
                        <span className="bill-rate-rating">
                          ${BillRate?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="right-card-buttons">
                  <hr />
                  <div className="right-buttons">
                    <ACL
                      submodule={""}
                      module={"jobs"}
                      action={["GET", "POST"]}
                    >
                      <CustomButton
                        className="professional-button"
                        onClick={() => toggle()}
                      >
                        Apply Professional
                      </CustomButton>
                    </ACL>
                  </div>
                </div>
              </CustomMainCard>
              <CustomMainCard className="job-desc-card main-card-wrapper card mt-3 view-job-section">
                <div className="job-description">
                  <h3>Job Description</h3>
                  {Description && (
                    <div className="react-quill-wr mb-2">
                      <ReactQuill
                        value={Description}
                        modules={{ toolbar: [] }}
                        readOnly
                        theme="snow"
                      />
                    </div>
                  )}
                  {JobProfession && (
                    <p>
                      <span className="job-description-key">Profession:</span>{" "}
                      <span className="job-description-value">
                        {JobProfession?.Profession}
                      </span>
                    </p>
                  )}
                  {JobSpeciality && (
                    <p>
                      <span className="job-description-key">Speciality:</span>{" "}
                      <span className="job-description-value">
                        {JobSpeciality?.Speciality}
                      </span>
                    </p>
                  )}
                </div>
                <div className="contract-details">
                  <h3 className="contract-heading">Contract Details</h3>
                  {ContractStartDate && (
                    <div className="contract-content">
                      <p className="content-key d-flex">
                        Start Date:{" "}
                        <span className="content-value">
                          {formatDateInDayMonthYear(ContractStartDate)}
                        </span>
                      </p>
                    </div>
                  )}
                  {ShiftEndTime && JobShift && ShiftStartTime && (
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
                  )}
                  {ContractLength && (
                    <div className="contract-content d-flex">
                      <p className="content-key d-flex me-4">
                        Contract Length:{" "}
                        <span className="content-value">
                          {ContractLength} Weeks
                        </span>
                      </p>
                      <p className="content-key d-flex">
                        Hours Per Week:{" "}
                        <span className="content-value">
                          {HrsPerWeek} Hours
                        </span>
                      </p>
                    </div>
                  )}
                  {NoOfShifts && (
                    <div className="contract-content">
                      <p className="content-key d-flex">
                        Number of Shifts:{" "}
                        <span className="content-value">{NoOfShifts}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="pay-package ps-0">
                  <h3 className="package-header">Pay Package</h3>
                  <table className="view-package-table">
                    <tbody className="tbody">
                      {datas?.length > 0 &&
                        datas.map((item, index) => (
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
                                  {" "}
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
                                {item.value != null &&
                                !isNaN(Number(item.value))
                                  ? `$${Number(item.value).toFixed(2)}`
                                  : "-"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="pay-package ps-0">
                  <h3 className="package-header">Additional Pay Details</h3>
                  <table className="view-package-table">
                    <tbody className="tbody">
                      {additionalData?.length > 0 &&
                        additionalData.map((item, index) => (
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
                                {item.value != null &&
                                !isNaN(Number(item.value))
                                  ? `$${Number(item.value).toFixed(2)}`
                                  : "-"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="tab-wrapper compliance-wrapper ps-0">
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
                              onClick={() =>
                                handleTogglebar(category?.Category)
                              }
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
            </>
          )}
        </>
      }
    </>
  );
};

export default ViewJobCard;
