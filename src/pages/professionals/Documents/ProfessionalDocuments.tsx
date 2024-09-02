import CustomMainCard from "../../../components/custom/CustomCard";
import UploadProfessionalDocument from "./UploadProfessionalDocument";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfessionalDocumentServices from "../../../services/ProfessionalDocumentServices";
import ProfessionalDocumentCard from "./ProfessionalDocumentCard";
import { ProfessionalDocument } from "../../../types/ProfessionalDocumentType";
import CustomInput from "../../../components/custom/CustomInput";
import CustomButton from "../../../components/custom/CustomBtn";
import Search from "../../../assets/images/search.svg";
import Loader from "../../../components/custom/CustomSpinner";
import CustomPagination from "../../../components/custom/CustomPagination";
import { debounce } from "../../../helpers";

const ProfessionalDocuments = () => {
  const params = useParams<{ Id: string }>();
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<ProfessionalDocument[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [abort, setAbort] = useState<boolean>(false);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const handlePageSizeChange = async (selectedPage: number): Promise<void> => {
    setPage(selectedPage);
  };

  const abortController = new AbortController();
  const fetchProfessionalDocuments = useCallback(
    debounce(async () => {
      setLoading("loading");
      try {
        const res = await ProfessionalDocumentServices.getProfessionalDocuments(
          {
            professionalId: Number(params.Id),
            search: search,
            size: size,
            page: page,
            abortController,
          }
        );

        if (res.status === 200) {
          setLoading("idle");
          setTotalRows(res.data.data[0]?.count);
          setTotalPages(Math.ceil(res.data.data[0]?.count / size));
          setDocuments(res.data.data[0].rows);
        }
      } catch (error: any) {
        if (abortController.signal.aborted) {
          setAbort(true);
          return;
        }
        console.error(error);
        setLoading("error");
      }
    }, 300),
    [page, params.Id, search, size, abort]
  );

  useEffect(() => {
    fetchProfessionalDocuments();

    return () => abortController.abort();
  }, [fetchProfessionalDocuments, abort]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="facility-main-card-section">
        <CustomMainCard>
          <div>
            <h2 className="page-content-header mb-0 pt-2 mb-2">Documents</h2>
            <div className="d-flex mb-3">
              <div className="search-bar-wrapper w-100">
                <CustomInput
                  placeholder="Search Here"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSearch(e.target.value)
                  }
                />
                <img src={Search} alt="search" />
              </div>
              <div className="table-navigate">
                <CustomButton
                  className="primary-btn ms-2"
                  onClick={() => setIsOffCanvasOpen(true)}
                >
                  Add New
                </CustomButton>
              </div>
            </div>

            {isOffCanvasOpen && (
              <UploadProfessionalDocument
                setIsOffCanvasOpen={setIsOffCanvasOpen}
                isOffCanvasOpen={isOffCanvasOpen}
                fetchFacilityDocuments={fetchProfessionalDocuments}
              />
            )}
          </div>
          <div className="offer-wrapper">
            {documents.length === 0 ? (
              <div className="no-data-found text-center">
                There are no records to display.
              </div>
            ) : (
              <>
                {documents.map((document, index) => (
                  <ProfessionalDocumentCard
                    key={index}
                    doc={document}
                    fetchDocuments={fetchProfessionalDocuments}
                  />
                ))}
              </>
            )}
          </div>

          {documents.length !== 0 && (
            <div
              style={{
                marginTop: "auto",
              }}
            >
              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageSizeChange}
                onPageSizeChange={setSize}
                entriesPerPage={size}
                totalRows={totalRows}
                setPage={setPage}
              />
            </div>
          )}
        </CustomMainCard>
      </div>
    </>
  );
};

export default ProfessionalDocuments;
