// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect('/login');
  }

  const user = authData.user;

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('user_id', user.id)
    .single();

  const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);
  const sessionCount = count ?? 0;

  const { data: causeData } = await supabase
    .from('sessions')
    .select('cause')
    .eq('user_id', user.id);

  const uniqueCauses = new Set(causeData?.map((d) => d.cause)).size || 0;

  const { data: hoursData } = await supabase
    .from('sessions')
    .select('hours')
    .eq('user_id', user.id);

  const totalHours = hoursData?.reduce((sum, row) => sum + (row.hours || 0), 0) || 0;

  return (
    <DashboardClient
      profile={profile ?? { first_name: '' }}
      sessionCount={sessionCount}
      uniqueCauses={uniqueCauses}
      totalHours={totalHours}
    />
  );
}
