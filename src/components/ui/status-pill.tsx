import { cn } from "@/lib/cn";

const variants = {
  focus: { className: "bg-yellow-wash text-yellow-bold", label: "focus" },
  paid: { className: "bg-green-wash text-green-bold", label: "paid off ✓" },
  overdue: { className: "bg-coral-wash text-coral-bold", label: "overdue" },
  simulated: {
    className: "bg-purple-wash text-purple-bold",
    label: "✦ simulated",
  },
  now: { className: "bg-blue-wash text-blue-text", label: "now" },
} as const;

export type StatusVariant = keyof typeof variants;

export function StatusPill({
  variant,
  className,
  children,
  ...props
}: { variant: StatusVariant } & React.ComponentProps<"span">) {
  const v = variants[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill-status px-2.5 py-1 text-xs font-bold leading-none",
        v.className,
        className,
      )}
      {...props}
    >
      {children ?? v.label}
    </span>
  );
}
