import api from "./api";

export const getFaqList = async (
  facilityId: number,
  search: string,
  abortController?: AbortController
) => {
  const list = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/faqs/list?search=${search}`,
    {
      signal: abortController?.signal,
    }
  );
  return list.data.data;
};

export const createFaq = async (
  facilityId: number,
  faqs: {
    question: string;
    answer: string;
    isInternalUse: boolean;
    typeId: number;
  }[]
) => {
  await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/faqs/create`,
    {
      faqs,
    }
  );
};

export const deleteFaqs = async (faqIds: number[], facilityId: number) => {
  const idsString = faqIds.join(",");
  await api.delete(
    `/api/v1/protected/submodules/facilities/${facilityId}/faqs/delete?ids=${idsString}`
  );
};

export const editFaq = async (
  question: string,
  answer: string,
  typeId: number,
  facilityId: number,
  Id: number
) => {
  await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/faqs/edit/${Id}`,
    {
      question,
      answer,
      typeId,
    }
  );
};
export const faqType = async (facilityId: number) => {
  const types = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/faqs/types`
  );
  return types.data.data;
};
