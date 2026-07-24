import { buildPlanView, type PlanView } from "@/domain/payoff/plan-view";
import type { PayoffPlanInput } from "@/domain/payoff/simulate";
import { findDebts } from "@/server/debt/debt.repository";
import { findPlan } from "@/server/plan/plan.repository";

export async function getPlan(): Promise<PayoffPlanInput> {
  return findPlan();
}

export async function getPlanView(): Promise<PlanView> {
  const [debts, plan] = await Promise.all([findDebts(), findPlan()]);
  return buildPlanView(debts, plan);
}
