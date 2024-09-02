import { useState } from "react";
import { CustomEyeBtnProps } from "../../types/CustomElementTypes";

import DescriptionIcon from "../icons/description";

const DescriptionBtn = ({ onEye }: CustomEyeBtnProps) => {
  const [isEyeHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  return (
    <div className="custom-action-btn">
      <div
        className="btn"
        style={{ marginRight: "5px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onEye}
      >
        <DescriptionIcon color={isEyeHovered ? "#FFF" : "#717B9E"} />
      </div>
    </div>
  );
};

export default DescriptionBtn;
