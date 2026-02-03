import { Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "highlight.js/styles/github-dark.css";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock";
import CopyIcon from "./icons/CopyIcon";
import DeleteIcon from "./icons/DeleteIcon";
// import ErrorIcon from "./icons/ErrorIcon";
import FullScreenIcon from "./icons/FullScreenIcon";
import RefetchIcon from "./icons/RefetchIcon";

interface BaseNodeProps {
  data: {
    question: string;
    answer: string;
    isLoading?: boolean;
    error?: boolean;
  };
  selected?: boolean;
}

export default function BaseNode({ data, selected }: BaseNodeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLParagraphElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const actions = [
    {
      id: "1",
      label: "Regenerate",
      src: <RefetchIcon />,
      onClick: () => console.log("Regenerate"),
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
      className={`relative bg-nodebg rounded-lg max-w-[400px] min-w-[400px] border transition-colors ${
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
        style={{ opacity: 0, top: "20px" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={{ opacity: 0, top: "20px" }}
      />

      {/* Question header */}
      <div className="bg-node-header rounded-t-lg p-3 max-h-[90px] overflow-auto scrollbar-thin scrollbar-thumb-node-header scrollbar-track-transparent">
        <p
          ref={questionRef}
          onWheelCapture={handleWheel}
          className="text-input font-bold text-xs"
        >
          {data.question}
        </p>
      </div>

      {/* Answer body — skeleton while loading, error if failed, markdown once ready */}
      {data.isLoading && !data.answer ? (
        <div className="p-4 flex flex-col gap-2.5">
          <div className="h-2.5 w-full bg-node-header rounded animate-pulse" />
          <div className="h-2.5 w-11/12 bg-node-header rounded animate-pulse" />
          <div className="h-2.5 w-3/4 bg-node-header rounded animate-pulse" />
        </div>
      ) : data.error ? (
        <div className="p-4">
          <div className="rounded-md border border-[#6b2d2d] bg-[#2a1a1a] p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* <ErrorIcon /> */}
              <span className="text-[#f87171] text-xs font-semibold">
                Error
              </span>
            </div>
            <p className="text-[#f87171] text-xs leading-relaxed opacity-80">
              {data.error}
            </p>
            <button
              onClick={() => console.log("Retry", data.question)}
              className="mt-1 self-start flex items-center gap-1.5 px-2.5 py-1 rounded-md 
              bg-[#3a1f1f] border border-[#6b2d2d] hover:bg-[#4a2525] 
              transition-colors text-[#f87171] text-xs"
            >
              <RefetchIcon className="text-[#f87171]" />
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={contentRef}
          onWheelCapture={handleWheel}
          className="text-input text-xs p-4 max-h-[350px] overflow-auto 
          scrollbar-thin scrollbar-thumb-node-header scrollbar-track-transparent"
        >
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Fenced code blocks — delegate to CodeBlock for header + copy
              code({ node, className, children, ...props }) {
                const isBlock = (node as any)?.parentElement?.tagName === "PRE";
                const language = (className || "")
                  .replace("language-", "")
                  .replace("hljs", "")
                  .trim();

                if (isBlock) {
                  return (
                    <CodeBlock language={language || undefined}>
                      {String(children)}
                    </CodeBlock>
                  );
                }

                // Inline code
                return (
                  <code
                    className="bg-node-header text-[#e6db74] px-1.5 py-0.5 rounded text-[10px] font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },

              // Strip the <pre> wrapper — CodeBlock already renders its own
              pre({ children }) {
                return <>{children}</>;
              },

              // Headers
              h1: ({ children }) => (
                <h1 className="text-base font-bold text-input mt-3 mb-1.5">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold text-input mt-2.5 mb-1">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xs font-semibold text-input mt-2 mb-1">
                  {children}
                </h3>
              ),

              // Paragraphs
              p: ({ children }) => (
                <p className="text-xs text-input leading-relaxed mb-2">
                  {children}
                </p>
              ),

              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-0.5 ml-2 my-1.5">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-0.5 ml-2 my-1.5">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-xs text-input leading-relaxed">
                  {children}
                </li>
              ),

              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-placeholder pl-3 my-2 text-placeholder italic">
                  {children}
                </blockquote>
              ),

              // Horizontal rule
              hr: () => <hr className="border-[#3a3a3e] my-2" />,

              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7eb8da] hover:underline"
                >
                  {children}
                </a>
              ),

              // Strong / Em
              strong: ({ children }) => (
                <strong className="font-semibold text-input">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-placeholder">{children}</em>
              ),
            }}
          >
            {data.answer}
          </ReactMarkdown>
          {data.isLoading && (
              <span className="inline-block w-0.5 h-3.5 bg-placeholder animate-pulse align-middle" />
          )}
        </div>
      )}
    </div>
  );
}

