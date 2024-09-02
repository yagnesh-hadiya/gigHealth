import { useEffect, useState } from "react";
import CertificationCard from "./CertificationCard";
import LicenseCard from "./LicenseCard";
import CustomButton from "../../components/custom/CustomBtn";
import { showToast } from "../../helpers";
import { useParams } from "react-router-dom";
import {
  getCertficationList,
  getLicenseList,
} from "../../services/ProfessionalDetails";
import Loader from "../../components/custom/CustomSpinner";
import { useDispatch, useSelector } from "react-redux";
import {
  getCertificationsList,
  getLicensesList,
  setCertificationList,
  setLicenseList,
} from "../../store/ProfessionalDetailsSlice";
import { CertificationList, LicenseList } from "../../types/StoreInitialTypes";
import CertificationModal from "./ProfessionalsModals/CertificationModal";
import ACL from "../../components/custom/ACL";
import LicenseModal from "./ProfessionalsModals/LIcenseModal";

const ProfessionalLicenses = () => {
  const [licenseModal, setLicenseModal] = useState<boolean>(false);
  const [certificationModal, setCertificationModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const licenseDetails: LicenseList[] = useSelector(getLicensesList);
  const certificationDetails: CertificationList[] = useSelector(
    getCertificationsList
  );
  const [fetchData, setFetchData] = useState<boolean>(false);
  const params = useParams();

  const toggleLicenseModal = () => setLicenseModal((prevModal) => !prevModal);
  const toggleCertificationModal = () =>
    setCertificationModal((prevModal) => !prevModal);

  const fetchLicenseAndCertifications = async () => {
    try {
      setLoading(true);
      const [license, certificates] = await Promise.all([
        getLicenseList(Number(params?.Id)),
        getCertficationList(Number(params?.Id)),
      ]);
      const newLicenseList = license.data?.data;
      dispatch(setLicenseList(newLicenseList));
      dispatch(setCertificationList(certificates.data?.data));
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
  useEffect(() => {
    fetchLicenseAndCertifications();
  }, [fetchData]);

  return (
    <>
      {loading && <Loader />}
      <div
        style={{
          borderRadius: "4px",
          background: "#fff",
          boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
          marginTop: "10px",
          marginBottom: "5px",
        }}
      >
        <div
          className="facility-header-wrap view-file-wrapper bg-white"
          style={{ padding: "10px 10px" }}
        >
          <span className="section-header" style={{ padding: "10px 21px" }}>
            Professional Information
          </span>
          <div className="wrapper">
            <div className="details-wrapper">
              <span className="prof-card-header mb-4">Licenses</span>
              {licenseDetails.length > 0 &&
                licenseDetails?.map((item: LicenseList) => (
                  <LicenseCard
                    key={item.Id}
                    setFetchData={setFetchData}
                    Id={item.Id}
                    Name={item?.Name}
                    LicenseNumber={item?.LicenseNumber}
                    IsActiveCompact={item?.IsActiveCompact}
                    Expiry={item?.Expiry}
                    State={item?.State}
                  />
                ))}
              <div className="right-buttons text-start justify-content-start mb-4">
                <ACL
                  submodule="details"
                  module="professionals"
                  action={["GET", "POST"]}
                >
                  <CustomButton
                    className="professional-button add-more"
                    onClick={toggleLicenseModal}
                  >{`${
                    licenseDetails.length === 0 ? "Add" : "Add More"
                  }`}</CustomButton>
                </ACL>
              </div>
              <LicenseModal
                isOpen={licenseModal}
                toggle={() => setLicenseModal(false)}
                setFetchData={setFetchData}
              />
              <span
                className="prof-card-header"
                style={{ marginTop: "14px", marginBottom: "0px" }}
              >
                Certifications
              </span>
              {certificationDetails?.length > 0 &&
                certificationDetails?.map((item: CertificationList) => (
                  <CertificationCard
                    key={item.Id}
                    Id={item.Id}
                    Name={item.Name}
                    Expiry={item.Expiry}
                    setFetchData={setFetchData}
                  />
                ))}
              <div className="right-buttons text-start justify-content-start mb-2">
                <ACL
                  submodule="details"
                  module="professionals"
                  action={["GET", "POST"]}
                >
                  <CustomButton
                    className="professional-button add-more"
                    onClick={toggleCertificationModal}
                  >{`${
                    certificationDetails.length === 0 ? "Add" : "Add More"
                  }`}</CustomButton>
                </ACL>
              </div>
              <CertificationModal
                isOpen={certificationModal}
                toggle={() => setCertificationModal(false)}
                setFetchData={setFetchData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalLicenses;
