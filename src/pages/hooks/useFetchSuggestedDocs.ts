import { useEffect, useState } from "react";
import { showToast } from "../../helpers";
import { getSuggestedDocs } from "../../services/TalentJobs";
import { SuggestedJobsType } from "../../types/TalentJobs";

const useFetchSuggestedDocs = (
  docIds: number[],
  size: number,
  page: number
) => {
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJobsType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("loading");
        if (docIds) {
          const promises = docIds?.map(async (docId) => {
            const response = await getSuggestedDocs(docId, size, page);
            return response;
          });

          const results = await Promise.all(promises);
          setSuggestedJobs(results);
        }
        setLoading("idle");
      } catch (error: any) {
        console.log("error", error);
        console.error(error);
        setLoading("error");
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };

    fetchData();
  }, [docIds?.length, page]);

  return { loading, setLoading, suggestedJobs };
};

export default useFetchSuggestedDocs;
