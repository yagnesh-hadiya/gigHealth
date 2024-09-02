import { Modal, ModalBody,  ModalHeader } from "reactstrap";

const DeclineFinalModal = ({
  isOpen,
  toggle,
}: {
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
        <ModalHeader className="border-0" toggle={toggle}></ModalHeader>
        <ModalBody className="accept-offer-mdl-body">
          <p style={{ fontWeight: 600 }}>We're sad to see you decline</p>
          <p>
            A member of our team will be in touch to help find you a better fit.
          </p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeclineFinalModal;
