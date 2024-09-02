import {
  Button,
  Col,
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Calendar from "../../../../assets/images/calendar.svg";
import { showToast } from "../../../../helpers";
import Loader from "../../../../components/custom/CustomSpinner";
import { ProfessionalCertificationModalProps } from "../../../../types/ProfessionalMyProfile";
import { CertificationModalType } from "../../../../types/CertificationModalTypes";
import { createProfessionalCertification } from "../../../../services/ProfessionalMyProfile";
import { Form } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CertificationModalSchema } from "../../../../helpers/schemas/CertificationModalSchema";

const ProfessionalCertificationModal = ({
  isOpen,
  toggle,
  fetch,
  setFetchDetails,
}: ProfessionalCertificationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificationModalType>({
    resolver: yupResolver(CertificationModalSchema) as any,
  });

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  const handleExpirationDate = (date: Date) => setExpirationDate(date);

  const onSubmit = async (data: CertificationModalType) => {
    try {
      if (!expirationDate) {
        return showToast("error", "Select expiration date");
      }

      setLoading("loading");
      await createProfessionalCertification(
        data?.name,
        expirationDate && expirationDate
          ? moment(expirationDate?.toString()).format("YYYY-MM-DD")
          : ""
      );
      // showToast(
      //   "success",
      //   "Certification created successfully" || response.data?.message
      // );
      fetch();
      setFetchDetails && setFetchDetails((prev) => !prev);
      toggle();
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
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="xl"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Add Certification</ModalHeader>
        <ModalBody
          style={{ padding: "20px 30px", height: "auto", width: "auto" }}
        >
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6">
                <div className="mb-3">
                  <Label for="select_cert">
                    Certification Name<span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    placeholder="Certification Name"
                    invalid={!!errors.name}
                    {...register("name")}
                  />
                  <FormFeedback>{errors.name?.message}</FormFeedback>
                </div>
              </Col>
              <Col sm="6">
                <div className="accented-date-picker mb-3">
                  <Label className="">
                    Expiration Date <span className="asterisk">*</span>
                  </Label>
                  <ReactDatePicker
                    selected={expirationDate}
                    onChange={handleExpirationDate}
                    timeIntervals={15}
                    isClearable={true}
                    dateFormat="h:mm aa"
                    className="custom-select-picker-all contract-select"
                    customInput={
                      <div className="custom-calendar-wrapper">
                        <CustomInput
                          value={
                            expirationDate
                              ? moment(expirationDate.toDateString()).format(
                                  "MM-DD-YYYY"
                                )
                              : ""
                          }
                          placeholder="Expiration Date"
                        />
                        {!expirationDate && (
                          <img src={Calendar} className="calendar-icon" />
                        )}
                      </div>
                    }
                  />
                </div>
              </Col>
            </Row>
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "12px" }}
            >
              <Button className="blue-gradient-btn mb-0 mobile-btn">
                Save
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProfessionalCertificationModal;
