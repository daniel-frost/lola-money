import { cn } from "@/lib/cn";

export function Caret({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      fill="currentColor"
      className={cn("h-2.5 w-2.5 shrink-0 transition-transform", className)}
    >
      <path d="M1 3h8L5 7z" />
    </svg>
  );
}
