import { Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface BaseNodeProps {
  data: { question: string; answer: string };
  selected?: boolean;
}

export default function BaseNode({ data, selected }: BaseNodeProps) {
  return (
    <div
      className={`bg-nodebg rounded-lg max-w-[400px] border transition-colors ${
        selected ? "border-[#9F9F9F]" : "border-transparent"
      }`}
    >
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
