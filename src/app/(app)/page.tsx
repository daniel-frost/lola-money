import { OverviewHeader } from "@/components/overview/overview-header";
import { getOverviewHeaderStats } from "@/server/overview/overview.service";

export default async function Overview() {
  const summary = await getOverviewHeaderStats();

  return (
    <div className="flex flex-col gap-8">
      <OverviewHeader userName="Maya" summary={summary} />
    </div>
  );
}
