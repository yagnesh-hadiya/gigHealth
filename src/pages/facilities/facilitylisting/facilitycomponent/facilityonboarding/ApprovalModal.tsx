import { Form, } from "react-router-dom";
import { Col, Row, Modal, ModalBody } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import ReactDatePicker from "react-datepicker";
import Calendar from '../../../../../assets/images/calendar.svg'
type ApprovedModalProps = {
  isOpen: boolean;
  toggle: () => void;
}

const ApprovalModal = ({ isOpen, toggle }: ApprovedModalProps) => {

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered={true} style={{ width: '22%' }} >
        <ModalBody style={{ display: 'flex', justifyContent: 'center' }}>
          <Form>
            <Row>
              <Col md='12' className="col-group">
                <div className='modal-content-center'>
                  <p className='header' style={{ textAlign: 'center', marginTop: '10px' }}>Confirm Approval</p>
                  <p className='edu-card-content'>Add effective date to approve this document.</p>
                  <div className="date-range">
                    <ReactDatePicker
                      dateFormat="MM/dd/yyyy"
                      isClearable={true}
                      onChange={() => { }}
                      placeholderText="----"
                      customInput={
                        <div className='calendar-wrapper'>
                          <CustomInput
                            placeholder="Select Date"
                            value=''
                          />
                          <img src={Calendar} className='calendar-icon' />
                        </div>
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <div style={{ marginBottom: ' 10px' }}>
              <CustomButton className="primary-btn" >  Confirm </CustomButton>
              <CustomButton className="secondary-btn" onClick={toggle}>Cancel</CustomButton>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ApprovalModal;


