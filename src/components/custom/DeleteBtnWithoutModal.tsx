import { useState } from "react";
import DeleteIcon from "../icons/DeleteBtn";
import { CustomDeleteBtnProps } from "../../types/CustomElementTypes";

const CustomDeleteBtn = ({ onDelete }: CustomDeleteBtnProps) => {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  const handleDeleteMouseEnter = () => {
    setIsDeleteHovered(true);
  };

  const handleDeleteMouseLeave = () => {
    setIsDeleteHovered(false);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="custom-action-btn">
      <div
        className="btn"
        onMouseEnter={handleDeleteMouseEnter}
        onMouseLeave={handleDeleteMouseLeave}
        onClick={handleDelete}
      >
        <DeleteIcon color={isDeleteHovered ? "#FFF" : "#717B9E"} />
      </div>
    </div>
  );
};

export default CustomDeleteBtn;


