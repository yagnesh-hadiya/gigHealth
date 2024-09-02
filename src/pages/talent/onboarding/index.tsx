import { Card, CardBody } from "reactstrap";
import OnBoardingDocument from "./OnBoardingDocument";
import OnboardingHeading from "./OnboardingHeading";
import OnboardingTeam from "./OnboardingTeam";
import OnboardingCardInfo from "./OnboardingCardInfo";
import useFetchOnboardingList from "../../hooks/useFetchOnboardingList";
import Loader from "../../../components/custom/CustomSpinner";
import { TalentOnboardingListType } from "../../../types/TalentOnboardingTypes";
import OnboardingRequiredDocuments from "./OnboardingRequiredDocument";
import {
  getTalentOnboardingAppliedDocs,
  getTalentOnboardingRequiredDocs,
} from "../../common";
import TalentExpiredDocuments from "./TalentExpiredDocuments";

const Index = () => {
  const { onboardingList, loading, fetchData } = useFetchOnboardingList();

  return (
    <>
      {loading === "loading" && <Loader />}
      {loading === "idle" && onboardingList.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p>There are no onboarding records</p>
        </div>
      )}
      <div className="main-onboard-margin-top">
        {loading === "idle" &&
          onboardingList &&
          onboardingList.length > 0 &&
          onboardingList?.map((list: TalentOnboardingListType) => {
            return (
              <div key={list?.Id}>
                <div className="onboarding-outer-wrapper">
                  <div className="onboarding-white-bg">
                    <div className="onboard-title-wr">
                      <h2>Congratulations on your Assignment..!!</h2>
                      <p>
                        Let's get you cleared to start. The below documents are
                        required by{" "}
                        <span className="text-capitalize">
                          {" "}
                          {list?.Facility?.Name ? list?.Facility?.Name : "-"}.
                        </span>
                      </p>
                    </div>

                    <Card className="job-list-card assignment-card">
                      <CardBody className="job-list-card-body">
                        <OnboardingHeading {...list} />
                        <OnboardingTeam />
                        <OnboardingCardInfo list={list} fetchData={fetchData} />
                        <OnBoardingDocument
                          list={list}
                          submittedDocs={getTalentOnboardingAppliedDocs(
                            list?.JobApplication?.JobComplianceDocuments
                          )}
                          fetchData={fetchData}
                        />
                        <TalentExpiredDocuments
                          doc={list}
                          fetchData={fetchData}
                        />
                        <OnboardingRequiredDocuments
                          list={list}
                          requiredDocs={getTalentOnboardingRequiredDocs(
                            list?.JobApplication?.JobComplianceDocuments
                          )}
                          fetchData={fetchData}
                        />
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Index;
