import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border border-hairline-strong bg-card p-6",
        className,
      )}
      {...props}
    />
  );
}
