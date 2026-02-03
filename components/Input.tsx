"use client";

import { PROVIDERS } from "@/app/api/providers";
import { useChat } from "@/hooks/useChat";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ArrowUpIcon from "./icons/ArrowUp";

export default function Input() {
  const {
    value,
    setValue,
    selectedModel,
    setSelectedModel,
    inputRef,
    handleSubmit,
  } = useChat();

  const [focus, setFocus] = useState(true);
  const [showModels, setShowModels] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowModels(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const updateHeight = () => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "1.25lh";
    if (ta.scrollHeight > ta.clientHeight) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) handleSubmit();
    }
  };

  // Group providers by their group label
  const grouped = PROVIDERS.reduce<Record<string, typeof PROVIDERS>>(
    (acc, p) => {
      (acc[p.group] ??= []).push(p);
      return acc;
    },
    {}
  );

  const currentLabel =
    PROVIDERS.find((p) => p.id === selectedModel)?.label ?? selectedModel;

  return (
    <form
      className={clsx(
        "w-[600px] max-h-[238px] self-center mb-12 bg-nodebg rounded-lg p-3 flex flex-col gap-3 border flex-shrink-0 pointer-events-auto",
        focus ? "border-inputfocus" : "border-transparent"
      )}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <textarea
        autoFocus
        onKeyDown={handleKeyDown}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        name="prompt-input"
        className="placeholder-placeholder caret-input text-input w-full focus:outline-none resize-none pr-4 overflow-auto scrollbar-thin scrollbar-thumb-node-header scrollbar-track-transparent"
        style={{ height: "1.25lh", minHeight: "1.25lh" }}
        placeholder="Type your message"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        ref={inputRef}
        onInput={updateHeight}
      />

      {/* Bottom row: model selector + submit */}
      <div className="flex items-center justify-between">
        {/* Model selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowModels(!showModels)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-node-header hover:bg-[#4a4a4a] transition-colors"
          >
            <span className="text-xs text-placeholder">{currentLabel}</span>
            <svg
              width={10}
              height={10}
              viewBox="0 0 10 10"
              fill="none"
              className={`transition-transform ${showModels ? "rotate-180" : ""}`}
            >
              <path
                d="M2.5 3.75L5 6.25L7.5 3.75"
                stroke="#7f7f86"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {showModels && (
            <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#2a2a2e] border border-[#454545] rounded-lg shadow-lg overflow-hidden">
              {Object.entries(grouped).map(([group, models], i) => (
                <div key={group}>
                  {i > 0 && <div className="border-t border-[#3a3a3e]" />}
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] text-placeholder uppercase tracking-wider">
                      {group}
                    </span>
                  </div>
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModels(false);
                      }}
                      className={clsx(
                        "w-full text-left px-3 py-1.5 text-xs transition-colors",
                        model.id === selectedModel
                          ? "text-input bg-[#3a3a3e]"
                          : "text-placeholder hover:text-input hover:bg-[#333338]"
                      )}
                    >
                      {model.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={clsx(
            "p-1 rounded-sm self-end cursor-pointer",
            value ? "bg-input" : "bg-placeholder"
          )}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </form>
  );
}

