import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Home, Pencil, List, User } from "lucide-react";


export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 🔐 If not logged in, redirect to login page
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      {/* Top Navigation */}
      <nav className="py-3 px-3">
        <div className="flex items-center justify-between">
        <div className="flex gap-6 text-muted-foreground">
          <Link href="/dashboard">
            <Home className="w-6 h-6 hover:text-purple-600" />
          </Link>
          <Link href="/dashboard/log">
            <Pencil className="w-6 h-6 hover:text-purple-600" />
          </Link>
          <Link href="/dashboard/activity">
            <List className="w-6 h-6 hover:text-purple-600" />
          </Link>
        </div>
        <Link href="/dashboard/profile">
          <User className="w-6 h-6 text-muted-foreground hover:text-purple-600" />
        </Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 px-4 py-6 w-full">
        {children}
      </main>
    </div>
  );
}
