import { useState } from "react";
import { CustomHistoryBtnProps } from "../../types/CustomElementTypes";
import HistroyIcon from "../icons/HistoryBtn";

const CustomHistoryBtn = ({ onView, disabled = false, ...props }: CustomHistoryBtnProps) => {
  const [isEditHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (props.allow === false) {
    return null;
  }
 
  return (
    <div className="custom-action-btn">
      <div
        className="btn"
        style={{ marginRight: "5px", opacity: disabled ? 0.5 : 1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onView}
        {...props}
        id="">
        <HistroyIcon color={isEditHovered ? "#FFF" : "#717B9E"} />
      </div>
    </div>
  );
};

export default CustomHistoryBtn;
