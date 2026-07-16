import { cn } from "@/lib/cn";

const tones = {
  green: { track: "bg-green-wash", fill: "bg-green-bold" },
  blue: { track: "bg-blue-wash", fill: "bg-blue-bold" },
} as const;

export type ProgressTone = keyof typeof tones;

export function ProgressBar({
  value,
  tone = "green",
  className,
  ...props
}: {
  value: number;
  tone?: ProgressTone;
} & Omit<React.ComponentProps<"div">, "children">) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const t = tones[tone];
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full",
        t.track,
        className,
      )}
      {...props}
    >
      <div
        className={cn("h-full rounded-full", t.fill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
