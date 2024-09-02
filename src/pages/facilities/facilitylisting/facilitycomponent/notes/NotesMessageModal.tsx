import { Form, } from "react-router-dom";
import { Col, Row, Modal, ModalHeader, ModalBody, Label } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import { MessageModalProps } from "../../../../../types/NotesTypes";
import ACL from "../../../../../components/custom/ACL";

const NotesMessageModal = ({ isOpen, toggle }: MessageModalProps) => {

    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle} centered={true} size="lg" onClosed={toggle}>
                <ModalHeader toggle={toggle}> Send New Message  </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md='6' className="col-group">
                                <Label>
                                    From
                                </Label>
                                <CustomInput
                                    id='from'
                                    placeholder="Brittany Persutti (828-446-3147)" disabled={true} />
                            </Col>
                            <Col md='6' className="col-group">
                                <Label>
                                    To
                                </Label>
                                <div className="split-input-container">
                                    <CustomInput
                                        id='phone'
                                        placeholder="" disabled={false}
                                        className="split-input"
                                        value="828-446-3147" />

                                    <div className="input-divider"></div>
                                    <CustomInput
                                        id='name'
                                        className="split-input"
                                        placeholder=""
                                        value="Dona Harrison"
                                    />
                                </div>
                            </Col>

                        </Row>
                        <Row>
                            <Col md='12' className="col-group">
                                <Label>Message</Label>
                                <CustomTextArea disabled={false} id="messageTextArea" className="fixed-height-textarea"
                                    placeholder="Message" />
                            </Col>
                        </Row>
                        <div className="btn-wrapper">
                            <ACL submodule={"notes"} module={"facilities"} action={["GET", "PUT"] || ["GET", "GET"]}>
                                <CustomButton className="primary-btn" >  Save </CustomButton>
                            </ACL>
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
export default NotesMessageModal;


