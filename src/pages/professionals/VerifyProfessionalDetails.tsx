import {
  Col,
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomTextArea from "../../components/custom/CustomTextarea";
import CustomButton from "../../components/custom/CustomBtn";
import {
  RatingLevelType,
  RatingParameterType,
  VerifyWorkReferenceType,
  WorkReferenceType,
} from "../../types/WorkReferenceTypes";
import {
  fetchReferenceDetails,
  getRatingLevels,
  getRatingParameters,
  verifyReference,
} from "../../services/ProfessionalServices";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Loader from "../../components/custom/CustomSpinner";
import CustomRadioBtnForRatings from "../../components/custom/CustomRadioBtnForRatings";
import { Form } from "react-router-dom";
import { useSelector } from "react-redux";
import { getName } from "../../store/UserSlice";
import CustomCheckbox from "../../components/custom/CustomCheckboxBtn";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalize, formatPhoneNumber } from "../../helpers";
import { createReferenceSchema } from "../../helpers/schemas/CreateReferenceSchema";
import { toast } from "react-toastify";

export interface VerifyProfessionalDetailsProps {
  fetch: () => void;
  isOpen: boolean;
  toggle: () => void;
  workReference: WorkReferenceType;
  professionalId: number;
}

export type VerifyReferenceType = {
  facilityName: string;
  referenceName: string;
  title: string;
  email: string;
  phone: string;
  additionalFeedback: string;
};

export type VerifyReferenceModalRadiobtn = {
  hireAgain: true | false;
};

const VerifyProfessionalDetails = ({
  isOpen,
  toggle,
  workReference,
  professionalId,
  fetch,
}: VerifyProfessionalDetailsProps) => {
  const [reference, setReference] = useState<VerifyWorkReferenceType | null>(
    null
  );
  const [ratingLevels, setRatingLevels] = useState<RatingLevelType[]>([]);
  const [ratingParameters, setRatingParameters] = useState<
    RatingParameterType[]
  >([]);
  const [selectedRatings, setSelectedRatings] = useState<
    { ratingParameterId: number; ratingLevelId: number }[]
  >([]);
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const userName: string = useSelector(getName);
  const [radionBtnValue, setRadionBtnValue] =
    useState<VerifyReferenceModalRadiobtn>({
      hireAgain: false,
    });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyReferenceType>({
    resolver: yupResolver(createReferenceSchema) as any,
  });

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadionBtnValue({ hireAgain: e.target.checked });
  };

  const fetchReference = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await fetchReferenceDetails(
        Number(professionalId),
        workReference.Id
      );
      if (res.status === 200) {
        setReference(res.data.data[0]);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
    }
  }, [professionalId, workReference.Id]);

  const listRating = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await getRatingLevels(Number(professionalId));
      if (res.status === 200) {
        setRatingLevels(res.data.data);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
    }
  }, [professionalId]);

  const listParameters = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await getRatingParameters(Number(professionalId));
      if (res.status === 200) {
        setRatingParameters(res.data.data);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
    }
  }, [professionalId]);

  const handleRatingChange = (parameterId: number, levelId: number) => {
    const existingRatingIndex = selectedRatings.findIndex(
      (rating) => rating.ratingParameterId === parameterId
    );

    if (existingRatingIndex !== -1) {
      const updatedRatings = [...selectedRatings];
      updatedRatings[existingRatingIndex] = {
        ratingParameterId: parameterId,
        ratingLevelId: levelId,
      };
      setSelectedRatings(updatedRatings);
    } else {
      setSelectedRatings([
        ...selectedRatings,
        { ratingParameterId: parameterId, ratingLevelId: levelId },
      ]);
    }
  };

  const onSubmit = async (data: VerifyReferenceType) => {
    setLoading("loading");
    const formattedRatings = selectedRatings.map((rating) => ({
      ratingParameterId: rating.ratingParameterId,
      ratingLevelId: rating.ratingLevelId,
    }));

    if (formattedRatings.length !== 6) {
      toast.error("Please select all ratings");
      setLoading("idle");
      return;
    }

    const numberNoHyphens = data.phone.replace(/-/g, "");

    try {
      const res = await verifyReference({
        referenceId: Number(reference?.Id),
        professionalId: professionalId,
        additionalFeedback: data.additionalFeedback,
        facilityName: data.facilityName,
        referenceName: data.referenceName,
        title: data.title,
        email: data.email,
        phone: numberNoHyphens,
        rating: formattedRatings,
        wouldHireAgain: radionBtnValue.hireAgain,
      });
      if (res.status === 200) {
        setLoading("idle");
        toggle();
        fetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setValue("facilityName", capitalize(workReference.FacilityName));
    setValue("referenceName", capitalize(workReference.ReferenceName));
    setValue("title", capitalize(workReference.Title));
    setValue("email", workReference.Email);
    setValue("phone", formatPhoneNumber(workReference.Phone));
    listRating();
    listParameters();
    fetchReference();
  }, [
    fetchReference,
    listRating,
    listParameters,
    setValue,
    workReference.FacilityName,
    workReference.ReferenceName,
    workReference.Title,
    workReference.Email,
    workReference.Phone,
  ]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered={true}
        size="lg"
        onClosed={toggle}
      >
        <ModalHeader toggle={toggle}>Check Reference Details</ModalHeader>
        <ModalBody style={{ height: "600px", overflow: "auto" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="facility-listing-loader">
              <Row>
                <Col md="6" className="col-group">
                  <Label>Facility/Hospital Name</Label>
                  <CustomInput
                    id="facilityName"
                    placeholder=""
                    className="facility-field-color"
                    invalid={!!errors.facilityName}
                    {...register("facilityName")}
                  />
                  <FormFeedback>{errors.facilityName?.message}</FormFeedback>
                </Col>
                <Col md="6" className="col-group">
                  <Label className="">
                    Reference Name
                    <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    placeholder="Reference Name"
                    invalid={!!errors.referenceName}
                    {...register("referenceName")}
                  />
                  <FormFeedback>{errors.referenceName?.message}</FormFeedback>
                </Col>
                <Col md="6" className="col-group">
                  <Label className="">
                    Title
                    <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    placeholder="Title"
                    className="user-field-color"
                    invalid={!!errors.title}
                    {...register("title")}
                  />
                  <FormFeedback>{errors.title?.message}</FormFeedback>
                </Col>
                <Col md="4" className="col-group">
                  <Label>
                    Phone <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="Phone"
                    placeholder="Phone Number"
                    {...register("phone", {
                      onChange: (e) => {
                        const formattedNumber: string = formatPhoneNumber(
                          e.target.value
                        );
                        setValue("phone", formattedNumber);
                      },
                    })}
                  />
                  {errors.phone && (
                    <label
                      className="text-danger"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        marginTop: "5px",
                        marginLeft: "5px",
                      }}
                    >
                      {errors.phone.message}
                    </label>
                  )}
                </Col>
                <Col xxl="6" xl="6" lg="6" className="col-group">
                  <Label className="">
                    Email Address
                    <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    placeholder="Email"
                    className="user-field-color"
                    invalid={!!errors.email}
                    {...register("email")}
                  />
                  <FormFeedback>{errors.email?.message}</FormFeedback>
                </Col>
                <Col md="6" className="col-group">
                  <Label>Checked By</Label>
                  <CustomInput
                    id="user"
                    placeholder=""
                    className="user-field-color"
                    value={capitalize(userName)}
                    disabled={true}
                  />
                </Col>
              </Row>
              <div className="table-wrapper">
                <Table bordered>
                  <thead>
                    <tr>
                      <th></th>
                      {ratingLevels.map((level) => (
                        <th key={level.Id}>{level.Rating}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ratingParameters.map((parameter) => (
                      <tr key={parameter.Id}>
                        <td>{parameter.Parameter}</td>
                        {ratingLevels.map((level) => (
                          <td key={level.Id} className="text-center">
                            <CustomRadioBtnForRatings
                              disabled={false}
                              options={
                                selectedRatings.some(
                                  (rating) =>
                                    rating.ratingParameterId === parameter.Id &&
                                    rating.ratingLevelId === level.Id
                                )
                                  ? [{ value: "true" }]
                                  : [{ value: "false" }]
                              }
                              selected={selectedRatings.some(
                                (rating) =>
                                  rating.ratingParameterId === parameter.Id &&
                                  rating.ratingLevelId === level.Id
                              )}
                              onChange={() => {
                                handleRatingChange(parameter.Id, level.Id);
                              }}
                              className="custom-radio-style ms-0"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Col>
                <div className="d-flex mb-4 align-items-center gap-2">
                  <CustomCheckbox
                    disabled={false}
                    checked={radionBtnValue.hireAgain}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleCheckBoxChange(e)
                    }
                  />
                  <Label className="col-label">Would hire again?</Label>
                </div>
              </Col>
            </div>
            <Row>
              <Col md="12" className="col-group">
                <Label>Additional Feedback</Label>
                <CustomTextArea
                  id="additionalFeedback"
                  disabled={false}
                  placeholder="Write Here"
                  invalid={!!errors.additionalFeedback}
                  {...register("additionalFeedback")}
                />
              </Col>
            </Row>
            <div className="btn-wrapper mt-0">
              <CustomButton className="primary-btn mt-0 ms-0" type="submit">
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

export default VerifyProfessionalDetails;
