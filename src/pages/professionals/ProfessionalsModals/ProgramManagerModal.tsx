import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  ProgramManagerModalProps,
  ProgramManagerType,
} from "../../../types/ProfessionalDetails";
import { memo, useEffect, useState } from "react";
import { capitalize, checkAclPermission, showToast } from "../../../helpers";
import {
  changeProgramManager,
  fetchProfessionalHeaderDetails,
  fetchProgramManager,
} from "../../../services/ProfessionalDetails";
import CustomSelect from "../../../components/custom/CustomSelect";
import { SelectOption } from "../../../types/FacilityTypes";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHeaderDetails } from "../../../store/ProfessionalDetailsSlice";
import ACL from "../../../components/custom/ACL";

const ProgramManagerModal = ({
  isOpen,
  toggle,
  professionalId,
  selectedProgramManager,
  setSelectedProgramManager,
}: ProgramManagerModalProps) => {
  const [programManager, setProgramManager] = useState<ProgramManagerType[]>(
    []
  );
  const params = useParams();
  const dispatch = useDispatch();
  const allow = checkAclPermission("professionals", "details", ["GET", "PUT"]);

  const getProgramManagerList = async () => {
    try {
      const response = await fetchProgramManager();
      setProgramManager(response.data?.data);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  useEffect(() => {
    getProgramManagerList();
  }, []);

  const saveHandler = async () => {
    try {
      if (!selectedProgramManager?.value) {
        return showToast("error", "Please select program manager");
      }

      if (selectedProgramManager?.value) {
        const response = await changeProgramManager(
          professionalId,
          selectedProgramManager?.value
        );
        if (response.status === 200) {
          await fetchProfessionalHeaderDetails(Number(params.Id)).then(
            (response) => {
              dispatch(setHeaderDetails(response.data?.data));
            }
          );
          showToast(
            "success",
            "Program manager updated successfully" || response.data?.message
          );
          toggle();
        }
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleProgramManagerChange = (selectedOption: SelectOption | null) => {
    setSelectedProgramManager(
      selectedOption && {
        value: selectedOption?.value,
        label: selectedOption?.label,
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="md"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Program Manager</ModalHeader>
        <ModalBody className="programModal">
          <ACL
            submodule={"details"}
            module={"professionals"}
            action={["GET", "PUT"]}
          >
            <CustomSelect
              id="programManager"
              name="programManager"
              value={selectedProgramManager}
              onChange={(manager) => handleProgramManagerChange(manager)}
              placeholder={"Select Program Manager"}
              options={programManager.map(
                (manager: {
                  Id: number;
                  FirstName: string;
                  LastName: string;
                }): { value: number; label: string } => ({
                  value: manager?.Id,
                  label: `${capitalize(manager?.FirstName)} ${capitalize(
                    manager.LastName
                  )}`,
                })
              )}
              noOptionsMessage={(): string => "No Program Manager Found"}
              isClearable={true}
              isSearchable={true}
              className="custom-select-placeholder"
              isDisabled={!allow}
            />
          </ACL>
        </ModalBody>
        <ModalFooter>
          <ACL
            module="professionals"
            submodule="details"
            action={["GET", "PUT"]}
          >
            <Button
              color="primary primary-btn"
              onClick={saveHandler}
              disabled={!allow}
            >
              Save
            </Button>
          </ACL>
          <Button color="secondary secondary-btn" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default memo(ProgramManagerModal);
