import { ProfessionalCertificationCardProps } from "../../../../types/ProfessionalMyProfile";
import { Button, Col, FormFeedback, Label, Row } from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import { MouseEvent, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Calendar from "../../../../assets/images/calendar.svg";
import { showToast } from "../../../../helpers";
import Loader from "../../../../components/custom/CustomSpinner";
import {
  deleteProfessionalCertification,
  editProfessionalCertification,
} from "../../../../services/ProfessionalMyProfile";
import { Form } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CertificationModalSchema } from "../../../../helpers/schemas/CertificationModalSchema";
import { CertificationModalType } from "../../../../types/CertificationModalTypes";
import CustomDeleteBtn from "../../../../components/custom/CustomDeleteBtn";

const ProfessionalCertificationCard = ({
  Id,
  Name,
  Expiry,
  index,
  fetch,
  setFetchDetails,
}: ProfessionalCertificationCardProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CertificationModalType>({
    resolver: yupResolver(CertificationModalSchema) as any,
  });

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  const handleExpirationDate = (date: Date) => setExpirationDate(date);

  const onSubmit = async (data: CertificationModalType) => {
    try {
      if (!expirationDate) {
        return showToast("error", "Select expiration date");
      }

      setLoading("loading");
      await editProfessionalCertification(
        Id,
        data?.name,
        expirationDate && expirationDate
          ? moment(expirationDate?.toString()).format("YYYY-MM-DD")
          : ""
      );
      // showToast(
      //   "success",
      //   "Certification edited successfully" || response.data?.message
      // );
      fetch();
      setEdit((prevEdit) => !prevEdit);
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

  const onDeleteHandler = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await deleteProfessionalCertification(Id);

      if (response.status === 200) {
        // showToast("success", "Certification deleted successfully");
        if (fetch) {
          fetch();
          setFetchDetails && setFetchDetails((prev) => !prev);
        }
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const onEditHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEdit((prevValue) => !prevValue);
  };

  useEffect(() => {
    setValue("name", Name);
    setExpirationDate(new Date(Expiry));
  }, []);

  return (
    <>
      {loading === "loading" && <Loader />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <p
            className="form-small-text scroll-title mb-0"
            style={{ fontSize: "16px" }}
          >
            Certification {index ? index : ""}
          </p>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={(e) => onEditHandler(e)}
          >
            <span className="material-symbols-outlined">Edit</span>
          </Button>
          <CustomDeleteBtn
            onDelete={() => {
              if (Id) {
                onDeleteHandler(Id);
              }
            }}
          />
        </div>
        {/* <h2 className="form-small-text scroll-title mb-0">
          Certification {index ? index : ""}
        </h2>
        <Button
          type="button"
          className="dt-talent-btn"
          onClick={(e) => onEditHandler(e)}
        >
          <span className="material-symbols-outlined">Edit</span>
        </Button>
        <CustomDeleteBtn
          onDelete={() => {
            if (Id) {
              onDeleteHandler(Id);
            }
          }}
        /> */}
        <Row className="mt-3">
          <Col sm="6">
            <div className="mb-3">
              <Label for="select_cert">
                Certification Name<span className="asterisk">*</span>
              </Label>
              <CustomInput
                placeholder="Certification Name"
                invalid={!!errors.name}
                {...register("name")}
                disabled={!edit}
                style={{ textTransform: "capitalize" }}
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
                dateFormat="h:mm aa"
                isClearable={true}
                className="custom-select-picker-all contract-select"
                disabled={!edit}
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
                      disabled={!edit}
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
        <div className="d-flex align-items-center mb-2" style={{ gap: "12px" }}>
          <Button
            className="blue-gradient-btn mb-0 mobile-btn"
            disabled={!edit}
          >
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};

export default ProfessionalCertificationCard;
