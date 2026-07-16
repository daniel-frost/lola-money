import { cn } from "@/lib/cn";

export function Highlight({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("bg-yellow-wash px-1 text-yellow-bold", className)}
      {...props}
    />
  );
}
