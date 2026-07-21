import { PaymentRow } from "@/components/overview/payment-row";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import { ProgressBar, type ProgressTone } from "@/components/ui/progress-bar";
import type { OverviewPayments } from "@/domain/overview/payments";
import { formatUSD } from "@/lib/format";

function ProgressLine({
  label,
  paid,
  total,
  tone,
  trackClassName,
}: {
  label: string;
  paid: number;
  total: number;
  tone: ProgressTone;
  trackClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-muted">{label}</span>
        <span className="tabular-nums text-muted">
          <span className="font-bold text-ink">{formatUSD(paid)}</span> of{" "}
          {formatUSD(total)}
        </span>
      </div>
      <ProgressBar
        value={total > 0 ? paid / total : 0}
        tone={tone}
        className={trackClassName}
      />
    </div>
  );
}

export function PaymentsCard({ payments }: { payments: OverviewPayments }) {
  const { summary, overall } = payments;
  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="July payments"
        trailing={
          <span className="text-sm text-muted">{payments.daysLeft} days left</span>
        }
      />

      <div className="flex flex-col gap-3">
        <ProgressLine
          label="Overall"
          paid={overall.paid}
          total={overall.total}
          tone="blue"
          trackClassName="bg-[#e3f2fd]"
        />
        <ProgressLine
          label="July"
          paid={summary.paid}
          total={summary.planned}
          tone="green"
        />
      </div>

      <div className="flex flex-col gap-2">
        {payments.rows.map((row) => (
          <PaymentRow key={row.debtId} row={row} />
        ))}
      </div>
    </Card>
  );
}
