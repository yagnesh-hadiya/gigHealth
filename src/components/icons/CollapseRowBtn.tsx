export type ExpandtProps = {
  color?: string;
  className?: string;
  onClick?:string
}
const AddRowIcon = () => {

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_5775_28506)">
        <circle cx="18" cy="18" r="14" fill="#4C83E1" />
        <circle cx="18" cy="18" r="13" stroke="white" stroke-width="2" />
      </g>
      <path d="M17.147 18.8532H13.4508C13.2114 18.8532 13.0093 18.7709 12.8447 18.6062C12.68 18.4415 12.5977 18.2395 12.5977 18.0001C12.5977 17.7607 12.68 17.5587 12.8447 17.394C13.0093 17.2293 13.2114 17.147 13.4508 17.147H17.147V13.4508C17.147 13.2114 17.2293 13.0093 17.394 12.8447C17.5587 12.68 17.7607 12.5977 18.0001 12.5977C18.2395 12.5977 18.4415 12.68 18.6062 12.8447C18.7709 13.0093 18.8532 13.2114 18.8532 13.4508V17.147H22.5494C22.7888 17.147 22.9909 17.2293 23.1556 17.394C23.3202 17.5587 23.4026 17.7607 23.4026 18.0001C23.4026 18.2395 23.3202 18.4415 23.1556 18.6062C22.9909 18.7709 22.7888 18.8532 22.5494 18.8532H18.8532V22.5494C18.8532 22.7888 18.7709 22.9909 18.6062 23.1556C18.4415 23.3202 18.2395 23.4026 18.0001 23.4026C17.7607 23.4026 17.5587 23.3202 17.394 23.1556C17.2293 22.9909 17.147 22.7888 17.147 22.5494V18.8532Z" fill="white" />
      <defs>
        <filter id="filter0_d_5775_28506" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5775_28506" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5775_28506" result="shape" />
        </filter>
      </defs>
    </svg>

  )
}

export default AddRowIcon;