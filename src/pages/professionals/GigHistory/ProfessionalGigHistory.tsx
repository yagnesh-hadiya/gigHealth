import { useState } from "react";
import { TabContent, TabPane } from "reactstrap";
import GigHistoryHeader from "./GigHistoryHeader";
import AssignmentHistory from "./AssignmentHistory";
import AppliedJob from "./AppliedJobs/AppliedJobs";
import JobInterest from "./JobInterest/JobInterest";

const ProfessionalGigHistory = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <div className="bg-white">
        <div>
          <h2 className="page-content-header ps-3 mb-0 pt-2">Gig History</h2>
          <div className="header-wrap">
            <GigHistoryHeader activeTab={activeTab} toggleTab={toggleTab} />
          </div>

          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <AssignmentHistory />
            </TabPane>
            <TabPane tabId={2}>
              <AppliedJob />
            </TabPane>
            <TabPane tabId={3}>
              <JobInterest />
            </TabPane>
          </TabContent>
        </div>
      </div>
    </>
  );
};

export default ProfessionalGigHistory;
