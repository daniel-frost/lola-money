import type { Debt, DebtStatus, DebtType } from "@/domain/debt/debt";
import { prisma } from "@/server/db";

export async function findDebts(): Promise<Debt[]> {
  const rows = await prisma.debt.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type as DebtType,
    status: row.status as DebtStatus,
    currentBalance: row.currentBalance,
    highestBalance: row.highestBalance,
    apr: row.apr,
    minimumPayment: row.minimumPayment,
    dueDayOfMonth: row.dueDayOfMonth,
    nextPaymentDueOn: row.nextPaymentDueOn,
  }));
}
