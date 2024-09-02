import { ActionTypes, FacilityState } from "../../types/FacilityTypes";

const facilityReducer = (state: FacilityState, action: { type: ActionTypes, payload: any }) => {
    switch (action.type) {
        case ActionTypes.SetSelectedFacility:
            return {
                ...state,
                selectedFacility: action.payload
            };
        case ActionTypes.SetFacility:
            return {
                ...state,
                facility: action.payload
            };
        case ActionTypes.SetSelectedContract:
            return {
                ...state,
                selectedContract: action.payload
            };
        case ActionTypes.SetSelectedService:
            return {
                ...state,
                selectedService: action.payload
            };
        case ActionTypes.SetContracts:
            return {
                ...state,
                contracts: action.payload
            };
        case ActionTypes.SetServices:
            return {
                ...state,
                services: action.payload
            };
        case ActionTypes.SetSelectedTrauma:
            return {
                ...state,
                selectedTrauma: action.payload
            };
        case ActionTypes.SetTraumas:
            return {
                ...state,
                traumas: action.payload
            };
        case ActionTypes.SetSelectedState:
            return {
                ...state,
                selectedState: action.payload
            };
        case ActionTypes.SetStates:
            return {
                ...state,
                states: action.payload
            };
        case ActionTypes.SetSelectedCity:
            return {
                ...state,
                selectedCity: action.payload
            };
        case ActionTypes.SetCities:
            return {
                ...state,
                cities: action.payload
            };
        case ActionTypes.SetSelectedProgramManager:
            return {
                ...state,
                selectedProgramManager: action.payload
            };
        case ActionTypes.SetProgramManagers:
            return {
                ...state,
                programManagers: action.payload
            };
        case ActionTypes.SetRoles:
            return {
                ...state,
                roles: action.payload
            };
        case ActionTypes.SetSelectedRole:
            return {
                ...state,
                selectedRole: action.payload
            };
        case ActionTypes.SetSelectedRole2:
            return {
                ...state,
                selectedRole2: action.payload
            };
        case ActionTypes.SetSelectedZip:
            return {
                ...state,
                selectedZip: action.payload
            };
        case ActionTypes.SetZip:
            return {
                ...state,
                zip: action.payload
            };
        case ActionTypes.SetHealthSystem:
            return {
                ...state,
                healthSystem: action.payload
            };
        case ActionTypes.SetSelectedHealth:
            return {
                ...state,
                selectedHealth: action.payload
            };
        case ActionTypes.SetFacilityId:
            return {
                ...state,
                facilityId: action.payload
            };
        case ActionTypes.SetSystemHealthId:
            return {
                ...state,
                systemHealthId: action.payload
            };
        case ActionTypes.SetSelectedFacilityType:
            return {
                ...state,
                selectedFacilityType: action.payload
            };
        case ActionTypes.SetTeachingHospital:
            return {
                ...state,
                teachingHospital: action.payload
            };
        default:
            return state;
    }
}

export default facilityReducer;