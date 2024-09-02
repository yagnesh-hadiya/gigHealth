import { useEffect, useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import { FederalQuestionType } from "../../../types/ProfessionalAuth";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { showToast } from "../../../helpers";
import { updateFederalQuestions } from "../../../services/PersonalInformation";
import { FederalQuestionsCardProps } from "../../../types/PersonalInformation";
import { formatAnswer } from "../../common";

const FederalQuestionsCard = ({
  state,
  setFetch,
}: FederalQuestionsCardProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [checkRadio, setCheckRadio] = useState<
    { questionId: number; optionId: number | boolean }[]
  >([]);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (state?.federalQuestions) {
      const result = formatAnswer(state?.federalQuestions);
      if (result) {
        setCheckRadio(result);
      }
    }
  }, [state?.federalQuestions]);

  const handleRadioChange = (questionId: number, optionId: number) => {
    setCheckRadio((prevCheck) => {
      const index = prevCheck.findIndex(
        (item) => item.questionId === questionId
      );

      if (index !== -1) {
        const updatedCheckRadio = [...prevCheck];

        updatedCheckRadio[index] = {
          questionId: questionId,
          optionId: optionId,
        };

        return updatedCheckRadio;
      } else {
        return [
          ...prevCheck,
          {
            questionId: questionId,
            optionId: optionId,
          },
        ];
      }
    });
  };

  const handleDoubleClickRadioChange = (
    questionId: number,
    optionId: number
  ) => {
    setCheckRadio((prevCheck) => {
      const index = prevCheck.findIndex(
        (item) => item.questionId === questionId
      );

      if (index !== -1) {
        const updatedCheckRadio = [...prevCheck];
        updatedCheckRadio[index] = {
          questionId: questionId,
          optionId: optionId ? false : optionId,
        };

        return updatedCheckRadio;
      }
      return prevCheck;
    });
  };

  const handleCheckboxSubmit = async () => {
    const checkboxData = checkRadio.filter(
      (radio) => radio.optionId && radio.questionId
    );

    if (checkboxData?.length === 0) {
      return showToast("error", "Atleast one federal question is required");
    }
    try {
      setLoading("loading");
      const response = await updateFederalQuestions(checkboxData);
      if (response.status === 200) {
        // showToast(
        //   "success",
        //   "Federal questions updated successfully" || response.data?.message
        // );
        setFetch((prev) => !prev);
        setEdit((prev) => !prev);
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
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        <h2 className="main-title mb-3 mt-4">
          Federal Equal Opportunity Questions
        </h2>
        <Button
          type="button"
          className="dt-talent-btn mb-3 mt-4"
          onClick={() => setEdit((prev) => !prev)}
        >
          <span className="material-symbols-outlined">Edit</span>
        </Button>
      </div>
      {state?.federalQuestions?.map((question: FederalQuestionType) => {
        return (
          <>
            <p className="radio-question-text mb-3">
              {question?.Id}. {question?.Question}
            </p>
            {question.FederalQuestionOptions?.sort(
              (a, b) => a.Order - b.Order
            )?.map((option) => {
              return (
                <div
                  key={option?.Id}
                  className="purple-radio-btn d-flex flex-wrap mb-3"
                  style={{ gap: "8px 20px" }}
                >
                  <FormGroup check>
                    <Input
                      name={`question_${question?.Id}`}
                      type="radio"
                      id={`radio_${option?.Id}`}
                      onDoubleClick={() =>
                        handleDoubleClickRadioChange(question?.Id, option?.Id)
                      }
                      onChange={() =>
                        handleRadioChange(question?.Id, option?.Id)
                      }
                      checked={checkRadio?.some(
                        (radio) =>
                          radio.questionId === question?.Id &&
                          radio.optionId === option?.Id
                      )}
                      disabled={!edit}
                    />{" "}
                    <Label check for={`radio_${option?.Id}`}>
                      {option?.Option}
                    </Label>
                  </FormGroup>
                </div>
              );
            })}
          </>
        );
      })}
      <Button
        type="submit"
        className="blue-gradient-btn login-btn register-btn"
        onClick={() => handleCheckboxSubmit()}
        disabled={!edit}
      >
        Save
      </Button>
    </>
  );
};

export default FederalQuestionsCard;
