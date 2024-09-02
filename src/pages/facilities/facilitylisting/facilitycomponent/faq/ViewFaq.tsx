import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps, Form, Row, Col, Label, FormFeedback, } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { JSX } from "react/jsx-runtime";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaqSchema } from "../../../../../helpers/schemas/FaqSchema";
import { useEffect } from 'react'
import { AddQuestionForEdit, FaqType, ViewFaqProps } from "../../../../../types/FacilityFaqTypes";

const ViewFaq = (
  { isOpen, toggleViewModal, selectedViewFaq }: ViewFaqProps & JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<Modal> & Readonly<ModalProps>) => {

  const { register, formState: { errors }, setValue } = useForm<AddQuestionForEdit>({
    resolver: yupResolver(FaqSchema) as any
  });

  const [selectedType, setSelectedType] = useState<{ value: number; label: string } | null>(null);
  const faqTypes: FaqType[] = [
    { Id: 1, Type: "Internal Use Only" },
    { Id: 2, Type: "To Be Shared with Professionals" },
  ];

  useEffect(() => {
    if (selectedViewFaq) {
      const { Question, Answer, FaqType } = selectedViewFaq
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
  }, [selectedViewFaq]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleViewModal} centered={true} size="xl">
        <ModalHeader toggle={toggleViewModal} className="faq-header">View FAQ's</ModalHeader>
        <ModalBody className="modal-body-faq">
          <Form >
            <Row>
              <Col md="12" className="col-group">
                <Label>Select Type</Label>
                <CustomSelect
                  id={"type"}
                  name={"type"}
                  options={faqTypes.map(type => ({ label: type.Type, value: type.Id }))}
                  noOptionsMessage={() => "No options available"} placeholder={""}
                  value={selectedType}
                  isDisabled={true}
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
                    <div className="d-flex align-items-center">
                      <CustomInput
                        id='question'
                        invalid={!!errors.question}
                        {...register('question')}
                        placeholder="Question"
                        className="faq-question-input"
                        disabled={true}
                      />
                      <FormFeedback>{errors.question?.message}</FormFeedback>
                    </div>
                  </Col>
                  <Col md="12" className="">
                    <CustomTextArea
                      id='answer'
                      invalid={!!errors.answer}
                      {...register('answer')}
                      disabled={true}
                    />
                    <FormFeedback>{errors.answer?.message}</FormFeedback>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter className="mb-3 justify-content-start">
          <div className="btn-wrapper">
            <CustomButton className="secondary-btn" onClick={toggleViewModal}>
              Cancel
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ViewFaq;
