import { Form, useParams } from "react-router-dom";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormFeedback,
} from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { useEffect, useState } from "react";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import {
  capitalize,
  formatPhoneNumber,
  showToast,
} from "../../../../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ContactFormSchema } from "../../../../../helpers/schemas/ContactFormSchema";
import {
  ContactFormDataType,
  FacilityRoles,
} from "../../../../../types/FacilityContactTypes";
import {
  getFacilityRoles,
  createContact,
  editContact,
} from "../../../../../services/FacilityContacts";
import { AddNewContactsProps } from "../../../../../types/FacilityContactTypes";

const AddNewContacts = ({
  isOpen,
  toggle,
  selectedContactForEdit,
  setSelectedContactForEdit,
  fetchData,
}: AddNewContactsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormDataType>({
    resolver: yupResolver<ContactFormDataType>(ContactFormSchema),
  });
  const [, setLoading] = useState(false);
  const [facilityRoles, setFacilityRoles] = useState<FacilityRoles[]>([]);
  const [selectedRole, setSelectedRole] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const facilityDataId = useParams();

  const fetchFacilityRoles = async () => {
    try {
      setLoading(true);
      const data = await getFacilityRoles();
      setLoading(false);
      setFacilityRoles(data);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast("error", error.response.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchFacilityRoles();
  }, []);

  useEffect(() => {
    if (selectedContactForEdit) {
      const { FirstName, LastName, Title, Email, Phone, FacilityRole, Fax } =
        selectedContactForEdit;
      setValue("FirstName", capitalize(FirstName));
      setValue("LastName", capitalize(LastName));
      setValue(
        "Title",
        Title.split(" ")
          .map((word) => capitalize(word))
          .join(" ")
      );
      setValue("Phone", formatPhoneNumber(Phone));
      setValue("Email", Email);
      setValue("Fax", Fax);
      const initialRoleValue = FacilityRole
        ? {
            value: FacilityRole?.Id ?? 0,
            label: FacilityRole?.Role ?? "",
          }
        : null;

      setSelectedRole(initialRoleValue);
    } else {
      reset();
      setSelectedRole(null);
    }
  }, [selectedContactForEdit]);
  const onSubmit = async (data: ContactFormDataType) => {
    try {
      const { FirstName, LastName, Title, Email, Phone, Fax } = data;
      const phone: string = Phone.replace(/\D/g, "");

      if (!selectedRole || !selectedRole.value) {
        setLoading(false);
        showToast("error", "Role is required");
        return;
      }
      if (selectedContactForEdit) {
        const contactId = selectedContactForEdit.Id;
        setLoading(true);
        await editContact(
          FirstName,
          LastName,
          Title,
          Email,
          phone,
          Fax || null,
          selectedRole?.value,
          contactId,
          Number(facilityDataId?.Id)
        );
        setLoading(false);
        fetchData();
        setSelectedContactForEdit(null);
        toggle();
        showToast("success", "Contact updated successfully!");
      } else {
        setLoading(true);
        await createContact(
          FirstName,
          LastName,
          Title,
          Email,
          phone,
          Fax || null,
          selectedRole?.value,
          Number(facilityDataId?.Id)
        );
        setLoading(false);
        fetchData();
        reset();
        toggle();
        setSelectedRole(null);
        showToast("success", "Facility contact created successfully!");
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  const handleCloseModal = () => {
    toggle();
  };

  const handleModalClosed = () => {
    reset();
    setSelectedRole(null);
    setSelectedContactForEdit(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={handleCloseModal}
        centered={true}
        size="lg"
        onClosed={handleModalClosed}
      >
        <ModalHeader toggle={toggle}>
          {" "}
          {selectedContactForEdit ? "Edit Contact" : "Add Contact"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="6" className="col-group">
                <Label>
                  First Name <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="FirstName"
                  placeholder="First Name"
                  invalid={!!errors.FirstName}
                  {...register("FirstName")}
                />
                <FormFeedback>{errors.FirstName?.message}</FormFeedback>
              </Col>
              <Col md="6" className="col-group">
                <Label>
                  Last Name <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="LastName"
                  placeholder="Last Name"
                  invalid={!!errors.LastName}
                  {...register("LastName")}
                />
                <FormFeedback>{errors.LastName?.message}</FormFeedback>
              </Col>
              <Col md="6" className="col-group">
                <Label>
                  Title <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="Title"
                  placeholder="Title"
                  invalid={!!errors.Title}
                  {...register("Title")}
                />
                <FormFeedback>{errors.Title?.message}</FormFeedback>
              </Col>
              <Col md="6" className="col-group">
                <Label>
                  Phone <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="Phone"
                  placeholder="Phone"
                  invalid={!!errors.Phone}
                  {...register("Phone", {
                    onChange: (e) => {
                      const formattedNumber: string = formatPhoneNumber(
                        e.target.value
                      );
                      setValue("Phone", formattedNumber);
                    },
                  })}
                />
                <FormFeedback>{errors.Phone?.message}</FormFeedback>
              </Col>
              <Col md="6" className="col-group">
                <Label>
                  Email Address <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  id="Email"
                  invalid={!!errors.Email}
                  {...register("Email")}
                  placeholder="Email Address"
                />
                <FormFeedback>{errors.Email?.message}</FormFeedback>
              </Col>
              <Col md="6" className="col-group">
                <Label>Fax</Label>
                <CustomInput
                  id="Fax"
                  placeholder="Fax"
                  invalid={!!errors.Fax}
                  {...register("Fax")}
                />
                <FormFeedback>{errors.Fax?.message}</FormFeedback>
              </Col>
              <Col md="6" className="col-group">
                <Label>
                  Select Role <span className="asterisk">*</span>
                </Label>
                {/* <FormGroup> */}
                <CustomSelect
                  id="role"
                  name="role"
                  placeholder="Select Role"
                  noOptionsMessage={() => "No Role Found"}
                  isClearable={true}
                  isSearchable={true}
                  options={
                    facilityRoles?.map((role) => ({
                      value: role.Id,
                      label: role.Role,
                    })) || []
                  }
                  onChange={(selectedOption) => setSelectedRole(selectedOption)}
                  value={
                    selectedRole
                      ? {
                          value: selectedRole?.value,
                          label: selectedRole?.label,
                        }
                      : null
                  }
                />
                {/* </FormGroup> */}
              </Col>
            </Row>
            <div className="btn-wrapper">
              <CustomButton className="primary-btn">
                {" "}
                {selectedContactForEdit ? "Edit" : "Save"}{" "}
              </CustomButton>
              <CustomButton
                className="secondary-btn"
                onClick={() => {
                  reset();
                  setSelectedContactForEdit(null);
                  toggle();
                }}
              >
                Cancel
              </CustomButton>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter className="mb-3 justify-content-start">
          {/* <div className="btn-wrapper">
                                <CustomButton className="primary-btn" >Save</CustomButton>
                                <CustomButton className="secondary-btn" onClick={toggle}>Cancel</CustomButton>
                            </div> */}
        </ModalFooter>
      </Modal>
    </>
  );
};
export default AddNewContacts;
