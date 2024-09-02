import { useState } from "react";
import { CustomArticleBtnProps } from "../../types/CustomElementTypes";
import ArticleIcon from "../icons/HistoryBtn";

const CustomArticleBtn = ({
  id,
  title,
  onView,
  disabled = false,
  ...props
}: CustomArticleBtnProps) => {
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
    <div className="custom-action-btn" id={id}>
      <button
        title={title}
        className="btn"
        disabled={disabled}
        style={{ marginRight: "5px", opacity: disabled ? 0.5 : 1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onView}
        {...props}
      >
        <ArticleIcon color={isEditHovered ? "#FFF" : "#717B9E"} />
      </button>
    </div>
  );
};

export default CustomArticleBtn;
