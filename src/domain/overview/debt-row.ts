import type { Debt } from "@/domain/debt/debt";

export type OverviewDebtRow = {
  debt: Debt;
  projectedPayoffOn: Date;
  isFocus: boolean;
};
