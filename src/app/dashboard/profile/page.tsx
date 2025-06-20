import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/LogoutButton";
import {
  TreePine,
  PawPrint,
  Book,
  Heart,
  Puzzle,
  Palette,
  Handshake,
  MoreHorizontal,
} from 'lucide-react';

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

  const groupedCauses: Record<string, number> = {};
  let othersCount = 0;

  Object.entries(causeCounts).forEach(([cause, count]) => {
    switch (cause) {
      case 'Environment':
      case 'Animals':
      case 'Youths':
      case 'Elderly':
      case 'Disabilities':
      case 'Arts & Culture':
      case 'Community':
        groupedCauses[cause] = count;
        break;
      default:
        othersCount += count;
        break;
    }
  });

  if (othersCount > 0) {
    groupedCauses['Others'] = othersCount;
  }

  const sortedCauses = Object.entries(groupedCauses).sort((a, b) => b[1] - a[1]);
  const firstLetter = profile?.first_name?.[0] || user.email?.[0] || "?";

  function getIcon(cause: string) {
    switch (cause) {
      case 'Environment': return <TreePine className="w-5 h-5 text-green-600" />;
      case 'Animals': return <PawPrint className="w-5 h-5 text-orange-500" />;
      case 'Youths': return <Book className="w-5 h-5 text-blue-500" />;
      case 'Elderly': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Disabilities': return <Puzzle className="w-5 h-5 text-gray-500" />;
      case 'Arts & Culture': return <Palette className="w-5 h-5 text-yellow-600" />;
      case 'Community': return <Handshake className="w-5 h-5 text-purple-500" />;
      default: return <MoreHorizontal className="w-5 h-5 text-gray-400" />;
    }
  }

  function getBgColor(cause: string) {
    switch (cause) {
      case 'Environment': return 'bg-green-100';
      case 'Animals': return 'bg-orange-100';
      case 'Youths': return 'bg-blue-100';
      case 'Elderly': return 'bg-pink-100';
      case 'Disabilities': return 'bg-gray-200';
      case 'Arts & Culture': return 'bg-yellow-100';
      case 'Community': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  }

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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#F4F2FF] rounded-xl p-4">
          <p className="text-sm text-purple-700 font-medium">Total Sessions</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{totalSessions}</p>
        </div>
        <div className="bg-[#F4F2FF] rounded-xl p-4">
          <p className="text-sm text-purple-700 font-medium">Total Hours</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{totalHours} hrs</p>
        </div>
      </div>

      {/* Causes */}
      <div className="bg-[#FAFAFA] rounded-xl p-4">
        <h3 className="text-sm text-gray-800 font-medium mb-3">Your Causes</h3>
        {sortedCauses.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">No causes yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {sortedCauses.map(([cause, count]) => (
              <div
                key={cause}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-full ${getBgColor(cause)}`}
              >
                {getIcon(cause)}
                <span className="text-[10px] mt-1 font-medium text-gray-700 text-center leading-tight">
                  {count}×
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email */}
      <div className="bg-white rounded-xl">
        <div className="px-4 pt-3 pb-1">
          <p className="text-sm text-muted-foreground font-medium">Email</p>
        </div>
        <div className="px-4 pb-3">
          <p className="text-sm font-medium">{user.email}</p>
        </div>
      </div>

      <Separator />

      {/* Logout */}
      <div className="pt-2">
        <LogoutButton />
      </div>
    </div>
  );
}