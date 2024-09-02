import { ExportProps } from "../../types/IconType";

const DocumentIcon = ({ color }: ExportProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="article_FILL0_wght500_GRAD0_opsz48 1">
                <path id="Vector" d="M7.70494 16.9953H13.0799C13.2885 16.9953 13.4656 16.923 13.6113 16.7784C13.7571 16.6338 13.8299 16.4546 13.8299 16.2409C13.8299 16.0311 13.7571 15.8544 13.6113 15.7108C13.4656 15.5671 13.2885 15.4953 13.0799 15.4953H7.70494C7.49244 15.4953 7.31431 15.5686 7.17056 15.7152C7.02681 15.8617 6.95494 16.0409 6.95494 16.2527C6.95494 16.4644 7.02681 16.6411 7.17056 16.7828C7.31431 16.9244 7.49244 16.9953 7.70494 16.9953ZM7.70494 12.7502H16.3011C16.5096 12.7502 16.6868 12.6779 16.8325 12.5333C16.9782 12.3887 17.0511 12.2095 17.0511 11.9958C17.0511 11.7821 16.9782 11.6043 16.8325 11.4627C16.6868 11.321 16.5096 11.2502 16.3011 11.2502H7.70494C7.49244 11.2502 7.31431 11.3225 7.17056 11.4671C7.02681 11.6117 6.95494 11.7908 6.95494 12.0046C6.95494 12.2183 7.02681 12.396 7.17056 12.5377C7.31431 12.6793 7.49244 12.7502 7.70494 12.7502ZM7.70691 8.4991H16.3011C16.5096 8.4991 16.6868 8.4268 16.8325 8.2822C16.9782 8.13762 17.0511 7.95845 17.0511 7.7447C17.0511 7.53495 16.9782 7.35824 16.8325 7.21458C16.6868 7.07093 16.5096 6.9991 16.3011 6.9991H7.70691C7.49386 6.9991 7.31527 7.07239 7.17114 7.21898C7.027 7.36556 6.95494 7.54473 6.95494 7.75648C6.95494 7.96823 7.027 8.14493 7.17114 8.2866C7.31527 8.42827 7.49386 8.4991 7.70691 8.4991ZM4.55384 21.1496C4.09385 21.1496 3.69498 20.9808 3.35721 20.643C3.01946 20.3052 2.85059 19.9064 2.85059 19.4464V4.55398C2.85059 4.09236 3.01946 3.69209 3.35721 3.35315C3.69498 3.0142 4.09385 2.84473 4.55384 2.84473H19.4462C19.9079 2.84473 20.3081 3.0142 20.6471 3.35315C20.986 3.69209 21.1555 4.09236 21.1555 4.55398V19.4464C21.1555 19.9064 20.986 20.3052 20.6471 20.643C20.3081 20.9808 19.9079 21.1496 19.4462 21.1496H4.55384ZM4.55384 19.4464H19.4462V4.55398H4.55384V19.4464Z" fill={color || "#7F47DD"} />
            </g>
        </svg>
    )
}

export default DocumentIcon;