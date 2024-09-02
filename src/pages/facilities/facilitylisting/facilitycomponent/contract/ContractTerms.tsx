import DataTable from "react-data-table-component";
import Search from "../../../../../assets/images/search.svg";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomActionDownloadBtn from "../../../../../components/custom/CustomDownloadBtn";
import CustomEyeBtn from "../../../../../components/custom/CustomEyeBtn";
import { Link, useNavigate, useParams } from "react-router-dom";
import ToggleSwitch from "../../../../../components/custom/CustomContractToggle";
import { useEffect, useState } from "react";
import CustomEditBtn from "../../../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../../../components/custom/CustomDeleteBtn";
import ViewContract from "./ViewContract";
import {
  changeContractTermActivation,
  deleteContractTerm,
  getContractIdForDownLoad,
  getContractTermList,
} from "../../../../../services/ContractTerm";
import Loader from "../../../../../components/custom/CustomSpinner";
import { debounce, showToast } from "../../../../../helpers";
import { ContractTermList } from "../../../../../types/ContractTerm";
import ACL from "../../../../../components/custom/ACL";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const ContractTerms = () => {
  const facilityDataId = useParams();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ContractTermList[]>([]);
  const [isAddNewDisabled, setIsAddNewDisabled] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [selectedIdForView, setSelectedIdForView] = useState<
    number | undefined
  >();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const Id = Number(facilityDataId?.Id);
  const navigate = useNavigate();
  const [abort, setAbort] = useState<boolean>(false);

  const renderToggleSwitch = (row: ContractTermList) => {
    if (row.ActivationStatus) {
      return (
        <ACL
          submodule={"contractterms"}
          module={"facilities"}
          action={["GET", "PUT"]}
        >
          <ToggleSwitch
            onStateChange={(state) =>
              toggleContractTermActivation(row.Id, state)
            }
            checked={row.ActivationStatus}
          />
        </ACL>
      );
    } else {
      const tooltip = (
        <Tooltip id={`tooltip-${row.Id}`} className="custom-tooltip">
          This contract has expired or been disabled. You cannot activate this
          contract as a new contract is already active.
        </Tooltip>
      );

      return (
        <OverlayTrigger placement="top" overlay={tooltip}>
          <span>
            <ACL
              submodule={"contractterms"}
              module={"facilities"}
              action={["GET", "PUT"]}
            >
              <ToggleSwitch
                onStateChange={(state) =>
                  toggleContractTermActivation(row.Id, state)
                }
                checked={row.ActivationStatus}
              />
            </ACL>
          </span>
        </OverlayTrigger>
      );
    }
  };

  const renderEditButton = (row: ContractTermList) => {
    if (row.ActivationStatus) {
      return (
        <CustomEditBtn
          onEdit={() => onEditHandler(row.Id)}
          disabled={!row.ActivationStatus}
        />
      );
    } else {
      const tooltip = (
        <Tooltip id={`disabled-tooltip-${row.Id}`} className="custom-tooltip">
          You can't edit this contract as the new contract is active.
        </Tooltip>
      );

      return (
        <OverlayTrigger overlay={tooltip} placement="top">
          <span className="d-inline-block" tabIndex={0}>
            <CustomEditBtn onEdit={() => {}} disabled={!row.ActivationStatus} />
          </span>
        </OverlayTrigger>
      );
    }
  };

  const abortController = new AbortController();
  const fetchContractList = debounce(async () => {
    try {
      setLoading(true);
      const data = await getContractTermList(
        Number(facilityDataId?.Id),
        search,
        abortController
      );
      setLoading(false);
      setList(data);
      checkAndSetButtonState(data);
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
    fetchContractList();

    return () => abortController.abort();
  }, [search, abort]);

  const checkAndSetButtonState = (contractList: ContractTermList[]) => {
    const isAnyActive = contractList.some(
      (contract) => contract.ActivationStatus
    );
    setIsAddNewDisabled(isAnyActive);
  };

  const onEditHandler = (Id: number) => {
    const selectedItem = list.find((item) => item.Id === Id);
    if (selectedItem) {
      navigate(`/facility/${Number(facilityDataId?.Id)}/contract/edit/${Id}`);
    }
  };

  const toggleContractTermActivation = async (
    ContractTermId: number,
    value: boolean
  ) => {
    try {
      await changeContractTermActivation(
        Number(facilityDataId?.Id),
        ContractTermId,
        value
      );

      setList((currentList) => {
        const newList = currentList.map((contract) => {
          if (contract.Id === ContractTermId) {
            return { ...contract, ActivationStatus: value };
          }
          return contract;
        });
        checkAndSetButtonState(newList);
        return newList;
      });
    } catch (error: any) {
      setList((currentList) => {
        const newList = currentList.map((contract) => {
          if (contract.Id === ContractTermId) {
            return { ...contract, ActivationStatus: !value };
          }
          return contract;
        });
        checkAndSetButtonState(newList);
        return newList;
      });
      //  showToast('error', error?.response?.data?.message || 'Something went wrong');
    }
  };

  const onDeleteHandler = async (Id: number) => {
    try {
      setLoading(true);
      await deleteContractTerm(Number(facilityDataId?.Id), Id);
      await fetchContractList();
      showToast("success", "Contract term deleted successfully");
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onDownloadHandler = async (contractId: number) => {
    try {
      setLoading(true);
      const response = await getContractIdForDownLoad(Number(Id), contractId);

      if (response.statusText === "OK" && response.status === 200) {
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

        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      if (error.response) {
        if (error.response.status === 404) {
          showToast(
            "error",
            error.response.data.message ||
              "No contract term document available for download"
          );
        } else {
          showToast(
            "error",
            error.response.data.message || "Something went wrong"
          );
        }
      }
    }
  };

  const viewHandler = (Id: number) => {
    const selectedItem = list.find((item) => item.Id === Id);
    if (selectedItem) {
      setSelectedIdForView(selectedItem.Id);
      setIsViewModalOpen(true);
    }
  };
  const toggle = () => {
    setIsViewModalOpen(false);
  };

  const Column = [
    {
      name: "Sr No",
      cell: (row: ContractTermList, index: number) => index + 1 ?? row.Id,
      width: "10%",
    },
    {
      name: "Contract Date",
      cell: (row: ContractTermList): string | undefined => {
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        return new Date(row.CreatedOn).toLocaleString("en-US", options);
      },
      minWidth: "150px",
    },
    {
      name: "Contract ID",
      cell: (row: ContractTermList) => `FCON-${row.Id}`,
      minWidth: "150px",
    },
    {
      name: "Contract Status",
      cell: (row: ContractTermList) => (
        <>
          <ACL
            submodule={"contractterms"}
            module={"facilities"}
            action={["GET", "PUT"]}
          >
            {renderToggleSwitch(row)}
            {/* <ToggleSwitch onStateChange={(state: boolean) => { toggleContractTermActivation(row.Id, state) }} checked={row.ActivationStatus} allow={true} />*/}
          </ACL>
          <span className="p-2">
            {row.ActivationStatus ? "Active" : "Expired/Disabled"}
          </span>
        </>
      ),
      minWidth: "143px",
    },
    {
      name: "Actions",
      cell: (row: ContractTermList) => (
        <>
          <div className="d-flex align-items-center justify-content-start action-btn">
            <div className="d-flex align-items-center justify-content-end actions">
              <ACL
                submodule={"contractterms"}
                module={"facilities"}
                action={["GET", "GET"]}
              >
                <CustomEyeBtn onEye={() => viewHandler(row.Id)} />
              </ACL>

              {/* <ACL submodule={"contractterms"} module={"facilities"} action={["GET", "PUT"]}><CustomEditBtn onEdit={() => onEditHandler(row.Id)} disabled={!row.ActivationStatus} /></ACL> */}
              {renderEditButton(row)}
            </div>
            <div className="d-flex align-items-center actions">
              <ACL
                submodule={"contractterms"}
                module={"facilities"}
                action={["GET", "GET"]}
              >
                <CustomActionDownloadBtn
                  onDownload={() => onDownloadHandler(row.Id)}
                />
              </ACL>

              <ACL
                submodule={"contractterms"}
                module={"facilities"}
                action={["GET", "DELETE"]}
              >
                <CustomDeleteBtn onDelete={() => onDeleteHandler(row.Id)} />
              </ACL>
            </div>
          </div>
        </>
      ),
      minWidth: "165px",
    },

  ];

  const handleChange = (text: string) => {
    setSearch(text);
  };

  return (
    <>
    <div className="facility-main-card-section">
      <CustomMainCard>
        <div>
          <h2 className="page-content-header">Contract Terms</h2>
          <div className="d-flex mb-3">
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
              {isAddNewDisabled ? (
                <CustomButton className="primary-btn" disabled>
                  Add New
                </CustomButton>
              ) : (
                <Link
                  to={`/facility/${Id}/contract/create`}
                  className="link-btn"
                >
                  <ACL
                    submodule={"contractterms"}
                    module={"facilities"}
                    action={["GET", "POST"]}
                  >
                    <CustomButton className="primary-btn">Add New</CustomButton>
                  </ACL>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="datatable-wrapper facility-datatable-wrapper facility-onboarding-datatable">
          {loading ? <Loader /> : <DataTable columns={Column} data={list} />}
        </div>
      </CustomMainCard>
    </div>
      {isViewModalOpen && selectedIdForView !== undefined && (
        <ViewContract
          Id={selectedIdForView}
          isOpen={isViewModalOpen}
          toggle={toggle}
        />
      )}
    </>
  );
};
export default ContractTerms;
