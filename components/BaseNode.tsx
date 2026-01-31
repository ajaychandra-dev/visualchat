import { Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CopyIcon from "./icons/CopyIcon";
import DeleteIcon from "./icons/DeleteIcon";
import FullScreenIcon from "./icons/FullScreenIcon";
import RefetchIcon from "./icons/RefetchIcon";

interface BaseNodeProps {
  data: { question: string; answer: string };
  selected?: boolean;
}

export default function BaseNode({ data, selected }: BaseNodeProps) {
  const actions = [
    {
      id: "1",
      label: "Regenerate",
      src: <RefetchIcon />,
      onClick: () => console.log("Refetch"),
    },
    {
      id: "2",
      label: "Copy",
      src: <CopyIcon />,
      onClick: () => console.log("Copy Answer"),
    },
    {
      id: "3",
      label: "Full Screen",
      src: <FullScreenIcon />,
      onClick: () => console.log("Full Screen"),
    },
    {
      id: "4",
      label: "Delete",
      src: <DeleteIcon />,
      onClick: () => console.log("Delete Node"),
    },
  ];
  return (
    <div
      className={`relative bg-nodebg rounded-lg max-w-[400px] border transition-colors ${
        selected ? "border-[#9F9F9F]" : "border-transparent"
      }`}
    >
      {selected && (
        <div className="absolute -top-8 right-0 flex gap-1 z-10">
          {actions.map((action) => (
            <div key={action.id} className="relative group">
              <button
                onClick={action.onClick}
                className="cursor-pointer w-6 h-6 flex items-center justify-center 
                rounded-md bg-node-header hover:bg-[#4a4a4a] 
                transition-colors active:bg-[#3a3a3a] active:scale-95"
              >
                {action.src}
              </button>

              <span
                className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 
                whitespace-nowrap rounded-md bg-black px-2 py-1 text-[10px] text-white 
                opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {action.label}
              </span>
            </div>
          ))}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={{ opacity: 0 }}
      />
      <p className="p-3 text-input font-bold text-xs bg-node-header rounded-t-lg">
        {data.question}
      </p>

      <p className="text-input text-xs p-4 max-h-[25vh] overflow-auto scrollbar-thin scrollbar-thumb-node-header scrollbar-track-transparent">
        {data.answer.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </div>
  );
}
