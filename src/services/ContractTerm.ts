import { Contract, ContractTermData } from "../types/ContractTerm";
import api from "./api";

export const getContractTermList = async (
  facilityId: number,
  search: string,
  abortController?: AbortController
) => {
  const list = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/list?search=${search}`,
    {
      signal: abortController?.signal,
    }
  );
  return list.data.data;
};
export const getContractTermId = async (facilityId: number) => {
  const nextId = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/contractId/next`
  );
  return nextId.data.data[0];
};

export const deleteContractTerm = async (
  facilityId: number,
  contractTermId: number
) => {
  return await api.delete(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/delete/${contractTermId}`
  );
};

export const changeContractTermActivation = async (
  facilityId: number,
  contractTermId: number | undefined,
  value: boolean
) => {
  await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/activation/${contractTermId}`,
    {
      active: value,
    }
  );
};
export const getPayementTerms = async (facilityId: number) => {
  const list = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/payment-terms`
  );
  return list.data.data;
};
export const createContractTerm = async (
  facilityId: number,
  contractData: Contract
) => {
  const Id = await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/create`,
    {
      ...contractData,
    }
  );
  return Id.data.data[0];
};
export const getContractDetails = async (facilityId: number, Id: number) => {
  const details = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/contract/${Id}`
  );
  return details.data.data[0];
};

export const getContractIdForDownLoad = async (
  facilityId: number,
  contractTermId: number
) => {
  const response = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/download/${contractTermId}`,
    {
      responseType: "blob",
    }
  );
  return response;
};

export const editContractTerm = async (
  facilityId: number | string,
  contractId: number | string,
  contactName: string,
  contactNumber: string,
  paymentTermId: number,
  workWeek: string,
  superAdminFee: number,
  nonBillableOrientation: string,
  holidayMultiplier: number,
  includedHolidays: string,
  holidayBillingRules: string,
  overtimeMultiplier: number,
  overtimeThreshold: number,
  onCallRate: number,
  doubletimeMultiplier: number,
  callBackMultiplier: number,
  timeRoundingGuidelines: string,
  specialBillingDetails: string,
  gauranteedHrs: number,
  timekeepingProcess: string,
  missedPunchPayrollProcess: string,
  costCenters: string,
  kronosTimeCodes: string
) => {
  const editResponse = await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/edit/${contractId}`,
    {
      contactName,
      contactNumber,
      paymentTermId,
      workWeek,
      superAdminFee,
      nonBillableOrientation,
      holidayMultiplier,
      includedHolidays,
      holidayBillingRules,
      overtimeMultiplier,
      overtimeThreshold,
      onCallRate,
      doubletimeMultiplier,
      callBackMultiplier,
      timeRoundingGuidelines,
      specialBillingDetails,
      gauranteedHrs,
      timekeepingProcess,
      missedPunchPayrollProcess,
      costCenters,
      kronosTimeCodes,
    }
  );

  return editResponse;
};

export const uploadDocument = async (
  facilityId: number,
  contractTermId: number,
  { notes, contractDocuments }: ContractTermData
) => {
  const response = await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/upload/${contractTermId}`,
    { notes, contractDocuments },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
export const uploadEditedDocument = async (
  facilityId: number,
  contractTermId: number,
  { notes, contractDocuments }: ContractTermData
) => {
  const response = await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/upload/${contractTermId}`,
    { notes, contractDocuments },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
export const editedDocument = async (
  facilityId: number,
  contractTermId: number,
  documentId: number,
  { notes, contractDocuments }: ContractTermData
) => {
  const response = await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/edit/${contractTermId}/${documentId}`,
    { notes, contractDocuments },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const deleteContractDocument = async (
  facilityId: number,
  contractTermId: number,
  documentId: number
) => {
  return await api.delete(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/delete/${contractTermId}/${documentId}`
  );
};

export const downloadDoc = async (
  facilityId: number | string,
  contractId: number | string,
  documentId: number | string
) => {
  const response = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/contractterms/download/${contractId}/${documentId}`,
    {
      responseType: "blob",
    }
  );
  return response;
};
