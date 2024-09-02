import { Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import CustomSelect from "../../../../components/custom/CustomSelect";
import CustomButton from "../../../../components/custom/CustomBtn";
import { JobModalProps } from "../../../../types/JobsTypes";

const JobModal = ({ filterModal, toggleFilter }: JobModalProps) => {

    return (
        <Modal isOpen={filterModal} toggle={toggleFilter} size="lg" className="filter-modal" centered >
            <ModalHeader toggle={toggleFilter}>Filters</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md='6' className="col-group" >
                        <Label className="col-label">
                            Select Profession
                        </Label>
                        <CustomSelect
                            className="custom-select-placeholder"
                            id={""}
                            name={""}
                            options={[]}
                            placeholder="Select Profession"
                            noOptionsMessage={() => 'No Profession Found'}
                            onChange={() => { }} />
                    </Col>
                    <Col md="6" className="col-group">
                        <Label className="col-label">
                            Select Specialties
                        </Label>
                        <CustomSelect
                            className="custom-select-placeholder"
                            id={""}
                            name={""}
                            options={[]}
                            placeholder="Select Specialties"
                            noOptionsMessage={() => 'No Specialties Found'}
                            onChange={() => { }} />
                    </Col>
                    <Col md="6" className="col-group">
                        <Label className="col-label">
                            Select State
                        </Label>
                        <CustomSelect
                            className="custom-select-placeholder"
                            id={""}
                            name={""}
                            options={[]}
                            placeholder="Select State"
                            noOptionsMessage={() => 'No State Found'}
                            onChange={() => { }} />
                    </Col>
                    <Col md="6" className="col-group">
                        <Label className="col-label">
                            Select Shift
                        </Label>
                        <CustomSelect
                            className="custom-select-placeholder"
                            id={""}
                            name={""}
                            options={[]}
                            placeholder="Select Shift"
                            noOptionsMessage={() => 'No Shift Found'}
                            onChange={() => { }} />
                    </Col>
                    <Col md="6" className="col-group">
                        <Label className="col-label">
                            Select Skills
                        </Label>
                        <CustomSelect
                            className="custom-select-placeholder"
                            id={""}
                            name={""}
                            options={[]}
                            placeholder="Select Skills"
                            noOptionsMessage={() => 'No Skills Found'}
                            onChange={() => { }} />
                    </Col>
                    <Col md="6" className="col-group">
                        <Label className="col-label">
                            Job Code
                        </Label>
                        <CustomSelect
                            className="custom-select-placeholder"
                            id={""}
                            name={""}
                            options={[]}
                            placeholder="Select Job Code"
                            noOptionsMessage={() => 'No Job Code Found'}
                            onChange={() => { }} />
                    </Col>
                </Row>
                <div className="btn-wrapper">
                    <CustomButton className="job-header-button" >Apply </CustomButton>
                    <CustomButton className="secondary-btn" >Cancel</CustomButton>
                    <CustomButton className="secondary-btn" >Clear Filters</CustomButton>
                </div>
            </ModalBody>
        </Modal >
    );
};

export default JobModal;