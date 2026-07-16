import type { Strategy } from "@/domain/payoff/strategy";

export type OverviewHeaderStats = {
  remainingCents: number;
  debtFreeOn: Date;
  paidOffRatio: number;
  strategy: Strategy;
};
