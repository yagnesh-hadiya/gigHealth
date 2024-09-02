import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Loader from "../../../components/custom/CustomSpinner";
import { ProfessionalOnboardingType } from "../../../types/ProfessionalOnboardingTypes";
import ProfessionalOnboardingCard from "./ProfessionalOnboardingCard";
import { showToast } from "../../../helpers";
import ProfessionalOnboardingServices from "../../../services/ProfessionalOnboardingServices";

const ProfessionalOnboarding = () => {
  const params = useParams<{ Id: string }>();
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [onboardingData, setOnboardingData] = useState<
    ProfessionalOnboardingType[]
  >([]);

  const fetch = useCallback(async () => {
    setLoading("loading");
    try {
      const res =
        await ProfessionalOnboardingServices.getProfessionalOnboarding(
          Number(params.Id)
        );
      if (res.status === 200) {
        setOnboardingData(res.data.data);
        setLoading("idle");
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.response.data.message, "error");
      setLoading("error");
    }
  }, [params.Id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div
        style={{
          gap: "1rem",
        }}
      >
        {onboardingData.length === 0 && (
          <div className="no-data-found text-center">
            There are no records to display.
          </div>
        )}

        {onboardingData.map((data: ProfessionalOnboardingType) => (
          <ProfessionalOnboardingCard
            key={data.Id}
            onboarding={data}
            fetchOnboarding={fetch}
          />
        ))}
      </div>
    </>
  );
};

export default ProfessionalOnboarding;
