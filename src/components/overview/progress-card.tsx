import { BarChart, type BarChartBar } from "@/components/ui/bar-chart";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import type { OverviewProgress } from "@/domain/overview/progress";
import { cn } from "@/lib/cn";
import { formatUSD } from "@/lib/format";

const WINDOW = 8;

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function ProgressCard({ progress }: { progress: OverviewProgress }) {
  const history = progress.history.slice(-WINDOW);
  const lastIndex = history.length - 1;

  const bars: BarChartBar[] = history.map((point, index) => ({
    label: monthLabel(point.month),
    segments: [{ value: point.balance, tone: "blue" }],
    emphasized: index === lastIndex,
    valueLabel:
      index === lastIndex
        ? formatUSD(point.balance, { compact: true })
        : undefined,
  }));

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="Progress"
        trailing={<span className="text-sm text-muted">Balance by month</span>}
      />
      <BarChart bars={bars} trend={false} />
      <div className="flex items-center gap-1.5 text-sm">
        <span
          className={cn(
            "flex items-center gap-1 font-bold tabular-nums",
            progress.balanceReduced < 0 ? "text-coral-bold" : "text-blue-text",
          )}
        >
          <span>{progress.balanceReduced < 0 ? "▴" : "▾"}</span>
          {formatUSD(Math.abs(progress.balanceReduced))}
        </span>
        <span className="text-muted">all time</span>
      </div>
    </Card>
  );
}
