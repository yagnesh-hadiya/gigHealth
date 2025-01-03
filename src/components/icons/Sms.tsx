import { ExportProps } from "./ExportIcon";

const SmsIcon = ({ color }: ExportProps) => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="sms_black_24dp (2) 1" clip-path="url(#clip0_6482_16778)">
        <path id="Vector" d="M15 1.5H3C2.175 1.5 1.5 2.175 1.5 3V16.5L4.5 13.5H15C15.825 13.5 16.5 12.825 16.5 12V3C16.5 2.175 15.825 1.5 15 1.5ZM6.75 8.25H5.25V6.75H6.75V8.25ZM9.75 8.25H8.25V6.75H9.75V8.25ZM12.75 8.25H11.25V6.75H12.75V8.25Z" fill={color || "#7F47DD"} />
      </g>
      <defs>
        <clipPath id="clip0_6482_16778">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>)
}
export default SmsIcon;
