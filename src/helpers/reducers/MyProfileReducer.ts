import {
  ActionType,
  ProfessionalMyProfileState,
} from "../../types/ProfessionalAuth";

const myProfileReducer = (
  state: ProfessionalMyProfileState,
  action: { type: ActionType; payload: any }
) => {
  switch (action.type) {
    case ActionType.SetSelectedState:
      return {
        ...state,
        selectedState: action.payload,
      };
    case ActionType.SetState:
      return {
        ...state,
        states: action.payload,
      };
    case ActionType.SetSelectedCity:
      return {
        ...state,
        selectedCity: action.payload,
      };
    case ActionType.SetCities:
      return {
        ...state,
        cities: action.payload,
      };
    case ActionType.SelectedQuestion:
      return {
        ...state,
        selectedQuestion: action.payload,
      };
    case ActionType.SetSelectedZip:
      return {
        ...state,
        selectedZip: action.payload,
      };
    case ActionType.SetZip:
      return {
        ...state,
        zip: action.payload,
      };
    case ActionType.SetBackgroundQuestion:
      return {
        ...state,
        bgQuestions: action.payload,
      };
    case ActionType.SetDocuments:
      return {
        ...state,
        documents: action.payload,
      };
    case ActionType.SetUploadedDocuments:
      return {
        ...state,
        uploadedDocuments: action.payload,
      };
    case ActionType.SetAdditionalDetails:
      return {
        ...state,
        additionalDetails: action.payload,
      };
    case ActionType.SetGenderList:
      return {
        ...state,
        gendersList: action.payload,
      };
    case ActionType.SetFederalQuestion:
      return {
        ...state,
        federalQuestions: action.payload,
      };
    case ActionType.SetEmergencyContactList:
      return {
        ...state,
        emergencyContactList: action.payload,
      };
    case ActionType.SetTalentJobDetails:
      return {
        ...state,
        talentJobDetailsList: action.payload,
      };
    case ActionType.SetRequiredDocsDetails:
      return {
        ...state,
        requiredDocsList: action.payload,
      };
    default:
      return state;
  }
};

export default myProfileReducer;
