import { DebtFreeCard } from "@/components/overview/debt-free-card";
import { DebtsCard } from "@/components/overview/debts-card";
import { MonthlyPaymentsCard } from "@/components/overview/monthly-payments-card";
import { OverviewHeader } from "@/components/overview/overview-header";
import { PaymentsCard } from "@/components/overview/payments-card";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import {
  getOverviewDebtFree,
  getOverviewDebts,
  getOverviewHeaderStats,
  getOverviewMonthlyPayments,
  getOverviewPayments,
} from "@/server/overview/overview.service";
import { getCurrentUser } from "@/server/user/user.service";

export default async function Overview() {
  const [user, summary, debtFree, debts, payments, monthlyPayments] =
    await Promise.all([
      getCurrentUser(),
      getOverviewHeaderStats(),
      getOverviewDebtFree(),
      getOverviewDebts(),
      getOverviewPayments(),
      getOverviewMonthlyPayments(),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <OverviewHeader userName={user.name} summary={summary} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-6">
          <PaymentsCard payments={payments} />
          <DebtsCard debts={debts} />
        </div>

        <div className="flex flex-col gap-6">
          <DebtFreeCard debtFree={debtFree} />
          <MonthlyPaymentsCard monthly={monthlyPayments} />
          <Card className="min-h-48">
            <CardHeader title="Progress" />
          </Card>
        </div>
      </div>
    </div>
  );
}
