import { Form } from "react-router-dom";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
} from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import CustomButton from "../../../components/custom/CustomBtn";
import CustomRichTextEditor from "../../../components/custom/CustomTextEditor";
import { EmailModalType } from "../../../types/NotesTypes";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EmailModalSchema } from "../../../helpers/schemas/NotesSchema";
import { useSelector } from "react-redux";
import { getEmail } from "../../../store/UserSlice";
import { showToast } from "../../../helpers";
import ProfessionalNotesServices from "../../../services/ProfessionalNotesServices";
import Loader from "../../../components/custom/CustomSpinner";
import { ProfessionalActivity } from "../../../types/ProfessionalNotesTypes";
import ACL from "../../../components/custom/ACL";

type EmailModalProps = {
  isOpen: boolean;
  toggle: () => void;
  fetchNotes: () => void;
  professionalId: number;
  activity?: ProfessionalActivity;
};

const ProfessionalEmailModal = ({
  isOpen,
  toggle,
  fetchNotes,
  professionalId,
  activity,
}: EmailModalProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<EmailModalType>({
    resolver: yupResolver(EmailModalSchema) as any,
  });
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const email: string = useSelector(getEmail);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const handleComposeEmail = (text: string) => {
    setContent(text);
  };

  useEffect(() => {
    if (activity?.ToEmail && activity?.Subject && activity?.Content) {
      setValue("toEmail", activity?.ToEmail);
      setValue("subject", activity?.Subject);
      setContent(activity.Content);
      setReadOnly(true);
    }
  }, [activity?.Content, activity?.Subject, activity?.ToEmail, setValue]);

  const submit = async (data: EmailModalType) => {
    if (content.length === 0) {
      showToast("error", "Email body is required");
      return;
    }

    const emailData = {
      ...data,
      body: content,
    };

    try {
      setLoading("loading");
      const res = await ProfessionalNotesServices.createEmailActivity({
        professionalId,
        data: emailData,
      });

      if (res.status === 201) {
        showToast("success", res.data.message || "Email sent successfully");
        fetchNotes();
        toggle();
        setLoading("idle");
      }
    } catch (error: any) {
      showToast("error", error.response.data.message || "Error sending email");
      setLoading("error");
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Compose Email</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="6" className="col-group">
                <Label>From</Label>
                <CustomInput
                  id="from"
                  placeholder=""
                  disabled={true}
                  defaultValue={email && email}
                />
              </Col>
              <Col md="6" className="col-group">
                <Label>To</Label>
                <CustomInput
                  id="to"
                  placeholder="Email"
                  disabled={readOnly}
                  invalid={!!errors.toEmail}
                  {...register("toEmail")}
                />
                <FormFeedback>{errors.toEmail?.message}</FormFeedback>
              </Col>
              <Col md="12" className="col-group">
                <Label>Subject</Label>
                <CustomInput
                  id="Subject"
                  placeholder="Subject"
                  disabled={readOnly}
                  invalid={!!errors.subject}
                  {...register("subject")}
                />
                <FormFeedback>{errors.subject?.message}</FormFeedback>
              </Col>
              <Col xxl="12" xl="12" lg="12" className="col-group">
                <Label className="">Email</Label>
                <CustomRichTextEditor
                  content={content}
                  disabled={readOnly}
                  handleChange={(text: string) => handleComposeEmail(text)}
                />
              </Col>
            </Row>

            {!readOnly && (
              <div className="btn-wrapper">
                <ACL
                  submodule={"notes"}
                  module={"professionals"}
                  action={["GET", "POST"]}
                >
                  <CustomButton
                    className="primary-btn"
                    onClick={handleSubmit(submit)}
                    disabled={loading === "loading" || content.length === 0}
                  >
                    Save
                  </CustomButton>
                </ACL>
                <CustomButton className="secondary-btn" onClick={toggle}>
                  Cancel
                </CustomButton>
              </div>
            )}
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ProfessionalEmailModal;
