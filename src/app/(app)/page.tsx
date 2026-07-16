import { OverviewHeader } from "@/components/overview/overview-header";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
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

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-6">
          <Card className="min-h-48">
            <CardHeader title="July payments" />
          </Card>
          <Card className="min-h-48">
            <CardHeader title="Debts" />
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="min-h-48">
            <CardHeader title="Monthly payments" />
          </Card>
          <Card className="min-h-48">
            <CardHeader title="Progress" />
          </Card>
        </div>
      </div>
    </div>
  );
}
