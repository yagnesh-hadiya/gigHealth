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
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomRichTextEditor from "../../../../../components/custom/CustomTextEditor";
import { EmailModalType } from "../../../../../types/NotesTypes";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EmailModalSchema } from "../../../../../helpers/schemas/NotesSchema";
import { showToast } from "../../../../../helpers";
import Loader from "../../../../../components/custom/CustomSpinner";
import { postEmail } from "../../../../../services/NotesServices";
import { useSelector } from "react-redux";
import { getEmail } from "../../../../../store/UserSlice";
import ACL from "../../../../../components/custom/ACL";

type EmailModalProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  fetchNotes: () => void;
};

const EmailModal = ({
  isOpen,
  toggle,
  facilityId,
  fetchNotes,
}: EmailModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailModalType>({
    resolver: yupResolver(EmailModalSchema) as any,
  });
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const email: string = useSelector(getEmail);

  const handleComposeEmail = (text: string) => {
    setContent(text);
  };

  const onSubmit = async (data: EmailModalType) => {
    if (!content) {
      return showToast("error", "Email body is required");
    } else if (typeof content !== "string") {
      return showToast("error", "Email body should be of type string");
    } else if (content.length < 2 || content.length > 1000) {
      return showToast(
        "error",
        "Email body must be between 2 to 1000 characters"
      );
    }

    try {
      setLoading(true);
      const email = await postEmail(
        Number(facilityId),
        data.toEmail,
        data.subject,
        content
      );
      showToast(
        "success",
        "Email activity Created Successfully" || email.data?.message
      );
      setLoading(false);
      fetchNotes();
      toggle();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}> Compose Email </ModalHeader>
        <ModalBody>
          {loading && <Loader />}
          <Form onSubmit={handleSubmit(onSubmit)}>
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
                  placeholder=""
                  disabled={false}
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
                  disabled={false}
                  invalid={!!errors.subject}
                  {...register("subject")}
                />
                <FormFeedback>{errors.subject?.message}</FormFeedback>
              </Col>
              <Col xxl="12" xl="12" lg="12" className="col-group">
                <Label className="">Email</Label>
                <CustomRichTextEditor
                  content={content}
                  handleChange={(text: string) => handleComposeEmail(text)}
                />
              </Col>
            </Row>
            <div className="btn-wrapper">
              <ACL
                submodule={"notes"}
                module={"facilities"}
                action={["GET", "POST"]}
              >
                <CustomButton className="primary-btn"> Save</CustomButton>
              </ACL>
              <CustomButton className="secondary-btn" onClick={() => toggle()}>
                Cancel
              </CustomButton>
            </div>
          </Form>
        </ModalBody>
        {/* <ModalFooter className="mb-3 justify-content-start">
            <div className="btn-wrapper">
              <CustomButton className="primary-btn" >Save</CustomButton>
              <CustomButton className="secondary-btn" onClick={toggle}>Cancel</CustomButton>
            </div>
          </ModalFooter> */}
      </Modal>
    </>
  );
};
export default EmailModal;
