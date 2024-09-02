import {
  ActionType,
  ProfessionalRegisterFormState,
} from "../../types/ProfessionalAuth";

const professionalFormReducer = (
  state: ProfessionalRegisterFormState,
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
    case ActionType.SetProfession:
      return {
        ...state,
        profession: action.payload,
      };
    case ActionType.SetSelectedProfession:
      return {
        ...state,
        selectedProfession: action.payload,
      };
    case ActionType.SetSelectedSpecialities:
      return {
        ...state,
        selectedSpecialities: action.payload,
      };
    case ActionType.SetSpeciality:
      return {
        ...state,
        speciality: action.payload,
      };
    case ActionType.SetPreferredLocations:
      return {
        ...state,
        preferredLocations: action.payload,
      };
    case ActionType.SetIsChecked:
      return {
        ...state,
        isChecked: action.payload,
      };
    default:
      return state;
  }
};

export default professionalFormReducer;
