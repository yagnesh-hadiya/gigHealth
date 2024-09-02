import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps, Form, Row, Col, Label, FormFeedback, } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { JSX } from "react/jsx-runtime";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { showToast } from "../../../../../helpers";
import { editFaq } from "../../../../../services/FacilityFaq";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaqSchema } from "../../../../../helpers/schemas/FaqSchema";
import { useParams } from "react-router";
import { AddQuestionForEdit, EditFaqProps, FaqType } from "../../../../../types/FacilityFaqTypes";
import { useEffect } from 'react';
import Loader from "../../../../../components/custom/CustomSpinner";

const EditFaq = (
  { isOpen, toggleEditModal, selectedEditFaq, fetchFaqs }: EditFaqProps & JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<Modal> & Readonly<ModalProps>) => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<AddQuestionForEdit>({
    resolver: yupResolver(FaqSchema) as any
  });

  const [selectedType, setSelectedType] = useState<{ value: number; label: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const facilityId = useParams();

  const faqTypes: FaqType[] = [
    { Id: 1, Type: "Internal Use Only" },
    { Id: 2, Type: "To Be Shared with Professionals" },
  ];



  useEffect(() => {
    if (selectedEditFaq) {
      const { Question, Answer, FaqType } = selectedEditFaq
      setValue('question', Question)
      setValue('answer', Answer)
      const initialTypeValue = FaqType
        ? {
          value: FaqType?.Id ?? 0,
          label: FaqType?.Type ?? ''
        }
        : null;
      setSelectedType(initialTypeValue);
    }
  }, [selectedEditFaq]);

  const onSubmit = async (data: AddQuestionForEdit) => {
    try {
      if (!selectedType) {
        showToast('error', 'Please select a type');
        return;
      }
      const { question, answer } = data;
      if (question.trim().length === 0 || answer.trim().length === 0) {
        showToast('error', 'Please enter both question and answer.');
        return;
      }
      if (question.trim().length > 255 || answer.trim().length > 255) {
        showToast('error', 'Question and answer must be within 255 characters.');
        return;
      }
      const faqId = selectedEditFaq?.Id
      setLoading(true);
      await editFaq(question, answer, selectedType?.value, Number(facilityId?.Id), faqId!);
      setLoading(false);
      toggleEditModal();
      fetchFaqs();
    }
    catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast('error', error?.response?.data?.message || 'Something went wrong');
    }
  }
  const handleCancle = () => {
    toggleEditModal();
  }
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleEditModal} centered={true} size="xl">
        <ModalHeader toggle={toggleEditModal} className="faq-header">Edit FAQ's</ModalHeader>
        <ModalBody className="modal-body-faq">
          {loading ? <Loader /> : (<Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="12" className="col-group">
                <Label>Select Type</Label>
                <CustomSelect
                  id="type"
                  name="type"
                  options={faqTypes.map(type => ({ label: type.Type, value: type.Id }))}
                  noOptionsMessage={() => "No options available"}
                  placeholder="Select Type"
                  value={selectedType}
                  onChange={(selectedOption) => {
                    setSelectedType(selectedOption);
                  }}
                />
              </Col>
            </Row>

            <div>
              <h2 className="page-content-header">Questions</h2>
              <div className={`add-faq-question mt-3  'add-faq-wrapper-active' : ''}`} >
                <Row>
                  <Col md="12" className="col-group">
                    <Label>Question</Label>
                    <div className="d-flex align-items-center edit-faq">
                      <CustomInput
                        id='question'
                        invalid={!!errors.question}
                        {...register('question')}
                        placeholder="Question"
                        className="faq-question-input edit-faq-question"
                      />
                      <FormFeedback>{errors.question?.message}</FormFeedback>
                    </div>
                  </Col>
                  <Col md="12" className="">
                    <CustomTextArea
                      id='answer'
                      invalid={!!errors.answer}
                      {...register('answer')}
                    />
                    <FormFeedback>{errors.answer?.message}</FormFeedback>
                  </Col>
                </Row>
              </div>
              {/* )
              )} */}
            </div>
            <div className="btn-wrapper">
              <CustomButton className="primary-btn" >
                Save
              </CustomButton>
              <CustomButton className="secondary-btn" onClick={handleCancle}>
                Cancel
              </CustomButton>
            </div>
          </Form>)}
        </ModalBody>
        <ModalFooter className="mb-3 justify-content-start">
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditFaq;
