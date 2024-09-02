import { Form } from "react-router-dom";
import { Col, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import CustomButton from "../../../../../components/custom/CustomBtn";
import RadioBtn from "../../../../../components/custom/CustomRadioBtn";
import { useState } from "react";
import ServiceExtensionReqModal from "./ServiceExtensionReqModal";

type ExtensionModalProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  currentStatus: string;
  fetchRosterData: () => void;
};

const ExtensionModal = ({
  isOpen,
  toggle,
  facilityId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  jobId,
  currentStatus,
  fetchRosterData,
}: ExtensionModalProps) => {
  const [serviceExtensionModal, setServiceExtensionModal] =
    useState<boolean>(false);

  const [isEmail, setIsEmail] = useState<boolean>(true);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        className="extension-modal"
      >
        <ModalHeader toggle={toggle}> Service Extension Request </ModalHeader>
        <ModalBody style={{ width: "75%" }}>
          <Form>
            <Row className="d-flex justify-content-center purple-radio-extension">
              <span className="extension-radio">
                <RadioBtn
                  name="extensionradio"
                  disabled={false}
                  options={[
                    { label: "Request Extension with Client", value: "true" },
                    {
                      label: "Send Extension Offer to Professional",
                      value: "false",
                    },
                  ]}
                  selected={isEmail ? "true" : "false"}
                  onChange={() => {
                    setIsEmail(!isEmail);
                  }}
                  className="custom-radio-style"
                />
              </span>
              <Col md="12" className="col-group">
                <div
                  className=" extension-btn-wrapper"
                  style={{ marginLeft: "48px" }}
                >
                  <CustomButton
                    className="primary-btn"
                    style={{ marginLeft: "0px!important" }}
                    onClick={() => {
                      setServiceExtensionModal(true);
                    }}
                  >
                    Proceed
                  </CustomButton>
                  <CustomButton className="secondary-btn" onClick={toggle}>
                    Cancel
                  </CustomButton>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      {serviceExtensionModal && (
        <ServiceExtensionReqModal
          isEmail={isEmail}
          facilityId={facilityId}
          professionalId={professionalId}
          jobId={jobId}
          jobApplicationId={jobApplicationId}
          jobAssignmentId={jobAssignmentId}
          currentStatus={currentStatus}
          isOpen={serviceExtensionModal}
          toggle={() => {
            setServiceExtensionModal(false);
          }}
          toggleParent={toggle}
          fetchRoster={fetchRosterData}
        />
      )}
    </>
  );
};
export default ExtensionModal;
