import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogSessionButton } from '@/components/LogSessionButton';
import React from 'react';
import ChangemakrsAnimation from '@/components/ChangemakrsAnimation';
import Link from 'next/link';

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user;

  if (authError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email')
    .eq('user_id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    redirect('/error');
  }

  const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const sessionCount = typeof count === 'number' ? count : 0;

  const { data: causeData } = await supabase
    .from('sessions')
    .select('cause')
    .eq('user_id', user.id);

  const uniqueCauses = causeData
    ? new Set(causeData.map((item: { cause: string }) => item.cause)).size
    : 0;

  const { data: hoursData } = await supabase
    .from('sessions')
    .select('hours')
    .eq('user_id', user.id);

  const totalHours = hoursData
    ? hoursData.reduce((sum: number, row: { hours: number }) => sum + (row.hours || 0), 0)
    : 0;

  return (
    <>
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="scroll-m-20 text-left text-4xl leading-[1.2] font-semibold tracking-tight text-balance text-[#424242]">
          Hi {profile.first_name}, <br />
          <span className="text-[#949494]">You&apos;ve given</span> {totalHours} hour{totalHours === 1 ? '' : 's'}, <br />
          <span className="text-[#949494]">backed</span> {uniqueCauses} cause{uniqueCauses === 1 ? '' : 's'}, <br />
          <span className="text-[#949494]">shown up for</span> {sessionCount} moment{sessionCount === 1 ? '' : 's'} <br />
          <span className="text-[#949494]">that mattered.</span>
        </h1>
      </div>

      <div>
        <div className="flex items-center justify-center -mt-12">
          <ChangemakrsAnimation sessionCount={sessionCount} />
        </div>

        <p className="font-semibold text-[#6B59FF] text-center text-md -mt-8">
          5 more moments to a little surprise! <br />
          Thank you for being a Changemakr 💜
        </p>
      </div>

      <div className="flex justify-end items-center">
        <Link href="/dashboard/log">
          <LogSessionButton />
        </Link>
      </div>
    </>
  );
}
