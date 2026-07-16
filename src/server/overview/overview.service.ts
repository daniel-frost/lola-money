import type { OverviewHeaderStats } from "@/domain/overview/header-stats";

export async function getOverviewHeaderStats(): Promise<OverviewHeaderStats> {
  return {
    remaining: 4_231_800,
    debtFreeOn: new Date("2029-08-01"),
    paidOffRatio: 0.34,
    strategy: "snowball",
  };
}
