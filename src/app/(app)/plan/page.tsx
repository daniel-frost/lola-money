import { PlanHeader } from "@/components/plan/plan-header";
import { PlanScheduleTable } from "@/components/plan/plan-schedule-table";
import { getPlanView } from "@/server/plan/plan.service";

export default async function PlanPage() {
  const view = await getPlanView();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-[32px] font-black tracking-display text-ink">
        Plan
      </h1>

      <div className="flex flex-col gap-3">
        <PlanHeader stats={view.stats} />
        <PlanScheduleTable
          columns={view.columns}
          schedule={view.schedule}
          debtFree={view.debtFree}
        />
      </div>
    </div>
  );
}
