import Input from "@/components/Input";
import TopBar from "@/components/TopBar";
import "./globals.css";

export default function Home() {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <TopBar />
      <Input />
    </div>
  );
}
