import { Modal, ModalBody } from "reactstrap";

type ConfirmModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

const ConfirmModal = (props: ConfirmModalProps) => {
  const { show, onClose, onConfirm, title, message } = props;
  return (
    <Modal show={show} onHide={onClose} centered>
      <ModalBody>
        <h5>{title}</h5>
        <p>{message}</p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;
