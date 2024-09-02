import { useEffect, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import InterestedJob from "./InterestedJob";
import AppliedJobs from "./AppliedJobs";
import Assignment from "./Assignment";
import GigsFilters from "./GigsFilters";
import {
  clearCookies,
  getLoggedInStatus,
} from "../../../services/ProfessionalAuth";
import { useNavigate } from "react-router-dom";
import { setIsloggedIn } from "../../../store/ProfessionalAuthStore";
import { useDispatch } from "react-redux";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("Interested Jobs");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const isLoggedIn = getLoggedInStatus();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (isLoggedIn === "1") {
      navigate("/talent/my-profile");
    } else {
      clearCookies();
      localStorage.removeItem("isLoggedIn");
      dispatch(setIsloggedIn(false));
      navigate("/talent/login");
    }
  }, [isLoggedIn]);

  return (
    <div>
      <div className="gigs-main-wrapper">
        <div className="gigs-box-wr">
          <h2 className="gigs-title mb-2">Gig History</h2>
          <div className="search-job-tabs">
            <div className="tab-wrapper compliance-wrapper px-0">
              <Nav tabs>
                <Nav tabs>
                  {["Interested Jobs", "Applied Jobs", "Assignments"].map(
                    (tabName) => (
                      <NavItem key={tabName}>
                        <NavLink
                          className={activeTab === tabName ? "active" : ""}
                          onClick={() => toggleTab(tabName)}
                        >
                          {tabName}
                        </NavLink>
                      </NavItem>
                    )
                  )}
                </Nav>
              </Nav>
              {activeTab === "Interested Jobs" && (
                <TabContent
                  key={1}
                  activeTab={activeTab}
                  id="custom-scrollable-target1"
                >
                  <GigsFilters
                    search={search}
                    setSearch={setSearch}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                  />
                  <TabPane tabId="Interested Jobs">
                    <InterestedJob
                      search={search}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </TabPane>
                </TabContent>
              )}
              {activeTab === "Applied Jobs" && (
                <TabContent
                  key={2}
                  activeTab={activeTab}
                  id="custom-scrollable-target2"
                >
                  <GigsFilters
                    search={search}
                    setSearch={setSearch}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                  />
                  <TabPane tabId="Applied Jobs">
                    <AppliedJobs
                      search={search}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </TabPane>
                </TabContent>
              )}
              {activeTab === "Assignments" && (
                <TabContent
                  key={3}
                  activeTab={activeTab}
                  id="custom-scrollable-target3"
                >
                  <GigsFilters
                    search={search}
                    setSearch={setSearch}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                  />

                  <TabPane tabId="Assignments">
                    <Assignment
                      search={search}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </TabPane>
                </TabContent>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
