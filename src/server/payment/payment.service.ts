import type { Payment } from "@/domain/payment/payment";
import { findPayments } from "@/server/payment/payment.repository";

export async function getPayments(): Promise<Payment[]> {
  return findPayments();
}
