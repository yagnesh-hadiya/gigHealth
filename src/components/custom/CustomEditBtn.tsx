import { useState } from "react";
import EditIcon from "../icons/EditBtn";
import { CustomEditBtnProps } from "../../types/CustomElementTypes";

const CustomEditBtn = ({
  onEdit,
  disabled = false,
  ...props
}: CustomEditBtnProps) => {
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
      <button
        disabled={disabled}
        className="btn"
        style={{ marginRight: "5px", opacity: disabled ? 0.5 : 1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onEdit}
        {...props}
      >
        <EditIcon color={isEditHovered ? "#FFF" : "#717B9E"} />
      </button>
    </div>
  );
};

export default CustomEditBtn;
