import { FormGroup, Input, Label } from "reactstrap";
import { BackgroundQuestionsProps } from "../../../types/ProfessionalDocumentType";
import { ProfessionalBackgroundQuesionsType } from "../../../types/ProfessionalDetails";
import useBackgroundQuestions from "../../hooks/useBackgroundQuestions";

const BackgroundQuestions = ({ state }: BackgroundQuestionsProps) => {
  const { check } = useBackgroundQuestions(state);
  return (
    <div>
      {state &&
        state.bgQuestions.length > 0 &&
        state?.bgQuestions?.map(
          (item: ProfessionalBackgroundQuesionsType, index: number) => {
            const questionId = item?.Id;
            return (
              <div
                className="background-check-radio mb-3 mt-4"
                key={questionId}
                style={{ padding: "0px 20px" }}
              >
                <p className="radio-label-p mb-2">
                  {questionId}. {item?.Question}
                  <span className="asterisk">*</span>
                </p>
                <div className="d-flex flex-wrap" style={{ gap: "10px 20px" }}>
                  <FormGroup check>
                    <Input
                      type="radio"
                      checked={check[index]?.yes}
                      disabled={true}
                    />{" "}
                    <Label check> Yes </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Input
                      type="radio"
                      checked={check[index]?.no}
                      disabled={true}
                    />{" "}
                    <Label check> No </Label>
                  </FormGroup>
                </div>
              </div>
            );
          }
        )}
    </div>
  );
};

export default BackgroundQuestions;
