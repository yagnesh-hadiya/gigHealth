import CustomButton from "../../../../../components/custom/CustomBtn"
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomSelect from "../../../../../components/custom/CustomSelect"
import Search from "../../../../../assets/images/search.svg";
import { notecustomStyles } from "../../../../../helpers";
import { FacilityJobsHeaderProps } from "../../../../../types/FacilityJobsTypes";
import { JobsActions } from "../../../../../types/JobsTypes";
import ACL from "../../../../../components/custom/ACL";
import { useState } from "react";

const FacilityJobsHeader = ({ handleAddJob, search, handleSearch, state, dispatch, total }: FacilityJobsHeaderProps) => {

    const [dataDrp] = useState([
        {
            label: <>American Hospital Association <span className="span-brd">Parent</span></>,
            value: 1,
        },
        {
            label: <>American Hospital Association 2 <span className="span-brd">Parent</span></>,
            value: 2,
        },
        {
            label: <>American Hospital Association 3 <span className="span-brd">Parent</span></>,
            value: 3,
        },
    ]);

    const handleJobStatus = (selectedOption: { value: number, label: string } | null) => {
        if (selectedOption === null) {
            dispatch({ type: JobsActions.SetSelectedJobStatus, payload: null })
            return;
        }

        dispatch({
            type: JobsActions.SetSelectedJobStatus, payload: {
                Id: selectedOption?.value,
                Status: selectedOption?.label,
            }
        })
    }

    return (
        <>
            <h2 className="page-content-header job-title">Jobs <span className="job-count">({total})</span></h2>
            <div className="d-flex mb-3 search-button" style={{ gap: '10px' }}>
                <div className="search-bar-wrapper w-100">
                    <CustomInput placeholder="Search Here" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleSearch(e.target.value)} />
                    <img src={Search} alt="search" />
                </div>
                <div className="facility-header-cus-drp dt-facility-drp" style={{ marginLeft: '0px' }}>
                    <CustomSelect
                        value={dataDrp[0]}
                        id="select_profession"
                        isSearchable={false}
                        placeholder={"Select Profession"}
                        onChange={() => { }}
                        name=""
                        noOptionsMessage={() => ""}
                        options={dataDrp}
                    ></CustomSelect>
                </div>
                <div className="facility-job-search ps-0 custom-height-40">
                    <ACL submodule={"jobs"} module={"facilities"} action={["GET", "PUT"]}>
                        <CustomSelect
                            styles={notecustomStyles}
                            id={"jobStatus"}
                            name={"jobStatus"}
                            className="custom-select-placeholder custom-select-job"
                            options={state.jobStatus.map((job: { Id: number; Status: string }): { value: number; label: string } => ({
                                value: job?.Id,
                                label: job?.Status,
                            }))}
                            value={state.selectedJobStatus ? { value: state.selectedJobStatus?.Id, label: state.selectedJobStatus?.Status } : null}
                            placeholder="Select Job Status"
                            noOptionsMessage={(): string => ""}
                            onChange={(jobStatus) => handleJobStatus(jobStatus)}
                            isSearchable={false}
                            isClearable={true}
                        />
                    </ACL>
                </div>
                <div className="table-navigate">
                    <ACL submodule={"jobs"} module={"facilities"} action={["GET", "POST"]}>
                        <CustomButton className="primary-btn ms-0 new-job-btn" style={{ marginLeft: '0 !important' }} onClick={() => handleAddJob()}>
                            Add New
                        </CustomButton>
                    </ACL>
                </div>
            </div>
        </>
    )
}

export default FacilityJobsHeader