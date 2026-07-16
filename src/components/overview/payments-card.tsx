import { PaymentRow } from "@/components/overview/payment-row";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import type { OverviewPayments } from "@/domain/overview/payments";

export function PaymentsCard({ payments }: { payments: OverviewPayments }) {
  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="July payments"
        trailing={
          <span className="text-sm text-muted">{payments.daysLeft} days left</span>
        }
      />

      <div className="flex flex-col gap-2">
        {payments.rows.map((row) => (
          <PaymentRow key={row.debtId} row={row} />
        ))}
      </div>
    </Card>
  );
}
