import { useEffect, useState } from "react";
import { components } from "react-select";
import moment from "moment";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  applySuggestedProfessionalDocument,
  downloadSuggestedProfessionalDocument,
  getSuggestedDocs,
} from "../../../services/TalentJobs";
import {
  Document,
  SelecSuggestedDocumentType,
  SuggestedDocumentList,
} from "../../../types/TalentJobs";
import { capitalize, showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";

const SelectSuggestedDocument = ({
  docId,
  docCount,
  setFetchDetails,
  setPage,
  filename,
}: SelecSuggestedDocumentType) => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  async function loadOptions(
    search: string,
    loadedOptions: any[],
    { page }: any
  ) {
    setPage(page);
    const response = await getSuggestedDocs(docId, 10, page);

    return {
      options: [
        ...loadedOptions,
        ...response.rows?.map((item: SuggestedDocumentList) => ({
          value: item.Id,
          label: `${capitalize(item?.DocumentMaster.Type)} - ${moment(
            item.CreatedOn
          ).format("MM-DD-YYYY")}`,
          document: item,
          professionalDocumentId: item.ProfessionalDocumentId,
        })),
      ],
      hasMore: response.count > page * 10,
      search: search,
      additional: {
        page: page + 1,
      },
    };
  }

  const handleDownloadDocument = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    pdId: number
  ) => {
    try {
      e.stopPropagation();
      setLoading("loading");
      const response = await downloadSuggestedProfessionalDocument(pdId);
      if (response) {
        const contentDisposition = response.headers["content-disposition"];
        let fileName = filename || "download";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            fileName = filenameMatch[1].replace(/['"]/g, "");
          }
        }
        const file = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const fileURL = URL.createObjectURL(file);
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.download = fileName;
        fileLink.click();
        URL.revokeObjectURL(fileURL);
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleApplyDocument = async () => {
    try {
      setLoading("loading");
      if (currentDocument) {
        const res = await applySuggestedProfessionalDocument(
          currentDocument?.document?.DocumentMaster?.Id,
          currentDocument?.document?.ProfessionalDocumentId
        );
        if (res.status === 200) {
          showToast("success", "Document uploaded successfully");
          setFetchDetails((prev) => !prev);
        }
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    handleApplyDocument();
  }, [currentDocument]);

  const SelectOption = (props: any) => {
    return (
      <components.Option {...props}>
        <div onClick={handleApplyDocument}>
          <table
            style={{
              width: "100%",
            }}
          >
            <tbody>
              <tr
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <td style={{ width: "100%" }}>
                  <div className="drp-suggestion-flex d-flex">
                    <div className="doc-info-box">
                      <div
                        className="doc-avatar filled-icon me-2"
                        title="Click here to download"
                        style={{ cursor: "pointer" }}
                        onClick={(e) =>
                          handleDownloadDocument(
                            e,
                            props.data.professionalDocumentId
                          )
                        }
                      >
                        <span className="material-symbols-outlined cursor-pointer">
                          description
                        </span>
                      </div>
                      <p
                        className="center-align text-align mb-0 text-capitalize"
                        style={{
                          color: "#2E65C3",
                          fontWeight: "500",
                        }}
                      >
                        {props.data.document.DocumentMaster.Type}
                      </p>
                    </div>
                    <div className="drp-right-side" style={{ color: "gray" }}>
                      <p
                        className="center-align text-align mb-0"
                        style={{
                          color: "gray",
                          fontWeight: "500",
                        }}
                      >
                        Uploaded On:
                      </p>
                      {moment(props.data.document.CreatedOn).format(
                        "MM-DD-YYYY HH:mm:ss"
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </components.Option>
    );
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <AsyncPaginate
        loadOptions={loadOptions as any}
        additional={{
          page: 1,
        }}
        value={currentDocument}
        onChange={setCurrentDocument}
        components={{
          Option: SelectOption,
        }}
        placeholder={
          docCount ? ` ${docCount} found,Select Documents` : "Select Document"
        }
        isSearchable={false}
      />
    </>
  );
};

export default SelectSuggestedDocument;
