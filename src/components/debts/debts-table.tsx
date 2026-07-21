import { Card } from "@/components/ui/card";
import type { DebtsTable as DebtsTableData } from "@/domain/debt/debt-table";
import { cn } from "@/lib/cn";
import { formatAPR, formatMonthYear, formatPercent, formatUSD } from "@/lib/format";

const th =
  "border border-hairline px-3 py-2.5 text-xs font-medium uppercase tracking-label text-faint";
const td = "border border-hairline px-3 py-2.5";

export function DebtsTable({ table }: { table: DebtsTableData }) {
  const { rows, totals } = table;

  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={cn(th, "text-center")}>#</th>
            <th className={cn(th, "text-left")}>Debt</th>
            <th className={cn(th, "text-right")}>Balance ↓</th>
            <th className={cn(th, "text-right")}>APR</th>
            <th className={cn(th, "text-right")}>Min /mo</th>
            <th className={cn(th, "text-right")}>Paid off</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => {
            const paidOff = row.debt.status === "paid_off";
            return (
              <tr
                key={row.debt.id}
                className={cn(
                  paidOff
                    ? "bg-green-wash/40"
                    : index % 2 === 1 && "bg-hairline/40",
                )}
              >
                <td className={cn(td, "text-center text-faint")}>
                  {paidOff ? (
                    <span className="font-bold text-green-bold">✓</span>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className={cn(td, "font-bold text-ink")}>
                  {row.debt.name}
                  {paidOff && row.paidOffOn ? (
                    <span className="font-normal text-muted">
                      {" · paid off "}
                      {formatMonthYear(row.paidOffOn)}
                    </span>
                  ) : null}
                </td>
                <td
                  className={cn(
                    td,
                    "text-right font-bold tabular-nums",
                    paidOff ? "text-green-bold" : "text-ink",
                  )}
                >
                  {formatUSD(row.debt.currentBalance)}
                </td>
                <td className={cn(td, "text-right tabular-nums text-ink")}>
                  {paidOff ? "" : formatAPR(row.debt.apr)}
                </td>
                <td
                  className={cn(td, "text-right font-bold tabular-nums text-ink")}
                >
                  {paidOff ? "" : formatUSD(row.debt.minimumPayment)}
                </td>
                <td
                  className={cn(
                    td,
                    "text-right tabular-nums",
                    paidOff ? "font-bold text-green-bold" : "text-ink",
                  )}
                >
                  {formatPercent(row.paidOffRatio)}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-ink font-bold text-ink">
            <td className="px-3 py-3" />
            <td className="px-3 py-3 text-xs uppercase tracking-label text-faint">
              Total
            </td>
            <td className="px-3 py-3 text-right tabular-nums">
              {formatUSD(totals.balance)}
            </td>
            <td className="px-3 py-3" />
            <td className="px-3 py-3 text-right tabular-nums">
              {formatUSD(totals.minimum)}
            </td>
            <td className="px-3 py-3 text-right tabular-nums">
              {formatPercent(totals.paidOffRatio)}
            </td>
          </tr>
        </tfoot>
      </table>
    </Card>
  );
}
