import { Form } from "react-router-dom";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
} from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { useEffect, useState } from "react";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import {
  ActivityModalType,
  CategoryType,
  NotesActivityModalProps,
} from "../../../../../types/NotesTypes";
import {
  activityModalDropdown,
  capitalize,
  showToast,
} from "../../../../../helpers";
import {
  editActivity,
  getActivityModalCategories,
} from "../../../../../services/NotesServices";
import Loader from "../../../../../components/custom/CustomSpinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ActivityModalSchema } from "../../../../../helpers/schemas/NotesSchema";
import { useSelector } from "react-redux";
import { getName } from "../../../../../store/UserSlice";
import ACL from "../../../../../components/custom/ACL";

const NotesActivityModal = ({
  isOpen,
  toggle,
  facilityId,
  editData,
  readOnly,
  fetchNotes,
}: NotesActivityModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ActivityModalType>({
    resolver: yupResolver(ActivityModalSchema) as any,
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const userName: string = useSelector(getName);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editData && editData?.ActivityCategory?.Id !== undefined) {
      setSelectedCategory(
        editData
          ? {
              value: editData?.ActivityCategory?.Id,
              label: editData?.ActivityCategory?.Category,
            }
          : null
      );
    }
    setValue("notes", editData?.Content);
  }, [editData?.ActivityCategory]);

  useEffect(() => {
    getCategories();
  }, []);

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

  const getCategories = async () => {
    try {
      setLoading(true);
      const categories = await getActivityModalCategories();
      setCategories(categories.data?.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedCategory) {
      return showToast("error", "Please Select Category");
    }

    try {
      setLoading(true);
      const activity = await editActivity(
        Number(facilityId),
        editData?.Id,
        selectedCategory?.value,
        data.notes
      );
      showToast(
        "success",
        "Activity Edited Successfully" || activity.data?.message
      );
      setLoading(false);
      fetchNotes();
      toggle();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
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
        <ModalHeader toggle={toggle}>{`${
          readOnly ? "View Activity" : "Edit Activity"
        }`}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
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
                  isDisabled={readOnly}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12" className="col-group">
                <Label>Notes</Label>
                <CustomTextArea
                  id="notesTextArea"
                  className="fixed-height-textarea"
                  disabled={readOnly}
                  placeholder="Notes"
                  invalid={!!errors.notes}
                  {...register("notes")}
                />
                <FormFeedback>{errors.notes?.message}</FormFeedback>
              </Col>
            </Row>
            <div className="btn-wrapper">
              <ACL
                submodule={"notes"}
                module={"facilities"}
                action={["GET", "PUT"] || ["GET", "GET"]}
              >
                <CustomButton className="primary-btn" disabled={readOnly}>
                  Save
                </CustomButton>
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
