import { useState } from "react";
import DownloadIcon from "../icons/DownloadBtn";
import { DownloadButtonProp } from "../../types/FacilityDocument";

const CustomActionDownloadBtn = ({
  onDownload,
  title,
  disabled,
}: DownloadButtonProp) => {
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
        onClick={onDownload}
      >
        <DownloadIcon color={isDownloadHovered ? "#FFF" : "#717B9E"} />
      </button>
    </div>
  );
};

export default CustomActionDownloadBtn;
