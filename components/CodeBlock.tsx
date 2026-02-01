"use client";

import { useState } from "react";
import CopyIcon from "./icons/CopyIcon";

interface CodeBlockProps {
  language?: string;
  children: string;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="rounded-md border border-[#3a3a3e] overflow-hidden my-2">
      {/* Header bar: language label + copy button */}
      <div className="flex items-center justify-between bg-node-header px-3 py-1.5">
        <span className="text-[10px] text-placeholder">
          {language || "plaintext"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] text-placeholder hover:text-input transition-colors"
        >
          <CopyIcon />
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Code content */}
      <pre className="overflow-auto p-3 scrollbar-thin scrollbar-thumb-node-header scrollbar-track-transparent">
        <code
          className={`text-[11px] leading-relaxed ${language ? `language-${language}` : ""}`}
          dangerouslySetInnerHTML={{ __html: children }}
        />
      </pre>
    </div>
  );
}
