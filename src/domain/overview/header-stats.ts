import type { Strategy } from "@/domain/payoff/strategy";

export type OverviewHeaderStats = {
  remaining: number;
  debtFreeOn: Date;
  paidOffRatio: number;
  strategy: Strategy;
};
