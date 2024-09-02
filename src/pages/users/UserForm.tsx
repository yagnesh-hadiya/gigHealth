import { Form, Link, useNavigate } from "react-router-dom";
import { Col, FormFeedback, Label, Row } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import CustomSelect from "../../components/custom/CustomSelect";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserSchema } from "../../helpers/schemas/UserSchema";
import { useForm } from "react-hook-form";
import { capitalize, formatPhoneNumber, showToast } from "../../helpers";
import {
  addUser,
  getCities,
  getStates,
  getUserRoles,
} from "../../services/user";
import { UserType } from "../../types/UserTypes";
// import { SelectOption } from "../../types/FacilityTypes";
// import { getFacilityZipCode } from "../../services/facility";

const UserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserType>({
    resolver: yupResolver(addUserSchema) as any,
  });

  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  // const [selectedZip, setSelectedZip] = useState<SelectOption | null>(null);
  const [roles, setRoles] = useState<{ Id: number; Role: string }[]>([]);
  const [states, setStates] = useState<
    { Id: number; State: string; Code: string }[]
  >([]);
  const [cities, setCities] = useState<{ Id: number; City: string }[]>([]);
  // const [zip, setZip] = useState<{ Id: number; ZipCode: string }[]>([]);
  const [, setLoading] = useState<boolean>(false);

  const getRoles = async () => {
    const roles = await getUserRoles();
    setRoles(roles?.data?.data);
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleStateChange = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    try {
      if (selectedOption === null) {
        setSelectedState(null);
        setSelectedCity(null);
        return;
      }
      if (selectedOption) {
        setSelectedState({
          value: selectedOption.value,
          label: selectedOption.label,
        });
        setSelectedCity(null);
        const stateId: number = selectedOption.value;

        setLoading(true);
        const response = await getCities(stateId);
        setCities(response?.data?.data);
        setLoading(false);
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

  const handleCityChange = (
    selectedOption: { value: number; label: string } | null
  ): void => {
    if (selectedOption === null) {
      setSelectedCity(null);
    } else {
      setSelectedCity(selectedOption);
    }
  };

  // const handleCityChange = async (selectedOption: { value: number, label: string } | null) => {
  //   try {
  //     if (selectedOption === null) {
  //       setSelectedCity(null);
  //       setSelectedZip(null);
  //       return
  //     }
  //     if (selectedOption) {
  //       setSelectedCity({
  //         value: selectedOption.value,
  //         label: selectedOption.label
  //       });

  //       setSelectedZip(null);
  //       const cityId: number = selectedOption.value;

  //       setLoading(true);
  //       const response = await getFacilityZipCode(cityId);
  //       setZip(response?.data?.data);
  //       setLoading(false);
  //     }
  //   } catch (error: any) {
  //     console.error(error);
  //     setLoading(false)
  //     showToast('error', error?.response?.data?.message || 'Something went wrong');
  //   }
  // }

  useEffect(() => {
    const fetchStateAndCities = async () => {
      try {
        const statesResponse = await getStates();
        setStates(statesResponse?.data?.data);
      } catch (error: any) {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };
    fetchStateAndCities();
  }, []);

  const onSubmit = async (data: UserType) => {
    const { FirstName, LastName, Email, Phone, Address, Zip }: UserType = data;
    const State: string | undefined = selectedState?.label;
    const City: string | undefined = selectedCity?.label;
    const Role: number | undefined = selectedRole?.value;
    const phone: string = Phone.replace(/\D/g, "");

    if (!State) {
      showToast("error", "Please select state");
      return;
    }
    if (!City) {
      showToast("error", "Please select city");
      return;
    }
    if (!Role) {
      showToast("error", "Please select role");
      return;
    }
    try {
      setLoading(true);
      const user = await addUser(
        FirstName,
        LastName,
        Email,
        phone,
        Address,
        State,
        City,
        Zip,
        Role
      );
      setLoading(false);
      showToast("success", "User created successfully" || user?.data?.message);
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleRoleChange = (role: { value: number; label: string } | null) => {
    try {
      if (role === null) {
        setSelectedRole(null);
        return;
      }
      setSelectedRole(role);
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <h2 className="page-content-header">Basic Information</h2>
      {/* {loading && <Loader />} */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" lg="4" className="col-group">
            <Label className="">
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
          <Col md="6" lg="4" className="col-group">
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
          <Col md="6" lg="4" className="col-group">
            <Label>
              Phone <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="Phone"
              placeholder="Phone Number"
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
          <Col md="6" lg="4" className="col-group">
            <Label className="">
              Email Address <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="Email"
              placeholder="Email"
              invalid={!!errors.Email}
              {...register("Email")}
            />
            <FormFeedback>{errors.Email?.message}</FormFeedback>
          </Col>
          <Col md="6" lg="4" className="col-group">
            <Label>
              Assign Role <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id="Role"
              name="Role"
              value={selectedRole}
              onChange={(role) => handleRoleChange(role)}
              placeholder="Select Role"
              options={roles.map(
                (role: {
                  Id: number;
                  Role: string;
                }): { value: number; label: string } => ({
                  value: role?.Id,
                  label: role?.Role.split(" ")
                    .map((word) => capitalize(word))
                    .join(" "),
                })
              )}
              noOptionsMessage={(): string => "No Role Found"}
              isClearable={true}
              isSearchable={true}
            />
          </Col>
          <h2 className="page-content-header">Address</h2>
          <Col md="6" lg="4" className="col-group">
            <Label className="">
              Address Line <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="Address"
              placeholder="Address"
              invalid={!!errors.Address}
              {...register("Address")}
            />
            <FormFeedback>{errors.Address?.message}</FormFeedback>
          </Col>
          <Col md="6" lg="4" className="col-group">
            <Label>
              State <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id="State"
              name="State"
              value={selectedState}
              onChange={(state) => handleStateChange(state)}
              options={states.map(
                (state: {
                  Id: number;
                  State: string;
                  Code: string;
                }): { value: number; label: string } => ({
                  value: state?.Id,
                  label: `${state?.State} (${state?.Code})`,
                })
              )}
              placeholder="Select State"
              noOptionsMessage={(): string => "No State Found"}
              isSearchable={true}
              isClearable={true}
            />
          </Col>
          <Col md="6" lg="2" className="col-group">
            <Label>
              City <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id="City"
              name="City"
              value={selectedCity}
              onChange={(city) => handleCityChange(city)}
              options={cities.map(
                (city: {
                  Id: number;
                  City: string;
                }): { value: number; label: string } => ({
                  value: city?.Id,
                  label: city?.City,
                })
              )}
              placeholder="Select City"
              noOptionsMessage={(): string => "No City Found"}
              isClearable={true}
              isSearchable={true}
              isDisabled={!selectedState}
            />
          </Col>
          <Col md="6" lg="2" className="col-group">
            <Label className="">
              Zip Code <span className="asterisk">*</span>
            </Label>
            <CustomInput
              id="Zip"
              placeholder="Zip"
              invalid={!!errors.Zip}
              {...register("Zip")}
            />
            <FormFeedback>{errors.Zip?.message}</FormFeedback>
          </Col>
          {/* <Col xxl="2" xl="2" lg="3" md="6" className="col-group">
            <Label className="">
              Zip Code <span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id="Zip"
              name="Zip"
              value={selectedZip}
              onChange={(zipcode) => handleZipChange(zipcode)}
              options={zip.map((zipCode: { Id: number, ZipCode: string }): { value: number; label: string } => ({ value: zipCode?.Id, label: zipCode?.ZipCode }))}
              placeholder="Select Zip"
              noOptionsMessage={(): string => "No Zip Found"}
              isClearable={true}
              isSearchable={true}
              isDisabled={!selectedCity}
            />
          </Col> */}
        </Row>
        <div className="btn-wrapper">
          <CustomButton className="primary-btn">Save</CustomButton>
          <Link to="/users">
            <CustomButton className="secondary-btn">Cancel</CustomButton>
          </Link>
        </div>
      </Form>
    </>
  );
};

export default UserForm;
