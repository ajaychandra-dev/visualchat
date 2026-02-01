"use client";

import { useAppContext } from "@/app/context/context";
import PlusIcon from "./icons/PlusIcon";

export default function Signup() {
  const { setRefresh } = useAppContext();
  // temporarily using as new flow
  return (
    <button
      className="py-2 px-3 bg-nodebg rounded-lg border border-[#454545]/50 
     flex gap-2 font-medium items-center cursor-pointer hover:bg-button-focus pointer-events-auto"
      onClick={() => {
        localStorage.clear();
        setRefresh(true);
      }}
    >
      <PlusIcon />
      <p className="text-sm text-input">New Flow</p>
    </button>
  );
}
