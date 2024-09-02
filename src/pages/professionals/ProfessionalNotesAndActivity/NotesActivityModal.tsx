import { Form } from "react-router-dom";
import { Col, Row, Modal, ModalHeader, ModalBody, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomButton from "../../../components/custom/CustomBtn";
import { useState } from "react";
import CustomSelect from "../../../components/custom/CustomSelect";
import CustomTextArea from "../../../components/custom/CustomTextarea";
import { CategoryType } from "../../../types/NotesTypes";
import { activityModalDropdown, capitalize } from "../../../helpers";

import Loader from "../../../components/custom/CustomSpinner";
import { useSelector } from "react-redux";
import { getName } from "../../../store/UserSlice";
import ACL from "../../../components/custom/ACL";
import { ProfNotesActivityModalProps } from "../../../types/ProfessionalTypes";

const NotesActivityModal = ({
  isOpen,
  toggle,
}: ProfNotesActivityModalProps) => {
  const [categories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const userName: string = useSelector(getName);
  const [loading] = useState<boolean>(false);

  const handleCategoryChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setSelectedCategory(
      selectedOption && {
        value: selectedOption.value,
        label: selectedOption.label,
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="lg"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>fdgfdgdfbh</ModalHeader>
        <ModalBody>
          <Form>
            {loading && <Loader />}
            <Row>
              <Col md="6" className="col-group">
                <Label>User</Label>
                <CustomInput
                  id="user"
                  placeholder=""
                  disabled={true}
                  value={userName && capitalize(userName)}
                  className="user-field-color"
                />
              </Col>
              <Col md="6" className="col-group">
                <Label>Select Category</Label>
                <CustomSelect
                  id="category"
                  styles={activityModalDropdown}
                  name="category"
                  placeholder="Select Category"
                  noOptionsMessage={() => "No Category Found"}
                  isClearable={true}
                  isSearchable={true}
                  options={categories?.map(
                    (category: {
                      Id: number;
                      Category: string;
                    }): { value: number; label: string } => ({
                      value: category?.Id,
                      label: category?.Category,
                    })
                  )}
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12" className="col-group">
                <Label>Notes</Label>
                <CustomTextArea
                  id="notesTextArea"
                  className="fixed-height-textarea"
                  placeholder="Notes"
                />
              </Col>
            </Row>
            <div className="btn-wrapper">
              <ACL
                submodule={"notes"}
                module={"facilities"}
                action={["GET", "PUT"] || ["GET", "GET"]}
              >
                <CustomButton className="primary-btn">Save</CustomButton>
              </ACL>
              <CustomButton className="secondary-btn" onClick={toggle}>
                Cancel
              </CustomButton>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default NotesActivityModal;
