// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";


export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect("/login");
  }
  const user = authData.user;

  // Run queries in parallel
  const [
    // query 1
    { data: profile },
    // query 2
    { data: sessionCount },
    //query 3
    { data: totalHours },
    { data: uniqueCauses },
    // Promise.all([...]) lets you run multiple async operations in parallel
  ] = await Promise.all([
    // query 1 - Get user profile
    supabase
      .from("profiles")
      .select("first_name")
      .eq("user_id", user.id)
      .single(),

    // query 2 - Get session count and details
    supabase.rpc("session_count_for_user", {
      uid: user.id,
    }),

    // query 3 - Get total hours from sessions
    supabase.rpc("total_hours_for_user", { uid: user.id }),

    // query 4 - Get unique causes
    supabase.rpc("unique_causes_for_user", { uid: user.id }),
  ]);

  return (
    <DashboardClient
      profile={profile ?? { first_name: "" }}
      sessionCount={sessionCount ?? 0}
      uniqueCauses={uniqueCauses}
      totalHours={totalHours}
    />
  );
}
