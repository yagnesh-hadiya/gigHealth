import { useEffect, useMemo } from "react";
import { JobSidebarMenu, JobSidebarProps } from "../../../../types/JobsTypes";
import { checkAclPermission } from "../../../../helpers";
import { Link } from "react-router-dom";
import { getActiveMenu, storeActiveMenu } from "../../../../helpers/tokens";

const JobSidebar = ({
  activeComponent,
  setActiveComponent,
}: JobSidebarProps) => {
  const selectedMenu = getActiveMenu();
  const menuItems: JobSidebarMenu[] = [
    {
      text: "Job Details",
      module: "jobs",
      submodule: "",
    },
    {
      text: "Openings & Assignments",
      module: "jobs",
      submodule: "",
    },
    {
      text: "Submissions",
      module: "jobs",
      submodule: "",
    },
    {
      text: "Applicants",
      module: "jobs",
      submodule: "",
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
        storeActiveMenu(selectedMenu);
        setActiveComponent(selectedMenu);
      }
    }
  }, [allowedMenus, activeComponent]);

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
              <li className="facility__li">{item}</li>
            </Link>
          </div>
        ))}
      </ul>
    </nav>
  );
};

export default JobSidebar;
