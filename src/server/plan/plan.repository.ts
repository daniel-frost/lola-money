import type { PayoffPlanInput } from "@/domain/payoff/simulate";
import type { Strategy } from "@/domain/payoff/strategy";
import { prisma } from "@/server/db";

export async function findPlan(): Promise<PayoffPlanInput> {
  const plan = await prisma.payoffPlan.findFirstOrThrow();
  return {
    strategy: plan.strategy as Strategy,
    monthlyExtra: plan.monthlyExtra,
    customOrder: plan.customOrder,
  };
}
