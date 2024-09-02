import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProfessionalSidebarMenu } from "../../../types/ProfessionalTypes";
import { checkAclPermission } from "../../../helpers";

interface ProfessionalSidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const OnboardingSidebar = ({
  setActiveComponent,
  activeComponent,
}: ProfessionalSidebarProps) => {
  const menuItems: ProfessionalSidebarMenu = useMemo(
    () => [
      {
        text: "Onboarding Documents",
        module: "professionals",
        submodule: "",
      },

      {
        text: "Submission Documents",
        module: "professionals",
        submodule: "",
      },
      {
        text: "Professional Documents",
        module: "professionals",
        submodule: "",
      },
    ],
    []
  );

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
    if (allowedMenus.length > 0) {
      const firstAvailableModule = allowedMenus[0];
      setActiveComponent(
        activeComponent ? activeComponent : firstAvailableModule
      );
    }
  }, [activeComponent, allowedMenus, setActiveComponent]);

  return (
    <nav className="facility-sidebar onboarding">
      <h6 className="ps-3 mb-2 pt-3">Uploaded Documents</h6>
      <ul className="facility__list">
        {allowedMenus.map((item, i) => (
          <div className="facility__li-box" key={i}>
            <Link
              onClick={() => setActiveComponent(item)}
              className={`facility__li-link ${
                item === activeComponent ? "active" : ""
              }`}
              to={""}
            >
              <li className="facility__li">{item}</li>
            </Link>
          </div>
        ))}
      </ul>
    </nav>
  );
};

export default OnboardingSidebar;
