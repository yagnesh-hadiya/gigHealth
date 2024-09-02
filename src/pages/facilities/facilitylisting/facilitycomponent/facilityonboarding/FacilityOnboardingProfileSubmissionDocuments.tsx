import Loader from "../../../../../components/custom/CustomSpinner";
import { showToast } from "../../../../../helpers";
import { ProfessionalOnboardingDocumentType } from "../../../../../types/ProfessionalOnboardingTypes";
import { useCallback, useEffect, useState } from "react";
import CustomButton from "../../../../../components/custom/CustomBtn";
import FacilityOnboardingServices from "../../../../../services/FacilityOnboardingServices";
import FacilityOnboardingAddNewDoc from "./FacilityOnboardingAddNewDoc";
import FacilityOnboardingProfileSubmissionDocumentCard from "./FacilityOnboardingProfileSubmissionDocumentCard";

type FacilityOnboardingProfileSubmissionDocumentsProps = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  fetchList: () => void;
};

const FacilityOnboardingProfileSubmissionDocuments = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  fetchList,
}: FacilityOnboardingProfileSubmissionDocumentsProps) => {
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [data, setData] = useState<ProfessionalOnboardingDocumentType[]>([]);
  const [addNewDoc, setAddNewDoc] = useState(false);

  const toggleAddNewModal = () => {
    setAddNewDoc(!addNewDoc);
  };

  const fetch = useCallback(async () => {
    setLoading("loading");
    try {
      const response =
        await FacilityOnboardingServices.fetchOnboardingDocuments({
          jobId,
          facilityId,
          professionalId,
          jobApplicationId,
        });
      if (response.status === 200) {
        setData(response.data.data);
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      showToast("error", error.response.data.message || "An error occurred");
    }
  }, [facilityId, jobId, professionalId, jobApplicationId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="offer-wrapper p-3"   style={{boxShadow: '0px 2px 2px 0px #00000026'}}>
        {data.map((doc) => (
          <>
            <FacilityOnboardingProfileSubmissionDocumentCard
              key={doc.Id}
              onboardingDocument={doc}
              facilityId={facilityId}
              jobId={jobId}
              professionalId={professionalId}
              jobApplicationId={jobApplicationId}
              fetchDocuments={fetch}
              fetchList={fetchList}
            />
          </>
        ))}

        <div className="right-buttons text-start justify-content-start mt-4">
          <CustomButton
            className="professional-button text-nowrap"
            onClick={() => setAddNewDoc(true)}
          >
            Add new Documents
          </CustomButton>
        </div>
        {addNewDoc && (
          <FacilityOnboardingAddNewDoc
            isOpen={addNewDoc}
            toggle={toggleAddNewModal}
            facilityId={facilityId}
            jobId={jobId}
            professionalId={professionalId}
            jobApplicationId={jobApplicationId}
            fetchDocuments={fetch}
            fetchList={fetchList}
          />
        )}
      </div>
    </>
  );
};

export default FacilityOnboardingProfileSubmissionDocuments;
