import DataTable from "react-data-table-component";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomEyeBtn from "../../../../../components/custom/CustomEyeBtn";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import { useEffect, useState } from "react";
import { deleteFacility, fetchLocationList } from "../../../../../services/FacilityLocation";
import { capitalize, showToast } from "../../../../../helpers";
import Loader from "../../../../../components/custom/CustomSpinner";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ParentHealthSystem, FacilityData, ParentResponse, ChildResponse } from '../../../../../types/FacilityLocationTypes'
import ACL from "../../../../../components/custom/ACL";

const FacilityLocation = () => {
    const [data, setData] = useState<ParentResponse[] | ChildResponse[]>([]);
    const [isParent, setIsParent] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const facilityDataId = useParams();

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetchLocationList(Number(facilityDataId?.Id));
            if (data && data.length > 0) {
                const firstItem = data[0];
                if (firstItem.parent) {
                    setIsParent(true);
                    setData(data);
                } else if (firstItem.children && firstItem.children.length > 0) {
                    setIsParent(false);
                    setData(data);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [isParent]);

    const onDeleteHandler = async (Id: number) => {
        try {
            setLoading(true);
            await deleteFacility(Id);
            const updatedData = await fetchLocationList(Number(facilityDataId?.Id));
            setLoading(false);
            setData(updatedData);
            showToast("success", "Facility deleted successfully");
        }
        catch (error: any) {
            console.error("Error", error);
            setLoading(false)
            showToast(
                "error",
                error?.response?.data?.message || "Something went wrong"
            );
        }
    };

    const renderTable = () => {
        // if (data.length === 0) {
        //     return <p>There are no records to display.</p>;
        // }
        let transformedData: FacilityData[] = [];
        if (isParent) {
            const parentData = data as ParentResponse[];
            if (parentData.length > 0) {
                return (

                    loading ? <Loader /> : (
                        <DataTable
                            columns={Column}
                            data={[parentData[0].parent]}
                        />)
                );
            }
        } else {

            const childData = data as ChildResponse[];
            if (childData.length > 0) {
                transformedData = childData[0].children.map((child) => ({
                    Id: child.Id,
                    Name: child.Name,
                    ParentHealthSystem: child.ParentHealthSystem || { Name: '' },
                    PrimaryContact: child.PrimaryContact ?? null,
                    SecondaryContact: child.SecondaryContact,
                }));
                return (
                    loading ? <Loader /> : (<DataTable
                        columns={Column}
                        data={transformedData}
                    />)
                );
            }
        }
    };

    const handleEyeClick = (facilityId: number) => {
        navigate(`/facility/${facilityId}`);
        setTimeout(() => {
            navigate(0);
        }, 100)
    };

    const Column = [
        {
            name: "Sr No",
            cell: (row: ParentHealthSystem | FacilityData, index: number) => index + 1 || row.Id,
            width: "7%",
        },
        {
            name: "Facility Name",
            cell: (row: ParentHealthSystem | FacilityData) => {
                const name = isParent
                    ? ((row as ParentHealthSystem).Facility.Name).split(' ').map(word => capitalize(word)).join(' ')
                    : ((row as FacilityData).Name).split(' ').map(word => capitalize(word)).join(' ');
                const facilityId = isParent ? (row as ParentHealthSystem).Facility.Id : (row as FacilityData).Id;
                const handleLinkClick = () => {
                    navigate(`/facility/${facilityId}`);
                    setTimeout(() => {
                        navigate(0);
                    }, 100)

                };
                return (
                    <>
                        <Link to={`/facility/${facilityId}`} className="facility-link"
                            style={{ textDecoration: "none" }}><span
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#474D6A",
                                    textDecoration: "none",
                                }}
                                onClick={handleLinkClick}
                            >
                                {name || ''} </span>
                        </Link >
                    </>
                );
            },

            minWidth: "163px",
        },
        {
            name: "Health System ID",
            cell: (row: ParentHealthSystem | FacilityData) => {
                const id = (isParent ? (row as ParentHealthSystem).Id : (row as FacilityData).Id) || '';
                return id ? `HSID${id}` : '';
            },
            minWidth: "140px",
        },
        {
            name: "Contact Person",
            cell: (row: ParentHealthSystem | FacilityData) => {
                const contactName =
                    isParent
                        ? (
                            (row as ParentHealthSystem).Facility?.PrimaryContact
                                ? `${capitalize((row as ParentHealthSystem).Facility?.PrimaryContact?.FirstName!)} ${capitalize((row as ParentHealthSystem).Facility?.PrimaryContact?.LastName!)}`
                                : (
                                    (row as ParentHealthSystem).Facility?.SecondaryContact
                                        ? `${capitalize((row as ParentHealthSystem).Facility?.SecondaryContact?.FirstName!)} ${capitalize((row as ParentHealthSystem).Facility?.SecondaryContact?.LastName!)}`
                                        : "--"
                                )
                        )
                        : (
                            (row as FacilityData).PrimaryContact
                                ? `${capitalize((row as FacilityData).PrimaryContact?.FirstName!)} ${capitalize((row as FacilityData).PrimaryContact?.LastName!)}`
                                : (
                                    (row as FacilityData).SecondaryContact
                                        ? `${capitalize((row as FacilityData).SecondaryContact?.FirstName!)} ${capitalize((row as FacilityData).SecondaryContact?.LastName!)}`
                                        : "--"
                                )
                        );

                return contactName || "--";
            },
            minWidth: "140px",
        },
        {
            name: "Phone",
            cell: (row: ParentHealthSystem | FacilityData) => {
                const contactPhone =
                    isParent
                        ? (
                            (row as ParentHealthSystem).Facility?.PrimaryContact?.Phone
                                ? (row as ParentHealthSystem).Facility?.PrimaryContact?.Phone
                                : (row as ParentHealthSystem).Facility?.SecondaryContact?.Phone ?? '--'
                        )
                        : (
                            (row as FacilityData).PrimaryContact?.Phone
                                ? (row as FacilityData).PrimaryContact?.Phone
                                : (row as FacilityData).SecondaryContact?.Phone ?? '--'
                        );

                return contactPhone ? contactPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') : "--";
            },
            minWidth: "130px",
        },
        {
            name: "Email Address",
            cell: (row: ParentHealthSystem | FacilityData) => {
                const contactEmail =
                    isParent
                        ? (
                            (row as ParentHealthSystem).Facility?.PrimaryContact?.Email
                                ? (row as ParentHealthSystem).Facility?.PrimaryContact?.Email
                                : (row as ParentHealthSystem).Facility?.SecondaryContact?.Email ?? '--'
                        )
                        : (
                            (row as FacilityData).PrimaryContact?.Email
                                ? (row as FacilityData).PrimaryContact?.Email
                                : (row as FacilityData).SecondaryContact?.Email ?? '--'
                        );

                return contactEmail || "--";

            },
            minWidth: "150px",
        },
        {
            name: "Actions",
            cell: (row: ParentHealthSystem | FacilityData) => <>
                <div className="d-flex" style={{ gap: '3px' }}>


                    <ACL submodule={"location"} module={"facilities"} action={["GET", "GET"]}><CustomEyeBtn onEye={() => handleEyeClick(isParent ? (row as ParentHealthSystem).Facility.Id : (row as FacilityData).Id)} /></ACL>
                    <ACL submodule={"location"} module={"facilities"} action={["GET", "DELETE"]}><CustomDeleteBtn onDelete={() => onDeleteHandler((isParent ? (row as ParentHealthSystem).Facility.Id : (row as FacilityData).Id))} /></ACL>
                </div>
            </>,
            minWidth: "100px",
        },
    ];

    return (
        <>
            <div className="facility-main-card-section">
                <CustomMainCard>
                    <h2 className="page-content-header"> {data.length === 0 ? "" : isParent ? "Parent Health System" : "Child Facilities"}
                    </h2>
                    <div className="datatable-wrapper facility-datatable-wrapper facility-onboarding-datatable">
                        {loading ? (
                            <Loader />
                        ) : data.length === 0 ? (
                            <p style={{ textAlign: 'center', marginTop: '20px' }}>There are no records to display.</p>
                        ) : (
                            renderTable()
                        )}
                    </div>
                </CustomMainCard>
            </div>
        </>
    );
};
export default FacilityLocation;
