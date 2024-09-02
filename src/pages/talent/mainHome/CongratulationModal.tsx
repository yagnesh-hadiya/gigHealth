import { Modal, ModalHeader, ModalBody } from "reactstrap";
import CongratulationImg from "../../../assets/images/congratulation-mdl.png";

const CongratulationModal = ({
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
        wrapClassName="talent-modal-wrapper congratulation-mdl"
        scrollable={true}
      >
        <ModalHeader className="border-0" toggle={toggle}></ModalHeader>
        <ModalBody className="accept-offer-mdl-body">
          <div className="d-flex justify-content-center align-items-center">
            <div className="img-wr">
              <img src={CongratulationImg} alt="congratulations" />
            </div>
          </div>
          <h3>Congratulations!</h3>
          <p>
            A member of our Program Team will be in touch to finalize your
            placement.
          </p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CongratulationModal;
