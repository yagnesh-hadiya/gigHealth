import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { Nav, NavItem, TabContent, TabPane } from "reactstrap";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import { useContext, useEffect, useState } from "react";
import AddContract from "./AddContract";
import UploadContract from "./UploadContract";
import CustomButton from "../../../../../components/custom/CustomBtn";
import { FacilityActiveComponentProps } from "../../../../../types";
import { FacilityActiveComponentContext } from "../../../../../helpers/context/FacilityActiveComponent";
import { FacilityNameContext } from "../../../../../helpers/context/FacilityName";
import { showToast } from "../../../../../helpers";
import { getFacilityListData } from "../../../../../services/facility";

const NewContract = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [contractIdProp, setContractIdProp] = useState<number>();
  const [editingContractId, setEditingContractId] = useState<number | null>(
    null
  );
  const { Id, contractId } = useParams();
  const { setActiveComponent } = useContext<FacilityActiveComponentProps>(
    FacilityActiveComponentContext
  );
  const navigate = useNavigate();
  const facilityDataId = useParams();
  const { facilityName, setFacilityName } = useContext(FacilityNameContext);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const switchToNextTab = () => setActiveTab("2");

  const handleContractIdChange = (newContractId: number) =>
    setContractIdProp(newContractId);

  const switchToContractInfoTab = () => setActiveTab("1");

  useEffect(() => {
    if (contractId) {
      setEditingContractId(Number(contractId));
    }
  }, [contractId]);

  useEffect(() => {
    const getFacilityData = async () => {
      try {
        const facilityData = await getFacilityListData(
          Number(facilityDataId?.Id)
        );
        setFacilityName(facilityData.data?.data[0]?.Name);
      } catch (error: any) {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };
    getFacilityData();
  }, []);

  const handleCancel = () => {
    setActiveComponent("Contract Terms");
    navigate(`/facility/${Number(Id)}`);
  };

  return (
    <>
      <div className="navigate-wrapper d-flex justify-content-between">
        <div>
          <Link to="/facility" className="link-btn">
            Facilities
          </Link>
          <span className="backlash"> / </span>
          <Link
            onClick={handleCancel}
            to={""}
            className="link-btn text-capitalize"
            style={{
              fontSize: "14px",
              fontStyle: "normal",
              lineHeight: "normal",
              letterSpacing: "-0.28px",
            }}
          >
            {/* <Link to="/facility-listing" className="link-btn"> */}
            {facilityName ?? "--"}
          </Link>
          <span> / </span>
          <span>
            {!editingContractId
              ? "Add New Contract Term"
              : "Edit Contract Term"}
          </span>
        </div>
        <div className="create-template-btn">
          <Link to={`/facility/${Number(Id)}`}>
            <CustomButton className="secondary-btn" onClick={handleCancel}>
              Back to Contract Terms
            </CustomButton>
          </Link>
        </div>
      </div>
      <CustomMainCard>
        <h2 className="page-content-header">
          {!editingContractId
            ? "Add New Contract Information"
            : "Edit Contract Term"}
        </h2>
        <div className="tab-wrapper contract-tab-wrapper">
          <Nav tabs>
            <NavItem disabled={!editingContractId && activeTab === "2"}>
              <NavLink
                className={activeTab === "1" ? "show" : ""}
                onClick={() => toggleTab("1")}
                to={""}
              >
                <input
                  className="contract-input"
                  type="text"
                  value={
                    !editingContractId
                      ? "1. Add New Contract Information"
                      : "1. Edit Contract Term"
                  }
                  disabled={activeTab === "2"}
                />
              </NavLink>
            </NavItem>
            <NavItem disabled={editingContractId && activeTab === "1"}>
              <NavLink
                className={activeTab === "2" ? "show" : ""}
                onClick={() => toggleTab("2")}
                to={""}
              >
                <input
                  className="contract-input"
                  type="text"
                  value="2. Upload Contract"
                  disabled={activeTab === "1"}
                />
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} disabled={activeTab === "1"}>
            <TabPane tabId="1">
              <AddContract
                switchToNextTab={switchToNextTab}
                onContractIdChange={handleContractIdChange}
                setActiveTab={setActiveTab}
                editingContractId={editingContractId}
              />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab} disabled={activeTab === "2"}>
            <TabPane tabId="2">
              <UploadContract
                contractIdprop={contractIdProp}
                switchToContractInfoTab={switchToContractInfoTab}
              />
            </TabPane>
          </TabContent>
        </div>
      </CustomMainCard>
    </>
  );
};

export default NewContract;
