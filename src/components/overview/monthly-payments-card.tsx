import { BarChart, type BarChartBar } from "@/components/ui/bar-chart";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import type { OverviewMonthlyPayments } from "@/domain/overview/monthly-payments";
import type { MonthlyPaymentTotals } from "@/domain/payment/monthly-history";
import { addMonths } from "@/lib/date";

const WINDOW = 7;

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function toBar(month: MonthlyPaymentTotals): BarChartBar {
  if (month.planned) {
    return {
      label: monthLabel(month.month),
      emphasized: true,
      variant: "planned",
      segments: [
        { value: month.minimumsBaseline, tone: "neutral" },
        { value: month.plannedExtra, tone: "blue" },
      ],
    };
  }
  return {
    label: monthLabel(month.month),
    variant: "solid",
    segments: [
      { value: month.minimumsPaid, tone: "neutral" },
      { value: month.extraPaid, tone: "blue" },
    ],
  };
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px] bg-blue-bold" />
        Extra
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px] bg-hairline-strong" />
        Minimums
      </span>
    </div>
  );
}

export function MonthlyPaymentsCard({
  monthly,
}: {
  monthly: OverviewMonthlyPayments;
}) {
  const real = monthly.months.slice(-WINDOW);
  const lastMonth = real[real.length - 1]?.month;
  const placeholderCount = Math.max(0, WINDOW - real.length);

  const bars: BarChartBar[] = [
    ...real.map(toBar),
    ...Array.from({ length: placeholderCount }, (_, index) => ({
      label: lastMonth ? monthLabel(addMonths(lastMonth, index + 1)) : "",
      variant: "placeholder" as const,
      segments: [],
    })),
  ];

  const subtitle =
    real.length <= 1
      ? "Your first month — history builds here as you go"
      : "Extra above minimums";

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <CardHeader title="Monthly payments" trailing={<Legend />} />
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      <BarChart bars={bars} />
    </Card>
  );
}
