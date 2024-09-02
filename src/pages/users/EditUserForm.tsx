import { Form, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, FormFeedback, Label, Row } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import CustomSelect from "../../components/custom/CustomSelect";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUserSchema } from "../../helpers/schemas/UserSchema";
import { useForm } from "react-hook-form";
import { capitalize, formatPhoneNumber, showToast } from "../../helpers";
import { editUser, getCities, getStates, getUserRoles } from "../../services/user";
import { UserType } from "../../types/UserTypes";
import Loader from "../../components/custom/CustomSpinner";
import CustomMainCard from "../../components/custom/CustomCard";

const EditUserForm = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<UserType>({
        resolver: yupResolver(editUserSchema) as any
    })
    const { userId } = useParams();
    const userIdNumber: number | undefined = userId ? parseInt(userId) : undefined;
    const navigate = useNavigate();
    const userData = useLocation();

    const { State, City, Role } = userData?.state || {};

    const [selectedRole, setSelectedRole] = useState<{ value: number; label: string } | null>(
        Role ? { value: Role?.Id, label: Role?.Role } : null);

    const [selectedState, setSelectedState] = useState<{ value: number; label: string } | null>(
        State ? { value: State, label: State } : null
    );
    const [selectedCity, setSelectedCity] = useState<{ value: number; label: string } | null>(
        City ? { value: City, label: City } : null
    );
    const [roles, setRoles] = useState<{ Id: number; Role: string }[]>([]);
    const [states, setStates] = useState<{ Id: number; Code: string; State: string }[]>([]);
    const [cities, setCities] = useState<{ Id: number; City: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getRoles = async (): Promise<void> => {
        const roles = await getUserRoles();
        setRoles(roles?.data?.data);
    }

    useEffect(() => {
        getRoles();
    }, [])

    const handleStateChange = async (selectedOption: { value: number; label: string } | null): Promise<void> => {
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
                const stateId: number = selectedOption?.value;

                setLoading(true);
                const response = await getCities(stateId);
                setLoading(false);
                setCities(response?.data?.data);
            }
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    const handleCityChange = (selectedOption: { value: number, label: string } | null): void => {
        if (selectedOption === null) {
            setSelectedCity(null);
        }
        setSelectedCity(selectedOption);
    }

    useEffect(() => {
        if (userData?.state) {
            const { FirstName, LastName, Email, Phone, Address, Zip } = userData.state;
            setValue("FirstName", capitalize(FirstName));
            setValue("LastName", capitalize(LastName));
            setValue("Email", Email);
            setValue("Phone", formatPhoneNumber(Phone));
            setValue("Address", Address);
            setValue("Zip", Zip);
        }
    }, [userData]);

    useEffect(() => {
        const fetchStateAndCities = async (): Promise<void> => {
            try {
                setLoading(true);
                const statesResponse = await getStates();
                setLoading(false);
                setStates(statesResponse?.data?.data);

            } catch (error: any) {
                console.error(error);
                setLoading(false);
                showToast('error', error?.response?.data?.message || 'Something went wrong');
            }
        }
        fetchStateAndCities()
    }, [])

    const onSubmit = async (data: UserType): Promise<void> => {
        const { FirstName, LastName, Email, Phone, Address, Zip }: UserType = data;
        const State: string | undefined = selectedState?.label
        const City: string | undefined = selectedCity?.label
        const Role: number | undefined = selectedRole?.value
        const phone: string = Phone.replace(/\D/g, '');

        if (!State) {
            showToast('error', "Please select state");
            return;
        }
        if (!City) {
            showToast('error', "Please select city");
            return;
        }
        if (!Role) {
            showToast('error', "Please select role");
            return;
        }
        try {
            if (userIdNumber !== undefined) {
                await editUser(FirstName, LastName, Email, phone, Address, State, City, Zip, Role, userIdNumber);
                showToast('success', 'User edited successfully');
                setTimeout(() => {
                    navigate('/users');
                }, 1500);
            } else {
                showToast('error', 'Invalid userId');
            }
        } catch (error: any) {
            console.error(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    const handleRoleChange = async (role: { value: number, label: string } | null): Promise<void> => {
        try {
            if (role === null) {
                setSelectedRole(null);
                return;
            }
            setSelectedRole(role);
        } catch (error: any) {
            console.error(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <>
            <div className="navigate-wrapper">
                <Link to="/users" className="link-btn">
                    Manage Users
                </Link>
                <span> / </span>
                <span>Edit User</span>
            </div>
            <CustomMainCard>
                <h2 className="page-content-header">Basic Information</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {loading && <Loader />}
                    <Row>
                        <Col md="6" lg="4" className="col-group">
                            <Label className="">
                                First Name <span className="asterisk">*</span>
                            </Label>
                            <CustomInput
                                id="FirstName"
                                placeholder="First Name"
                                invalid={!!errors.FirstName}
                                {...register("FirstName")} />
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
                                {...register("LastName")} />
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
                                        const formattedNumber: string = formatPhoneNumber(e.target.value);
                                        setValue("Phone", formattedNumber);
                                    }
                                })} />
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
                                {...register("Email")} />
                            <FormFeedback>{errors.Email?.message}</FormFeedback>
                        </Col>
                        <Col md="6" lg="4" className="col-group">
                            <Label>
                                Assign Role <span className="asterisk">*</span>
                            </Label>
                            <CustomSelect
                                id="Role"
                                name="Role"
                                value={selectedRole
                                    ? {
                                        value: selectedRole.value,
                                        label: selectedRole.label
                                            ? selectedRole.label
                                                .split(' ')
                                                .map(word => capitalize(word))
                                                .join(' ')
                                            : ''
                                    }
                                    : null}
                                onChange={(role) => handleRoleChange(role)}
                                placeholder="Select Role"
                                options={roles.map((role: { Id: number; Role: string; }): { value: number; label: string; } => ({
                                    value: role?.Id, label:
                                        role?.Role
                                            .split(' ')
                                            .map((word: string) => capitalize(word))
                                            .join(' ')

                                }))}
                                noOptionsMessage={(): string => "No Role Found"}
                                isClearable={true}
                                isSearchable={true} />
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
                                {...register("Address")} />
                            <FormFeedback>{errors.Address?.message}</FormFeedback>
                        </Col>
                        <Col  md="6" lg="2"  className="col-group">
                            <Label>
                                State <span className="asterisk">*</span>
                            </Label>
                            <CustomSelect
                                id="State"
                                name="State"
                                value={selectedState}
                                onChange={(state): Promise<void> => handleStateChange(state)}
                                options={states.map((state: { Id: number; State: string; Code: string; }): { value: number; label: string; } => ({
                                    value: state?.Id,
                                    label: `${state?.State} (${state?.Code})`,
                                }))}
                                placeholder="Select State"
                                noOptionsMessage={(): string => "No State Found"}
                                isSearchable={true}
                                isClearable={true} />
                        </Col>
                        <Col  md="6" lg="2"  className="col-group">
                            <Label>
                                City <span className="asterisk">*</span>
                            </Label>
                            <CustomSelect
                                id="City"
                                name="City"
                                value={selectedCity}
                                onChange={(city): void => handleCityChange(city)}
                                options={cities.map((city: { Id: number; City: string; }): { value: number; label: string; } => ({ value: city?.Id, label: city?.City }))}
                                placeholder="Select City"
                                noOptionsMessage={(): string => "No City Found"}
                                isClearable={true}
                                isSearchable={true}
                                isDisabled={!selectedState} />
                        </Col>
                            <Col md="6" lg="4" className="col-group">
                            <Label className="">
                                Zip Code <span className="asterisk">*</span>
                            </Label>
                            <CustomInput
                                id="Zip"
                                placeholder="Zip"
                                invalid={!!errors.Zip}
                                {...register("Zip")} />
                            <FormFeedback>{errors.Zip?.message}</FormFeedback>
                        </Col>
                    </Row>
                    <div className="btn-wrapper">
                        <CustomButton className="primary-btn">Save</CustomButton>
                        <Link to='/users'>
                            <CustomButton className="secondary-btn">Cancel</CustomButton>
                        </Link>
                    </div>
                </Form>
            </CustomMainCard>
        </>
    );
};

export default EditUserForm;