import {
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomTextArea from "../../components/custom/CustomTextarea";
import {
  RatingLevelType,
  RatingParameterType,
  VerifyWorkReferenceType,
} from "../../types/WorkReferenceTypes";
import {
  fetchReferenceDetails,
  getRatingLevels,
  getRatingParameters,
} from "../../services/ProfessionalServices";
import { useCallback, useEffect, useState } from "react";
import Loader from "../../components/custom/CustomSpinner";
import { Form } from "react-router-dom";
import { useSelector } from "react-redux";
import { getName } from "../../store/UserSlice";
import CustomCheckbox from "../../components/custom/CustomCheckboxBtn";
import { capitalize, formatPhoneNumber } from "../../helpers";

export interface ReadOnlyProfessionalDetailsProps {
  isOpen: boolean;
  toggle: () => void;
  workReferenceId: number;
  professionalId: number;
}

export type VerifyReferenceModalRadiobtn = {
  hireAgain: true | false;
};

const ReadOnlyProfessionalDetails = ({
  isOpen,
  toggle,
  workReferenceId,
  professionalId,
}: ReadOnlyProfessionalDetailsProps) => {
  const [reference, setReference] = useState<VerifyWorkReferenceType | null>(
    null
  );
  const [ratingLevels, setRatingLevels] = useState<RatingLevelType[]>([]);
  const [ratingParameters, setRatingParameters] = useState<
    RatingParameterType[]
  >([]);
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const userName: string = useSelector(getName);

  const fetchReference = useCallback(async () => {
    setLoading("loading");
    try {
      const res = await fetchReferenceDetails(
        Number(professionalId),
        workReferenceId
      );
      if (res.status === 200) {
        setReference(res.data.data[0]);
        setLoading("idle");
      }
    } catch (error) {
      console.error(error);
    }
  }, [professionalId, workReferenceId]);

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

  useEffect(() => {
    listRating();
    listParameters();
    fetchReference();
  }, [fetchReference, listRating, listParameters]);

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
          <Form>
            <div className="facility-listing-loader">
              <Row>
                <Col md="6" className="col-group">
                  <Label>Facility/Hospital Name</Label>
                  <CustomInput
                    id="facilityName"
                    placeholder=""
                    value={capitalize(
                      reference?.FacilityName ? reference.FacilityName : ""
                    )}
                    className="facility-field-color"
                    disabled={true}
                  />
                </Col>
                <Col md="6" className="col-group">
                  <Label className="">
                    Reference Name
                    <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    placeholder="Reference Name"
                    value={capitalize(
                      reference?.ReferenceName ? reference.ReferenceName : ""
                    )}
                    disabled={true}
                  />
                </Col>
                <Col md="6" className="col-group">
                  <Label className="">
                    Title
                    <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    placeholder="Title"
                    className="user-field-color"
                    value={capitalize(reference?.Title ? reference.Title : "")}
                    disabled={true}
                  />
                </Col>
                <Col md="4" className="col-group">
                  <Label>
                    Phone <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="Phone"
                    placeholder="Phone Number"
                    value={formatPhoneNumber(
                      reference?.Phone ? reference.Phone : ""
                    )}
                    disabled={true}
                  />
                </Col>
                <Col xxl="6" xl="6" lg="6" className="col-group">
                  <Label className="">
                    Email Address
                    <span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    placeholder="Email"
                    className="user-field-color"
                    value={reference?.Email}
                    disabled={true}
                  />
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
              {reference?.ReferenceRatings &&
                reference?.ReferenceRatings.length === 6 && (
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
                              <td key={level.Id}>
                                <input
                                  type="radio"
                                  value={level.Id}
                                  checked={
                                    reference?.ReferenceRatings &&
                                    reference?.ReferenceRatings.some(
                                      (rating) =>
                                        rating.RatingParameter.Id ===
                                          parameter.Id &&
                                        rating.RatingLevel.Id === level.Id
                                    )
                                  }
                                  style={{
                                    width: "1rem",
                                    height: "1rem",
                                    borderRadius: "50%",
                                    accentColor: "green",
                                  }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              <Col>
                <div className="d-flex mb-4 align-items-center gap-2">
                  <CustomCheckbox
                    disabled={false}
                    checked={reference?.WouldHireAgain === true}
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
                  disabled={true}
                  placeholder="Write Here"
                  value={reference?.AdditionalFeedback}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ReadOnlyProfessionalDetails;
