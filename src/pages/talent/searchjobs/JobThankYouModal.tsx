import { Button, Modal, ModalBody } from "reactstrap";

const JobThankYouModal = ({ isOpen, toggle }: any) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="md"
        wrapClassName="thank-you-modal-wrapper"
      >
        <ModalBody
          className="confirm-modal-body"
          style={{ backgroundColor: "#fff" }}
        >
          <div className="modal-circle-animation">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="svg-success"
              viewBox="0 0 24 24"
            >
              <g
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
              >
                <circle
                  className="success-circle-outline"
                  cx="12"
                  cy="12"
                  r="11.5"
                />
                <circle
                  className="success-circle-fill"
                  cx="12"
                  cy="12"
                  r="11.5"
                />
                <polyline
                  className="success-tick"
                  points="17,8.5 9.5,15.5 7,13"
                />
              </g>
            </svg>
          </div>
          <div className="modal-text-wr">
            <h3>Thank You! For your Application</h3>
            <p>A member of our Program Team will be in touch.</p>
          </div>
          <div className="modal-btn-wr mb-3 pt-1">
            <Button
              className="yellow-btn me-3 mb-0"
              style={{ height: "34px", width: "110px" }}
              onClick={toggle}
            >
              Okay
            </Button>
            <Button
              outline
              className="purple-outline-btn mb-0"
              style={{ width: "110px" }}
              onClick={toggle}
            >
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default JobThankYouModal;
