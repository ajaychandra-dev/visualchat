import UserIcon from "./icons/user";

export default function Signup() {
  return (
    <button
      className="py-2 px-3 bg-nodebg rounded-lg border border-[#454545]/50 
     flex gap-2 font-medium items-center cursor-pointer hover:bg-nodebg-focus"
    >
      <UserIcon />
      <p className="text-sm text-input">Sign up</p>
    </button>
  );
}
