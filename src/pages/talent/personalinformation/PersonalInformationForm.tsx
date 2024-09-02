import { Form } from "react-router-dom";
import { Button, Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import ReactDatePicker from "react-datepicker";
import { useEffect, useReducer, useState } from "react";
import moment from "moment";
import Calendar from "../../../assets/images/calendar.svg";
import CustomSelect from "../../../components/custom/CustomSelect";
import ContactCard from "./ContactCard";
import EmergencyContactModal from "./EmergenyContactModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PersonalInformationSchema } from "../../../helpers/schemas/PersonalInformation";
import {
  CreatePersonalInformationType,
  PersonalInformationType,
} from "../../../types/PersonalInformation";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import {
  getEmergencyContactList,
  getFederalQuestions,
  getGenderList,
  updatePersonalInformation,
} from "../../../services/PersonalInformation";
import { SelectOption } from "../../../types/FacilityTypes";
import myProfileReducer from "../../../helpers/reducers/MyProfileReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthDetails,
  setAuthDetails,
} from "../../../store/ProfessionalAuthStore";
import {
  getProfessionalProfile,
  getProfessionalStates,
} from "../../../services/ProfessionalAuth";
import {
  ActionType,
  EmergencyContactDetailType,
  GenderListType,
} from "../../../types/ProfessionalAuth";
import FederalQuestionsCard from "./FederalQuestionCards";

const PersonalInformationForm = () => {
  const initialState = {
    selectedState: null,
    selectedCity: null,
    selectedZip: null,
    states: [],
    cities: [],
    zip: [],
    selectedQuestion: null,
    bgQuestions: [],
    documents: [],
    uploadedDocuments: [],
    additionalDetails: [],
    gendersList: [],
    federalQuestions: [],
    emergencyContactList: [],
    talentJobDetailsList: [],
    requiredDocsList: [],
  };

  const [dob, setDob] = useState<Date | null>(null);
  const [emergencyModal, setEmergencyModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [selectedGender, setSelectedGender] = useState<SelectOption | null>(
    null
  );
  const [edit, setEdit] = useState<boolean>(false);
  const [fetch, setFetch] = useState<boolean>(false);
  const [state, dispatch] = useReducer(myProfileReducer, initialState);
  const profileDetails = useSelector(getAuthDetails);
  const dispatchStore = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PersonalInformationType>({
    resolver: yupResolver(PersonalInformationSchema) as any,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("loading");
        const [genderList, federalList, contactList, stateList] =
          await Promise.allSettled([
            getGenderList(),
            getFederalQuestions(),
            getEmergencyContactList(),
            getProfessionalStates(),
          ]);

        if (genderList.status === "fulfilled") {
          dispatch({
            type: ActionType.SetGenderList,
            payload: genderList.value?.data?.data,
          });
        }
        if (federalList.status === "fulfilled") {
          dispatch({
            type: ActionType.SetFederalQuestion,
            payload: federalList.value?.data?.data,
          });
        }
        if (contactList.status === "fulfilled") {
          dispatch({
            type: ActionType.SetEmergencyContactList,
            payload: contactList.value?.data?.data,
          });
        }
        if (stateList.status === "fulfilled") {
          dispatch({
            type: ActionType.SetState,
            payload: stateList.value?.data?.data,
          });
        }
        setLoading("idle");
      } catch (error: any) {
        console.error(error);
        setLoading("error");
        showToast("error", "Something went wrong");
      }
    };

    fetchData().catch((error) => {
      console.error("Error fetching data:", error);
      setLoading("idle");
    });
  }, []);

  useEffect(() => {
    const fetchValue = async () => {
      try {
        const response = await getProfessionalProfile();
        const contactList = await getEmergencyContactList();
        if (response.status === 200) {
          dispatchStore(setAuthDetails(response.data?.data));
        }
        if (contactList.status === 200) {
          dispatch({
            type: ActionType.SetEmergencyContactList,
            payload: contactList?.data?.data,
          });
        }
      } catch (error: any) {
        console.error(error);
        setLoading("idle");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };
    fetchValue();
  }, [fetch]);

  useEffect(() => {
    setValue("ssn", profileDetails[0]?.Ssn ? profileDetails[0]?.Ssn : "");
    setDob(profileDetails[0]?.Dob ? new Date(profileDetails[0]?.Dob) : null);
    if (profileDetails[0]?.Gender) {
      setSelectedGender({
        value: profileDetails[0]?.Gender?.Id,
        label: profileDetails[0]?.Gender?.Gender,
      });
    } else {
      setSelectedGender(null);
    }
  }, [profileDetails]);

  const toggleEmergencyModal = () => setEmergencyModal((prev) => !prev);

  const handleGender = (selectedOption: SelectOption | null) => {
    if (selectedOption === null) {
      setSelectedGender(null);
    }
    if (selectedOption) {
      setSelectedGender({
        value: selectedOption?.value,
        label: selectedOption?.label,
      });
    }
  };

  const onSubmit = async (data: CreatePersonalInformationType) => {
    if (data?.ssn === "" && !selectedGender?.value && !dob) {
      return showToast("error", "At least one field is required to update");
    }

    try {
      setLoading("loading");
      const personalInformationData = {
        ssn: data?.ssn ? data?.ssn : null,
        dob: dob ? moment(dob).format("YYYY-MM-DD") : null,
        genderId: selectedGender ? selectedGender?.value : null,
      };

      const response = await updatePersonalInformation(personalInformationData);
      if (response.status === 200) {
        // showToast(
        //   "success",
        //   "Personal information updated successfully" || response.data?.message
        // );
        setEdit((prev) => !prev);
        setFetch((prev) => !prev);
      }

      setLoading("idle");
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
      {loading === "loading" && <Loader />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex align-items-center gap-10 flex-wrap mb-3">
          <h3 className="main-title mb-0">Personal Information</h3>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={() => setEdit((prev) => !prev)}
          >
            <span className="material-symbols-outlined">Edit</span>
          </Button>
        </div>
        <Row>
          <Col xl="2" lg="4" sm="6" className="col-group">
            <div className="accented-date-picker">
              <Label className="">Date of Birth</Label>
              <ReactDatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                timeIntervals={15}
                dateFormat="h:mm aa"
                isClearable={true}
                className="custom-select-picker-all contract-select"
                disabled={!edit}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      value={
                        dob
                          ? moment(dob.toDateString()).format("MM-DD-YYYY")
                          : ""
                      }
                      placeholder="Date of Birth"
                      disabled={!edit}
                    />
                    {!dob && <img src={Calendar} className="calendar-icon" />}
                  </div>
                }
              />
            </div>
          </Col>
          <Col xl="2" lg="4" sm="6">
            <div className="mb-3">
              <Label for="gender_drp">Gender</Label>
              <CustomSelect
                value={selectedGender}
                id="gender_drp"
                placeholder="Select Gender"
                isClearable={true}
                isSearchable={true}
                isDisabled={!edit}
                onChange={(gender) => handleGender(gender)}
                name=""
                noOptionsMessage={() => ""}
                options={state?.gendersList?.map((item: GenderListType) => ({
                  value: item?.Id,
                  label: item?.Gender,
                }))}
              />
            </div>
          </Col>
          <Col xl="4" lg="4" sm="6">
            <FormGroup>
              <Label for="ssn_input">SSN</Label>
              <CustomInput
                type="text"
                placeholder="SSN"
                id="ssn_input"
                invalid={!!errors.ssn}
                {...register("ssn")}
                disabled={!edit}
              />
              <FormFeedback>{errors.ssn?.message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col xl="4" lg="4" sm="6">
            <FormGroup>
              <Label for="referral_id">Professional/Referral ID</Label>
              <CustomInput
                type="text"
                placeholder="Professional/Referral ID"
                id="referral_id"
                value={`PID-${
                  profileDetails[0]?.Id ? profileDetails[0]?.Id : "-"
                }`}
                disabled
              />
            </FormGroup>
          </Col>
          <Col sm="12">
            <div className="mb-2" style={{ gap: "12px" }}>
              <Button
                className="blue-gradient-btn login-btn register-btn"
                disabled={!edit}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
      <Col sm="12">
        <div className="d-flex align-items-center justify-content-between flex-wrap mt-4">
          <h3 className="main-title mb-3">Emergency Contact Details</h3>
          <Button
            outline
            className="purple-outline-btn"
            onClick={() => toggleEmergencyModal()}
          >
            Add Emergency Contact
          </Button>
        </div>
      </Col>

      {state?.emergencyContactList &&
        state?.emergencyContactList?.length > 0 &&
        state?.emergencyContactList?.map(
          (item: EmergencyContactDetailType, index: number) => {
            return (
              <ContactCard
                {...item}
                key={item?.Id}
                index={index + 1}
                state={state}
                dispatch={dispatch}
                setFetch={setFetch}
              />
            );
          }
        )}

      <FederalQuestionsCard state={state} setFetch={setFetch} />

      {emergencyModal && (
        <EmergencyContactModal
          isOpen={emergencyModal}
          toggle={() => {
            setEmergencyModal(false);
            dispatch({ type: ActionType.SetSelectedState, payload: null });
            dispatch({ type: ActionType.SetSelectedCity, payload: null });
            dispatch({ type: ActionType.SetSelectedZip, payload: null });
          }}
          state={state}
          dispatch={dispatch}
          setFetch={setFetch}
        />
      )}
    </>
  );
};

export default PersonalInformationForm;
