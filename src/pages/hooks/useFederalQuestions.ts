import { useEffect, useState } from "react";
import { formatAnswer } from "../common";
import { AdditionalDetailsState } from "../../types/ProfessionalDocumentType";

const useFederalQuestions = (
  state: Pick<AdditionalDetailsState, "federalQuestions">
) => {
  const [checkRadio, setCheckRadio] = useState<
    { questionId: number; optionId: number | boolean }[]
  >([]);

  useEffect(() => {
    if (state?.federalQuestions) {
      const result = formatAnswer(state?.federalQuestions);
      if (result) {
        setCheckRadio(result);
      }
    }
  }, [state]);

  return { checkRadio };
};

export default useFederalQuestions;
