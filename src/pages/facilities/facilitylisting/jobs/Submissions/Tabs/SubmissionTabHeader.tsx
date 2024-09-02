import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

type HeaderProps = {
  activeTab: number;
  toggleTab: (categotyId: number) => void;
};
const SubmissionTabHeader = ({ activeTab, toggleTab }: HeaderProps) => {
  const navData = [
    {
      Id: 1,
      Category: "Submissions",
    },
    {
      Id: 2,
      Category: "Declined/Terminated",
    },
  ];
  return (
    <div className="facility-header-wrap no-shadow">
      <div className="tab-wrapper ">
        <Nav tabs>
          {navData.map((category: any) => (
            <NavItem key={category.Id} className="nav-item">
              <NavLink
                className={` ${activeTab === category.Id ? "show" : ""}`}
                onClick={() => toggleTab(category.Id)}
                to={""}
              >
                {category.Category}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default SubmissionTabHeader;
