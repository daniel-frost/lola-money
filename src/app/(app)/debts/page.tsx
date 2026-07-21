import { DebtsTable } from "@/components/debts/debts-table";
import { Button } from "@/components/ui/button";
import { getDebtsTable } from "@/server/debt/debt.service";

export default async function DebtsPage() {
  const table = await getDebtsTable();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[32px] font-black tracking-display text-ink">
          Debts
        </h1>
        <Button>+ Add debt</Button>
      </div>

      <DebtsTable table={table} />
    </div>
  );
}
