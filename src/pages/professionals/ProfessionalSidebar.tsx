import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProfessionalSidebarMenu } from "../../types/ProfessionalTypes";
import { checkAclPermission } from "../../helpers";
import { getActiveMenu, storeActiveMenu } from "../../helpers/tokens";

interface ProfessionalSidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const ProfessionalSidebar = ({
  setActiveComponent,
  activeComponent,
}: ProfessionalSidebarProps) => {
  const selectedMenu = getActiveMenu();
  const menuItems: ProfessionalSidebarMenu = useMemo(
    () => [
      {
        text: "Profile Details",
        module: "professionals",
        submodule: "",
      },
      {
        text: "Notes & Activity",
        module: "professionals",
        submodule: "",
      },
      {
        text: "Gig History",
        module: "professionals",
        submodule: "",
      },
      {
        text: "Onboarding",
        module: "professionals",
        submodule: "",
        // additionalText: "2",
      },
      {
        text: "Documents",
        module: "professionals",
        submodule: "",
      },
      {
        text: "Additional Details",
        module: "professionals",
        submodule: "",
      },
    ],
    []
  );

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
  }, [menuItems]);

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
  }, [activeComponent, allowedMenus, setActiveComponent]);

  return (
    <nav className="facility-sidebar">
      <ul className="facility__list">
        {allowedMenus.map((item, i) => (
          <div className="facility__li-box" key={i}>
            <Link
              onClick={() => handleClickListener(item)}
              className={`facility__li-link ${
                item === activeComponent ? "active" : ""
              }`}
              to={""}
            >
              <li className="facility__li">
                {item}
                {menuItems.find((menuItem) => menuItem.text === item)
                  ?.additionalText && (
                  <span className="additional-text">
                    {
                      menuItems.find((menuItem) => menuItem.text === item)
                        ?.additionalText
                    }
                  </span>
                )}
              </li>
            </Link>
          </div>
        ))}
      </ul>
    </nav>
  );
};

export default ProfessionalSidebar;
