"use client";

import { createNodeRequest } from "@/app/api/createNode";
import { useAppContext } from "@/app/context/context";
import clsx from "clsx";
import { useRef, useState } from "react";
import ArrowUpIcon from "./icons/arrow_up";

export default function Input() {
  const { data, setData } = useAppContext();
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const response = createNodeRequest(value, data?.nodes.length || 0);
    setData(response);
    setValue("");
    if (inputRef.current) {
      inputRef.current?.focus();
      inputRef.current.style.height = "1lh";
    }
  };

  const updateHeight = () => {
    const ta = inputRef.current;
    if (!ta) return;

    ta.style.height = "1lh";
    if (ta.scrollHeight > ta.clientHeight) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSubmit();
      }
    }
  };

  return (
    <form
      className={clsx(
        "w-[600px] max-h-[238px] overflow-auto self-center mb-12 bg-nodebg rounded-lg p-3 flex flex-col gap-3 border flex-shrink-0 pointer-events-auto",
        focus ? " border-inputfocus" : "border-transparent"
      )}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <textarea
        autoFocus
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        name="prompt-input"
        className="placeholder-placeholder caret-input text-input w-full focus:outline-none resize-none pr-4"
        style={{ height: "1lh" }}
        placeholder="Type your message"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        ref={inputRef}
        onInput={updateHeight}
      />

      <button
        type="submit"
        className={clsx(
          "p-1 rounded-sm self-end",
          value ? "bg-input" : "bg-placeholder"
        )}
      >
        <ArrowUpIcon />
      </button>
    </form>
  );
}
