import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { WithdrawModalProps } from "../../../types/TalentJobs";
import CustomButton from "../../../components/custom/CustomBtn";

const WithdrawModal = ({ isOpen, toggle, onWithdraw }: WithdrawModalProps) => {
  const handleDelete = () => {
    toggle();
    onWithdraw();
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Withdraw the job?</ModalHeader>
        <ModalBody>
          Are you sure you want to withdraw this application?
        </ModalBody>
        <ModalFooter>
          <div className="btn-wrapper">
            <CustomButton className="primary-btn" onClick={handleDelete}>
              Withdraw
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
export default WithdrawModal;
