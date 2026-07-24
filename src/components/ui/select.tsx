"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handle(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group inline-flex items-center overflow-hidden rounded-card"
      >
        <span className="bg-sand px-2.5 py-2.5 font-bold text-ink transition-colors group-hover:bg-blue-wash group-hover:text-blue-text">
          {label}
        </span>
        <span className="flex items-center gap-1.5 bg-sand px-2.5 py-2.5 text-muted transition-colors group-hover:bg-blue-wash group-hover:text-blue-text">
          {selected?.label ?? value}
          <span className="text-xs text-faint transition-colors group-hover:text-blue-text">
            {open ? "⌄" : "›"}
          </span>
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-1 min-w-[200px] overflow-hidden rounded-card bg-card py-1 shadow-card">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-6 px-3 py-2 text-left transition-colors",
                  isSelected
                    ? "bg-blue-wash font-bold text-blue-text"
                    : "text-ink hover:bg-hairline",
                )}
              >
                {option.label}
                {isSelected ? <span className="text-blue-text">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
