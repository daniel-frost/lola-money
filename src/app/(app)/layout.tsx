import { NavBar } from "@/components/layout/nav-bar";
import { getCurrentUser } from "@/server/user/user.service";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-col">
      <NavBar userName={user.name} />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 min-[1800px]:max-w-[1440px]">
        {children}
      </main>
    </div>
  );
}
