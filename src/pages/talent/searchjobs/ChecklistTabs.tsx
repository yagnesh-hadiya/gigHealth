import { useEffect, useState } from "react";
import { NavLink, TabContent, TabPane, Nav, NavItem } from "reactstrap";
import { CompChecklist, CompDocuments } from "../../../types/TalentJobs";

type ChecklistTabsProps = {
  documentList: CompChecklist;
};

const ChecklistTabs = ({ documentList }: ChecklistTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("Required to Apply");

  useEffect(() => {
    if (documentList) {
      setActiveTab(
        documentList?.CompDocuments[0]?.DocumentCategory?.Category || ""
      );
    }
  }, [documentList]);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const uniqueCategories = Array.from(
    new Set(
      documentList?.CompDocuments?.map((doc) => doc?.DocumentCategory?.Category)
    )
  );

  return (
    <div className="search-job-tabs">
      <div className="tab-wrapper compliance-wrapper px-0">
        {documentList && documentList?.CompDocuments?.length > 0 && (
          <Nav tabs>
            {uniqueCategories?.map((category: string) => {
              return (
                <NavItem key={category}>
                  <NavLink
                    className={activeTab === category ? "active" : ""}
                    onClick={() => toggleTab(category)}
                  >
                    {category}
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
        )}

        <TabContent activeTab={activeTab}>
          {documentList &&
            documentList?.CompDocuments &&
            uniqueCategories.map((category) => (
              <TabPane key={category} tabId={category}>
                {documentList?.CompDocuments?.filter(
                  (doc) => doc?.DocumentCategory?.Category === category
                ).map((doc: CompDocuments, index: number) => {
                  return (
                    <ol className="para-text" key={doc?.Id}>
                      <p className="mb-3 text-capitalize" key={doc?.Id}>
                        {index + 1}. {doc?.DocumentMaster?.Type}
                      </p>
                    </ol>
                  );
                })}
              </TabPane>
            ))}
        </TabContent>
      </div>
    </div>
  );
};

export default ChecklistTabs;
