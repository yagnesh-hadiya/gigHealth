import { useState } from "react";
import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import { formatPhoneNumber, showToast } from "../../../helpers";
import { AdditionalEmergencyContactCardProps } from "../../../types/ProfessionalDocumentType";
import { deleteAdminContact } from "../../../services/AdditionalDetails";
import { useParams } from "react-router-dom";
import Loader from "../../../components/custom/CustomSpinner";
import EditAdditionalEmergencyContactModal from "./EditAdditionalEmergencyContactModal";

const AdditionalEmergencyContactCard = ({
  Id,
  Name,
  Email,
  Phone,
  State,
  City,
  ZipCode,
  Address,
  setFetch,
  state,
  dispatch,
}: AdditionalEmergencyContactCardProps) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [edit, setEdit] = useState<boolean>(false);
  const data = {
    Id,
    Name,
    Email,
    Phone,
    State,
    ZipCode,
    Address,
    City,
  };
  const params = useParams();
  const professionalId = Number(params?.Id);

  const handleDeleteContact = async (Id: number) => {
    try {
      setLoading("loading");
      const response = await deleteAdminContact(professionalId, Id);
      if (response.status === 200) {
        setFetch((prev) => !prev);
      }
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
      <div className="ref-wrapper me-4 additional-wrapper">
        <div className="details-wrapper" style={{ padding: "10px 10px" }}>
          <div className="d-flex">
            <p
              className="prof-card-subheading me-2 text-capitalize"
              style={{ marginBottom: "8px" }}
            >
              {Name ? Name : "-"}
            </p>
            <CustomEditBtn onEdit={() => setEdit((prev) => !prev)} />

            <CustomDeleteBtn onDelete={() => handleDeleteContact(Id)} />
          </div>
        </div>

        <div className="section-content" style={{ marginBottom: "0px" }}>
          <span>
            <span className="main-text">Phone:</span>
            {Phone ? formatPhoneNumber(Phone) : "-"}
          </span>
        </div>
        <div className="section-content" style={{ marginBottom: "0px" }}>
          <span>
            <span className="main-text">Email:</span>
            {Email ? Email : "-"}
          </span>
        </div>
        <div
          className="section-content mb-2 d-flex text-capitalize"
          style={{ marginBottom: "0px" }}
        >
          <span className="main-text">Address:</span>
          <span>
            {Address ? Address : "-"}, {State ? State.State : "-"}{" "}
            {ZipCode ? ZipCode.ZipCode : "-"}
          </span>
        </div>
      </div>
      <EditAdditionalEmergencyContactModal
        isOpen={edit}
        toggle={() => setEdit(false)}
        Id={Id}
        state={state}
        dispatch={dispatch}
        setFetch={setFetch}
        data={data}
      />
    </>
  );
};

export default AdditionalEmergencyContactCard;
