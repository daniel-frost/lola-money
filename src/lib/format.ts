export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatPercent(
  ratio: number,
  options?: { maximumFractionDigits?: number },
): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(ratio);
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
