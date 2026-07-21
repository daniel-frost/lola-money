import type { Debt } from "@/domain/debt/debt";

export type DebtTableRow = {
  debt: Debt;
  paidOffRatio: number;
  paidOffOn: Date | null;
};

export type DebtsTable = {
  rows: DebtTableRow[];
  totals: {
    balance: number;
    minimum: number;
    paidOffRatio: number;
  };
};
