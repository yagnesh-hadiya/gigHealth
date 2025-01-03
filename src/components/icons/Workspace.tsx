import { ExportProps } from "../../types/IconType";

const WorkspaceIcon = ({ color }: ExportProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="grid_view_black_24dp (1) 1" clipPath="url(#clip0_2260_484)">
                <g id="Group">
                    <path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M4 3C3.44772 3 3 3.44772 3 4V10C3 10.5523 3.44772 11 4 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3H4ZM9 8C9 8.55228 8.55228 9 8 9H6C5.44772 9 5 8.55228 5 8V6C5 5.44772 5.44772 5 6 5H8C8.55228 5 9 5.44772 9 6V8ZM4 13C3.44772 13 3 13.4477 3 14V20C3 20.5523 3.44772 21 4 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13H4ZM9 18C9 18.5523 8.55228 19 8 19H6C5.44772 19 5 18.5523 5 18V16C5 15.4477 5.44772 15 6 15H8C8.55228 15 9 15.4477 9 16V18ZM14 3C13.4477 3 13 3.44772 13 4V10C13 10.5523 13.4477 11 14 11H20C20.5523 11 21 10.5523 21 10V4C21 3.44772 20.5523 3 20 3H14ZM19 8C19 8.55228 18.5523 9 18 9H16C15.4477 9 15 8.55228 15 8V6C15 5.44772 15.4477 5 16 5H18C18.5523 5 19 5.44772 19 6V8ZM14 13C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13H14ZM19 18C19 18.5523 18.5523 19 18 19H16C15.4477 19 15 18.5523 15 18V16C15 15.4477 15.4477 15 16 15H18C18.5523 15 19 15.4477 19 16V18Z" fill={color || "#7F47DD"} />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_2260_484">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default WorkspaceIcon;