import { ExportProps } from "./ExportIcon";

const DownloadIcon = ({ color }: ExportProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="download_black_24dp (3) 1" clip-path="url(#clip0_4188_16036)">
        <path
          id="Vector"
          d="M14.25 6.75H11.25V2.25H6.75V6.75H3.75L9 12L14.25 6.75ZM8.25 8.25V3.75H9.75V8.25H10.6275L9 9.8775L7.3725 8.25H8.25ZM3.75 13.5H14.25V15H3.75V13.5Z"
          fill={color || "#7F47DD"}
        /> 
      </g>
      <defs>
        <clipPath id="clip0_4188_16036">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DownloadIcon;
