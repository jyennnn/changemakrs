// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect('/login');
  }
  const user = authData.user;

  // Run queries in parallel
  const [
    { data: profile },
    { data: sessions, count: sessionCount },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name')
      .eq('user_id', user.id)
      .single(),

    supabase
      .from('sessions')
      .select('cause, hours', { count: 'exact' })
      .eq('user_id', user.id),
  ]);

  // Compute metrics from a single sessions result
  const uniqueCauses = new Set(sessions?.map((d) => d.cause)).size || 0;
  const totalHours =
    sessions?.reduce((sum, row) => sum + (row.hours || 0), 0) || 0;

  return (
    <DashboardClient
      profile={profile ?? { first_name: '' }}
      sessionCount={sessionCount ?? 0}
      uniqueCauses={uniqueCauses}
      totalHours={totalHours}
    />
  );
}
