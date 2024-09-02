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
import CustomInput from "../../../components/custom/CustomInput";
import CustomButton from "../../../components/custom/CustomBtn";
import CustomSelect from "../../../components/custom/CustomSelect";
import CustomTextArea from "../../../components/custom/CustomTextarea";
import { ActivityModalType, CategoryType } from "../../../types/NotesTypes";
import ACL from "../../../components/custom/ACL";
import { activityModalDropdown, capitalize, showToast } from "../../../helpers";
import { useSelector } from "react-redux";
import { getName } from "../../../store/UserSlice";
import { useCallback, useEffect, useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActivityModalSchema } from "../../../helpers/schemas/NotesSchema";
import ProfessionalNotesServices from "../../../services/ProfessionalNotesServices";
import { ProfessionalActivity } from "../../../types/ProfessionalNotesTypes";

type ProfessionalActivityModalProps = {
  isOpen: boolean;
  toggle: () => void;
  professionalId: number;
  fetchNotes: () => void;
  activity?: ProfessionalActivity;
  isReadOnly?: boolean;
  editActivity?: boolean;
};

const ProfessionalActivityModal = ({
  isOpen,
  toggle,
  professionalId,
  fetchNotes,
  activity,
  isReadOnly,
  editActivity,
}: ProfessionalActivityModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ActivityModalType>({
    resolver: yupResolver(ActivityModalSchema) as any,
  });

  useEffect(() => {
    if (activity?.Content) {
      setValue("notes", activity?.Content);
    }

    if (activity?.ActivityCategory) {
      setSelectedCategory({
        value: activity?.ActivityCategory?.Id,
        label: activity?.ActivityCategory?.Category,
      });
    }
  }, [activity, setValue]);

  const userName: string = useSelector(getName);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [selectedCategory, setSelectedCategory] = useState<{
    value: number;
    label: string;
  } | null>(null);

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

  const getCategories = useCallback(async () => {
    if (isReadOnly) return;

    try {
      setLoading("loading");
      const categories =
        await ProfessionalNotesServices.getActivityCategories();
      setCategories(categories.data?.data);
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }, [isReadOnly]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const onSubmit = async (data: any) => {
    if (!selectedCategory) {
      return showToast("error", "Please Select Category");
    }

    try {
      setLoading("loading");
      const activity = await ProfessionalNotesServices.createActivity({
        professionalId: professionalId,
        data: {
          categoryId: selectedCategory.value,
          notes: data.notes,
        },
      });
      if (activity.status === 201) {
        showToast(
          "success",
          "Activity Created Successfully" || activity.data?.message
        );
        setLoading("idle");
        toggle();
        fetchNotes();
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEdit = async (data: any) => {
    if (!selectedCategory) {
      return showToast("error", "Please Select Category");
    }

    if (!activity) return;

    try {
      setLoading("loading");
      const res = await ProfessionalNotesServices.editActivity({
        professionalId: professionalId,
        activityId: activity.Id,
        data: {
          categoryId: selectedCategory.value,
          notes: data.notes,
        },
      });
      if (res.status === 200) {
        showToast("success", res.data?.message || "Activity Edit Successfully");
        setLoading("idle");
        toggle();
        fetchNotes();
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
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
        <ModalHeader toggle={toggle}>
          {editActivity ? "Edit" : isReadOnly ? "View" : "Add"} Activity
        </ModalHeader>
        <ModalBody>
          <Form>
            {loading === "loading" && <Loader />}
            <Row>
              <Col md="6" className="col-group">
                <Label>User</Label>
                <CustomInput
                  id="user"
                  placeholder=""
                  disabled={true}
                  defaultValue={userName && capitalize(userName)}
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
                  isDisabled={isReadOnly}
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
                  invalid={!!errors.notes}
                  disabled={isReadOnly}
                  {...register("notes")}
                />
                <FormFeedback>{errors.notes?.message}</FormFeedback>
              </Col>
            </Row>
            {!isReadOnly && !editActivity && (
              <div className="btn-wrapper">
                <ACL
                  submodule={"notes"}
                  module={"professionals"}
                  action={["GET", "POST"]}
                >
                  <CustomButton
                    className="primary-btn"
                    disabled={loading === "loading"}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save
                  </CustomButton>
                </ACL>
                <CustomButton className="secondary-btn" onClick={toggle}>
                  Cancel
                </CustomButton>
              </div>
            )}
            {editActivity && (
              <div className="btn-wrapper">
                <ACL
                  submodule={"notes"}
                  module={"professionals"}
                  action={["GET", "PUT"]}
                >
                  <CustomButton
                    className="primary-btn"
                    disabled={loading === "loading"}
                    onClick={handleSubmit(onEdit)}
                  >
                    Save
                  </CustomButton>
                </ACL>

                <CustomButton className="secondary-btn" onClick={toggle}>
                  Cancel
                </CustomButton>
              </div>
            )}
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ProfessionalActivityModal;
