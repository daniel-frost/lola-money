import { Card } from "@/components/ui/card";
import { Highlight } from "@/components/ui/highlight";
import type { OverviewDebtFree } from "@/domain/overview/debt-free";
import { formatMonthYear } from "@/lib/format";

export function DebtFreeCard({ debtFree }: { debtFree: OverviewDebtFree }) {
  return (
    <Card className="flex items-end justify-between gap-4">
      <div>
        <div className="text-sm text-muted">Debt-free</div>
        <div className="mt-3 font-display text-4xl font-black leading-none tracking-display text-ink">
          {debtFree.debtFreeOn ? (
            <Highlight>{formatMonthYear(debtFree.debtFreeOn)}</Highlight>
          ) : (
            "—"
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-3xl font-bold tabular-nums text-ink">
          {debtFree.months ?? "—"}
        </div>
        <div className="text-sm text-muted">months to go</div>
      </div>
    </Card>
  );
}
