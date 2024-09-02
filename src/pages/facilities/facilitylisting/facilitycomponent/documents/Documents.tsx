import DataTable, { TableColumn } from "react-data-table-component";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import CustomDownloadBtn from "../../../../../components/custom/CustomDownloadBtn";
import AddNewDocuments from "./AddNewDocuments";
import { useEffect, useState } from "react";
import { capitalize, debounce, showToast } from "../../../../../helpers";
import { useParams } from "react-router-dom";
import {
  deleteDocument,
  fetchDocuments,
  getDocumentById,
} from "../../../../../services/FacilityDocuments";
import { DocumentDataType } from "../../../../../types/FacilityDocument";
import Loader from "../../../../../components/custom/CustomSpinner";
import ACL from "../../../../../components/custom/ACL";
import CustomSelect from "../../../../../components/custom/CustomSelect";

const FacilityDocuments = () => {
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<DocumentDataType[]>([]);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] =
    useState<DocumentDataType | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const facilityId = useParams();
  const [abort, setAbort] = useState<boolean>(false);

  const onEditHandler = (documentId: number) => {
    const filteredDocument: DocumentDataType | undefined = documents.find(
      (doc: DocumentDataType) => doc.Id === documentId
    );
    if (filteredDocument !== undefined) {
      setSelectedDocumentForEdit(filteredDocument);
      setIsOffCanvasOpen(true);
    }
  };

  const onDeleteHandler = async (facilityId: number, documentId: number) => {
    try {
      setLoading(true);
      await deleteDocument(facilityId, documentId);
      setLoading(false);
      await fetchFacilityDocuments();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onDownloadHandler = async (documentId: number) => {
    try {
      setLoading(true);
      await getDocumentById(Number(facilityId?.Id), documentId).then(
        (response) => {
          const contentDisposition = response.headers["content-disposition"];
          let filename = "download";
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(
              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, "");
            }
          }
          const file = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          const fileURL = URL.createObjectURL(file);
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.download = filename;
          fileLink.click();
          URL.revokeObjectURL(fileURL);
        }
      );
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const abortController = new AbortController();
  const fetchFacilityDocuments = debounce(async () => {
    try {
      setLoading(true);
      const documents = await fetchDocuments(Number(facilityId?.Id), search, abortController);
      setDocuments(documents?.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, 300);

  useEffect(() => {
    fetchFacilityDocuments();

    return () => abortController.abort();
  }, [search, abort]);


  const Column: TableColumn<DocumentDataType>[] = [
    {
      name: "Sr No",
      width: '8%',
      cell: (row: DocumentDataType, index: number): number =>
        index + 1 ?? row.Id,

    },
    {
      name: "Document Name",
      cell: (row: DocumentDataType): string => capitalize(row.Name),
      minWidth: '180px',
    },
    {
      name: "Description",
      cell: (row: DocumentDataType): string => row.Description,
      minWidth: '190px',
    },
    {
      name: "Uploaded On",
      minWidth: '180px',
      cell: (row: DocumentDataType): string | undefined => {
        const options: Intl.DateTimeFormatOptions = {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        };
        const dateString = new Date(row.CreatedOn).toLocaleString(
          "en-US",
          options
        );
        return dateString.replace(/(\m+)\/(\d+)\/(\y+),/, "$2/$1/$3");
      },
    },
    {
      name: "Actions",
      minWidth: '130px',
      cell: (row: DocumentDataType) => (
        <>
          <ACL
            submodule={"facilitydocuments"}
            module={"facilities"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn onEdit={() => onEditHandler(row.Id)} />
          </ACL>
          <ACL
            submodule={"facilitydocuments"}
            module={"facilities"}
            action={["GET", "GET"]}
          >
            <CustomDownloadBtn onDownload={() => onDownloadHandler(row.Id)} />
          </ACL>
          <ACL
            submodule={"facilitydocuments"}
            module={"facilities"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn
              onDelete={() => onDeleteHandler(Number(facilityId?.Id), row.Id)}
            />
          </ACL>
        </>
      ),

    },
  ];

  return (
    <>
      <div className="facility-main-card-section">
        <CustomMainCard>
          <div className="facility-listing-loader">
            <h2 className="page-content-header">Facility Documents</h2>
            {loading && <Loader />}
            <AddNewDocuments
              key={selectedDocumentForEdit?.Id}
              setIsOffCanvasOpen={setIsOffCanvasOpen}
              isOffCanvasOpen={isOffCanvasOpen}
              selectedDocumentForEdit={selectedDocumentForEdit}
              setSelectedDocumentForEdit={setSelectedDocumentForEdit}
              fetchFacilityDocuments={fetchFacilityDocuments}
              search={search}
              setSearch={setSearch}
            />

            <div className="datatable-wrapper facility-datatable-wrapper facility-onboarding-datatable">
              <DataTable columns={Column} data={documents} />
            </div>
          </div>
        </CustomMainCard>
      </div>
    </>
  );
};
export default FacilityDocuments;
