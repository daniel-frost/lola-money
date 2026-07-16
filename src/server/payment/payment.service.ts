import type { Payment } from "@/domain/payment/payment";
import { payments } from "@/fixtures/payments";

export async function getPayments(): Promise<Payment[]> {
  return payments;
}
