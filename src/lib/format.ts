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

export function formatAPR(bps: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(bps / 10000);
}

export function formatMonthYear(
  date: Date,
  options?: { long?: boolean },
): string {
  return new Intl.DateTimeFormat("en-US", {
    month: options?.long ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
