import { SVGProps } from "react";
const ArrowUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.385}
      d="M8.94 13.333V2.667m0 0-4 4m4-4 4 4"
    />
  </svg>
);
export default ArrowUpIcon;
