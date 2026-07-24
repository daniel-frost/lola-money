import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanStats } from "@/domain/payoff/plan-view";
import { formatPercent, formatUSD } from "@/lib/format";

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-10 items-center gap-2 rounded-card border border-hairline-strong bg-card px-3.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-bold tabular-nums text-ink">{value}</span>
    </div>
  );
}

export function PlanHeader({ stats }: { stats: PlanStats }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Chip label="Monthly budget" value={formatUSD(stats.monthlyBudget)} />
        <Chip label="Minimums" value={formatUSD(stats.minimums)} />
        <Chip label="Extra" value={formatUSD(stats.extra)} />
        <Chip
          label="Months left"
          value={stats.monthsLeft?.toString() ?? "—"}
        />
        <Chip
          label="Overall progress"
          value={formatPercent(stats.progress, { maximumFractionDigits: 0 })}
        />
      </div>
      <Button variant="secondary">
        <Download className="h-4 w-4" />
        CSV
      </Button>
    </div>
  );
}
