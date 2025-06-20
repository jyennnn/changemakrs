import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/LogoutButton";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-red-500">You must be logged in.</p>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("user_id", user.id)
    .single();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return <p className="text-red-500">Error loading profile: {error.message}</p>;
  }

  const totalSessions = sessions.length;
  const totalHours = sessions.reduce((sum, s) => sum + (s.hours || 0), 0);

  const causeCounts: Record<string, number> = {};
  for (const s of sessions) {
    if (s.cause) {
      causeCounts[s.cause] = (causeCounts[s.cause] || 0) + 1;
    }
  }

  const sortedCauses = Object.entries(causeCounts).sort((a, b) => b[1] - a[1]);

  const firstLetter = profile?.first_name?.[0] || user.email?.[0] || "?";

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      {/* Profile Avatar */}
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-16 w-16 text-black font-bold text-xl">
          <AvatarFallback>{firstLetter.toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="text-lg font-semibold">
          {profile?.first_name ? `Hello, ${profile.first_name}!` : user.email}
        </p>
      </div>

      {/* Email Card */}
      <Card className="bg-white shadow-none border-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground font-medium">Account Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md font-medium">{user.email}</p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-none border-none rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-none border-none rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalHours} hrs</p>
          </CardContent>
        </Card>
      </div>

      {/* Causes */}
      <Card className="bg-white shadow-none border-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-medium">Your Causes</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCauses.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">No causes yet.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {sortedCauses.map(([cause, count]) => (
                <li key={cause} className="flex justify-between">
                  <span>{cause}</span>
                  <span className="text-muted-foreground">{count}×</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Logout */}
      <div className="pt-2">
        <LogoutButton />
      </div>
    </div>
  );
}
