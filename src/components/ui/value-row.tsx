import { cn } from "@/lib/cn";

export function ValueRow({
  value,
  name,
  detail,
  trailing,
  divider,
  className,
  ...props
}: {
  value: React.ReactNode;
  name: React.ReactNode;
  detail?: React.ReactNode;
  trailing?: React.ReactNode;
  divider?: boolean;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-3",
        divider && "border-t border-hairline",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="leading-tight text-ink">
          <span className="font-bold tabular-nums">{value}</span> {name}
        </div>
        {detail ? (
          <div className="text-sm text-muted">{detail}</div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
