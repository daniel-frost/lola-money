import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-blue-bold text-white hover:bg-blue-text",
  ghost: "border border-hairline-strong text-ink hover:bg-hairline",
  ink: "bg-ink text-white",
} as const;

const sizes = {
  md: "px-4 py-2 text-base",
  sm: "px-4 py-[7px] text-sm",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-card font-semibold leading-tight transition-colors disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
