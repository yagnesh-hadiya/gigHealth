import { useEffect, useState } from "react";
import { showToast } from "../../helpers";
import { fetchOnboardingList } from "../../services/TalentOnboarding";
import { TalentOnboardingListType } from "../../types/TalentOnboardingTypes";

const useFetchOnboardingList = () => {
  const [onboardingList, setOnboardingList] = useState<
    TalentOnboardingListType[]
  >([]);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const fetchData = async () => {
    try {
      setLoading("loading");
      const response = await fetchOnboardingList();
      if (response.status === 200) {
        setOnboardingList(response.data?.data);
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast("error", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { onboardingList, loading, fetchData };
};

export default useFetchOnboardingList;
