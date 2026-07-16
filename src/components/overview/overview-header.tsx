import { Highlight } from "@/components/ui/highlight";
import type { OverviewHeaderStats } from "@/domain/overview/header-stats";
import { STRATEGY_LABELS } from "@/domain/payoff/strategy";
import { formatMonthYear, formatPercent, formatUSD } from "@/lib/format";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-end text-right">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-base font-bold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

export function OverviewHeader({
  userName,
  summary,
}: {
  userName: string;
  summary: OverviewHeaderStats;
}) {
  return (
    <header className="flex items-start justify-between gap-6">
      <h1 className="font-display text-[32px] font-black leading-tight tracking-display text-ink">
        Welcome back, <Highlight>{userName}!</Highlight>
      </h1>

      <dl className="flex items-start gap-8">
        <Stat label="Remaining" value={formatUSD(summary.remainingCents)} />
        <Stat
          label="Debt-free"
          value={<Highlight>{formatMonthYear(summary.debtFreeOn)}</Highlight>}
        />
        <Stat label="Paid off" value={formatPercent(summary.paidOffRatio)} />
        <Stat label="Plan" value={STRATEGY_LABELS[summary.strategy]} />
      </dl>
    </header>
  );
}
