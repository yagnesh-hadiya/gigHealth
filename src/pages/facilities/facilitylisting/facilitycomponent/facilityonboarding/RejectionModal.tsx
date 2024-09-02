import { Form, } from "react-router-dom";
import { Col, Row, Modal, ModalHeader, ModalBody, Label } from "reactstrap";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";

type RejectModalProps = {
  isOpen: boolean;
  toggle: () => void;
}

const RejectionModal = ({ isOpen, toggle }: RejectModalProps) => {

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered={true} >
        <ModalHeader toggle={toggle}> Add Note For Rejection  </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md='12' className="col-group">
                <Label>
                  Add Note
                </Label>
                <CustomTextArea disabled={false} id="noteTextArea" className="height-textarea"
                  placeholder="Note" />
              </Col>
            </Row>
            <div className="btn-wrapper">
              <CustomButton className="primary-btn" >  Save </CustomButton>
              <CustomButton className="secondary-btn" onClick={() => {
              }}>Cancel</CustomButton>
            </div>
          </Form>
        </ModalBody>
        {/* <ModalFooter className="mb-3 justify-content-start">
            <div className="btn-wrapper">
              <CustomButton className="primary-btn" >Save</CustomButton>
              <CustomButton className="secondary-btn" onClick={toggle}>Cancel</CustomButton>
            </div>
          </ModalFooter> */}

      </Modal>
    </>
  );
};
export default RejectionModal;


