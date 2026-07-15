import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-card bg-card p-6 shadow-card", className)}
      {...props}
    />
  );
}
