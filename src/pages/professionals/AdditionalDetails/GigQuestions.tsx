import { Col, FormGroup, Input, Label } from "reactstrap";
import { GigQuestionsProps } from "../../../types/ProfessionalDocumentType";
import CustomInput from "../../../components/custom/CustomInput";

const GigQuestions = ({ state }: GigQuestionsProps) => {
  return (
    <>
      {state.gigList?.DiscoveredGig?.Option === "Other" && (
        <div className="d-flex gap-10 ">
          <Col lg="5" md="12">
            <div className="mb-3 mt-4">
              <Label for="discover_drp">
                How did you discover Gig Healthcare?
              </Label>
              <CustomInput
                type="text"
                placeholder="How did you discover Gig Healthcare?"
                id="deg_text"
                className="text-capitalize"
                disabled
                value={state.gigList?.DiscoveredGig?.Option}
              />
            </div>
          </Col>
          <Col lg="6" md="12">
            <div className="mb-3 mt-4">
              <Label for="discover_drp">
                Other
                <span className="asterisk">*</span>
              </Label>
              <CustomInput
                type="text"
                placeholder="How did you discover Gig Healthcare?"
                id="deg_text"
                className="text-capitalize"
                disabled
                value={state.gigList?.DiscoveredGigOther}
              />
            </div>
          </Col>
        </div>
      )}

      {state.gigList?.DiscoveredGig?.Option === "Referral" && (
        <div className="d-flex gap-10">
          <Col lg="5" md="12">
            <div className="mb-3 mt-4">
              <Label for="discover_drp">
                How did you discover Gig Healthcare?
              </Label>
              <CustomInput
                type="text"
                placeholder="How did you discover Gig Healthcare?"
                id="deg_text"
                className="text-capitalize"
                disabled
                value={state.gigList?.DiscoveredGig?.Option}
              />
            </div>
          </Col>
          <Col lg="6" md="12">
            <div className="mb-3 mt-4">
              <Label for="discover_drp">
                Referral Name or Professional/Referral ID
                <span className="asterisk">*</span>
              </Label>
              <CustomInput
                type="text"
                placeholder="How did you discover Gig Healthcare?"
                id="deg_text"
                className="text-capitalize"
                disabled
                value={state.gigList?.ReferralId}
              />
            </div>
          </Col>
        </div>
      )}

      {!(state.gigList?.DiscoveredGig?.Option === "Other") &&
        !(state.gigList?.DiscoveredGig?.Option === "Referral") && (
          <ol className="list-wrapper" style={{ padding: "0px 20px" }}>
            How did you discover Gig?
            <FormGroup check>
              <Input
                name={`gig`}
                type="radio"
                id={`gig`}
                checked={true}
                disabled={true}
              />{" "}
              <Label check for="gig">
                {" "}
                {state?.gigList?.DiscoveredGig?.Option}{" "}
              </Label>
            </FormGroup>
          </ol>
        )}
      {/* <ol className="list-wrapper">
        <li>
          How did you discover Gig?
          <div className="text-wrapper">
            <CustomRadioButton
              options={[{ label: "Word of Mouth", value: "true" }]}
              onChange={() => {}}
              name={""}
            />
          </div>
        </li>
      </ol> */}
    </>
  );
};

export default GigQuestions;
