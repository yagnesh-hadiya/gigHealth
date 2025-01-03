import { ExportProps } from "../../types/IconType";

const ExportIcon = ({ color }: ExportProps) => {

    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="file_upload_black_24dp (3) 1" clipPath="url(#clip0_7603_11765)">
                <g id="Group">
                    <path id="Vector" d="M14.9997 9.77311V15.0004H4.99967V9.77311H3.33301V15.0004C3.33301 15.9171 4.08301 16.6671 4.99967 16.6671H14.9997C15.9163 16.6671 16.6663 15.9171 16.6663 15.0004V9.77311H14.9997ZM5.83301 4.77311L7.00801 5.94811L9.16634 3.79811V13.3337H10.833V3.79811L12.9913 5.94811L14.1663 4.77311L9.99967 0.606445L5.83301 4.77311Z" fill={color || "#7F47DD"} />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_7603_11765">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default ExportIcon;