export type ExpandtProps = {
  color?: string;
  className?: string;
  onClick?:string
}

const ExpandRowIcon = () => {

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_5856_31186)">
        <circle cx="18" cy="18" r="14" fill="#4C83E1" />
        <circle cx="18" cy="18" r="13" stroke="white" stroke-width="2" />
      </g>
      <path d="M13.897 18.8834C13.6516 18.8834 13.443 18.7975 13.2713 18.6258C13.0995 18.454 13.0137 18.2455 13.0137 18C13.0137 17.7546 13.0995 17.5461 13.2713 17.3743C13.443 17.2026 13.6516 17.1167 13.897 17.1167H22.1043C22.3497 17.1167 22.5583 17.2026 22.73 17.3743C22.9017 17.5461 22.9876 17.7546 22.9876 18C22.9876 18.2455 22.9017 18.454 22.73 18.6258C22.5583 18.7975 22.3497 18.8834 22.1043 18.8834H13.897Z" fill="white" />
      <defs>
        <filter id="filter0_d_5856_31186" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5856_31186" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5856_31186" result="shape" />
        </filter>
      </defs>
    </svg>


  )
}

export default ExpandRowIcon;