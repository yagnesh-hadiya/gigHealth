import { useState } from "react";
import DeleteIcon from "../icons/DeleteBtn";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { CustomDeleteBtnProps } from "../../types/CustomElementTypes";
import CustomButton from "./CustomBtn";

const CustomDeleteBtn = ({ onDelete, ...props }: CustomDeleteBtnProps) => {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handleDeleteMouseEnter = () => {
    setIsDeleteHovered(true);
  };

  const handleDeleteMouseLeave = () => {
    setIsDeleteHovered(false);
  };

  const handleDelete = () => {
    toggle();
    onDelete();
  };

  if (props.allow === false) {
    return null;
  }

  return (
    <>
      <div className="custom-action-btn">
        <div
          className="btn"
          onMouseEnter={handleDeleteMouseEnter}
          onMouseLeave={handleDeleteMouseLeave}
          onClick={toggle}
        >
          <DeleteIcon color={isDeleteHovered ? "#FFF" : "#717B9E"} />
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Deleting the entry?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this entry? You CAN NOT view this
          entry in list anymore if you delete?
        </ModalBody>
        <ModalFooter>
          <div className="btn-wrapper">
            <CustomButton className="primary-btn" onClick={handleDelete}>
              Delete
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

export default CustomDeleteBtn;
