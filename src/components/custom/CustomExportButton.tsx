import { useState } from "react";
import { DownloadButtonProp } from "../../types/FacilityDocument";
import ExportIcon from "../icons/ExportBtn";

const CustomExportButton = ({ onDownload }: DownloadButtonProp) => {
    const [isExportHovered, setIsExportHovered] = useState(false);

    const handleExportMouseEnter = () => {
        setIsExportHovered(true);
    };

    const handleExportMouseLeave = () => {
        setIsExportHovered(false);
    };


    return (
        <div className="custom-action-btn">

            <div
                className="btn"
                style={{ marginRight: "5px" }}
                onMouseEnter={handleExportMouseEnter}
                onMouseLeave={handleExportMouseLeave}
                onClick={onDownload}
            >
                <ExportIcon color={isExportHovered ? "#FFF" : "#7F47DD"} />
            </div>
        </div>
    );
};

export default CustomExportButton;