import { JobActions, JobState } from "../../types/JobTemplateTypes";

const jobTemplateReducer = (state: JobState, action: { type: JobActions, payload: any }) => {
    switch (action.type) {
        case JobActions.SetSelectedTemplate:
            return {
                ...state,
                selectedTemplate: action.payload
            };
        case JobActions.SetSelectedProfession:
            return {
                ...state,
                selectedProfession: action.payload
            };
        case JobActions.SetSelectedSpecialities:
            return {
                ...state,
                selectedSpecialities: action.payload
            };
        case JobActions.SetSelectedContract:
            return {
                ...state,
                selectedContract: action.payload
            };
        case JobActions.SetSelectedJobStatus:
            return {
                ...state,
                selectedJobStatus: action.payload
            };
        case JobActions.SetSelectedEmploymentType:
            return {
                ...state,
                selectedEmploymentType: action.payload
            };
        case JobActions.SetSelectedScrub:
            return {
                ...state,
                selectedScrub: action.payload
            };
        case JobActions.SetSelectedShiftStart:
            return {
                ...state,
                selectedShiftStart: action.payload
            };
        case JobActions.SetSelectedShiftEnd:
            return {
                ...state,
                selectedShiftEnd: action.payload
            };
        case JobActions.SetSelectedChecklist:
            return {
                ...state,
                selectedChecklist: action.payload
            };
        case JobActions.SetScrub:
            return {
                ...state,
                scrub: action.payload
            };
        case JobActions.SetProfession:
            return {
                ...state,
                profession: action.payload
            };
        case JobActions.SetSearch:
            return {
                ...state,
                search: action.payload
            };
        case JobActions.SetEmploymentType:
            return {
                ...state,
                employmentType: action.payload
            };
        case JobActions.SetJobStatus:
            return {
                ...state,
                jobStatus: action.payload
            };
        case JobActions.SetSpeciality:
            return {
                ...state,
                speciality: action.payload
            };
        case JobActions.SetJobTemplate:
            return {
                ...state,
                jobTemplate: action.payload
            };
        case JobActions.SetJobStatus:
            return {
                ...state,
                jobStatus: action.payload
            };
        case JobActions.SetContract:
            return {
                ...state,
                contract: action.payload
            };
        case JobActions.SetSelectedComplianceList:
            return {
                ...state,
                selectedComplianceList: action.payload
            };
        case JobActions.SetComplianceList:
            return {
                ...state,
                complianceList: action.payload
            };
        case JobActions.SetSelectedComplianceDetails:
            return {
                ...state,
                selectedComplianceDetails: action.payload
            };
        case JobActions.SetComplianceDetails:
            return {
                ...state,
                complianceDetails: action.payload
            };
        case JobActions.SetCardDetails:
            return {
                ...state,
                cardDetails: action.payload
            };
        case JobActions.SetSelectedContractStart:
            return {
                ...state,
                selectedContractStartDate: action.payload
            };
        case JobActions.SetShiftEnd:
            return {
                ...state,
                shiftEndTime: action.payload
            };
        case JobActions.SetSelectedShiftStart:
            return {
                ...state,
                selectedShiftStart: action.payload
            };
        case JobActions.SetSelectedShiftEnd:
            return {
                ...state,
                selectedShiftEnd: action.payload
            };
        case JobActions.SetTemplate:
            return {
                ...state,
                jobTemplate: action.payload
            };
        case JobActions.SetFacilityName:
            return {
                ...state,
                facilityName: action.payload
            };
        case JobActions.SetProgramManager:
            return {
                ...state,
                programManager: action.payload
            };
        case JobActions.SetDocumentList:
            return {
                ...state,
                documentList: action.payload
            };
        case JobActions.SetShiftTime:
            return {
                ...state,
                shiftTime: action.payload
            };
        case JobActions.SetSelectedShiftTime:
            return {
                ...state,
                selectedShiftTime: action.payload
            }
        default:
            return state;
    }
}

export default jobTemplateReducer;