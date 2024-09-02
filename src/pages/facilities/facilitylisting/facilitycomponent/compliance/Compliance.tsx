import DataTable from "react-data-table-component";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import AddNewCompliance from "./AddNewCompliance";
import ViewCompliance from "./ViewCompliance";
import ACL from "../../../../../components/custom/ACL";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import Search from "../../../../../assets/images/search.svg";
import { useEffect, useState } from "react";
import {
  deleteComplianceChecklist,
  listComplianceChecklist,
} from "../../../../../services/FacilityCompliance";
import { capitalize, debounce, showToast } from "../../../../../helpers";
import { useParams } from "react-router-dom";
import CustomEyeBtn from "../../../../../components/custom/CustomEyeBtn";
import EditCompliance from "./EditCompliance";
import Loader from "../../../../../components/custom/CustomSpinner";
import { complianceList } from "../../../../../types/Compliance";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const Compliance = () => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [editModal, setEditModal] = useState(false);
  const editToggle = () => setEditModal(!editModal);

  const [viewModal, setViewModal] = useState(false);
  const [checklistId, setChecklistId] = useState<number>(0);
  const viewToggle = () => setViewModal(!viewModal);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState<string>("");
  const facilityDataId = useParams();
  const [loading, setLoading] = useState(true);
  const [abort, setAbort] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    const delayedFetchData = debounce(() => {
      listComplianceChecklist(facilityDataId?.Id!, search, abortController)
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          if (abortController.signal.aborted) {
            setAbort(true);
            return;
          }
          console.error(error);
          showToast("error", "Something went wrong");
        });
    }, 300);

    delayedFetchData();

    return () => abortController.abort();
  }, [search, abort]);

  const onViewClick = (checklistId: number) => {
    viewToggle();
    setChecklistId(checklistId);
  };

  const onEditClick = (checklistId: number) => {
    editToggle();
    setChecklistId(checklistId);
  };

  const onDelete = async (checklistId: number) => {
    try {
      setLoading(true);
      await deleteComplianceChecklist(facilityDataId?.Id!, checklistId);
      setLoading(false);
      showToast("success", "Checklist deleted successfully");

      const list = await listComplianceChecklist(facilityDataId?.Id!, search);
      setData(list);
    } catch (error: any) {
      console.error(error);
      if (error?.response.status === 409) {
        showToast("error", error?.response?.data?.message);
      } else {
        showToast("error", "Something went wrong");
      }
      setLoading(false);
    }
  };
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
  const Column = [
    {
      name: "Sr No",
      cell: (_: any, rowIndex: number) => rowIndex + 1,
      width: "10%",
    },
    {
      name: "Checklist Name",
      cell: (row: complianceList) => capitalize(row.Name),
      width: "65%",
    },
    {
      name: "Actions",

      cell: (row: complianceList) => (
        <>
          <ACL
            submodule={"compliance"}
            module={"facilities"}
            action={["GET", "GET"]}
          >
            <CustomEyeBtn onEye={() => onViewClick(row.Id)} />
          </ACL>
          <ACL
            submodule={"compliance"}
            module={"facilities"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn onEdit={() => onEditClick(row.Id)} />
          </ACL>
          <ACL
            submodule={"compliance"}
            module={"facilities"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn
              onDelete={function (): void {
                onDelete(row.Id);
              }}
            />
          </ACL>
        </>
      ),
      minWidth: "180px",
    },
  ];
  return (
    <>
      <div className="facility-main-card-section">
        <CustomMainCard>
          <div>
            <h2 className="page-content-header">Compliance Checklist</h2>
            <div className="d-flex mb-3">
              <div className="search-bar-wrapper flex-grow-1">
                <CustomInput
                  value={search}
                  onChange={(data: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(data.target.value)
                  }
                  placeholder="Search Here"
                />
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
              <div className="table-navigate">
                <ACL
                  submodule={"compliance"}
                  module={"facilities"}
                  action={["GET", "POST"]}
                >
                  <CustomButton className="primary-btn ms-2" onClick={toggle}>
                    Add New
                  </CustomButton>
                </ACL>
              </div>
            </div>
            <AddNewCompliance
              setListData={setData}
              modal={modal}
              toggle={toggle}
            />
            <ViewCompliance
              modal={viewModal}
              toggle={viewToggle}
              checklistId={checklistId}
              onEdit={onEditClick}
            />
            <EditCompliance
              setListData={setData}
              modal={editModal}
              toggle={editToggle}
              checklistId={checklistId}
            />
          </div>
          <div className="datatable-wrapper facility-datatable-wrapper facility-onboarding-datatable">
            {loading && <Loader styles={{ position: "absolute" }} />}
            <DataTable columns={Column} data={data} />
          </div>
        </CustomMainCard>
      </div>
    </>
  );
};
export default Compliance;
