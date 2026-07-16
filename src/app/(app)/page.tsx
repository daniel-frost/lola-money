import { OverviewHeader } from "@/components/overview/overview-header";
import { getOverviewHeaderStats } from "@/server/overview/overview.service";
import { getCurrentUser } from "@/server/user/user.service";

export default async function Overview() {
  const [user, summary] = await Promise.all([
    getCurrentUser(),
    getOverviewHeaderStats(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <OverviewHeader userName={user.name} summary={summary} />
    </div>
  );
}
