import { useState } from "react";
import { CustomEditBtnProps } from "../../types/CustomElementTypes";

const CustomCloseButton = ({
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
        <i
          className="fa fa-times"
          style={{
            color: isEditHovered ? "#FFF" : "#717B9E",
          }}
        ></i>
      </button>
    </div>
  );
};

export default CustomCloseButton;
