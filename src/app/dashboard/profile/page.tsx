import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from '@/components/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-red-500">You must be logged in.</p>;
  }

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return <p className="text-red-500">Error loading profile: {error.message}</p>;
  }

  // 🔢 Compute stats
  const totalSessions = sessions.length;
  const totalHours = sessions.reduce((sum, s) => sum + (s.hours || 0), 0);

  // Optional: most frequent cause
  const causeCounts: Record<string, number> = {};
  for (const s of sessions) {
    if (s.cause) {
      causeCounts[s.cause] = (causeCounts[s.cause] || 0) + 1;
    }
  }
  const topCause = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">👤 Profile</h1>
      <p><strong>Email:</strong> {user.email}</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Sessions</p>
          <p className="text-xl font-bold">{totalSessions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Hours</p>
          <p className="text-xl font-bold">{totalHours} hrs</p>
        </div>
        <div className="bg-white p-4 rounded shadow col-span-2">
          <p className="text-gray-500 text-sm">Most Frequent Cause</p>
          <p className="text-lg font-semibold">{topCause}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 w-full">
      <LogoutButton />
    </div>
    </div>
  );
}
