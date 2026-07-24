import type { Payment, PaymentType } from "@/domain/payment/payment";
import { prisma } from "@/server/db";

export async function findPayments(): Promise<Payment[]> {
  const rows = await prisma.payment.findMany();
  return rows.map((row) => ({
    id: row.id,
    debtId: row.debtId,
    amount: row.amount,
    date: row.date,
    type: row.type as PaymentType,
    note: row.note ?? undefined,
    createdAt: row.createdAt,
  }));
}
