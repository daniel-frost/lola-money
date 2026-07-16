import type { Debt } from "@/domain/debt/debt";

export type OverviewDebtRow = {
  debt: Debt;
  projectedPayoffOn: Date | null;
  isFocus: boolean;
};
