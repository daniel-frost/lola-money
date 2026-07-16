export type PaymentStatus = "paid" | "next" | "upcoming";

export type PaymentRow = {
  debtId: string;
  debtName: string;
  amount: number;
  status: PaymentStatus;
  date: Date;
  breakdown?: { minimum: number; extra: number };
};

export type PaymentsSummary = {
  paid: number;
  planned: number;
  paidCount: number;
  totalCount: number;
};

export function summarizePayments(rows: PaymentRow[]): PaymentsSummary {
  const paidRows = rows.filter((row) => row.status === "paid");
  return {
    paid: paidRows.reduce((sum, row) => sum + row.amount, 0),
    planned: rows.reduce((sum, row) => sum + row.amount, 0),
    paidCount: paidRows.length,
    totalCount: rows.length,
  };
}
