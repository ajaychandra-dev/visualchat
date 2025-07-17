import Logo from "./Branding";
import Signup from "./Signup";

export default function TopBar() {
  return (
    <div className="p-6 w-full flex justify-between">
      <Logo />
      <Signup />
    </div>
  );
}
