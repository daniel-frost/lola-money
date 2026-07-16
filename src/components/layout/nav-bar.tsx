"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const tabs = [
  { label: "Overview", href: "/" },
  { label: "Debts", href: "/debts" },
  { label: "Plan", href: "/plan" },
  { label: "Schedule", href: "/schedule" },
];

export function NavBar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="border-b border-hairline-strong bg-card">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex h-full items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-blue-bold" />
            <span className="text-lg font-bold text-ink">Lola</span>
          </Link>

          <nav className="flex h-full items-center gap-6">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "relative flex h-full items-center text-sm font-bold transition-colors",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {tab.label}
                  {active ? (
                    <span className="absolute inset-x-0 bottom-[3px] h-0.5 rounded-full bg-blue-bold" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-wash text-xs font-bold text-blue-text">
          {initial}
        </div>
      </div>
    </header>
  );
}
