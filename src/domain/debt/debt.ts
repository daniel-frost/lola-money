export const DEBT_TYPES = [
  "credit_card",
  "student_loan",
  "auto",
  "mortgage",
  "personal",
  "medical",
  "other",
] as const;

export type DebtType = (typeof DEBT_TYPES)[number];

export const DEBT_STATUSES = ["active", "paid_off", "archived"] as const;

export type DebtStatus = (typeof DEBT_STATUSES)[number];

export type Debt = {
  id: string;
  name: string;
  type: DebtType;
  status: DebtStatus;
  currentBalance: number;
  highestBalance: number;
  apr: number;
  minimumPayment: number;
  dueDayOfMonth: number;
  nextPaymentDueOn: Date;
};
