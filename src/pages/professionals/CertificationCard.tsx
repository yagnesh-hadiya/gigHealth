import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import { formatDateInDayMonthYear, showToast } from "../../helpers";
import { CertificationCardProps } from "../../types/CertificationModalTypes";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { deleteCertification } from "../../services/ProfessionalDetails";
import Loader from "../../components/custom/CustomSpinner";
import { CertificationList } from "../../types/StoreInitialTypes";
import {
  getCertificationsList,
  toggleFetchDetails,
} from "../../store/ProfessionalDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import CertificationEditModal from "./ProfessionalsModals/CertificationEditModal";
import ACL from "../../components/custom/ACL";

const CertificationCard = ({
  Id,
  Name,
  Expiry,
  setFetchData,
}: CertificationCardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const [editData, setEditData] = useState<CertificationList | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] =
    useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const certificationDetails: CertificationList[] = useSelector(
    getCertificationsList
  );
  const dispatch = useDispatch();

  const handleDeleteCertifications = async (certificateId: number) => {
    try {
      setLoading(true);
      const response = await deleteCertification(
        Number(params?.Id),
        certificateId
      );
      showToast(
        "success",
        "Certificate deleted successfully" || response.data?.message
      );
      setFetchData((prevData) => !prevData);
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
    const data: CertificationList | undefined = certificationDetails?.find(
      (item: CertificationList): boolean => item?.Id === licenseId
    );

    if (data) {
      setIsCertificateModalOpen(true);
      setReadOnly(false);
      setEditData(data);
    }
  };

  const handleReadCertificationMode = (certificateId: number) => {
    const data: CertificationList | undefined = certificationDetails?.find(
      (item: CertificationList): boolean => item?.Id === certificateId
    );
    if (data) {
      setIsCertificateModalOpen(true);
      setReadOnly(true);
      setEditData(data);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="prof-wrapper">
        <div className="d-flex align-items-center mt-3">
          <div
            className="prof-card-subheading me-3 text-blue text-capitalize"
            style={{ marginBottom: "0px", cursor: "pointer" }}
            onClick={() => handleReadCertificationMode(Id)}
          >
            {Name}
          </div>
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
            <CustomDeleteBtn onDelete={() => handleDeleteCertifications(Id)} />
          </ACL>
        </div>
        <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
          <div className="d-flex align-items-center">
            <div className="file-content">
              <span className="info-title">Certificate Name: </span>
              <span className="info-content me-4">{Name}</span>
              <span className="info-title">Expiration Date: </span>
              <span className="info-content">
                {formatDateInDayMonthYear(Expiry?.toString())}
              </span>
            </div>
          </div>
        </div>
      </div>
      {editData && isCertificateModalOpen && (
        <CertificationEditModal
          isOpen={isCertificateModalOpen}
          toggle={() => {
            setIsCertificateModalOpen(false);
            setEditData(null);
          }}
          setFetchData={setFetchData}
          editData={editData}
          readOnly={readOnly}
        />
      )}
    </>
  );
};

export default CertificationCard;
