import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomRichTextEditor from "../../../../../components/custom/CustomTextEditor";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CreatableSelect from "react-select/creatable";
import { useEffect, useRef, useState } from "react";
import { capitalize, emaildropdownStyles } from "../../../../../helpers";
import { useForm } from "react-hook-form";
import { Form, useParams } from "react-router-dom";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { getEmail, getName } from "../../../../../store/UserSlice";
import { emailSubmission } from "../../../../../services/SubmissionServices";
import { toast } from "react-toastify";
import Loader from "../../../../../components/custom/CustomSpinner";
import { JobSubmission } from "../../jobs/Submissions/ReadOnlyCoverPageDetails";
import { ProfessionalDetails } from "../../../../../types/StoreInitialTypes";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import Attachment from "../../../../../assets/images/attachment.svg";

type RejectModalProps = {
  isOpen: boolean;
  toggle: () => void;
  currentApplicantId: number;
  professionalId: number;
  facilityId: number;
  submission: JobSubmission;
  currentProfessional: ProfessionalDetails;
  job: RightJobContentData;
};

type ComposeEmailModal = {
  subject: string;
};

const ComposeEmailSchema = object().shape({
  subject: string().required(),
});

const ComposeEmailModal = ({
  isOpen,
  toggle,
  professionalId,
  currentApplicantId,
  submission,
  currentProfessional,
  job,
}: RejectModalProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ComposeEmailModal>({
    resolver: yupResolver(ComposeEmailSchema) as any,
  });
  const params = useParams();
  const userName: string = useSelector(getName);
  const userEmail: string = useSelector(getEmail);

  useEffect(() => {
    setValue(
      "subject",
      `Gig Submission: ${capitalize(
        currentProfessional &&
          currentProfessional?.FirstName + " " + currentProfessional?.LastName
      )}, ${
        currentProfessional?.JobProfession
          ? capitalize(currentProfessional?.JobProfession.Profession)
          : ""
      }, ${capitalize(job && job?.Title)} Required, Start Date ${
        submission && submission?.AvailableStartDate.replace(/-/g, "/")
      }`
    );
  }, [currentProfessional, job, setValue, submission]);

  const emailHtmlContent = `
  <p >Hi,</p>
 <p style="margin-bottom:20px;color:"red">The following healthcare professional would like to apply:</p>
   <p ><strong>Professional Name:</strong>${
     currentProfessional &&
     capitalize(currentProfessional?.FirstName) +
       " " +
       capitalize(currentProfessional?.LastName)
   }</p>
    <p ><strong>Profession:</strong>
    ${
      currentProfessional?.JobProfession
        ? capitalize(currentProfessional?.JobProfession.Profession)
        : ""
    }</p>
    </p>
    <p ><strong>Unit: </strong>${submission?.Unit ? submission.Unit : ""}</p>
   <p><strong>Hospital Name:</strong>
    ${job?.Facility ? capitalize(job?.Facility.Name) : ""}
   </p>
   <p><strong>Available Start Date:</strong> ${
     submission?.AvailableStartDate ? submission?.AvailableStartDate : ""
   }</p>
   <p><strong>Requested Time Off:</strong> ${
     submission?.JobRequestingTimeOffs
       ? submission?.JobRequestingTimeOffs[0].Date
       : ""
   }</p>
   <p><strong>Additional Notes:</strong>${
     submission?.Notes ? submission.Notes : ""
   }</li>
   <br /><br />
 <p>Thanks,</p>
<b>${capitalize(userName)}</b>
 <p>gig Healthcare</p>
 <b>Email:</b>
 <p>${userEmail}</p>
<p> <img src = "data:image/png;base64, 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" height='15%' width='15%' alt="logo"/></p>
`;

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedCcs, setSelectedCcs] = useState([]);
  const [selectedBccs, setSelectedBccs] = useState([]);
  const fromInputRef = useRef<HTMLInputElement | null>(null);
  const [body, setBody] = useState<string>(
    loading === "loading" ? "" : emailHtmlContent
  );

  const handleEmailChange = (selectedOption: any) => {
    setSelectedEmails(selectedOption);
  };
  const handleCcChange = (selectedOption: any) => {
    setSelectedCcs(selectedOption);
  };

  const handleBccChange = (selectedOption: any) => {
    setSelectedBccs(selectedOption);
  };

  useEffect(() => {
    const contentWidth = fromInputRef.current?.scrollWidth;
    if (fromInputRef.current) {
      fromInputRef.current.style.width = `${contentWidth}px`;
    }
  }, []);

  const onSubmit = async (data: ComposeEmailModal) => {
    if (selectedEmails.length === 0) {
      toast.error("Please select atleast one email");
      return;
    }

    if (!body) {
      toast.error("Please enter email content");
      return;
    }

    setLoading("loading");
    try {
      const response = await emailSubmission({
        facilityId: Number(params?.fId),
        jobId: Number(params?.jId),
        professionalId: professionalId,
        jobApplicationId: currentApplicantId,
        data: {
          toEmails: selectedEmails.map((email: any) => email.value),
          ccEmails:
            selectedCcs.length > 0
              ? selectedCcs.map((email: any) => email.value)
              : undefined,
          bccEmails:
            selectedBccs.length > 0
              ? selectedBccs.map((email: any) => email.value)
              : undefined,
          subject: data.subject,
          body: body,
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setLoading("idle");
        toggle();
      }
    } catch (error: any) {
      setLoading("error");
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal isOpen={isOpen} toggle={toggle} centered={true} size="lg">
        <ModalHeader toggle={toggle}>Email Submission</ModalHeader>
        <ModalBody
          style={{
            marginLeft: "10px",
            marginRight: "20px",
            height: "800px",
            overflow: "auto",
          }}
        >
          <Form>
            <ListGroup>
              <ListGroupItem className="from-input-style">
                <div className="d-flex justify-content-space-between">
                  From
                  <CustomInput
                    placeholder=""
                    value={userEmail}
                    onChange={() => {}}
                    className="from-style"
                    disabled
                    ref={fromInputRef}
                  />
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <div className="d-flex justify-content-space-between">
                  <span className="to-style">To</span>

                  <div className="dropdown-wrapper">
                    <CreatableSelect
                      isMulti
                      name="emails"
                      // options={emailOptions as any}
                      classNamePrefix="select"
                      value={selectedEmails}
                      styles={emaildropdownStyles}
                      onChange={handleEmailChange}
                      placeholder=""
                      formatCreateLabel={(inputValue) =>
                        `Use this address: ${inputValue}`
                      }
                    />
                  </div>
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <div className="d-flex">
                  <span className="to-style">Cc</span>
                  <div className="dropdown-wrapper">
                    <CreatableSelect
                      isMulti
                      name="cc"
                      // options={ccOptions as any}
                      classNamePrefix="select"
                      value={selectedCcs}
                      styles={emaildropdownStyles}
                      onChange={handleCcChange}
                      placeholder=""
                      formatCreateLabel={(inputValue) =>
                        `Use this address: ${inputValue}`
                      }
                    />
                  </div>
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <div className=" d-flex ">
                  <span className="to-style">Bcc</span>
                  <div className="dropdown-wrapper">
                    <CreatableSelect
                      isMulti
                      name="bccc"
                      // options={bccOptions as any}
                      styles={emaildropdownStyles}
                      classNamePrefix="select"
                      value={selectedBccs}
                      onChange={handleBccChange}
                      placeholder=""
                      formatCreateLabel={(inputValue: any) =>
                        `Use this address: ${inputValue}`
                      }
                    />
                  </div>
                </div>
              </ListGroupItem>
            </ListGroup>

            <div className="subject-style">
              <p>Subject</p>
              <CustomInput placeholder="Subject" {...register("subject")} />
              {errors.subject && (
                <p style={{ color: "red" }}>{errors.subject.message}</p>
              )}
            </div>

            <p>Email</p>
            <div className="email-wrapper">
              <CustomRichTextEditor
                content={body}
                readOnly={false}
                className="editor-container"
                handleChange={(text: string) => setBody(text)}
              />
            </div>

            <div
              style={{
                display: "flex",
                backgroundColor: "#F7F8F3",
                flexDirection: "row",
                alignItems: "center",
                border: "1px solid #DDDDEA",
                borderRadius: "5px",
                margin: "10px 0",
                padding: "12px",
                gap: "10px",
              }}
            >
              <img
                src={Attachment}
                alt="logo"
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                }}
              />
              <span
                style={{
                  color: "#2E65C3",
                  lineHeight: "16.94px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                submission.pdf
              </span>
            </div>
            <div className="btn-wrapper">
              <CustomButton
                className="primary-btn"
                disabled={loading === "loading"}
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </CustomButton>
              <CustomButton className="secondary-btn" onClick={toggle}>
                Cancel
              </CustomButton>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ComposeEmailModal;
