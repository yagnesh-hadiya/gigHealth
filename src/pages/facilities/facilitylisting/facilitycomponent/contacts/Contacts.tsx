import DataTable from "react-data-table-component";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import AddNewContacts from "./AddNewContacts";
import { useEffect, useState } from "react";
import { ContactListType } from "../../../../../types/FacilityContactTypes";
import {
  deleteContact,
  getContactList,
} from "../../../../../services/FacilityContacts";
import { capitalize, debounce, showToast } from "../../../../../helpers";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import Search from "../../../../../assets/images/search.svg";
import Loader from "../../../../../components/custom/CustomSpinner";
import { useParams } from "react-router";
import ACL from "../../../../../components/custom/ACL";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const FacilityContacts = () => {
  const [loading, setLoading] = useState(false);
  const [contactList, setContactList] = useState<ContactListType[]>([]);
  const [selectedContactForEdit, setSelectedContactForEdit] =
    useState<ContactListType | null>(null);
  const [search, setSearch] = useState<string>("");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const facilityDataId = useParams();
  const [abort, setAbort] = useState<boolean>(false);

  const abortController = new AbortController();
  const fetchData = debounce(async () => {
    try {
      setLoading(true);
      const data = await getContactList(
        search,
        Number(facilityDataId?.Id),
        abortController
      );
      setLoading(false);
      setContactList(data);
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      setLoading(false);
      showToast("error", error.response.message || "Something went wrong");
    }
  }, 300);

  useEffect(() => {
    fetchData();

    return () => abortController.abort();
  }, [search, abort]);

  const getRoleFromFacilityRole = (row: ContactListType) => {
    return row.FacilityRole ? row.FacilityRole.Role : "";
  };

  const handleChange = (text: string) => {
    setSearch(text);
  };

  const onDeleteHandler = async (contactId: number) => {
    try {
      setLoading(true);
      await deleteContact(contactId, Number(facilityDataId?.Id));
      await fetchData();
      showToast("success", "Contact deleted successfully");
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEditHandler = (contactId: number) => {
    const selectedContact = contactList.find(
      (contact) => contact.Id === contactId
    );
    if (selectedContact !== undefined) {
      setSelectedContactForEdit(selectedContact);
      toggle();
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
      name: "Name",
      minWidth: "150px",
      cell: (row: ContactListType) =>
        `${capitalize(row.FirstName)} ${capitalize(row.LastName)}`,

    },
    {
      name: "Title",
      cell: (row: ContactListType) =>
        row.Title.split(" ")
          .map((word) => capitalize(word))
          .join(" "),
      minWidth: "150px",
    },
    {
      name: "Phone",
      cell: (row: ContactListType) =>
        `${row.Phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`,
      minWidth: "160px",
    },
    {
      name: "Fax",
      cell: (row: ContactListType) =>
        `${row.Fax ?? '--'}`,
      minWidth: "160px",
    },
    {
      name: "Email Address",
      cell: (row: ContactListType) => row.Email,
      minWidth: "140px",
    },
    {
      name: "Role",
      cell: (row: ContactListType) => getRoleFromFacilityRole(row),
      minWidth: "150px",
    },
    {
      name: "Actions",
      minWidth: "120px",
      cell: (row: ContactListType) => (
        <>
          <ACL
            submodule={"contacts"}
            module={"facilities"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn onEdit={() => onEditHandler(row?.Id)} />
          </ACL>
          <ACL
            submodule={"contacts"}
            module={"facilities"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDeleteHandler(row?.Id)} />
          </ACL>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="facility-main-card-section">
        <CustomMainCard>
          <h2 className="page-content-header">Contacts</h2>
          <div className="d-flex mb-3">
            <div className="search-bar-wrapper flex-grow-1 me-2">
              <CustomInput
                placeholder="Search Here"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e.target.value);
                }}
              />
              <img src={Search} alt="search" />
            </div>
            <div className="table-navigate table-drp-navigate">
              <div className="facility-header-cus-drp dt-facility-drp">
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
              <ACL
                submodule={"contacts"}
                module={"facilities"}
                action={["GET", "POST"]}
              >
                <CustomButton className="primary-btn ms-2 me-0" onClick={toggle}>
                  Add New
                </CustomButton>
              </ACL>
            </div>
          </div>

          <div className="datatable-wrapper facility-datatable-wrapper facility-onboarding-datatable">
            {loading ? (
              <Loader />
            ) : (
              <DataTable columns={Column} data={contactList} />
            )}
          </div>
        </CustomMainCard>
      </div>
      <AddNewContacts
        isOpen={modal}
        toggle={() => toggle()}
        selectedContactForEdit={selectedContactForEdit}
        setSelectedContactForEdit={setSelectedContactForEdit}
        fetchData={fetchData}
      />
    </>
  );
};
export default FacilityContacts;
