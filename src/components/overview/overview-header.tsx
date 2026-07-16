import { Highlight } from "@/components/ui/highlight";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-end text-right">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-base font-bold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

export function OverviewHeader() {
  return (
    <header className="flex items-start justify-between gap-6">
      <h1 className="font-display text-[32px] font-black leading-tight tracking-display text-ink">
        Welcome back, <Highlight>Maya!</Highlight>
      </h1>

      <dl className="flex items-start gap-8">
        <Stat label="Remaining" value="$42,318" />
        <Stat label="Debt-free" value={<Highlight>Aug 2029</Highlight>} />
        <Stat label="Paid off" value="34%" />
        <Stat label="Plan" value="Snowball" />
      </dl>
    </header>
  );
}
