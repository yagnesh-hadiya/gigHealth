import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { checkAclPermission } from "../../../helpers";
import { FacilitySidebarMenu } from "../../../types/FacilityTypes";
import { getActiveMenu, storeActiveMenu } from "../../../helpers/tokens";

interface FacilitySidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const FacilitySidebar = ({
  setActiveComponent,
  activeComponent,
}: FacilitySidebarProps) => {
  const selectedMenu = getActiveMenu();
  const menuItems: FacilitySidebarMenu = [
    {
      text: "Facility Details",
      module: "facilities",
      submodule: "details",
    },
    {
      text: "Facility Locations",
      module: "facilities",
      submodule: "location",
    },
    {
      text: "Contacts",
      module: "facilities",
      submodule: "contacts",
    },
    {
      text: "Notes & Activity",
      module: "facilities",
      submodule: "notes",
    },
    {
      text: "Onboarding",
      module: "facilities",
      submodule: "onboarding",
    },
    {
      text: "Roster",
      module: "facilities",
      submodule: "roster",
    },
    {
      text: "Gig History",
      module: "facilities",
      submodule: "gighistory",
    },
    {
      text: "Contract Terms",
      module: "facilities",
      submodule: "contractterms",
    },
    {
      text: "Jobs",
      module: "facilities",
      submodule: "jobs",
    },
    {
      text: "Job Templates",
      module: "facilities",
      submodule: "jobtemplates",
    },
    {
      text: "Compliance",
      module: "facilities",
      submodule: "compliance",
    },
    {
      text: "Facility Documents",
      module: "facilities",
      submodule: "facilitydocuments",
    },
    {
      text: "FAQ's",
      module: "facilities",
      submodule: "faqs",
    },
  ];

  const handleClickListener = (item: string) => {
    setActiveComponent(item);
    storeActiveMenu(item);
  };

  const allowedMenus: string[] = useMemo(() => {
    const availableModules: string[] = menuItems
      .filter((menu) => {
        const mainModulePermission: boolean = checkAclPermission(
          menu.module,
          menu.submodule,
          ["GET"]
        );
        const subModules: boolean = checkAclPermission(
          menu.module,
          menu.submodule,
          ["GET"]
        );
        return mainModulePermission || subModules;
      })
      .map((menu) => menu.text);

    return availableModules;
  }, []);

  useEffect(() => {
    if (allowedMenus.length > 0 && !selectedMenu) {
      const firstAvailableModule = allowedMenus[0];
      setActiveComponent(
        activeComponent ? activeComponent : firstAvailableModule
      );
    } else {
      if (selectedMenu) {
        setActiveComponent(selectedMenu);
      }
    }
  }, [allowedMenus, setActiveComponent]);

  return (
    <nav className="facility-sidebar">
      <ul className="facility__list">
        {allowedMenus.map((item, i) => (
          <li className="facility__li-box" key={i}>
            <Link
              onClick={() => handleClickListener(item)}
              hrefLang={item}
              className={`facility__li-link ${
                item === activeComponent ? "active" : ""
              }`}
              to={""}
            >
              <span className="facility__li">{item}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FacilitySidebar;
