import DataTable from "react-data-table-component";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import CustomEyeBtn from "../../../../../components/custom/CustomEyeBtn";
import AddNewFaq from "./AddNewFaq";
import CustomCheckboxFaq from "../../../../../components/custom/CustomCheckboxFaq";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import Search from "../../../../../assets/images/search.svg";
import { useEffect, useState } from "react";
import { deleteFaqs, getFaqList } from "../../../../../services/FacilityFaq";
import { debounce, showToast, ucFirstChar } from "../../../../../helpers";
import { useParams } from "react-router";
import Loader from "../../../../../components/custom/CustomSpinner";
import ViewFaq from "./ViewFaq";
import EditFaq from "./EditFaq";
import { Faqs } from "../../../../../types/FacilityFaqTypes";
import DeleteBtnModal from "./DeleteModal";
import ACL from "../../../../../components/custom/ACL";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const FAQs = () => {
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [faqs, setFaqs] = useState<Faqs[]>([]);
  const [selectedEditFaq, setSelectedEditFaq] = useState<Faqs | null>(null);
  const [selectedViewFaq, setSelectedViewFaq] = useState<Faqs | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Faqs[]>([]);
  const [showDeleteAllButton, setShowDeleteAllButton] = useState(false);
  const [, setSelectAllChecked] = useState<boolean>(false);
  const [, setSomeChecked] = useState<boolean>(false);
  const facilityId = useParams();
  const [abort, setAbort] = useState<boolean>(false);
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
  const abortController = new AbortController();
  const fetchFaqs = debounce(async () => {
    try {
      setLoading(true);
      const res = await getFaqList(
        Number(facilityId?.Id),
        search,
        abortController
      );
      setFaqs(res);
      setLoading(false);
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 300);

  useEffect(() => {
    fetchFaqs();

    return () => abortController.abort();
  }, [search, abort]);

  const toggleViewModal = () => {
    setViewModalOpen(!viewModalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleChange = (text: string) => {
    setSearch(text);
  };

  const onDeleteHandler = async (faqId: number) => {
    try {
      setLoading(true);
      await deleteFaqs([faqId], Number(facilityId.Id));
      setLoading(false);
      await fetchFaqs();
      setSelectedRows([]);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEditHandler = (faqId: number) => {
    const filteredFaq: Faqs | undefined = faqs.find(
      (faq: Faqs) => faq.Id === faqId
    );
    if (filteredFaq !== undefined) {
      setSelectedEditFaq(filteredFaq);
      toggleEditModal();
    }
  };

  const onViewHandler = (faqId: number) => {
    const selectedViewFaq: Faqs | undefined = faqs.find(
      (faq: Faqs) => faq.Id === faqId
    );
    if (selectedViewFaq !== undefined) {
      setSelectedViewFaq(selectedViewFaq);
      toggleViewModal();
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setShowDeleteAllButton(checked);
    setSelectAllChecked(checked);
    if (checked) {
      setSelectedRows([...faqs]);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (checked: boolean, row: Faqs) => {
    let updatedSelectedRows = [];

    if (checked) {
      updatedSelectedRows = [...selectedRows, row];
    } else {
      updatedSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow.Id !== row.Id
      );
    }

    setSelectedRows(updatedSelectedRows);

    const allSelected = faqs.length === updatedSelectedRows.length;
    const isAnySelected = updatedSelectedRows.length > 0;

    setSelectAllChecked(allSelected);
    setShowDeleteAllButton(isAnySelected);
    setSomeChecked(isAnySelected && !allSelected);
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      const selectedIds = selectedRows.map((selectedRow) => selectedRow.Id);
      await deleteFaqs(selectedIds, Number(facilityId?.Id));
      setLoading(false);
      await fetchFaqs();
      setSelectedRows([]);
      setSomeChecked(false);
      setShowDeleteAllButton(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const Column = [
    {
      name:
        showDeleteAllButton || selectedRows.length > 1 ? (
          <div className="d-flex align-items-center">
            <CustomCheckboxFaq
              disabled={false}
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={selectedRows.length === faqs.length}
            />
            <DeleteBtnModal
              onDelete={handleDeleteAll}
              selectedRows={selectedRows}
              faqs={faqs}
            />
          </div>
        ) : (
          <CustomCheckboxFaq
            disabled={false}
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={showDeleteAllButton}
          />
        ),
      cell: (row: Faqs) => (
        <CustomCheckboxFaq
          disabled={false}
          onChange={(e) => handleSelectRow(e.target.checked, row)}
          checked={selectedRows.some(
            (selectedRow) => selectedRow.Id === row.Id
          )}
        />
      ),
      width: "5%",
    },
    {
      name: showDeleteAllButton || selectedRows.length > 1 ? "" : "Question",
      cell: (row: Faqs) => {
        const questionWithoutNumber = ucFirstChar(
          row.Question.replace(/^\d+ /, "")
        );
        return questionWithoutNumber;
      },
      minWidth: "400px",
    },
    {
      name: showDeleteAllButton || selectedRows.length > 1 ? "" : "Date",
      minWidth: '180px',
      cell: (row: Faqs) => {
        const date = new Date(row.CreatedOn);
        const formattedDate = date.toLocaleString();
        return formattedDate;
      },
    },
    {
      name: showDeleteAllButton || selectedRows.length > 1 ? "" : "Type",
      minWidth: '180px',
      cell: (row: Faqs) => row.FaqType.Type,
    },
    {
      name: showDeleteAllButton || selectedRows.length > 1 ? "" : "Actions",
      minWidth: '180px',
      cell: (row: Faqs) => (
        <>
          <ACL submodule={"faqs"} module={"facilities"} action={["GET", "GET"]}>
            <CustomEyeBtn onEye={() => onViewHandler(row?.Id)} />
          </ACL>
          <ACL submodule={"faqs"} module={"facilities"} action={["GET", "PUT"]}>
            <CustomEditBtn onEdit={() => onEditHandler(row.Id)} />
          </ACL>
          <ACL
            submodule={"faqs"}
            module={"facilities"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDeleteHandler(row.Id)} />
          </ACL>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="facility-main-card-section">
        <CustomMainCard>
          <h2 className="page-content-header">FAQ's</h2>
          <div className="d-flex mb-3">
            <div className="search-bar-wrapper w-100">
              <CustomInput
                placeholder="Search Here"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e.target.value);
                }}
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
                submodule={"faqs"}
                module={"facilities"}
                action={["GET", "POST"]}
              >
                <CustomButton className="primary-btn ms-2" onClick={toggle}>
                  Add New
                </CustomButton>
              </ACL>
            </div>
          </div>

          <div className="datatable-wrapper facility-datatable-wrapper-faq">
            {loading ? <Loader /> : <DataTable columns={Column} data={faqs} />}
          </div>
        </CustomMainCard>
      </div>
      <AddNewFaq isOpen={modal} toggle={toggle} fetchFaqs={fetchFaqs} />
      <ViewFaq
        isOpen={viewModalOpen}
        toggleViewModal={toggleViewModal}
        selectedViewFaq={selectedViewFaq}
        setSelectedViewFaq={setSelectedViewFaq}
        fetchFaqs={fetchFaqs}
      />
      <EditFaq
        isOpen={editModalOpen}
        toggleEditModal={toggleEditModal}
        selectedEditFaq={selectedEditFaq}
        fetchFaqs={fetchFaqs}
      />
    </>
  );
};
export default FAQs;
