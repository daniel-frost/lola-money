import type { Debt } from "@/domain/debt/debt";
import { debts } from "@/fixtures/debts";

export async function listDebts(): Promise<Debt[]> {
  return debts;
}
