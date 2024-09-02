import { FormGroup, Input, Label } from "reactstrap";
import { FederalAdminQuestionsProps } from "../../../types/ProfessionalDocumentType";
import { FederalQuestionType } from "../../../types/ProfessionalAuth";
import useFederalQuestions from "../../hooks/useFederalQuestions";

const FederalQuestions = ({ state }: FederalAdminQuestionsProps) => {
  const { checkRadio } = useFederalQuestions(state);

  return (
    <>
      {state?.federalQuestions?.map((question: FederalQuestionType) => {
        return (
          <>
            <p
              className="radio-question-text mb-3"
              style={{ padding: "0px 20px" }}
            >
              {question?.Id}. {question?.Question}
            </p>
            {question.FederalQuestionOptions?.sort(
              (a, b) => a.Order - b.Order
            )?.map((option) => {
              return (
                <div
                  key={option?.Id}
                  className="purple-radio-btn d-flex flex-wrap mb-3"
                  style={{ gap: "8px 20px", padding: "0px 20px" }}
                >
                  <FormGroup check>
                    <Input
                      name={`question_${question?.Id}`}
                      type="radio"
                      id={`radio_${option?.Id}`}
                      checked={checkRadio?.some(
                        (radio) =>
                          radio.questionId === question?.Id &&
                          radio.optionId === option?.Id
                      )}
                      disabled={true}
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
    </>
    // <ol className="list-wrapper">
    //   <li>
    //     Select Gender?
    //     <div className="text-wrapper">
    //       <CustomRadioButton
    //         options={[{ label: "Female", value: "true" }]}
    //         onChange={() => {}}
    //         name={""}
    //       />
    //     </div>
    //   </li>
    //   <li>
    //     Which ethnic group do you identify with? *
    //     <div className="text-wrapper">
    //       <CustomRadioButton
    //         options={[
    //           {
    //             label:
    //               "White(Not Hispanic or Latino):A person having origins in any of the original people of Europe,the middle East or North Africa.",
    //             value: "true",
    //           },
    //         ]}
    //         onChange={() => {}}
    //         name={""}
    //       />
    //     </div>
    //   </li>
    //   <li>
    //     Veteran Status
    //     <div className="text-wrapper">
    //       <CustomRadioButton
    //         options={[{ label: "Female", value: "true" }]}
    //         onChange={() => {}}
    //         name={""}
    //       />
    //     </div>
    //   </li>
    //   <li>
    //     Disability Status
    //     <div className="text-wrapper">
    //       <CustomRadioButton
    //         options={[{ label: "No, I dont have disability", value: "true" }]}
    //         onChange={() => {}}
    //         name={""}
    //       />
    //     </div>
    //   </li>
    // </ol>
  );
};

export default FederalQuestions;
