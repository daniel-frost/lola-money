import { cn } from "@/lib/cn";

export function CardHeader({
  title,
  trailing,
  className,
}: {
  title: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
