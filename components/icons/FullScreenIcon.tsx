import { SVGProps } from "react";
const FullScreenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
    viewBox="0 0 16 16"
  >
    <path
      stroke="#FAFAFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M9.333 6.667 14 2m0 0h-4m4 0v4M6.667 9.333 2 14m0 0h4m-4 0v-4"
    />
  </svg>
);
export default FullScreenIcon;
