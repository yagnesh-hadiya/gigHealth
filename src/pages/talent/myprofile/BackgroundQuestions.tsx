import { useEffect, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import {
  ProfessionalBackgroundQuesionsType,
  ProfileInformationCardProps,
} from "../../../types/ProfessionalDetails";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import { uploadBackgroundQuestions } from "../../../services/ProfessionalMyProfile";

const BackgroundQuestions = ({
  state,
  setFetchDetails,
}: ProfileInformationCardProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [check, setCheck] = useState<{ yes: boolean; no: boolean }[]>([]);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (state?.bgQuestions?.length) {
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
  }, [state, state?.bgQuestions?.length]);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const { checked } = e.target;
    setCheck((prevCheck) =>
      prevCheck.map((item, index) =>
        index === id ? { ...item, yes: checked, no: !checked } : item
      )
    );
  };

  const handleChangeInputNo = (e: string, id: number) => {
    setCheck((prevCheck) =>
      prevCheck.map((item, index) =>
        index === id && e === "No" ? { ...item, yes: false, no: true } : item
      )
    );
  };

  const handleDoubleChangeInput = (id: number) => {
    setCheck((prevCheck) =>
      prevCheck.map((item, index) =>
        index === id ? { ...item, yes: false, no: false } : item
      )
    );
  };

  const formatQuestionAnswer = (check: { yes: boolean; no: boolean }[]) => {
    return check
      .map((item, index) => ({
        questionId: index + 1,
        answer: item.yes === true ? true : item.no === true ? false : null,
      }))
      ?.filter((item) => item.answer !== null);
  };

  const handleEdit = () => setEdit((prev) => !prev);

  const handleSave = async () => {
    const questionAnswer = formatQuestionAnswer(check);
    if (questionAnswer.length < 1) {
      return showToast("error", "Please select atleast one question");
    }

    try {
      setLoading("loading");
      const response = await uploadBackgroundQuestions(questionAnswer);
      if (response.status === 200) {
        showToast("success", "Background questions updated successfully");
        setFetchDetails && setFetchDetails((prev) => !prev);
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
      <div className="purple-radio-btn">
        <h3 className="scroll-title"></h3>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <h2 className="form-small-text scroll-title mb-0">
            Background Questions{" "}
          </h2>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={() => handleEdit()}
          >
            <span className="material-symbols-outlined">Edit</span>
          </Button>
        </div>
        {state?.bgQuestions?.map(
          (item: ProfessionalBackgroundQuesionsType, index: number) => {
            return (
              <div className="background-check-radio mb-3 mt-4" key={item?.Id}>
                <p className="radio-label-p mb-2">
                  {item?.Id}. {item?.Question}
                  <span className="asterisk">*</span>
                </p>
                <div className="d-flex flex-wrap" style={{ gap: "10px 20px" }}>
                  <FormGroup check>
                    <Input
                      name={`question_${item?.Id}`}
                      type="radio"
                      id={`question_${index}_radio${index}`}
                      checked={check[index]?.yes}
                      disabled={!edit}
                      onDoubleClick={() =>
                        handleDoubleChangeInput(item?.Id - 1)
                      }
                      onChange={(e) => handleChangeInput(e, item?.Id - 1)}
                    />{" "}
                    <Label check for={`question_${index}_radio${index}`}>
                      {" "}
                      Yes{" "}
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Input
                      name={`question_${item?.Id}`}
                      type="radio"
                      id={`question_${item?.Id}_radio${item?.Id}`}
                      checked={check[index]?.no}
                      disabled={!edit}
                      onDoubleClick={() =>
                        handleDoubleChangeInput(item?.Id - 1)
                      }
                      onChange={() => handleChangeInputNo("No", item?.Id - 1)}
                    />{" "}
                    <Label check for={`question_${item?.Id}_radio${item?.Id}`}>
                      {" "}
                      No{" "}
                    </Label>
                  </FormGroup>
                </div>
              </div>
            );
          }
        )}

        <div className="d-flex align-items-center mb-2" style={{ gap: "12px" }}>
          <Button
            className="blue-gradient-btn mb-0 mobile-btn"
            disabled={!edit}
            onClick={handleSave}
          >
            Save
          </Button>
          {/* <Button outline className="purple-outline-btn mb-0 mobile-btn">
            Skip to Next
          </Button> */}
        </div>
      </div>
    </>
  );
};

export default BackgroundQuestions;
