import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { Smile } from 'lucide-react';
import { LogSessionButton } from '@/components/LogSessionButton';
import React from 'react';
import ChangemakrsAnimation from '@/components/ChangemakrsAnimation';
import Link from "next/link";


export default async function PrivatePage() {
  const supabase = await createClient()


  const { data: authData, error: authError } = await supabase.auth.getUser()
  const user = authData?.user

  if (authError || !user) {
    redirect('/login')
  }

    // Step 2: Query the `profiles` table for additional data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email') // include any columns you need
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    redirect('/error') // or show fallback text
  }

    const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

    console.log('Session count:', count);

    const sessionCount = typeof count === 'number' ? count : 0;

    // Query for unique causes
const { data: causeData, error: causeError } = await supabase
  .from('sessions')
  .select('cause', { count: 'exact', head: false })
  .eq('user_id', user.id);

const uniqueCauses = causeData
  ? new Set(causeData.map((item: any) => item.cause)).size
  : 0;

// Query for total hours
const { data: hoursData, error: hoursError } = await supabase
  .from('sessions')
  .select('hours')
  .eq('user_id', user.id);

const totalHours = hoursData
  ? hoursData.reduce((sum, row) => sum + (row.hours || 0), 0)
  : 0;

  // const handleLogClick = () => {
  //   router.push('/dashboard/log');
  // };

return (
  <>
   <div className="flex justify-between items-center mb-4 w-full">
    <h1 className="scroll-m-20 text-left  text-4xl leading-[1.2] font-semibold tracking-tight text-balance text-[#424242]">
      Hi {profile.first_name} , <br />
 <span className="text-[#949494]">You've given</span> {totalHours} hour{totalHours === 1 ? '' : 's'},  <br />
 <span className="text-[#949494]">backed</span> {uniqueCauses} cause{uniqueCauses === 1 ? '' : 's'}, <br />
 <span className="text-[#949494]">shown up for </span>{sessionCount} moment{sessionCount === 1 ? '' : 's'}  <br /> <span className="text-[#949494]">that mattered.</span></h1>
    </div>
    
    <div>
      {/* Big purple smiley icon */}
   <div className='flex items-center justify-center -mt-12'>
  <ChangemakrsAnimation sessionCount={sessionCount} />
</div>
      

      {/* Text message */}
<p className="font-semibold text-[#6B59FF] text-center text-md -mt-8">
        5 more moments to a little surprise!<br />
        Thank you for being a Changemakr 💜
      </p>

    </div>
    <div className="flex justify-end items-center">
      <Link href="/dashboard/log">
    <LogSessionButton />
  </Link>
    </div>
    
  </>
)

}