export const STRATEGIES = ["snowball", "avalanche", "custom"] as const;

export type Strategy = (typeof STRATEGIES)[number];

export const STRATEGY_LABELS: Record<Strategy, string> = {
  snowball: "Snowball",
  avalanche: "Avalanche",
  custom: "Custom",
};
