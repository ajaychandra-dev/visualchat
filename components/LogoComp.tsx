"use client";

import { useEffect, useRef, useState } from "react";

export default function Logo() {
  const logoRef = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let rafId: number;

    const checkOverlap = () => {
      const logoEl = logoRef.current;
      if (!logoEl) return;

      const logoRect = logoEl.getBoundingClientRect();
      const nodes = document.querySelectorAll(".react-flow__node");

      let isOverlapping = false;

      nodes.forEach((node) => {
        const nodeRect = (node as HTMLElement).getBoundingClientRect();

        const overlap = !(
          nodeRect.right < logoRect.left ||
          nodeRect.left > logoRect.right ||
          nodeRect.bottom < logoRect.top ||
          nodeRect.top > logoRect.bottom
        );

        if (overlap) {
          isOverlapping = true;
        }
      });

      setHidden(isOverlapping);
      rafId = requestAnimationFrame(checkOverlap);
    };

    rafId = requestAnimationFrame(checkOverlap);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={logoRef}
      className={`flex flex-row gap-3 items-center transition-opacity duration-200 ${
        hidden ? "opacity-0" : "opacity-75"
      }`}
    >
      <img src="/icons/logo.svg" draggable={false} className="select-none" />
      <p className="text-xl font-medium text-input select-none">VisualChat</p>
    </div>
  );
}
