import type {
  PaymentRow,
  PaymentsSummary,
} from "@/domain/payment/monthly-payments";

export type OverviewPayments = {
  daysLeft: number;
  rows: PaymentRow[];
  summary: PaymentsSummary;
};
