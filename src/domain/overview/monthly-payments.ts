import type { MonthlyPaymentTotals } from "@/domain/payment/monthly-history";

export type OverviewMonthlyPayments = {
  months: MonthlyPaymentTotals[];
};
