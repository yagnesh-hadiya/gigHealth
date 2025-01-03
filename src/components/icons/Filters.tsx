import { ExportProps } from "../../types/IconType";

const FilterIcon = ({ color }: ExportProps) => {

    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="tune_black_24dp (4) 1" clipPath="url(#clip0_7603_9105)">
                <path id="Vector" d="M2.75 15.5833V17.4167H8.25V15.5833H2.75ZM2.75 4.58333V6.41667H11.9167V4.58333H2.75ZM11.9167 19.25V17.4167H19.25V15.5833H11.9167V13.75H10.0833V19.25H11.9167ZM6.41667 8.25V10.0833H2.75V11.9167H6.41667V13.75H8.25V8.25H6.41667ZM19.25 11.9167V10.0833H10.0833V11.9167H19.25ZM13.75 8.25H15.5833V6.41667H19.25V4.58333H15.5833V2.75H13.75V8.25Z" fill={color || "#7F47DD"} />
            </g>
            <defs>
                <clipPath id="clip0_7603_9105">
                    <rect width="22" height="22" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default FilterIcon;