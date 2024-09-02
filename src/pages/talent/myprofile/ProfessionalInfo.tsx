import { Button } from "reactstrap";
import { useEffect, useState } from "react";
import { showToast } from "../../../helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  CertificationList,
  LicenseList,
} from "../../../types/StoreInitialTypes";
import {
  getCertificationsList,
  getLicensesList,
  setCertificationList,
  setLicenseList,
} from "../../../store/ProfessionalDetailsSlice";
import {
  getProfessionalCertficationList,
  getProfessionalLicenseList,
} from "../../../services/ProfessionalMyProfile";
import Loader from "../../../components/custom/CustomSpinner";
import ProfessionalLicenseModal from "./modals/ProfessionalLicenseModal";
import ProfessionalLicenseCard from "./Cards/ProfessionalLicenseCard";
import ProfessionalCertificationModal from "./modals/ProfessionalCertificationModal";
import ProfessionalCertificationCard from "./Cards/ProfessionalCertificationCard";
import { ProfileInformationCardProps } from "../../../types/ProfessionalDetails";

const ProfessionalInfo = ({ setFetchDetails }: ProfileInformationCardProps) => {
  const [licenseModal, setLicenseModal] = useState<boolean>(false);
  const [certificationModal, setCertificationModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const dispatch = useDispatch();
  const licenseDetails: LicenseList[] = useSelector(getLicensesList);
  const certificationDetails: CertificationList[] = useSelector(
    getCertificationsList
  );

  const fetchLicenseAndCertifications = async () => {
    try {
      setLoading("loading");
      const [license, certificates] = await Promise.all([
        getProfessionalLicenseList(),
        getProfessionalCertficationList(),
      ]);
      const newLicenseList = license.data?.data;
      dispatch(setLicenseList(newLicenseList));
      dispatch(setCertificationList(certificates.data?.data));
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

  useEffect(() => {
    fetchLicenseAndCertifications();
  }, [licenseDetails.length < 0, certificationDetails.length < 0]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div>
        <h3 className="scroll-title mb-3">Professional Info</h3>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <h2
            className="form-small-text scroll-title mb-3"
            style={{ fontSize: "18px", fontWeight: "500" }}
          >
            Licences
          </h2>
          <Button
            outline
            className="purple-outline-btn mb-2 min-width-146"
            onClick={() => setLicenseModal(true)}
          >
            Add License
          </Button>
        </div>

        {licenseDetails &&
          licenseDetails.length > 0 &&
          licenseDetails?.map((item, index) => {
            return (
              <ProfessionalLicenseCard
                {...item}
                key={item.Id}
                index={index + 1}
                fetch={fetchLicenseAndCertifications}
                setFetchDetails={setFetchDetails}
              />
            );
          })}

        {licenseModal && (
          <ProfessionalLicenseModal
            isOpen={licenseModal}
            toggle={() => setLicenseModal((prevModal) => !prevModal)}
            fetch={fetchLicenseAndCertifications}
            setFetchDetails={setFetchDetails}
          />
        )}

        <div className="d-flex align-items-center justify-content-between flex-wrap mt-2">
          <p
            className="form-small-text scroll-title mb-3"
            style={{ fontSize: "16px", fontWeight: "500" }}
          >
            Certifications
          </p>
          <Button
            outline
            className="purple-outline-btn mb-2 min-width-146"
            onClick={() => setCertificationModal(true)}
          >
            Add Certification
          </Button>
        </div>
      </div>

      {certificationDetails &&
        certificationDetails.length > 0 &&
        certificationDetails?.map((item, index) => {
          return (
            <ProfessionalCertificationCard
              {...item}
              key={item.Id}
              index={index + 1}
              fetch={fetchLicenseAndCertifications}
              setFetchDetails={setFetchDetails}
            />
          );
        })}

      {certificationModal && (
        <ProfessionalCertificationModal
          isOpen={certificationModal}
          toggle={() => setCertificationModal(false)}
          fetch={fetchLicenseAndCertifications}
          setFetchDetails={setFetchDetails}
        />
      )}
    </>
  );
};

export default ProfessionalInfo;
