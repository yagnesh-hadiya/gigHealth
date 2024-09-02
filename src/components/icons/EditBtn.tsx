import { IconProps } from "../../types/IconType";

const EditIcon: React.FC<IconProps> = ({ color }) => {

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="mode_edit_black_24dp 1" clipPath="url(#clip0_2859_3773)">
                <g id="Group">
                    <g id="Group_2">
                        <g id="Group_3">
                            <path id="Vector" d="M2.31271 13.6872H4.68251L11.6718 6.69792L9.30202 4.32812L2.31271 11.3174V13.6872ZM3.5766 11.8419L9.30202 6.11653L9.88341 6.69792L4.15799 12.4233H3.5766V11.8419Z" fill={color || "#717B9E"} />
                        </g>
                        <g id="Group_4"> 
                            <path id="Vector_2" d="M12.0257 2.49539C11.7793 2.24893 11.3811 2.24893 11.1347 2.49539L9.97821 3.65185L12.348 6.02164L13.5045 4.86518C13.7509 4.61872 13.7509 4.2206 13.5045 3.97414L12.0257 2.49539Z" fill={color || "#717B9E"} />
                        </g>
                    </g>
                </g>
            </g>
            <defs>
                <clipPath id="clip0_2859_3773">
                    <rect width="15.1667" height="15.1667" fill="white" transform="translate(0.41687 0.416504)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default EditIcon;