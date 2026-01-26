import Graph from "@/components/Graph";
import Input from "@/components/Input";
import TopBar from "@/components/TopBar";
import { ReactFlowProvider } from "@xyflow/react";
import "./globals.css";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-between h-full w-full relative">
        <ReactFlowProvider>
          <Graph />
        </ReactFlowProvider>

        {/* Overlay div, ignores pointer events */}
        <div className="flex flex-col justify-between h-full w-full absolute pointer-events-none">
          <TopBar />
          <Input />
        </div>
      </div>
    </>
  );
}
