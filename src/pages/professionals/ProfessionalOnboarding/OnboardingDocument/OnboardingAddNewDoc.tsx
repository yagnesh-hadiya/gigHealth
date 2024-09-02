import { Form } from "react-router-dom";
import { Col, Row, Modal, ModalHeader, ModalBody, Label } from "reactstrap";

// import CustomMultiSelect from "../../../../../components/custom/CustomMultiSelect";
import { useEffect, useState } from "react";
import { DocumentMasterListType } from "../../../../types/DocumentTypes";
import { listDocumentMasterList } from "../../../../services/DocumentMasterServices";
import { capitalize, showToast } from "../../../../helpers";
import ProfessionalOnboardingServices from "../../../../services/ProfessionalOnboardingServices";
import Loader from "../../../../components/custom/CustomSpinner";
import CustomSelect from "../../../../components/custom/CustomSelect";
import CustomButton from "../../../../components/custom/CustomBtn";

type RejectModalProps = {
  isOpen: boolean;
  toggle: () => void;
  professionalId: number;
  jobId: number;
  facilityId: number;
  jobApplicationId: number;
  fetchDocuments: () => void;
};

const OnboardingAddNewDoc = ({
  isOpen,
  toggle,
  jobId,
  jobApplicationId,
  facilityId,
  professionalId,
  fetchDocuments,
}: RejectModalProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [documentMasterList, setDocumentMasterList] = useState<
    DocumentMasterListType[]
  >([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    label: string;
    value: number;
  } | null>(null);

  const fetchData = async () => {
    try {
      setLoading("loading");
      const res = await listDocumentMasterList();
      setLoading("idle");
      setDocumentMasterList(res.data.data);
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.message || "Something went wrong");
    }
  };

  const submit = async () => {
    setLoading("loading");
    try {
      if (selectedDocument === null) {
        showToast("error", "Please select document");
        return;
      }
      const res = await ProfessionalOnboardingServices.addNewDocument({
        jobId: jobId,
        professionalId: professionalId,
        facilityId: facilityId,
        jobApplicationId: jobApplicationId,
        documentMasterId: selectedDocument.value,
      });
      if (res.status === 200) {
        setLoading("idle");
        showToast("success", res.data.message);
        fetchDocuments();
        toggle();
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error.response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal isOpen={isOpen} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle}>Add New Documents </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="12" className="col-group">
                <Label>Select Documents</Label>
                <CustomSelect
                  id="document-master-id"
                  name="document-master"
                  noOptionsMessage={() => "No Documents Found"}
                  options={documentMasterList.map((item) => ({
                    label: capitalize(item.Type),
                    value: item.Id,
                  }))}
                  onChange={(e) => {
                    setSelectedDocument(e);
                  }}
                  value={selectedDocument}
                  placeholder="Select Documents"
                />
              </Col>
            </Row>
            <div className="btn-wrapper">
              <CustomButton className="primary-btn" onClick={submit}>
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
export default OnboardingAddNewDoc;
