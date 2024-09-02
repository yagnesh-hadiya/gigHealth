import { useState } from "react";
import EmailIcon from "../icons/EmailICon";

type CustomEmailButtonProps = {
  onClick: () => void;
  title?: string;
  disabled?: boolean;
};

const CustomEmailButton = ({
  onClick,
  title,
  disabled,
}: CustomEmailButtonProps) => {
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);

  const handleDownloadMouseEnter = () => {
    setIsDownloadHovered(true);
  };

  const handleDownloadMouseLeave = () => {
    setIsDownloadHovered(false);
  };

  return (
    <div className="custom-action-btn">
      <button
        title={title}
        disabled={disabled}
        className="btn"
        style={{ marginRight: "5px" }}
        onMouseEnter={handleDownloadMouseEnter}
        onMouseLeave={handleDownloadMouseLeave}
        onClick={onClick}
      >
        <EmailIcon color={isDownloadHovered ? "#FFF" : "#717B9E"} />
      </button>
    </div>
  );
};

export default CustomEmailButton;
