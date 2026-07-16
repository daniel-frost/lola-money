import { Button } from "@/components/ui/button";
import { ValueRow } from "@/components/ui/value-row";
import type { PaymentRow as PaymentRowData } from "@/domain/payment/monthly-payments";
import { formatUSD, formatWeekdayDate } from "@/lib/format";

const surface: Record<PaymentRowData["status"], string> = {
  paid: "rounded-2xl bg-green-wash px-4",
  next: "rounded-2xl bg-yellow-wash px-4",
  upcoming: "px-4",
};

function Detail({ row }: { row: PaymentRowData }) {
  const date = formatWeekdayDate(row.date);
  if (row.status !== "paid") return <>{date}</>;
  return (
    <>
      Paid {date}
      {row.breakdown
        ? ` · min ${formatUSD(row.breakdown.minimum)} + ${formatUSD(
            row.breakdown.extra,
          )} extra`
        : ""}
    </>
  );
}

function Trailing({ row }: { row: PaymentRowData }) {
  if (row.status === "paid") {
    return <span className="font-bold text-green-bold">Paid</span>;
  }
  return (
    <Button variant={row.status === "next" ? "primary" : "ghost"} size="sm">
      Mark paid
    </Button>
  );
}

export function PaymentRow({ row }: { row: PaymentRowData }) {
  return (
    <div className={surface[row.status]}>
      <ValueRow
        leading={
          row.status === "paid" ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-green-bold">
              ✓
            </span>
          ) : undefined
        }
        value={formatUSD(row.amount)}
        name={row.debtName}
        detail={<Detail row={row} />}
        trailing={<Trailing row={row} />}
      />
    </div>
  );
}
