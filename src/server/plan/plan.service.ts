import type { PayoffPlanInput } from "@/domain/payoff/simulate";
import { findPlan } from "@/server/plan/plan.repository";

export async function getPlan(): Promise<PayoffPlanInput> {
  return findPlan();
}
