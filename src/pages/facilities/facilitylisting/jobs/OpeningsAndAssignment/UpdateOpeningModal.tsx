import { useEffect, useState } from "react";
import {
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  getSlotStatus,
  updateJobSlot,
} from "../../../../../services/OpeningServices";
import { showToast } from "../../../../../helpers";
import { Form } from "react-router-dom";
import CustomButton from "../../../../../components/custom/CustomBtn";
import Loader from "../../../../../components/custom/CustomSpinner";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { SlotType } from "../../../../../types/ApplicantTypes";

type UpdateOpeningModalProps = {
  facilityId: number;
  jobId: number;
  currentSlot: SlotType;
  isOpen: boolean;
  toggle: () => void;
  fetchJobAssignments: () => void;
};

const UpdateOpeningModal = ({
  facilityId,
  jobId,
  currentSlot,
  isOpen,
  toggle,
  fetchJobAssignments,
}: UpdateOpeningModalProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [selectedOption, setSelectedOption] = useState<{
    value: number;
    label: string;
  } | null>({
    value: currentSlot.JobSlotStatus.Id ? currentSlot.JobSlotStatus.Id : 0,
    label: currentSlot.JobSlotStatus.Status
      ? currentSlot.JobSlotStatus.Status
      : "",
  });
  const [options, setOptions] = useState<
    {
      Id: number;
      Status: string;
    }[]
  >([]);

  const fetch = async () => {
    try {
      const res = await getSlotStatus();
      if (res.status === 200) {
        setOptions(res.data.data);
      }
    } catch (error: any) {
      console.error(error);
      showToast("error", error.response.data.message);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const saveClientReqId = async () => {
    if (!selectedOption) return;

    setLoading("loading");
    try {
      const res = await updateJobSlot({
        facilityId,
        jobId,
        slotId: currentSlot.Id,
        data: {
          statusId: selectedOption?.value,
        },
      });
      if (res.status === 200) {
        setLoading("idle");
        fetchJobAssignments();
        toggle();
      }
    } catch (error: any) {
      setLoading("error");
      showToast("error", error.response.data.message);
      console.error(error);
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="sm"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Update Opening</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="12" className="col-group">
                <Label>Reason for updating the Opening</Label>
                <CustomSelect
                  id="reason"
                  name="reason"
                  options={
                    options &&
                    options.map((option) => ({
                      value: option.Id,
                      label: option.Status,
                    }))
                  }
                  placeholder="Select Reason"
                  onChange={(selectedOption) =>
                    setSelectedOption(selectedOption)
                  }
                  value={selectedOption}
                  noOptionsMessage={() => "No reason found"}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter className="mb-3 justify-content-start p-0">
          <div className="btn-wrapper">
            <CustomButton className="primary-btn" onClick={saveClientReqId}>
              Save
            </CustomButton>
            <CustomButton className="secondary-btn" onClick={toggle}>
              Cancel
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UpdateOpeningModal;
