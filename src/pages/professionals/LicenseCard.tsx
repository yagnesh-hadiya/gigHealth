import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import { formatDateInDayMonthYear, showToast } from "../../helpers";
import { useParams } from "react-router-dom";
import { deleteLicense } from "../../services/ProfessionalDetails";
import { LicenseCardProps } from "../../types/ProfessionalDetails";
import { useDispatch, useSelector } from "react-redux";
import { LicenseList } from "../../types/StoreInitialTypes";
import {
  getLicensesList,
  toggleFetchDetails,
} from "../../store/ProfessionalDetailsSlice";
import { useState } from "react";
import LicenseEditModal from "./ProfessionalsModals/LicenseEditModal";
import Loader from "../../components/custom/CustomSpinner";
import ACL from "../../components/custom/ACL";

const LicenseCard = ({
  setFetchData,
  Id,
  Name,
  LicenseNumber,
  IsActiveCompact,
  Expiry,
  State,
}: LicenseCardProps) => {
  const params = useParams();
  const [editData, setEditData] = useState<LicenseList | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const licenseDetails: LicenseList[] = useSelector(getLicensesList);
  const dispatch = useDispatch();

  const handleDelete = async (licenseId: number) => {
    try {
      setLoading(true);
      const response = await deleteLicense(Number(params?.Id), licenseId);
      showToast(
        "success",
        "License deleted successfully" || response.data?.message
      );
      setFetchData((prevState) => !prevState);
      dispatch(toggleFetchDetails());
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleEdit = (licenseId: number) => {
    const data: LicenseList | undefined = licenseDetails?.find(
      (item: LicenseList): boolean => item?.Id === licenseId
    );
    if (data) {
      setIsLicenseModalOpen(true);
      setReadOnly(false);
      setEditData(data);
    }
  };

  const handleReadLicenseMode = (licenseId: number) => {
    const data: LicenseList | undefined = licenseDetails?.find(
      (item: LicenseList): boolean => item?.Id === licenseId
    );
    if (data) {
      setIsLicenseModalOpen(true);
      setReadOnly(true);
      setEditData(data);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div
        className="prof-wrapper"
        style={{ marginBottom: "24px", backgroundColor: "none" }}
      >
        <div className="d-flex align-items-center mt-3">
          <p
            className="prof-card-subheading me-3 text-blue text-capitalize"
            style={{ marginBottom: "0px", cursor: "pointer" }}
            onClick={() => handleReadLicenseMode(Id)}
          >
            {Name}
          </p>
          <ACL
            submodule="details"
            module="professionals"
            action={["GET", "PUT"]}
          >
            <CustomEditBtn onEdit={() => handleEdit(Id)} />
          </ACL>
          <ACL
            submodule="details"
            module="professionals"
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => handleDelete(Id)} />
          </ACL>
        </div>
        <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
          <div className="d-flex align-items-center">
            <div className="file-content">
              <p style={{ marginBottom: "0px" }}>
                <span className="info-title">License Number: </span>
                <span className="info-content">{LicenseNumber}</span>
              </p>
              <span className="info-title">License State: </span>
              <span className="info-content me-4">{State?.State}</span>
              <span className="info-title">Active Compact Status: </span>
              <span className="info-content me-4">
                {IsActiveCompact === true ? "Yes" : "No"}
              </span>
              <span className="info-title">Expiration Date: </span>
              <span className="info-content">
                {formatDateInDayMonthYear(Expiry?.toString())}
              </span>
            </div>
          </div>
        </div>
      </div>
      {editData && (
        <LicenseEditModal
          isOpen={isLicenseModalOpen}
          toggle={() => {
            setIsLicenseModalOpen(false);
            setEditData(null);
          }}
          setFetchData={setFetchData}
          data={editData}
          readOnly={readOnly}
        />
      )}
    </>
  );
};

export default LicenseCard;
