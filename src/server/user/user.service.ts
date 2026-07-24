import { cache } from "react";
import type { User } from "@/domain/user/user";
import { findCurrentUser } from "@/server/user/user.repository";

export const getCurrentUser = cache(async (): Promise<User> => {
  return findCurrentUser();
});
