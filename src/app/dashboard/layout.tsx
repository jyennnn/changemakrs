// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientLayout from "./ClientLayout";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  // Ensure this layout is only used for authenticated users
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();



  if (!user) redirect("/login");

  return <ClientLayout >{children}</ClientLayout>;
}
