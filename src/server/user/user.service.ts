import type { User } from "@/domain/user/user";

export async function getCurrentUser(): Promise<User> {
  return { name: "Maya" };
}
