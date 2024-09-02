import { useState } from "react";
import OnboardingSidebar from "./OnboardingSidebar";
import ProfessionalOnboardingDocuments from "./OnboardingDocument/ProfessionalOnboardingDocuments";
import ProfessionalUploadedDocuments from "./OnboardingDocument/ProfessionalUploadedDocuments";
import ProfessionalSubmissionDocuments from "./OnboardingDocument/ProfessionalSubmissionDocuments";

type OnboardingLayoutProps = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  fetchOnboardingDocuments: () => void;
};

const OnboardingLayout = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  fetchOnboardingDocuments,
}: OnboardingLayoutProps) => {
  const [activeComponent, setActiveComponent] = useState<string>("");

  const componentMapping: { [key: string]: React.ReactNode } = {
    "Onboarding Documents": (
      <ProfessionalOnboardingDocuments
        fetchOnboardingDocuments={fetchOnboardingDocuments}
        professionalId={professionalId}
        jobId={jobId}
        jobApplicationId={jobApplicationId}
        jobAssignmentId={jobAssignmentId}
        facilityId={facilityId}
      />
    ),
    "Submission Documents": (
      <ProfessionalSubmissionDocuments
        fetchOnboardingDocuments={fetchOnboardingDocuments}
        professionalId={professionalId}
        jobId={jobId}
        jobApplicationId={jobApplicationId}
        jobAssignmentId={jobAssignmentId}
        facilityId={facilityId}
      />
    ),
    "Professional Documents": (
      <ProfessionalUploadedDocuments
        fetchOnboardingDocuments={fetchOnboardingDocuments}
        professionalId={professionalId}
        jobId={jobId}
        jobApplicationId={jobApplicationId}
        jobAssignmentId={jobAssignmentId}
        facilityId={facilityId}
      />
    ),
  };

  return (
    <div>
      <div className="d-flex sidebar-onboarding w-100">
        <div className="left">
          <OnboardingSidebar
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
        </div>
        <div className="w-100">
          <div className="facility-listing-wrapper ms-3">
            {componentMapping[activeComponent]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
