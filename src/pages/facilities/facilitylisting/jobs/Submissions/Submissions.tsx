import { useState } from "react";
import { TabContent, TabPane } from "reactstrap";
import SubmissionTabHeader from "./Tabs/SubmissionTabHeader";
import SubmissionsTab from "./SubmissionsTab";
import { RightJobContentData } from "../../../../../types/JobsTypes";
import RejectedTab from "./Rejected/RejectedTab";
import CustomMainCard from "../../../../../components/custom/CustomCard";

type SubmissionsProps = { job: RightJobContentData };

const Submissions = ({ job }: SubmissionsProps) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <CustomMainCard>
        <div>
          <h2 className="page-content-header ps-3 mb-0 pt-2">
            Profiles Submitted To Client
          </h2>
          <div
            className="header-wrap"
            style={{
              paddingTop: "1rem",
            }}
          >
            <SubmissionTabHeader activeTab={activeTab} toggleTab={toggleTab} />
          </div>

          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <SubmissionsTab job={job} activeTab={activeTab} />
            </TabPane>
            <TabPane tabId={2}>
              <RejectedTab job={job} activeTab={activeTab} />
            </TabPane>
          </TabContent>
        </div>
      </CustomMainCard>
    </>
  );
};

export default Submissions;
