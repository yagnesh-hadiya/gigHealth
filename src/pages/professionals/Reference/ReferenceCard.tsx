import { toast } from "react-toastify";
import CustomButton from "../../../components/custom/CustomBtn";
import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import {
  capitalize,
  debounce,
  formatDate,
  formatPhoneNumber,
} from "../../../helpers";
import {
  DeleteWorkReference,
  toggleShowOnSubmission,
} from "../../../services/ProfessionalServices";
import { WorkReferenceType } from "../../../types/WorkReferenceTypes";
import EditReference from "./EditReference";
import { ChangeEvent, useState } from "react";
import VerifyProfessionalDetails from "../VerifyProfessionalDetails";
import CustomCheckbox from "../../../components/custom/CustomCheckboxBtn";
import ACL from "../../../components/custom/ACL";
// import File from "../../../assets/images/file.svg";
import ReadOnlyProfessionalDetails from "../ReadOnlyProfessionalDetails";
import { useDispatch } from "react-redux";
import { toggleFetchDetails } from "../../../store/ProfessionalDetailsSlice";

type ReferenceCardProps = {
  id: number;
  fetch: () => void;
  workReference: WorkReferenceType;
};

export type ReferenceCardRadiobtn = {
  showOnSubmission: true | false;
};

const ReferenceCard = ({ workReference, id, fetch }: ReferenceCardProps) => {
  const [radionBtnValue, setRadionBtnValue] = useState<ReferenceCardRadiobtn>({
    showOnSubmission: workReference.ShowOnSubmission,
  });
  const [isVerifyProfDetails, setIsVerifyProfDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const verifyDetails = () => {
    setIsVerifyProfDetails(true);
  };

  const showReadOnlyDetails = () => {
    setIsReadOnlyProfessionalDetails(true);
  };
  const [isReadOnlyProfessionalDetails, setIsReadOnlyProfessionalDetails] =
    useState(false);

  const onEditHandler = () => {
    setIsOpen(true);
  };

  const handleCheckBoxChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setRadionBtnValue({ showOnSubmission: !e.target.checked });
      try {
        const res = await toggleShowOnSubmission({
          referenceId: workReference.Id,
          professionalId: id,
          showOnSubmission: !e.target.checked,
        });
        if (res.status === 200) {
          fetch();
          toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    500
  );

  const onDeleteHandler = async () => {
    try {
      const res = await DeleteWorkReference(id, workReference.Id);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetch();
        dispatch(toggleFetchDetails());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content-wrapper align-items-center">
      <div className="ref-wrapper">
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            backgroundColor: workReference.IsVerified ? "#F7F8F4" : "",
          }}
        >
          <div
            style={{
              flex: 2,
              margin: "0.5rem",
              borderRight: "1px solid #717B9E33",
            }}
          >
            <div
              style={{
                padding: "10px 10px",
              }}
            >
              <div className="d-flex">
                <p
                  className="edu-card-title me-2"
                  style={{ marginBottom: "8px" }}
                >
                  {capitalize(workReference.FacilityName)}
                </p>
                {!workReference.IsVerified && (
                  <>
                    <ACL
                      submodule={"details"}
                      module={"professionals"}
                      action={["GET", "PUT"]}
                    >
                      <CustomEditBtn onEdit={onEditHandler} />
                    </ACL>
                    <ACL
                      submodule={"details"}
                      module={"professionals"}
                      action={["GET", "DELETE"]}
                    >
                      <CustomDeleteBtn onDelete={onDeleteHandler} />
                    </ACL>
                  </>
                )}
              </div>
            </div>
            <p
              className="prof-card-subheading"
              style={{ marginBottom: "8px", marginLeft: "10px" }}
            >
              {capitalize(workReference.ReferenceName)}
            </p>
            <div className="section-content" style={{ marginBottom: "0px" }}>
              <span>
                <span className="main-text">Title: </span>
                {capitalize(workReference.Title)}
              </span>
            </div>
            <div className="d-flex mb-2">
              <div className="section-content" style={{ marginBottom: "0px" }}>
                <span>
                  <span className="main-text">Phone: </span>
                  {formatPhoneNumber(workReference.Phone)}
                </span>
              </div>
              <div
                className="section-content ms-3"
                style={{ marginBottom: "0px" }}
              >
                <span>
                  <span className="main-text">Email:</span>
                  {workReference.Email}
                </span>
              </div>
            </div>

            <div
              className="d-flex gap-2"
              style={{ marginBottom: "0px", flexDirection: "row" }}
            >
              <div className="d-flex align-items-center m-2 gap-1">
                <CustomCheckbox
                  disabled={false}
                  checked={workReference.CanContact}
                />
                <label className="col-label">Can contact for call</label>
              </div>
              <ACL
                submodule={""}
                module={"professionals"}
                action={["GET", "PUT"]}
              >
                <div className="d-flex align-items-center m-2 gap-1">
                  <CustomCheckbox
                    disabled={false}
                    checked={radionBtnValue.showOnSubmission}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleCheckBoxChange(e)
                    }
                  />
                  <label className="col-label">Show on Submission</label>
                </div>
              </ACL>
            </div>
          </div>
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              padding: "1rem 0.5rem 1rem 1rem",
            }}
          >
            {workReference.IsVerified === true && (
              <div className="d-flex">
                <div className="d-flex align-items-center">
                  <button
                    onClick={showReadOnlyDetails}
                    className="file-img d-flex align-items-center"
                  >
                    {/* <img src={File} className="ms-2" /> */}
                    <span className="material-symbols-outlined filled">
                      description
                    </span>
                  </button>

                  <div className="file-content file-text">
                    <span className="text-blue fw-600">Reference Check</span>
                    <div>
                      <span className="onboard-title text-grey d-block">
                        Uploaded On: {formatDate(workReference.VerifiedOn)}
                      </span>
                      <span className="onboard-info-content text-grey">
                        Checked By:{" "}
                        {capitalize(workReference.VerifiedByUser.FirstName)}{" "}
                        {capitalize(workReference.VerifiedByUser.LastName)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {workReference.CanContact === true &&
              workReference.IsVerified === false && (
                <div className="text-start ms-3 mb-2">
                  <ACL
                    submodule={""}
                    module={"professionals"}
                    action={["GET", "POST"]}
                  >
                    <CustomButton
                      className="verify-button"
                      onClick={verifyDetails}
                    >
                      Verify Reference Details
                    </CustomButton>
                  </ACL>
                </div>
              )}
          </div>
        </div>
      </div>
      {isOpen && (
        <EditReference
          isOpen={isOpen}
          toggle={() => setIsOpen(false)}
          fetch={fetch}
          id={id}
          workReference={workReference}
        />
      )}
      {isVerifyProfDetails && (
        <VerifyProfessionalDetails
          fetch={fetch}
          professionalId={id}
          isOpen={isVerifyProfDetails}
          toggle={() => setIsVerifyProfDetails(false)}
          workReference={workReference}
        />
      )}
      {isReadOnlyProfessionalDetails && (
        <ReadOnlyProfessionalDetails
          professionalId={id}
          workReferenceId={workReference.Id}
          isOpen={isReadOnlyProfessionalDetails}
          toggle={() => setIsReadOnlyProfessionalDetails(false)}
        />
      )}
    </div>
  );
};

export default ReferenceCard;
