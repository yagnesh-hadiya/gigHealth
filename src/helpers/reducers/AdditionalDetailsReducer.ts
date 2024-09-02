import { ActionType } from "../../types/ProfessionalAuth";
import { AdditionalDetailsState } from "../../types/ProfessionalDocumentType";

const additionalDetailsReducer = (
  state: AdditionalDetailsState,
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
    case ActionType.SetAdditionalDetails:
      return {
        ...state,
        additionalDetails: action.payload,
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
    case ActionType.SetGigList:
      return {
        ...state,
        gigList: action.payload,
      };
    default:
      return state;
  }
};

export default additionalDetailsReducer;
