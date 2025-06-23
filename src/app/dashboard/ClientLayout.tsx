// app/dashboard/ClientLayout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pencil, List, User } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col text-gray-900 h-svh">
      <nav className="py-3 px-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-6 text-muted-foreground">
            <Link href="/dashboard">
              <Home className={`w-6 h-6 ${pathname === "/dashboard" ? "text-purple-600" : ""}`} />
            </Link>
            <Link href="/dashboard/log">
              <Pencil className={`w-6 h-6 ${pathname === "/dashboard/log" ? "text-purple-600" : ""}`} />
            </Link>
            <Link href="/dashboard/activity">
              <List className={`w-6 h-6 ${pathname === "/dashboard/activity" ? "text-purple-600" : ""}`} />
            </Link>
          </div>
          <Link href="/dashboard/profile">
            <User className={`w-6 h-6 ${pathname === "/dashboard/profile" ? "text-purple-600" : ""}`} />
          </Link>
        </div>
      </nav>

      <main className="flex-1 px-4 py-4 w-full h-full flex flex-col justify-between">{children}</main>
    </div>
  );
}
