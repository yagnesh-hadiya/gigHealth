import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import Search from "../../../../../assets/images/search.svg";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import { Link, useParams } from "react-router-dom";
// import CustomSearch from "../../../../../components/custom/CustomSearch";
import { capitalize, debounce, initialStateValue, showToast } from "../../../../../helpers";
import jobTemplateReducer from "../../../../../helpers/reducers/JobTemplateReducer";
import { JobActions, JobTemplate } from "../../../../../types/JobTemplateTypes";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import JobCard from "./JobCard";
import { deleteJobTemplate, getJobDetails } from "../../../../../services/JobTemplate";
import Loader from "../../../../../components/custom/CustomSpinner";
import ACL from "../../../../../components/custom/ACL";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const JobTemplates = () => {

    const [state, dispatch] = useReducer(jobTemplateReducer, initialStateValue);
    const [loading, setLoading] = useState<boolean>(false);
    const facilityDataId = useParams();

    const handleSearch = debounce((text: string) => {
        dispatch({ type: JobActions.SetSearch, payload: text });
    }, 300);

    const getJobCardDetails = async () => {
        try {
            setLoading(true);
            const jobCardDetails = await getJobDetails(Number(facilityDataId?.Id), state.search);

            dispatch({ type: JobActions.SetCardDetails, payload: jobCardDetails?.data?.data });
            setLoading(false);
        } catch (error: any) {
            console.error(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        getJobCardDetails();
    }, [state.search]);
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
    const DeleteHandler = async (Id: number) => {
        try {
            setLoading(true);
            const deletedTemplate = await deleteJobTemplate(Number(facilityDataId?.Id), Id);
            showToast('success', 'Job Template Deleted Successfully' || deletedTemplate?.data?.message);
            setLoading(false);
            setLoading(true);
            const jobCardDetails = await getJobDetails(Number(facilityDataId?.Id), state.search);
            dispatch({ type: JobActions.SetCardDetails, payload: jobCardDetails?.data?.data });
            setLoading(false);
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <div className="facility-main-card-section">
            <CustomMainCard>
                {loading && <Loader />}
                <h2 className="page-content-header">Job Templates <span>({state.cardDetails?.length})</span></h2>
                <div className="d-flex mb-3">
                    <div className="search-bar-wrapper w-100">
                        <CustomInput placeholder="Search Here" onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)} />
                        <img src={Search} alt="search" />
                    </div>
                    <div className="facility-header-cus-drp dt-facility-drp" style={{ marginLeft: '10px' }}>
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
                    {/* <CustomSearch placeholder={"Search Here"} onSearch={(text) => handleSearch(text)} /> */}
                    <div className="table-navigate">
                        <Link to={`/facility/${facilityDataId?.Id}/job-template/create`}>
                            <ACL submodule={"jobtemplates"} module={"facilities"} action={["GET", "POST"]}>
                                <CustomButton className="primary-btn ms-2">
                                    Create New Template
                                </CustomButton></ACL>
                        </Link>
                    </div>
                </div>
                {state.cardDetails?.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>There are no records to display</p>
                ) : (
                    state.cardDetails.length > 0 && state.cardDetails?.map((card: JobTemplate) => (
                        <JobCard
                            key={card?.Id}
                            Id={card?.Id}
                            Title={capitalize(card?.Title)}
                            CreatedOn={card?.CreatedOn}
                            JobType={capitalize(card?.JobType)}
                            TotalGrossPay={card?.TotalGrossPay}
                            MinYearsExperience={card?.MinYearsExperience}
                            ContractLength={card?.ContractLength}
                            Location={capitalize(card?.Location)}
                            JobProfession={card?.JobProfession}
                            JobSpeciality={card?.JobSpeciality}
                            EmploymentType={card?.EmploymentType}
                            Facility={card?.Facility}
                            DeleteHandler={() => DeleteHandler(card?.Id)} />
                    ))
                )}
            </CustomMainCard>
        </div>
    );
};

export default JobTemplates;
