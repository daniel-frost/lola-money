import { PlanScheduleTable } from "@/components/plan/plan-schedule-table";
import { getPlanView } from "@/server/plan/plan.service";

export default async function PlanPage() {
  const view = await getPlanView();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-[32px] font-black tracking-display text-ink">
        Plan
      </h1>
      <PlanScheduleTable columns={view.columns} schedule={view.schedule} />
    </div>
  );
}
