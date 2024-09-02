import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { capitalize, showToast } from "../../../../helpers";
import { components } from "react-select";
import moment from "moment";
import {
  applySuggestedDocuments,
  fetchSuggestedDocuments,
} from "../../../../services/ApplicantsServices";

type DocumentMaster = {
  Id: number;
  Type: string;
  Description: string;
};

type ProfessionalDocumentType = {
  Id: number;
  CreatedOn: string;
  ProfessionalDocumentId: number;
  DocumentMaster: DocumentMaster;
};

type SelectDocumentProps = {
  jobId: number;
  facilityId: number;
  jobApplicationId: number;
  professionalId: number;
  documentId: number;
  jobComplianceId: number;
  DocCount?: number;
  fetchDocuments: () => void;
};

const formatDate = (date: string) => {
  const newDate = moment(date).format("DD/MM/YYYY HH:mm:ss");
  return newDate;
};

const SelectDocument: React.FC<SelectDocumentProps> = ({
  jobApplicationId,
  jobId,
  professionalId,
  facilityId,
  documentId,
  DocCount,
  jobComplianceId,
  fetchDocuments,
}: SelectDocumentProps) => {
  const [currentDocument, setCurrentDocument] = useState<{
    value: number;
    label: string;
  } | null>(null);

  async function loadOptions(
    search: string,
    loadedOptions: any[],
    { page }: any
  ) {
    console.log(search);
    const response = await fetchSuggestedDocuments({
      jobId,
      facilityId,
      professionalId,
      jobApplicationId,
      documentId,
      size: 10,
      page,
    });

    return {
      options: [
        ...loadedOptions,
        ...response.rows.map((item: ProfessionalDocumentType) => ({
          value: item.Id,
          label: `${capitalize(item.DocumentMaster.Type)} - ${formatDate(
            item.CreatedOn
          )}`,
          document: item,
        })),
      ],
      hasMore: response.count > page * 10,
      additional: {
        page: page + 1,
      },
    };
  }

  const applyDocument = async (suggestedDocumentId: number) => {
    try {
      const res = await applySuggestedDocuments({
        jobId,
        facilityId,
        professionalId,
        jobApplicationId,
        documentId: jobComplianceId,
        suggestedDocumentId,
      });
      if (res.status === 200) {
        fetchDocuments();
        showToast(
          "success",
          res.data.message || "Document linked successfully"
        );
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const SelectOption = (props: any) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            margin: "0px !important",
            padding: "10px",
            border: "1px solid #E5E5E5",
          }}
          onClick={() => {
            applyDocument(props.data.document.ProfessionalDocumentId);
          }}
        >
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
                <td
                  style={{
                    flex: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <p
                        className="center-align text-align mb-0"
                        style={{
                          color: "#2E65C3",
                          fontWeight: "500",
                        }}
                      >
                        {capitalize(props.data.document.DocumentMaster.Type)}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    flex: 2,
                    textAlign: "center",
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#717B9E",
                  }}
                >
                  <p
                    className="center-align text-align mb-0"
                    style={{
                      color: "gray",
                      fontWeight: "500",
                    }}
                  >
                    Uploaded On:
                  </p>
                  {formatDate(props.data.document.CreatedOn)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </components.Option>
    );
  };

  return (
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
      placeholder={`${
        DocCount ? `${DocCount} found, Select Document` : "Select Document"
      }`}
      isSearchable={false}
    />
  );
};

export default SelectDocument;
