import type { OverviewDebtRow } from "@/domain/overview/debt-row";
import type { OverviewHeaderStats } from "@/domain/overview/header-stats";
import { listDebts } from "@/server/debt/debt.service";

export async function getOverviewHeaderStats(): Promise<OverviewHeaderStats> {
  return {
    remaining: 4_231_800,
    debtFreeOn: new Date("2029-08-01"),
    paidOffRatio: 0.34,
    strategy: "snowball",
  };
}

const FABRICATED: Record<string, { projectedPayoffOn: Date; isFocus: boolean }> = {
  "store-card": { projectedPayoffOn: new Date("2026-12-01"), isFocus: true },
  "personal-loan": { projectedPayoffOn: new Date("2027-08-01"), isFocus: false },
  "visa-4412": { projectedPayoffOn: new Date("2028-03-01"), isFocus: false },
  "student-loan": { projectedPayoffOn: new Date("2028-11-01"), isFocus: false },
  "auto-loan": { projectedPayoffOn: new Date("2029-08-01"), isFocus: false },
};

export async function getOverviewDebts(): Promise<OverviewDebtRow[]> {
  const debts = await listDebts();
  return debts.map((debt) => ({ debt, ...FABRICATED[debt.id] }));
}
