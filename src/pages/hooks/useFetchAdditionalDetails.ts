import { useEffect, useReducer, useState } from "react";
import { ActionType } from "../../types/ProfessionalAuth";
import { showToast } from "../../helpers";
import additionalDetailsReducer from "../../helpers/reducers/AdditionalDetailsReducer";
import {
  getAdminBackgroundQuestionsList,
  getAdminFederalQuestions,
  getAdminGig,
  getAdminStates,
} from "../../services/AdditionalDetails";
import { useParams } from "react-router-dom";
const initialState = {
  selectedState: null,
  selectedCity: null,
  selectedZip: null,
  states: [],
  cities: [],
  zip: [],
  bgQuestions: [],
  additionalDetails: [],
  federalQuestions: [],
  emergencyContactList: [],
  gigList: [],
};

const useFetchAdditionalDetails = () => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [state, dispatch] = useReducer(additionalDetailsReducer, initialState);
  const params = useParams();
  const professionalId = Number(params?.Id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("loading");
        const [federalList, bgQuestion, stateList, gigList] =
          await Promise.allSettled([
            getAdminFederalQuestions(professionalId),
            getAdminBackgroundQuestionsList(professionalId),
            getAdminStates(),
            getAdminGig(professionalId),
          ]);

        if (federalList.status === "fulfilled") {
          dispatch({
            type: ActionType.SetFederalQuestion,
            payload: federalList.value?.data?.data,
          });
        }
        if (bgQuestion.status === "fulfilled") {
          dispatch({
            type: ActionType.SetBackgroundQuestion,
            payload: bgQuestion.value?.data?.data,
          });
        }
        if (stateList.status === "fulfilled") {
          dispatch({
            type: ActionType.SetState,
            payload: stateList.value?.data?.data,
          });
        }
        if (gigList.status === "fulfilled") {
          dispatch({
            type: ActionType.SetGigList,
            payload: gigList.value?.data?.data[0],
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

  return { state, dispatch, loading };
};

export default useFetchAdditionalDetails;
