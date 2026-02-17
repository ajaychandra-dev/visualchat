"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock";
import CloseIcon from "./icons/CloseIcon";
import CopyIcon from "./icons/CopyIcon";

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
}

export default function FullScreenModal({
  isOpen,
  onClose,
  question,
  answer,
}: FullScreenModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6 pointer-events-auto">
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Modal container */}
      <div
        className="bg-nodebg border border-[#454545]/50 rounded-xl w-full max-w-[800px] h-[85vh] shadow-2xl flex flex-col overflow-visible animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar (floating on top right) */}
        <div className="absolute -top-10 right-0 flex gap-2 z-50">
           {/* Copy button */}
           <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-node-header hover:bg-[#4a4a4a] text-placeholder hover:text-white transition-all duration-200 shadow-sm border border-transparent hover:border-[#555]"
              title="Copy answer"
            >
              <CopyIcon />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                bg-node-header hover:bg-[#4a4a4a] text-placeholder hover:text-white transition-all duration-200 shadow-sm border border-transparent hover:border-[#555]"
              title="Close (Esc)"
            >
              <CloseIcon />
            </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#454545]/30 bg-node-header/50 overflow-hidden rounded-t-xl">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-input font-bold text-sm leading-relaxed break-words line-clamp-2">
              {question}
            </p>
          </div>
        </div>

        {/* Answer body */}
        <div
          className="flex-1 overflow-y-auto p-8 text-input text-base leading-relaxed
            scrollbar-thin scrollbar-thumb-node-selected scrollbar-track-transparent"
        >
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, className, children, ...props }) {
                const isBlock =
                  (node as any)?.parentElement?.tagName === "PRE";
                const language = (className || "")
                  .replace("language-", "")
                  .replace("hljs", "")
                  .trim();

                if (isBlock) {
                  return (
                    <div className="my-4">
                        <CodeBlock language={language || undefined}>
                        {String(children)}
                        </CodeBlock>
                    </div>
                  );
                }

                return (
                  <code
                    className="bg-node-header text-[#e6db74] px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },

              pre({ children }) {
                return <>{children}</>;
              },

              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-input mt-6 mb-3 border-b border-[#454545]/30 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold text-input mt-5 mb-2.5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-input mt-4 mb-2">
                  {children}
                </h3>
              ),

              p: ({ children }) => (
                <p className="text-base text-input leading-7 mb-4">
                  {children}
                </p>
              ),

              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 ml-4 my-3 text-base">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 ml-4 my-3 text-base">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-input leading-7">
                  {children}
                </li>
              ),

              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-node-selected pl-4 my-4 bg-node-header/30 py-2 pr-2 rounded-r italic text-placeholder">
                  {children}
                </blockquote>
              ),

              hr: () => <hr className="border-[#3a3a3e] my-6" />,

              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7eb8da] hover:underline transition-colors"
                >
                  {children}
                </a>
              ),

              strong: ({ children }) => (
                <strong className="font-bold text-input">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-placeholder/90">{children}</em>
              ),
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </div>
    </div>,
    document.body
  );
}
