import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
  Form,
  Row,
  Col,
  Label,
} from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { JSX } from "react/jsx-runtime";
import CustomDeleteBtn from "../../../../../components/custom/DeleteBtnWithoutModal";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { showToast } from "../../../../../helpers";
import { createFaq, faqType } from "../../../../../services/FacilityFaq";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaqSchema } from "../../../../../helpers/schemas/FaqSchema";
import { useParams } from "react-router";
import {
  AddFaqProps,
  AddQuestion,
  FaqType,
} from "../../../../../types/FacilityFaqTypes";
import Loader from "../../../../../components/custom/CustomSpinner";

const AddNewFaq = ({
  isOpen,
  toggle,
  fetchFaqs,
}: AddFaqProps &
  JSX.IntrinsicAttributes &
  JSX.IntrinsicClassAttributes<Modal> &
  Readonly<ModalProps>) => {
  const { handleSubmit, reset } = useForm<AddQuestion>({
    resolver: yupResolver(FaqSchema) as any,
  });

  const [questions, setQuestions] = useState<AddQuestion>([
    { question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [faqTypes, setFaqTypes] = useState<FaqType[]>([]);
  const facilityId = useParams();

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };
  const getTypes = async () => {
    try {
      setLoading(true);
      const res = await faqType(Number(facilityId?.Id));
      setLoading(false);
      setFaqTypes(res);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  useEffect(() => {
    getTypes();
  }, []);

  const toggleModal = () => {
    setQuestions([{ question: "", answer: "" }]);
    setSelectedType(null);
    reset();
    toggle();
  };
  const onSubmit = async () => {
    try {
      if (!selectedType?.value) {
        showToast("error", "Please select a type");
        return;
      }
      const faqs: {
        question: string;
        answer: string;
        isInternalUse: boolean;
        typeId: number;
      }[] = questions.map((q) => ({
        question: q.question || "",
        answer: q.answer || "",
        isInternalUse: selectedType.value === 1,
        typeId: selectedType.value || 0,
      }));

      setLoading(true);
      await createFaq(Number(facilityId?.Id), faqs);
      setLoading(false);
      fetchFaqs();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  const handleSave = (data: any) => {
    if (!selectedType?.value) {
      showToast("error", "Please select a type");
      return;
    }
    const isInvalidQuestionAnswer = questions.some((q) => {
      const trimmedQuestion = q.question?.trim();
      const trimmedAnswer = q.answer?.trim();

      const isQuestionEmpty = !trimmedQuestion || trimmedQuestion.length === 0;
      const isAnswerEmpty = !trimmedAnswer || trimmedAnswer.length === 0;
      const isQuestionTooLong = trimmedQuestion && trimmedQuestion.length > 255;
      const isAnswerTooLong = trimmedAnswer && trimmedAnswer.length > 255;

      if (isQuestionEmpty || isAnswerEmpty) {
        showToast(
          "error",
          "Please enter both question and answer for all questions."
        );
        return true;
      }

      if (isQuestionTooLong || isAnswerTooLong) {
        showToast(
          "error",
          "Question and answer must be within 255 characters."
        );
        return true;
      }

      return false;
    });

    if (isInvalidQuestionAnswer) {
      return;
    }
    handleSubmit(onSubmit)(data);
    setQuestions([{ question: "", answer: "" }]);
    setSelectedType(null);
    reset();
    toggle();
  };

  const handleCancle = () => {
    setQuestions([{ question: "", answer: "" }]);
    setSelectedType(null);
    reset();
    toggle();
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true} size="xl">
      <ModalHeader toggle={toggleModal} className="faq-header">
        Add FAQ's
      </ModalHeader>
      <ModalBody className="modal-body-faq">
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="12" className="col-group">
                <Label>Select Type</Label>
                <CustomSelect
                  id={"type"}
                  name={"type"}
                  options={faqTypes.map((type) => ({
                    label: type.Type,
                    value: type.Id,
                  }))}
                  noOptionsMessage={() => "No options available"}
                  placeholder="Select Type"
                  value={
                    selectedType
                      ? {
                          value: selectedType?.value,
                          label: selectedType?.label,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setSelectedType(selectedOption);
                  }}
                />
              </Col>
            </Row>

            <div>
              <h2 className="page-content-header">Questions</h2>
              {questions.map((q, index) => (
                <div
                  className={`add-faq-question mt-3 ${
                    index === questions.length - 1
                      ? "add-faq-wrapper-active"
                      : ""
                  }`}
                  key={index}
                >
                  <Row>
                    <Col md="12" className="col-group">
                      <Label>Question</Label>
                      <div className="d-flex align-items-center">
                        <span className="faq-question-number">
                          {index + 1}.
                        </span>
                        <CustomInput
                          // invalid={!!errors.questions.}
                          //  {...register(`questions[${index}].question`)}
                          placeholder="Question"
                          className="faq-question-input"
                          value={q.question}
                          onChange={(e: { target: { value: string } }) =>
                            handleQuestionChange(index, e.target.value)
                          }
                        />
                        {/* <FormFeedback>{errors.question?.message}</FormFeedback> */}
                        <CustomDeleteBtn
                          onDelete={() => {
                            const newQuestions = [...questions];
                            newQuestions.splice(index, 1);
                            setQuestions(newQuestions);
                          }}
                        />
                      </div>
                    </Col>
                    <Col md="12" className="">
                      <CustomTextArea
                        // invalid={!!errors.answer}
                        // {...register(`questions[${index}].answer`)}
                        value={q.answer}
                        onChange={(e: { target: { value: string } }) =>
                          handleAnswerChange(index, e.target.value)
                        }
                      />
                      {/* <FormFeedback>{errors.answer?.message}</FormFeedback> */}
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Form>
        )}
        <CustomButton
          className="secondary-btn faq-secondary-btn"
          onClick={handleAddQuestion}
        >
          Add New Question
        </CustomButton>
      </ModalBody>
      <ModalFooter className="mb-3 justify-content-start">
        <div className="btn-wrapper">
          <CustomButton className="primary-btn" onClick={handleSave}>
            Save
          </CustomButton>
          <CustomButton className="secondary-btn" onClick={handleCancle}>
            Cancel
          </CustomButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default AddNewFaq;
