import type { PayoffPlanInput } from "@/domain/payoff/simulate";

export const plan: PayoffPlanInput = {
  strategy: "snowball",
  monthlyExtra: 50_000,
  customOrder: [],
};
