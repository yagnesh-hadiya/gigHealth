import DataTable from "react-data-table-component";
import Search from "../../assets/images/search.svg";
import CustomMainCard from "../../components/custom/CustomCard";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import { useEffect, useState } from "react";
import DocumentMasterForm from "./DocumentMasterForm";
import {
  deleteDocumentMaster,
  fetchDocumentMasterList,
} from "../../services/DocumentMasterServices";
import { DocumentMasterListType } from "../../types/DocumentTypes";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import { capitalize, debounce, showToast, ucFirstChar } from "../../helpers";
import Loader from "../../components/custom/CustomSpinner";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import ACL from "../../components/custom/ACL";

const DocumentMaster = () => {
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [documentMasterList, setDocumentMasterList] = useState<
    DocumentMasterListType[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] =
    useState<DocumentMasterListType | null>(null);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);

  const abortController = new AbortController();
  const fetchData = debounce(async () => {
    try {
      setLoading(true);
      const data = await fetchDocumentMasterList(search, abortController);
      setLoading(false);
      setDocumentMasterList(data);
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      setLoading(false);
      showToast("error", error.response.message || "Something went wrong");
    }
  }, 500);

  useEffect(() => {
    fetchData();

    return () => abortController.abort();
  }, [search, abort]);

  const onDeleteHandler = async (documentId: number) => {
    try {
      setLoading(true);
      await deleteDocumentMaster(documentId);
      const updatedData = await fetchDocumentMasterList(
        search,
        abortController
      );
      setLoading(false);
      setDocumentMasterList(updatedData);
      showToast("success", "Document type deleted successfully");
    } catch (error: any) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error("Error", error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEditHandler = (documentId: number) => {
    const selectedDocument = documentMasterList.find(
      (document) => document.Id === documentId
    );

    if (selectedDocument !== undefined) {
      setSelectedDocumentForEdit(selectedDocument);
      setIsOffCanvasOpen(true);
    }
  };

  const handleChange = (text: string) => {
    setSearch(text);
  };

  const Column = [
    {
      name: "Sr No",
      cell: (row: DocumentMasterListType, index: number) => (
        <span style={{ marginLeft: "10px" }}>{index + 1 || row.Id}</span>
      ),
      width: "10%",
    },
    {
      name: "Document Type",
      cell: (row: { Type: string }) => (
        <span style={{ fontWeight: "600" }}>
          {row.Type
            ? row.Type.split(" ")
                .map((word) => capitalize(word))
                .join(" ")
            : ""}
        </span>
      ),
      width: "20%",
    },
    {
      name: "IsCoreCompliance",
      cell: (row: { IsCoreCompliance: boolean }) => (
        <span style={{ marginLeft: "20px" }}>
          {row.IsCoreCompliance === true ? "Yes" : "No"}
        </span>
      ),
      width: "20%",
    },
    {
      name: "Description",
      cell: (row: { Description: string }) => ucFirstChar(row.Description),
    },
    {
      name: "Actions",
      cell: (row: { Id: number }) => (
        <>
          <ACL submodule={""} module={"documentmaster"} action={["GET", "PUT"]}>
            <CustomEditBtn onEdit={() => onEditHandler(row.Id)} />
          </ACL>
          <ACL
            submodule={""}
            module={"documentmaster"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDeleteHandler(row.Id)} />
          </ACL>
        </>
      ),
      width: "10%",
    },
  ];

  return (
    <>
      <h1 className="list-page-header">Document Master</h1>
      <CustomMainCard>
        <div className="d-flex mb-3 search-button">
          <div className="search-bar-wrapper flex-grow-1">
            <CustomInput
              placeholder="Search Here"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value);
              }}
            />
            <img src={Search} alt="search" />
          </div>
          <div className="table-navigate">
            <ACL
              submodule={""}
              module={"documentmaster"}
              action={["GET", "POST"]}
            >
              <CustomButton
                className="primary-btn"
                onClick={() => setIsOffCanvasOpen(true)}
              >
                Add Document Type
              </CustomButton>
            </ACL>
          </div>
        </div>
        <div className="datatable-wrapper">
          {loading ? (
            <Loader />
          ) : (
            <DataTable
              columns={Column}
              data={documentMasterList}
              // pagination
              // selectableRows={false}
            />
          )}
        </div>
      </CustomMainCard>
      <DocumentMasterForm
        setIsOffCanvasOpen={setIsOffCanvasOpen}
        isOffCanvasOpen={isOffCanvasOpen}
        setDocumentMasterList={setDocumentMasterList}
        selectedDocumentForEdit={selectedDocumentForEdit}
        setSelectedDocumentForEdit={setSelectedDocumentForEdit}
        fetchData={fetchData}
      />
    </>
  );
};
export default DocumentMaster;
