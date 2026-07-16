import type { Strategy } from "@/domain/payoff/strategy";

export type OverviewHeaderStats = {
  remaining: number;
  paidOffRatio: number;
  strategy: Strategy;
};
