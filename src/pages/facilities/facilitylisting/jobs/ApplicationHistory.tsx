import { TerminateModalProps } from "../../../../types/JobsTypes"
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const ApplicationHistory = ({ isOpen, toggle }: TerminateModalProps) => {
    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle} centered={true} size="md" onClosed={toggle}>
                <ModalHeader toggle={toggle} style={{color:'#2E65C3'}}>Application History</ModalHeader>
                <ModalBody>
                    <div className="application-history-stepper">
                        <div className="container-master">
                            <div className="step">
                                <div className="v-stepper">
                                    <div>
                                    <div className="circle"></div>
                                    <div className="line"></div>
                                    </div>
                                    <div className="text">Placements</div>
                                    <div className="border-line"></div>
                                </div>

                                <div className="content">
                                04/14/2023 10:22:36
                                </div>
                            </div>

                            <div className="step">
                                <div className="v-stepper">
                                <div>
                                    <div className="circle"></div>
                                    <div className="line"></div>
                                    </div>
                                    <div className="text">Offered</div>
                                    <div className="border-line"></div>
                                </div>

                                <div className="content">
                                04/14/2023 10:22:36
                                </div>
                            </div>

                            <div className="step">
                                <div className="v-stepper">
                                <div>
                                    <div className="circle"></div>
                                    <div className="line"></div>
                                    </div>
                                    <div className="text">Submitted</div>
                                    <div className="border-line"></div>
                                </div>

                                <div className="content">
                                04/14/2023 10:22:36
                                </div>
                            </div>


                        </div>

                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default ApplicationHistory