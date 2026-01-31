import { SVGProps } from "react";
const RefetchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M1.333 6.667S2.67 4.845 3.756 3.759a6 6 0 1 1-1.521 5.908m-.902-3v-4m0 4h4"
    />
  </svg>
);
export default RefetchIcon;
