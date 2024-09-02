import { Form, } from "react-router-dom";
import { Col, Row, Modal, ModalHeader, ModalBody, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomButton from "../../../components/custom/CustomBtn";
import CustomRichTextEditor from "../../../components/custom/CustomTextEditor";
import { NotesEmailModalProps } from "../../../types/NotesTypes";
import {  useState } from "react";

const NotesEmailModal = ({ isOpen, toggle }: NotesEmailModalProps) => {



    const [content, setContent] = useState<string>('');




    const handleComposeEmail = (text: string) => {
        setContent(text)
    }
    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle} centered={true} size="xl" onClosed={toggle}>
                <ModalHeader toggle={toggle}> Compose Email  </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md='6' className="col-group">
                                <Label>
                                    From
                                </Label>
                                <CustomInput
                                    id='from'
                                    placeholder=""
                                    disabled={true}
                                />
                            </Col>
                            <Col md='6' className="col-group">
                                <Label>
                                    To
                                </Label>
                                <CustomInput
                                    id='to'
                                    placeholder="" />
                            </Col>
                            <Col md='12' className="col-group">
                                <Label>
                                    Subject
                                </Label>
                                <CustomInput
                                    id='Subject'
                                    placeholder="Subject" />
                            </Col>
                            <Col xxl="12" xl="12" lg="12" className="col-group">
                                <Label className="">
                                    Email
                                </Label>
                                <CustomRichTextEditor
                                    content={content}
                                    handleChange={(text: string) => handleComposeEmail(text)}
                                />
                            </Col>
                        </Row>
                        <div className="btn-wrapper">

                            <CustomButton className="primary-btn" disabled> Save</CustomButton>

                            <CustomButton className="secondary-btn" onClick={() => toggle()}>Cancel</CustomButton>
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
export default NotesEmailModal;


