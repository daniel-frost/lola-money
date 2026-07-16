import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import { StatusPill } from "@/components/ui/status-pill";
import { ValueRow } from "@/components/ui/value-row";
import type { OverviewDebtRow } from "@/domain/overview/debt-row";
import { formatAPR, formatMonthYear, formatUSD } from "@/lib/format";

export function DebtsCard({ debts }: { debts: OverviewDebtRow[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader
        title={
          <>
            Debts <span className="text-muted">· {debts.length}</span>
          </>
        }
        trailing={
          <button className="text-sm font-bold text-blue-text hover:text-blue-bold">
            + Add debt
          </button>
        }
      />

      <div className="flex flex-col">
        {debts.map((row, index) => (
          <ValueRow
            key={row.debt.id}
            divider={index > 0}
            value={formatUSD(row.debt.currentBalance)}
            name={row.debt.name}
            detail={
              <span className="inline-flex items-center gap-2">
                {formatAPR(row.debt.apr)} APR
                {row.projectedPayoffOn
                  ? ` · paid off ${formatMonthYear(row.projectedPayoffOn, {
                      long: true,
                    })}`
                  : " · not on track"}
                {row.isFocus ? <StatusPill variant="focus" /> : null}
              </span>
            }
            trailing={<span className="text-faint">›</span>}
          />
        ))}
      </div>
    </Card>
  );
}
