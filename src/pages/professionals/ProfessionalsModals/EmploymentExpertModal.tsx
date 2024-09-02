import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  EmploymentExpertModalProps,
  EmploymentType,
} from "../../../types/ProfessionalDetails";
import { memo, useEffect, useState } from "react";
import {
  changeEmploymentExpert,
  fetchEmploymentExpert,
  fetchProfessionalHeaderDetails,
} from "../../../services/ProfessionalDetails";
import { capitalize, checkAclPermission, showToast } from "../../../helpers";
import CustomSelect from "../../../components/custom/CustomSelect";
import { SelectOption } from "../../../types/FacilityTypes";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHeaderDetails } from "../../../store/ProfessionalDetailsSlice";
import ACL from "../../../components/custom/ACL";

const EmploymentExpertModal = ({
  isOpen,
  toggle,
  professionalId,
  selectedEmploymentType,
  setSelectedEmploymentType,
}: EmploymentExpertModalProps) => {
  const [employment, setEmployment] = useState<EmploymentType[]>([]);
  const params = useParams();
  const dispatch = useDispatch();
  const allow = checkAclPermission("professionals", "details", ["GET", "PUT"]);

  const getEmploymentType = async () => {
    try {
      const response = await fetchEmploymentExpert();
      setEmployment(response.data?.data);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  useEffect(() => {
    getEmploymentType();
  }, []);

  const saveHandler = async () => {
    try {
      if (!selectedEmploymentType?.value) {
        return showToast("error", "Please select employment expert");
      }

      if (selectedEmploymentType?.value) {
        const response = await changeEmploymentExpert(
          professionalId,
          selectedEmploymentType?.value
        );
        if (response.status === 200) {
          await fetchProfessionalHeaderDetails(Number(params.Id)).then(
            (response) => {
              dispatch(setHeaderDetails(response.data?.data));
            }
          );
          showToast(
            "success",
            "Employment expert updated successfully" || response.data?.message
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

  const handleEmployment = (selectedOption: SelectOption | null) => {
    setSelectedEmploymentType(
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
        <ModalHeader toggle={toggle}>Employment Expert</ModalHeader>
        <ModalBody>
          <CustomSelect
            id="programManager"
            name="programManager"
            value={selectedEmploymentType}
            onChange={(manager) => handleEmployment(manager)}
            placeholder={"Select Employment Expert"}
            options={employment.map(
              (emp: {
                Id: number;
                FirstName: string;
                LastName: string;
              }): { value: number; label: string } => ({
                value: emp?.Id,
                label: `${capitalize(emp?.FirstName)} ${capitalize(
                  emp.LastName
                )}`,
              })
            )}
            noOptionsMessage={(): string => "No Employment Expert Found"}
            isClearable={true}
            isSearchable={true}
            className="custom-select-placeholder"
            isDisabled={!allow}
          />
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

export default memo(EmploymentExpertModal);
