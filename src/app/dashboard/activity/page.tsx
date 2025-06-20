import { createClient } from '@/lib/supabase/server';
import ActivityClient from './ActivityClient';

export default async function ActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <p className="text-red-500">You must be logged in to view this page.</p>;
  }

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">Error loading sessions: {error.message}</p>;
  }

  const signedSessions = await Promise.all(
    sessions.map(async (session) => {
      if (session.photo_url) {
        const { data, error } = await supabase.storage
          .from('changemakrs-session-photos')
          .createSignedUrl(session.photo_url, 60 * 60);
        return {
          ...session,
          photoUrl: error ? null : data?.signedUrl,
        };
      }
      return { ...session, photoUrl: null };
    })
  );

  return <ActivityClient sessions={signedSessions} />;
}
