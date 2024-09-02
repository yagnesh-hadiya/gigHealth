import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import { FormGroup } from "reactstrap";
import addMore from "../../../assets/images/cross-mark.png";
import AdditionalEmergencyContactCard from "./AdditionalEmergencyContactCard";
import BackgroundQuestions from "./BackgroundQuestions";
import GigQuestions from "./GigQuestions";
import PersonalDetails from "./PersonalDetails";
import FederalQuestions from "./FederalQuestions";
import { useState } from "react";
import Loader from "../../../components/custom/CustomSpinner";
import useFetchAdditionalDetails from "../../hooks/useFetchAdditionalDetails";
import AdditionalEmergencyContactModal from "./AdditionalEmergencyModal";
import useFetchAdditionalEmergencyContact from "../../hooks/useFetchAdditionalEmergencyContact";
import { AdminEmergencyContactType } from "../../../types/ProfessionalDocumentType";
import PersonalDetailsModal from "./PersonalDetailsModal";

const AdditionalDetails = () => {
  const [fetch, setFetch] = useState<boolean>(false);
  const { state, dispatch, loading } = useFetchAdditionalDetails();
  const { data } = useFetchAdditionalEmergencyContact(fetch, dispatch);
  const [emergencyModal, setEmergencyModal] = useState<boolean>(false);
  const [personalDetailsModal, setPersonalDetailsModal] =
    useState<boolean>(false);

  const toggleEmergencyModal = () => setEmergencyModal((prev) => !prev);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="facility-header-wrap" style={{ padding: "10px 10px" }}>
        <div
          className="details-header section-header"
          style={{ padding: "5px 10px" }}
        >
          Emergency Contacts
        </div>
        <div className="content-wrapper align-items-center px-2 py-0">
          {data &&
            data.length > 0 &&
            data?.map((contact: AdminEmergencyContactType) => {
              return (
                <AdditionalEmergencyContactCard
                  key={contact.Id}
                  {...contact}
                  setFetch={setFetch}
                  state={state}
                  dispatch={dispatch}
                  data={data}
                />
              );
            })}

          <div
            className="view-file-wrapper bg-white border-0 p-0 mt-3"
            onClick={toggleEmergencyModal}
          >
            <FormGroup>
              <div className="file-picker-wrapper file-picker-section text-center">
                <div className="file-picker-label-wrapper text-center">
                  <div className="cancel-wrapper">
                    <img src={addMore} alt="" />
                    <p className="text-purple mb-0 mt-2">Add More</p>
                  </div>
                </div>
              </div>
            </FormGroup>
          </div>
        </div>
      </div>
      <div
        className="facility-header-wrap  mt-3"
        style={{ padding: "10px 10px" }}
      >
        <div
          className="details-header section-header"
          style={{ padding: "10px 21px" }}
        >
          {" "}
          Background Questions
        </div>
        <BackgroundQuestions state={state} />
      </div>

      {state.gigList?.DiscoveredGig && (
        <div
          className="facility-header-wrap  mt-3"
          style={{ padding: "10px 10px" }}
        >
          <div
            className="details-header section-header"
            style={{ padding: "10px 21px" }}
          >
            Discovering the Gig
          </div>

          <GigQuestions state={state} />
        </div>
      )}

      <div
        className="facility-header-wrap  mt-3"
        style={{ padding: "10px 10px" }}
      >
        <div
          className="details-header section-header"
          style={{ padding: "10px 21px" }}
        >
          Federal Equal Opportunity Questions
        </div>
        <FederalQuestions state={state} />
      </div>

      <div
        className="facility-header-wrap mt-3"
        style={{ padding: "10px 10px" }}
      >
        <div className="d-flex align-items-center mt-2">
          <div className="details-header section-header me-2 ps-3">
            Personal Details
          </div>
          <CustomEditBtn
            onEdit={() => {
              setPersonalDetailsModal(true);
              setFetch((prev) => !prev);
            }}
          />
        </div>
        <PersonalDetails state={state} />
      </div>

      <AdditionalEmergencyContactModal
        isOpen={emergencyModal}
        toggle={() => setEmergencyModal(false)}
        state={state}
        dispatch={dispatch}
        setFetch={setFetch}
      />

      <PersonalDetailsModal
        isOpen={personalDetailsModal}
        toggle={() => setPersonalDetailsModal(false)}
        setFetch={setFetch}
        state={state}
      />
    </>
  );
};

export default AdditionalDetails;
