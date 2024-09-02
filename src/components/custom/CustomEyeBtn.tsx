import { useState } from "react";
import EyeIcon from "../icons/EyeBtn";
import { CustomEyeBtnProps } from "../../types/CustomElementTypes";

const CustomEyeBtn = ({ onEye }: CustomEyeBtnProps) => {
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
        <EyeIcon color={isEyeHovered ? "#FFF" : "#717B9E"} />
      </div>
    </div>
  );
};

export default CustomEyeBtn;
