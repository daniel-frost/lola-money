import type { Debt, DebtType } from "@/domain/debt/debt";

export type DebtTableRow = {
  debt: Debt;
  paidOffRatio: number;
  paidOffOn: Date | null;
};

export type DebtGroup = {
  label: string;
  count: number;
  balance: number;
  minimum: number;
  rows: DebtTableRow[];
};

export type DebtsTable = {
  groups: DebtGroup[];
  totals: {
    balance: number;
    minimum: number;
    avgApr: number;
    paidOffRatio: number;
  };
};

const TYPE_LABEL: Record<DebtType, string> = {
  credit_card: "Credit cards",
  personal: "Personal loans",
  student_loan: "Student loans",
  auto: "Auto loans",
  mortgage: "Mortgages",
  medical: "Medical",
  other: "Other",
};

const TYPE_ORDER = [
  "Credit cards",
  "Personal loans",
  "Student loans",
  "Auto loans",
  "Mortgages",
  "Medical",
  "Other",
];

export function groupDebtRows(rows: DebtTableRow[]): DebtGroup[] {
  const byLabel = new Map<string, DebtTableRow[]>();
  for (const row of rows) {
    const label = TYPE_LABEL[row.debt.type];
    const list = byLabel.get(label) ?? [];
    list.push(row);
    byLabel.set(label, list);
  }
  return TYPE_ORDER.filter((label) => byLabel.has(label)).map((label) => {
    const groupRows = byLabel.get(label)!;
    return {
      label,
      count: groupRows.length,
      balance: groupRows.reduce((sum, row) => sum + row.debt.currentBalance, 0),
      minimum: groupRows.reduce((sum, row) => sum + row.debt.minimumPayment, 0),
      rows: groupRows,
    };
  });
}
