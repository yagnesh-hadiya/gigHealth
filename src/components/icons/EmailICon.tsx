import { IconProps } from "../../types/IconType";

const EmailIcon: React.FC<IconProps> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 -960 960 960"
      width="20"
    >
      <path
        d="M144-192v-576l720 288-720 288Zm72-107 454-181-454-181v109l216 72-216 72v109Zm0 0v-362 362Z"
        fill={color || "#717B9E"}
      />
    </svg>
  );
};

export default EmailIcon;