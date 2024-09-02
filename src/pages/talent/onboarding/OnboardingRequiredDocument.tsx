import {
  TalentJobComplianceDocuments,
  TalentOnboardingRequiredDocumentProps,
} from "../../../types/TalentOnboardingTypes";
// import useFetchSuggestedDocs from "../../hooks/useFetchSuggestedDocs";
import RequiredDocsUplaodFile from "./RequiredDocsUploadFile";
// import { getRequiredDocsIds } from "../../common";
import TalentSuggestedDocs from "./TalentSuggestedDocs";

const OnboardingRequiredDocuments = ({
  list,
  requiredDocs,
  fetchData,
}: TalentOnboardingRequiredDocumentProps) => {
  // const docIds = getRequiredDocsIds(requiredDocs);
  // const [page, setPage] = useState<number>(1);
  // const { suggestedJobs } = useFetchSuggestedDocs(docIds, 10, page);

  return (
    <div className="select-picker-wrapper">
      {requiredDocs?.map((doc: TalentJobComplianceDocuments) => {
        return (
          <div className="talent-modal-picker" key={doc?.Id}>
            <p className="text-capitalize">
              {doc?.DocMaster?.Type ? doc?.DocMaster?.Type : "-"}
              <span className="asterisk">*</span>
              <span className="fw-400">
                {" "}
                {doc?.DocMaster?.Description
                  ? `(${doc?.DocMaster?.Description})`
                  : ""}
              </span>
            </p>
            {doc?.JobSuggestedDocCount &&
              doc.JobSuggestedDocCount?.Count !== 0 && (
                <div className="mb-2">
                  <TalentSuggestedDocs
                    docId={doc?.DocMaster?.Id}
                    docCount={doc?.JobSuggestedDocCount?.Count}
                    jobId={list?.JobId}
                    jobApplicationId={list?.JobApplicationId}
                    complianceId={doc?.Id}
                    setFetchDetails={fetchData}
                    fileName={doc?.DocMaster?.Type}
                    // setPage={setPage}
                  />
                </div>
              )}
            <RequiredDocsUplaodFile
              list={list}
              file={doc}
              fetchData={fetchData}
            />
          </div>
        );
      })}
    </div>
  );
};

export default OnboardingRequiredDocuments;
