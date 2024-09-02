import { JobsActions, JobsState } from "../../types/JobsTypes";

const jobsReducer = (state: JobsState, action: { type: JobsActions, payload: any }) => {
    switch (action.type) {
        case JobsActions.SetFacility:
            return {
                ...state,
                facility: action.payload
            }
        case JobsActions.SetSelectedFacility:
            return {
                ...state,
                selectedFacility: action.payload
            }
        case JobsActions.SetSelectedTemplate:
            return {
                ...state,
                selectedTemplate: action.payload
            };
        case JobsActions.SetSelectedProfession:
            return {
                ...state,
                selectedProfession: action.payload
            };
        case JobsActions.SetSelectedSpecialities:
            return {
                ...state,
                selectedSpecialities: action.payload
            };
        case JobsActions.SetSelectedContract:
            return {
                ...state,
                selectedContract: action.payload
            };
        case JobsActions.SetSelectedJobStatus:
            return {
                ...state,
                selectedJobStatus: action.payload
            };
        case JobsActions.SetSelectedEmploymentType:
            return {
                ...state,
                selectedEmploymentType: action.payload
            };
        case JobsActions.SetSelectedScrub:
            return {
                ...state,
                selectedScrub: action.payload
            };
        case JobsActions.SetSelectedShiftStart:
            return {
                ...state,
                selectedShiftStart: action.payload
            };
        case JobsActions.SetSelectedShiftEnd:
            return {
                ...state,
                selectedShiftEnd: action.payload
            };
        case JobsActions.SetSelectedChecklist:
            return {
                ...state,
                selectedChecklist: action.payload
            };
        case JobsActions.SetScrub:
            return {
                ...state,
                scrub: action.payload
            };
        case JobsActions.SetProfession:
            return {
                ...state,
                profession: action.payload
            };
        case JobsActions.SetSearch:
            return {
                ...state,
                search: action.payload
            };
        case JobsActions.SetEmploymentType:
            return {
                ...state,
                employmentType: action.payload
            };
        case JobsActions.SetJobStatus:
            return {
                ...state,
                jobStatus: action.payload
            };
        case JobsActions.SetSpeciality:
            return {
                ...state,
                speciality: action.payload
            };
        case JobsActions.SetJobTemplate:
            return {
                ...state,
                jobTemplate: action.payload
            };
        case JobsActions.SetJobStatus:
            return {
                ...state,
                jobStatus: action.payload
            };
        case JobsActions.SetContract:
            return {
                ...state,
                contract: action.payload
            };
        case JobsActions.SetSelectedComplianceList:
            return {
                ...state,
                selectedComplianceList: action.payload
            };
        case JobsActions.SetComplianceList:
            return {
                ...state,
                complianceList: action.payload
            };
        case JobsActions.SetSelectedComplianceDetails:
            return {
                ...state,
                selectedComplianceDetails: action.payload
            };
        case JobsActions.SetComplianceDetails:
            return {
                ...state,
                complianceDetails: action.payload
            };
        case JobsActions.SetCardDetails:
            return {
                ...state,
                cardDetails: action.payload
            };
        case JobsActions.SetSelectedContractStart:
            return {
                ...state,
                selectedContractStartDate: action.payload
            };
        case JobsActions.SetShiftEnd:
            return {
                ...state,
                shiftEndTime: action.payload
            };
        case JobsActions.SetSelectedShiftStart:
            return {
                ...state,
                selectedShiftStart: action.payload
            };
        case JobsActions.SetSelectedShiftEnd:
            return {
                ...state,
                selectedShiftEnd: action.payload
            };
        case JobsActions.SetTemplate:
            return {
                ...state,
                jobTemplate: action.payload
            };
        case JobsActions.SetFacilityName:
            return {
                ...state,
                facilityName: action.payload
            };
        case JobsActions.SetProgramManager:
            return {
                ...state,
                programManager: action.payload
            };
        case JobsActions.SetDocumentList:
            return {
                ...state,
                documentList: action.payload
            };
        case JobsActions.SetShiftTime:
            return {
                ...state,
                shiftTime: action.payload
            };
        case JobsActions.SetSelectedShiftTime:
            return {
                ...state,
                selectedShiftTime: action.payload
            };
        case JobsActions.SetContent:
            return {
                ...state,
                content: action.payload
            };
        case JobsActions.SetProgramManager:
            return {
                ...state,
                programManager: action.payload
            };
        case JobsActions.SetJobId:
            return {
                ...state,
                jobId: action.payload
            };
        case JobsActions.SetActiveContract:
            return {
                ...state,
                activeContract: action.payload
            };
        case JobsActions.SetPostToWebsite:
            return {
                ...state,
                postToWebsite: action.payload
            };
        case JobsActions.SetDaysOnAssignment:
            return {
                ...state,
                daysOnAssignment: action.payload
            };
        case JobsActions.SetSelectedDaysOnAssignment:
            return {
                ...state,
                selectedDaysOnAssignment: action.payload
            };
        case JobsActions.SetFormattedReqId:
            return {
                ...state,
                formattedReqId: action.payload
            };
        case JobsActions.SetState:
            return {
                ...state,
                states: action.payload
            };
        case JobsActions.SetSelectedState:
            return {
                ...state,
                selectedState: action.payload
            };
        case JobsActions.SetFilter:
            return {
                ...state,
                filter: action.payload
            };
        case JobsActions.SetCount:
            return {
                ...state,
                count: action.payload
            };
        case JobsActions.SetActiveIndex:
            return {
                ...state,
                activeIndex: action.payload``
            }
        default:
            return state;
    }
}

export default jobsReducer;