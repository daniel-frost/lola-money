"use client";

import { useState } from "react";
import { PlanFooter } from "@/components/plan/plan-footer";
import { Card } from "@/components/ui/card";
import { Caret } from "@/components/ui/caret";
import type { PlanColumn, PlanDebtFree } from "@/domain/payoff/plan-view";
import type { ScheduleMonth } from "@/domain/payoff/simulate";
import { cn } from "@/lib/cn";
import { formatMonthYear, formatUSD } from "@/lib/format";

const INITIAL_ROWS = 12;

const th =
  "border-b border-hairline px-3 py-2.5 text-xs font-bold uppercase tracking-label text-faint";
const td = "border-b border-hairline px-3 py-3 tabular-nums";

// Frozen (sticky-left) column positioning — # sits at the edge, Month butts
// against it, and Month carries the right border that marks the freeze line.
const stickyNum = "sticky left-0 w-12";
const stickyMonth = "sticky left-12 border-r border-hairline";

export function PlanScheduleTable({
  columns,
  schedule,
  debtFree,
}: {
  columns: PlanColumn[];
  schedule: ScheduleMonth[];
  debtFree: PlanDebtFree | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? schedule : schedule.slice(0, INITIAL_ROWS);
  const hidden = schedule.length - INITIAL_ROWS;

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className={cn(th, stickyNum, "z-20 bg-card text-center")}>#</th>
              <th className={cn(th, stickyMonth, "z-20 bg-card text-left")}>
                Month
              </th>
              {columns.map((col) => (
                <th
                  key={col.debtId}
                  className={cn(th, "min-w-[104px] text-right")}
                >
                  <span
                    className="inline-block max-w-[128px] truncate align-middle"
                    title={col.label}
                  >
                    {col.label}
                  </span>
                </th>
              ))}
              <th className={cn(th, "text-right")}>Interest</th>
              <th className={cn(th, "text-right")}>Balance</th>
              <th className={cn(th, "text-right")}>Total</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((month) => {
              const isNow = month.index === 1;
              const focusId = columns.find(
                (col) => month.payments[col.debtId],
              )?.debtId;
              const frozenBg = isNow ? "bg-now" : "bg-card";
              return (
                <tr key={month.index} className={cn(isNow && "bg-now")}>
                  <td
                    className={cn(
                      td,
                      stickyNum,
                      "z-10 text-center text-faint",
                      frozenBg,
                    )}
                  >
                    {month.index}
                  </td>
                  <td
                    className={cn(
                      td,
                      stickyMonth,
                      "z-10 whitespace-nowrap text-ink",
                      isNow && "font-bold",
                      frozenBg,
                    )}
                  >
                    {formatMonthYear(month.date)}
                    {isNow ? (
                      <span className="ml-2 rounded-pill-status bg-yellow-wash px-1.5 py-0.5 align-middle text-[10px] font-bold lowercase text-yellow-bold">
                        Now
                      </span>
                    ) : null}
                  </td>
                  {columns.map((col) => {
                    const cell = month.payments[col.debtId];
                    if (!cell) {
                      return (
                        <td
                          key={col.debtId}
                          className={cn(td, "text-right text-faint")}
                        >
                          —
                        </td>
                      );
                    }
                    return (
                      <td
                        key={col.debtId}
                        className={cn(
                          td,
                          "text-right",
                          col.debtId === focusId && "font-bold",
                          cell.paidOff ? "text-green-bold" : "text-ink",
                        )}
                      >
                        {formatUSD(cell.payment)}
                      </td>
                    );
                  })}
                  <td className={cn(td, "text-right text-faint")}>
                    {formatUSD(month.interest)}
                  </td>
                  <td className={cn(td, "text-right text-ink")}>
                    {formatUSD(month.endingBalance)}
                  </td>
                  <td className={cn(td, "text-right text-muted")}>
                    {formatUSD(month.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 bg-canvas py-3 text-sm font-bold text-blue-text transition-colors hover:bg-hairline/40"
        >
          {expanded ? "Show fewer rows" : `Show ${hidden} more rows`}
          <Caret className={cn(expanded && "rotate-180")} />
        </button>
      ) : null}

      {debtFree ? <PlanFooter debtFree={debtFree} /> : null}
    </Card>
  );
}
