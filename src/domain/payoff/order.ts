import type { Debt } from "@/domain/debt/debt";
import type { Strategy } from "@/domain/payoff/strategy";

function isActive(debt: Debt): boolean {
  return debt.status === "active" && debt.currentBalance > 0;
}

export function attackOrder(
  debts: Debt[],
  strategy: Strategy,
  customOrder: string[] = [],
): Debt[] {
  const active = debts.filter(isActive);

  if (strategy === "custom") {
    const rank = new Map(customOrder.map((id, index) => [id, index]));
    return [...active].sort((a, b) => {
      const ra = rank.get(a.id) ?? Number.POSITIVE_INFINITY;
      const rb = rank.get(b.id) ?? Number.POSITIVE_INFINITY;
      if (ra !== rb) return ra - rb;
      return a.id < b.id ? -1 : 1;
    });
  }

  return [...active].sort((a, b) => {
    const primary =
      strategy === "snowball"
        ? a.currentBalance - b.currentBalance
        : b.apr - a.apr;
    if (primary !== 0) return primary;
    if (a.currentBalance !== b.currentBalance) {
      return a.currentBalance - b.currentBalance;
    }
    if (a.apr !== b.apr) return b.apr - a.apr;
    return a.id < b.id ? -1 : 1;
  });
}

export function focusDebt(
  debts: Debt[],
  strategy: Strategy,
  customOrder: string[] = [],
): Debt | null {
  return attackOrder(debts, strategy, customOrder)[0] ?? null;
}
