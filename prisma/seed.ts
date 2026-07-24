import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { debts } from "@/fixtures/debts";
import { plan } from "@/fixtures/plan";
import { payments } from "@/fixtures/payments";

const prisma = new PrismaClient();

const MAYA_ID = "user-maya";

const PAID_OFF_ON: Record<string, Date> = {
  "old-card": new Date("2026-05-15"),
};

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: { id: MAYA_ID, name: "Maya", email: "maya@example.com" },
  });

  for (const debt of debts) {
    await prisma.debt.create({
      data: {
        id: debt.id,
        userId: MAYA_ID,
        name: debt.name,
        type: debt.type,
        status: debt.status,
        currentBalance: debt.currentBalance,
        highestBalance: debt.highestBalance,
        apr: debt.apr,
        minimumPayment: debt.minimumPayment,
        dueDayOfMonth: debt.dueDayOfMonth,
        nextPaymentDueOn: debt.nextPaymentDueOn,
        paidOffOn: PAID_OFF_ON[debt.id] ?? null,
      },
    });
  }

  await prisma.payoffPlan.create({
    data: {
      userId: MAYA_ID,
      strategy: plan.strategy,
      monthlyExtra: plan.monthlyExtra,
      customOrder: plan.customOrder ?? [],
    },
  });

  for (const payment of payments) {
    await prisma.payment.create({
      data: {
        id: payment.id,
        debtId: payment.debtId,
        amount: payment.amount,
        date: payment.date,
        type: payment.type,
        note: payment.note ?? null,
      },
    });
  }

  console.log(
    `Seeded: 1 user, ${debts.length} debts, 1 plan, ${payments.length} payments`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
