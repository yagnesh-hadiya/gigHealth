import { Modal, ModalBody, Button } from "reactstrap";

const DeclineModal = ({
  onSubmit,
  isOpen,
  toggle,
}: {
  onSubmit: () => void;
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        wrapClassName="talent-modal-wrapper accept-offer-details"
        scrollable={true}
      >
        <ModalBody className="accept-offer-mdl-body">
          <p style={{ fontWeight: 600, marginBottom: "20px" }}>
            Are you sure you wish to decline this offer?
          </p>

          <div className="button-wr">
            <Button className="blue-gradient-btn mb-0" onClick={onSubmit}>
              Yes
            </Button>
            <Button
              outline
              className="purple-outline-btn mb-0"
              onClick={toggle}
            >
              No
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeclineModal;
