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
import { activityModalDropdown, showToast } from "../../../helpers";
import ProfessionalOnboardingServices from "../../../services/ProfessionalOnboardingServices";
import CustomSelect from "../../../components/custom/CustomSelect";
import CustomButton from "../../../components/custom/CustomBtn";
import Loader from "../../../components/custom/CustomSpinner";
import { useState } from "react";
import CustomTextArea from "../../../components/custom/CustomTextarea";

type ProfessionalOnboardingTerminateProps = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  isOpen: boolean;
  toggle: () => void;
  fetchOnboarding: () => void;
};

const ProfessionalOnboardingTerminate = ({
  isOpen,
  toggle,
  facilityId,
  jobId,
  jobApplicationId,
  jobAssignmentId,
  professionalId,
  fetchOnboarding,
}: ProfessionalOnboardingTerminateProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [selectedCategory, setSelectedCategory] = useState<{
    value: number;
    label: string;
  } | null>(null);
  null;
  const handleCategoryChange = (selectedOption: any) => {
    setSelectedCategory(selectedOption);
  };
  const [notes, setNotes] = useState("");
  const roleOption = [
    { value: 1, label: "Facility Termination" },
    { value: 2, label: "Professional Termination" },
    { value: 3, label: "Gig Termination" },
  ];

  const termination = async () => {
    if (!selectedCategory) return;

    if (notes.length === 0) {
      showToast("error", "Notes is required");
      return;
    }
    setLoading("loading");

    try {
      const res = await ProfessionalOnboardingServices.terminateAssignment({
        facilityId,
        jobId,
        professionalId,
        jobApplicationId,
        jobAssignmentId,
        data: {
          status: selectedCategory?.label as
            | "Facility Termination"
            | "Professional Termination"
            | "Gig Termination",
          notes: notes,
        },
      });
      if (res.status === 200) {
        setLoading("idle");
        fetchOnboarding();
        toggle();
      }
    } catch (error) {
      setLoading("error");
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
        size="md"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Termination</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="12" className="col-group">
                <Label>Select Termination By</Label>
                <CustomSelect
                  id="termination"
                  styles={activityModalDropdown}
                  name="termination"
                  placeholder="Select"
                  noOptionsMessage={() => "No Category Found"}
                  isClearable={true}
                  isSearchable={true}
                  options={roleOption}
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12" className="col-group mb-0">
                <Label>Notes</Label>
                <CustomTextArea
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNotes(e.target.value)
                  }
                  id="notesTextArea"
                  placeholder="Notes"
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter className="justify-content-start">
          <div className="btn-wrapper mb-2">
            <CustomButton className="primary-btn ms-0" onClick={termination}>
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
export default ProfessionalOnboardingTerminate;
