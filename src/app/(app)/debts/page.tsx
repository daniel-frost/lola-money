import { DebtsGroupBy } from "@/components/debts/debts-group-by";
import { DebtsTable } from "@/components/debts/debts-table";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatPercent, formatUSD } from "@/lib/format";
import { getDebtsTable } from "@/server/debt/debt.service";

export default async function DebtsPage() {
  const table = await getDebtsTable();
  const debtCount = table.groups.reduce((sum, group) => sum + group.count, 0);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-[32px] font-black tracking-display text-ink">
        Debts
      </h1>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted">
            All debts <span className="text-faint">· {debtCount}</span>
          </span>
          <div className="flex items-center gap-3">
            <DebtsGroupBy />
            <Button>+ Add debt</Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <DebtsTable table={table} />
          </div>
          <div className="lg:w-[280px]">
            <SummaryCard
              title="Summary"
              rows={[
                {
                  label: "Total balance",
                  value: formatUSD(table.totals.balance),
                },
                {
                  label: "Avg APR",
                  value: formatPercent(table.totals.avgApr / 10000, {
                    maximumFractionDigits: 1,
                  }),
                },
                {
                  label: "Minimums / mo",
                  value: formatUSD(table.totals.minimum),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
