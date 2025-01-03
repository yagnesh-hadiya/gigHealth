import { ExportProps } from "../../types/IconType";

const RolesIcon = ({ color }: ExportProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="view_list_FILL0_wght400_GRAD0_opsz48 1">
                <path id="Vector" d="M3 17.5V6.5C3 6.0875 3.14688 5.73438 3.44063 5.44063C3.73438 5.14688 4.0875 5 4.5 5H19.5C19.9125 5 20.2656 5.14688 20.5594 5.44063C20.8531 5.73438 21 6.0875 21 6.5V17.5C21 17.9125 20.8531 18.2656 20.5594 18.5594C20.2656 18.8531 19.9125 19 19.5 19H4.5C4.0875 19 3.73438 18.8531 3.44063 18.5594C3.14688 18.2656 3 17.9125 3 17.5ZM4.5 9.175H7.15V6.5H4.5V9.175ZM8.65 9.175H19.5V6.5H8.65V9.175ZM8.65 13.325H19.5V10.675H8.65V13.325ZM8.65 17.5H19.5V14.825H8.65V17.5ZM4.5 17.5H7.15V14.825H4.5V17.5ZM4.5 13.325H7.15V10.675H4.5V13.325Z" fill={color || "#7F47DD"} />
            </g>
        </svg>
    )
}

export default RolesIcon;