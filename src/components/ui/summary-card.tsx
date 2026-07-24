import { Card } from "@/components/ui/card";

export type SummaryRow = { label: string; value: string };

export function SummaryCard({
  title,
  rows,
}: {
  title: string;
  rows: SummaryRow[];
}) {
  return (
    <Card className="p-0">
      <div className="border-b border-hairline px-5 py-3">
        <span className="text-xs font-medium uppercase tracking-label text-faint">
          {title}
        </span>
      </div>
      <dl className="divide-y divide-hairline">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-5 py-3.5"
          >
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="text-sm font-bold tabular-nums text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
