import type { PayoffPlanInput } from "@/domain/payoff/simulate";
import { plan } from "@/fixtures/plan";

export async function getPlan(): Promise<PayoffPlanInput> {
  return plan;
}
