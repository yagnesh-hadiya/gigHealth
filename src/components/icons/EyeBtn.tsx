import { IconProps } from "../../types/IconType";

const EyeIcon: React.FC<IconProps> = ({ color }) => {

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="visibility_FILL1_wght400_GRAD0_opsz24 (1) 1">
                <path id="Vector" d="M8.00008 10.6667C8.83342 10.6667 9.54175 10.375 10.1251 9.79169C10.7084 9.20835 11.0001 8.50002 11.0001 7.66669C11.0001 6.83335 10.7084 6.12502 10.1251 5.54169C9.54175 4.95835 8.83342 4.66669 8.00008 4.66669C7.16675 4.66669 6.45842 4.95835 5.87508 5.54169C5.29175 6.12502 5.00008 6.83335 5.00008 7.66669C5.00008 8.50002 5.29175 9.20835 5.87508 9.79169C6.45842 10.375 7.16675 10.6667 8.00008 10.6667ZM8.00008 9.46669C7.50008 9.46669 7.07508 9.29169 6.72508 8.94169C6.37508 8.59169 6.20008 8.16669 6.20008 7.66669C6.20008 7.16669 6.37508 6.74169 6.72508 6.39169C7.07508 6.04169 7.50008 5.86669 8.00008 5.86669C8.50008 5.86669 8.92508 6.04169 9.27508 6.39169C9.62508 6.74169 9.80008 7.16669 9.80008 7.66669C9.80008 8.16669 9.62508 8.59169 9.27508 8.94169C8.92508 9.29169 8.50008 9.46669 8.00008 9.46669ZM8.00008 12.6667C6.37786 12.6667 4.90008 12.2139 3.56675 11.3084C2.23341 10.4028 1.26675 9.18891 0.666748 7.66669C1.26675 6.14446 2.23341 4.93058 3.56675 4.02502C4.90008 3.11946 6.37786 2.66669 8.00008 2.66669C9.6223 2.66669 11.1001 3.11946 12.4334 4.02502C13.7667 4.93058 14.7334 6.14446 15.3334 7.66669C14.7334 9.18891 13.7667 10.4028 12.4334 11.3084C11.1001 12.2139 9.6223 12.6667 8.00008 12.6667Z" fill={color || "#717B9E"} />
            </g>
        </svg>
    )
}

export default EyeIcon;
