import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { Form } from "react-router-dom";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomInput from "../../../../../components/custom/CustomInput";
import { useState } from "react";
import { updateJobSlot } from "../../../../../services/OpeningServices";
import { showToast } from "../../../../../helpers";
import Loader from "../../../../../components/custom/CustomSpinner";

type EditRequestIdProps = {
  facilityId: number;
  jobId: number;
  slotId: number;
  isOpen: boolean;
  toggle: () => void;
  fetchJobAssignments: () => void;
};

const EditRequestId = ({
  isOpen,
  toggle,
  fetchJobAssignments,
  facilityId,
  jobId,
  slotId,
}: EditRequestIdProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [clientReqId, setClientReqId] = useState("");

  const handleClientReqId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientReqId(e.target.value);
  };

  const saveClientReqId = async () => {
    setLoading("loading");
    try {
      const res = await updateJobSlot({
        facilityId,
        jobId,
        slotId,
        data: {
          reqId: clientReqId,
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
        <ModalHeader toggle={toggle}>Edit Client Req ID</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="12" className="col-group">
                <Label>Edit Client Req ID</Label>
                <CustomInput
                  type="text"
                  placeholder="Client Req ID"
                  value={clientReqId}
                  onChange={handleClientReqId}
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
export default EditRequestId;
