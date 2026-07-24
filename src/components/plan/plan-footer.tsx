import type { PlanDebtFree } from "@/domain/payoff/plan-view";
import { formatMonthYear, formatUSD } from "@/lib/format";

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-sm text-muted">
      {label}{" "}
      <span className="ml-1 font-bold tabular-nums text-ink">{value}</span>
    </span>
  );
}

export function PlanFooter({ debtFree }: { debtFree: PlanDebtFree }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline bg-canvas px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl font-black text-ink">
          {debtFree.date ? formatMonthYear(debtFree.date) : "—"}
        </span>
        <span className="rounded-pill-status bg-green-wash px-2 py-0.5 text-xs font-bold lowercase text-green-bold">
          Debt-free
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        {debtFree.month !== null ? (
          <FooterStat label="Month" value={debtFree.month.toString()} />
        ) : null}
        <FooterStat
          label="Final payment"
          value={formatUSD(debtFree.finalPayment)}
        />
        <FooterStat label="Balance" value={formatUSD(debtFree.finalBalance)} />
      </div>
    </div>
  );
}
