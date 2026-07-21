"use client";

import { Fragment, useState } from "react";
import { Card } from "@/components/ui/card";
import type { DebtsTable as DebtsTableData } from "@/domain/debt/debt-table";
import { cn } from "@/lib/cn";
import { formatAPR, formatPercent, formatUSD } from "@/lib/format";

const th =
  "border border-hairline px-3 py-2.5 text-xs font-medium uppercase tracking-label text-faint";
const td = "border border-hairline px-3 py-2.5";

export function DebtsTable({ table }: { table: DebtsTableData }) {
  const { groups, totals } = table;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (label: string) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

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
          {groups.map((group) => {
            const isCollapsed = collapsed[group.label];
            return (
              <Fragment key={group.label}>
                <tr
                  className="cursor-pointer select-none font-bold text-ink hover:bg-hairline/40"
                  onClick={() => toggle(group.label)}
                >
                  <td className={cn(td, "text-center text-faint")}>
                    {isCollapsed ? "▸" : "▾"}
                  </td>
                  <td className={td}>
                    {group.label}
                    <span className="pl-1 font-normal text-faint">
                      ({group.count})
                    </span>
                  </td>
                  <td className={td} />
                  <td className={td} />
                  <td className={td} />
                  <td className={td} />
                </tr>

                {!isCollapsed &&
                  group.rows.map((row) => (
                    <tr key={row.debt.id}>
                      <td className={td} />
                      <td className={cn(td, "pl-8 text-ink")}>
                        {row.debt.name}
                      </td>
                      <td className={cn(td, "text-right tabular-nums text-ink")}>
                        {formatUSD(row.debt.currentBalance)}
                      </td>
                      <td className={cn(td, "text-right tabular-nums text-ink")}>
                        {formatAPR(row.debt.apr)}
                      </td>
                      <td className={cn(td, "text-right tabular-nums text-ink")}>
                        {formatUSD(row.debt.minimumPayment)}
                      </td>
                      <td className={cn(td, "text-right tabular-nums text-ink")}>
                        {formatPercent(row.paidOffRatio)}
                      </td>
                    </tr>
                  ))}
              </Fragment>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t border-hairline-strong font-bold text-ink">
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
