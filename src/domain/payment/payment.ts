export const PAYMENT_TYPES = ["regular", "windfall"] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];

export type Payment = {
  id: string;
  debtId: string;
  amount: number;
  date: Date;
  type: PaymentType;
  note?: string;
  createdAt: Date;
};
