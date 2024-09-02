import moment from "moment";
import { FederalQuestionType } from "../../types/ProfessionalAuth";
import { TalentJobComplianceDocuments } from "../../types/TalentOnboardingTypes";
import { authDetails } from "../../types/StoreInitialTypes";

export const formatAnswer = (data: FederalQuestionType[]) => {
  if (data) {
    const result = [];
    for (const item of data) {
      if (item?.FederalQuestionAnswer?.OptionId) {
        result.push({
          questionId: item?.Id,
          optionId: item?.FederalQuestionAnswer?.OptionId,
        });
      }
    }

    return result;
  }
};

export const isWithinPrevious1Month = (dateString: string | number | Date) => {
  const date = moment(dateString);
  const today = moment();
  const oneMonthAgo = moment().subtract(1, "month");
  return date.isBetween(oneMonthAgo, today, null, "[]");
};

export const getTalentOnboardingAppliedDocs = (
  data: TalentJobComplianceDocuments[]
) => {
  const appliedDocs = data?.filter((doc: TalentJobComplianceDocuments) => {
    return doc.ProfessionalDocument !== null && !isDocumentExpired(doc);
  });
  return appliedDocs;
};

export const getTalentOnboardingRequiredDocs = (
  data: TalentJobComplianceDocuments[]
) => {
  const requiredDocs = data?.filter(
    (doc: TalentJobComplianceDocuments) => doc.ProfessionalDocument === null
  );
  return requiredDocs;
};

export const getRequiredDocsIds = (data: TalentJobComplianceDocuments[]) => {
  const requiredDocs = data
    .filter((doc) => doc?.ProfessionalDocument === null)
    ?.flatMap((item) => item.DocMaster?.Id);

  return requiredDocs;
};

export const isDocumentExpired = (doc: TalentJobComplianceDocuments) => {
  if (!doc.ExpiryDate) return false;
  const expiryDate = moment(doc.ExpiryDate);
  const currentDate = moment();
  return (
    expiryDate.isBefore(currentDate, "day") ||
    expiryDate.diff(currentDate, "day") < 45
  );
};

export const getDocumentStatus = (doc: TalentJobComplianceDocuments) => {
  if (!doc.ExpiryDate) return null;
  const expiryDate = moment(doc.ExpiryDate);
  const currentDate = moment();
  if (expiryDate.isBefore(currentDate, "day")) {
    return "Expired On";
  } else if (expiryDate.diff(currentDate, "day") <= 45) {
    return "Expiring On";
  }
  return null;
};

export const getFormattedName = (details: authDetails, isMobile: boolean) => {
  const firstName = details?.FirstName || "";
  const lastName = details?.LastName || "";
  if (isMobile) {
    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  }
  return `${firstName} ${lastName}`;
};
