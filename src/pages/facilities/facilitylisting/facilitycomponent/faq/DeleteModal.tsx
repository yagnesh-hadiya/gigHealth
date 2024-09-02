import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { useState } from "react";
import { Faqs } from "../../../../../types/FacilityFaqTypes";

export interface CustomDeleteBtn {
  onDelete: (selectedRows: Faqs[]) => void;
  selectedRows: Faqs[];
  faqs: Faqs[]
}

const DeleteBtnModal = ({ onDelete, selectedRows, faqs }: CustomDeleteBtn) => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const deleteToggle = () => setDeleteModal(!deleteModal)

  const handleDelete = () => {
    deleteToggle();
    onDelete(selectedRows);
  };

  return (
    <>
      <CustomButton onClick={deleteToggle} className='faq-deletebutton'>
        {(selectedRows.length > 0 && selectedRows.length < faqs.length) ? 'Delete' : 'DeleteAll'}
      </CustomButton>
      <Modal isOpen={deleteModal} toggle={deleteToggle} centered>
        <ModalHeader toggle={deleteToggle}>Deleting the entry?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this entry? You CAN NOT view
          this entry in the list anymore if you delete?
        </ModalBody>
        <ModalFooter>
          <div className="btn-wrapper">
            <CustomButton className="primary-btn" onClick={handleDelete}>
              Delete
            </CustomButton>
            <CustomButton className="secondary-btn" onClick={deleteToggle}>
              Cancel
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default DeleteBtnModal