import { Form } from "react-router-dom";
import { Col, Row, Modal, ModalHeader, ModalBody, Label } from "reactstrap";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { useState } from "react";
import { showToast } from "../../../../../helpers";
import Loader from "../../../../../components/custom/CustomSpinner";
import FacilityOnboardingServices from "../../../../../services/FacilityOnboardingServices";
import { ProfessionalOnboardingDocumentType } from "../../../../../types/ProfessionalOnboardingTypes";

type RejectModalProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  document: ProfessionalOnboardingDocumentType;
  fetchDocuments: () => void;
  fetchList: () => void;
};

const FacilityOnboardingRejection = ({
  isOpen,
  toggle,
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  document,
  fetchDocuments,
  fetchList,
}: RejectModalProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [notes, setNotes] = useState<string>("");

  const handleNotes = (data: string) => {
    setNotes(data);
  };

  const handleReject = async () => {
    if (notes.length === 0) {
      return showToast("error", "Please add a note");
    }

    setLoading("loading");
    try {
      const res = await FacilityOnboardingServices.verifyJobComplianceDocument({
        jobId: jobId,
        facilityId: facilityId,
        professionalId: professionalId,
        jobApplicationId: jobApplicationId,
        documentId: document.Id,
        data: {
          approved: false,
          rejectionNotes: notes,
        },
      });
      if (res.status === 200) {
        showToast(
          "success",
          res.data.message || "Document approved successfully"
        );
        fetchDocuments();
        fetchList();
        setLoading("idle");
        toggle();
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "Something went wrong");
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal isOpen={isOpen} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle}> Add Note For Rejection </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="12" className="col-group">
                <Label>Add Note</Label>
                <CustomTextArea
                  disabled={false}
                  id="noteTextArea"
                  className="height-textarea"
                  placeholder="Note"
                  value={notes}
                  onChange={(e: { target: { value: string } }) =>
                    handleNotes(e.target.value)
                  }
                />
              </Col>
            </Row>
            <div className="btn-wrapper">
              <CustomButton className="primary-btn" onClick={handleReject}>
                Save
              </CustomButton>
              <CustomButton className="secondary-btn" onClick={toggle}>
                Cancel
              </CustomButton>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default FacilityOnboardingRejection;
