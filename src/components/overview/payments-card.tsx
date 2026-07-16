import { PaymentRow } from "@/components/overview/payment-row";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { OverviewPayments } from "@/domain/overview/payments";
import { paymentProgress } from "@/domain/payment/monthly-payments";
import { formatUSD } from "@/lib/format";

export function PaymentsCard({ payments }: { payments: OverviewPayments }) {
  const { summary } = payments;
  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="July payments"
        trailing={
          <span className="text-sm text-muted">{payments.daysLeft} days left</span>
        }
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4 text-sm">
          <span className="text-muted">
            <span className="font-bold tabular-nums text-ink">
              {formatUSD(summary.paid)}
            </span>{" "}
            of {formatUSD(summary.planned)} paid
          </span>
          <span className="font-semibold tabular-nums text-green-bold">
            {summary.paidCount} of {summary.totalCount} payments made
          </span>
        </div>
        <ProgressBar value={paymentProgress(summary)} />
      </div>

      <div className="flex flex-col gap-2">
        {payments.rows.map((row) => (
          <PaymentRow key={row.debtId} row={row} />
        ))}
      </div>
    </Card>
  );
}
