import { createClient } from '@/lib/supabase/server'

export default async function ActivityPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return <p className="text-red-500">You must be logged in to view this page.</p>
  }

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-500">Error loading sessions: {error.message}</p>
  }

  // 🔐 Create signed image URLs for photo display
  const signedSessions = await Promise.all(
    sessions.map(async (session) => {
      if (session.photo_url) {
        const { data, error } = await supabase.storage
          .from('changemakrs-session-photos') // your bucket name
          .createSignedUrl(session.photo_url, 60 * 60) // 1 hour expiry

          if (error) {
    console.error(`Failed to sign URL for session ${session.id}:`, error.message);
    // Optional: send error to monitoring/logging service
  }
        return {
          ...session,
          photoUrl: data?.signedUrl || null,
        }
      }

      return { ...session, photoUrl: null }
    })
  )

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Activity</h1>
      {signedSessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <ul className="space-y-4">
          {signedSessions.map((entry) => (
            <li key={entry.id} className="p-4 border rounded shadow bg-white space-y-2">
              <div className="text-lg font-semibold">{entry.role}</div>

              <div className="text-sm text-gray-600">
                {entry.date} · {entry.time} · {entry.hours}{" "}
                {entry.hours === 1 ? "hour" : "hours"}
              </div>

              <div className="text-sm">
                <span className="font-medium">Cause:</span> {entry.cause}
              </div>

              {entry.organisation && (
                <div className="text-sm">
                  <span className="font-medium">Organisation:</span>{" "}
                  {entry.organisation}
                </div>
              )}

              {entry.description && (
                <div className="text-sm italic text-gray-600">“{entry.description}”</div>
              )}

              <div className="text-sm text-gray-400">
                Logged at:{" "}
                {new Date(entry.created_at).toLocaleString("en-SG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>

              {entry.photoUrl && (
                <div className="mt-2">
                  <img
                    src={entry.photoUrl}
                    alt="Proof of volunteering"
                    className="max-w-xs rounded border"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
