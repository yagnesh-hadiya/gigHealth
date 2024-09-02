import { useEffect, useState } from "react";
import { ProfessionalBackgroundQuesionsType } from "../../types/ProfessionalDetails";
import { AdditionalDetailsState } from "../../types/ProfessionalDocumentType";

const useBackgroundQuestions = (
  state: Pick<AdditionalDetailsState, "bgQuestions">
) => {
  const [check, setCheck] = useState<{ yes: boolean; no: boolean }[]>([]);

  useEffect(() => {
    if (state?.bgQuestions?.length > 0) {
      const transformedData = state?.bgQuestions?.map(
        (item: ProfessionalBackgroundQuesionsType) => ({
          yes: item?.BackgroundQuestionAnswer?.Answer === true ? true : false,
          no: item?.BackgroundQuestionAnswer?.Answer === false ? true : false,
        })
      );

      setCheck(transformedData);
    } else {
      const length = state?.bgQuestions?.length;
      const arr = [];
      for (let i = 0; i < length; i++) {
        arr.push({ yes: false, no: false });
      }
      setCheck(arr);
    }
  }, [state]);

  return { check, setCheck };
};

export default useBackgroundQuestions;
