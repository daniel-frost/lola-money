import type { User } from "@/domain/user/user";
import { prisma } from "@/server/db";

export async function findCurrentUser(): Promise<User> {
  const user = await prisma.user.findFirstOrThrow();
  return { name: user.name };
}
