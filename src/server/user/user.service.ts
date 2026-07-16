import { cache } from "react";
import type { User } from "@/domain/user/user";

export const getCurrentUser = cache(async (): Promise<User> => {
  return { name: "Maya" };
});
