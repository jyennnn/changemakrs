import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { Smile } from 'lucide-react';
import { LogSessionButton } from '@/components/LogSessionButton';
import React from 'react';
import ChangemakrsAnimation from '@/components/LottiePlayer';


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

return (
  <>
   <div className="flex justify-between items-center mb-4 w-full">
    <h1 className="scroll-m-20 text-left   text-4xl font-extrabold tracking-tight text-balance">
      Hi {profile.first_name} ,
You've given 18 hours, 
backed 4 causes, 
shown up for 10 moments that mattered.</h1>
    </div>
    
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm text-center">
      {/* Big purple smiley icon */}
   <div className="scale-150">
  <ChangemakrsAnimation/>
</div>
      

      {/* Text message */}
<p className="mt-4 text-lg font-semibold text-[#6B59FF] leading-snug">
        5 more moments to a little surprise!<br />
        Thank you for being a Changemakr 💜
      </p>
    </div>
    <div>
      <LogSessionButton /> 
    </div>
    
  </>
)

}