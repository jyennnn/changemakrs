// app/dashboard/DashboardClient.tsx
'use client';

import { useState } from 'react';
import ChangemakrsAnimation from '@/components/ChangemakrsAnimation';
import { LogSessionButton } from '@/components/LogSessionButton';
import Link from 'next/link';
import SurpriseModal from '@/components/SurpriseModal';

type DashboardClientProps = {
  profile: { first_name: string };
  sessionCount: number;
  uniqueCauses: number;
  totalHours: number;
};

export default function DashboardClient({ profile, sessionCount, uniqueCauses, totalHours }: DashboardClientProps) {
  const showSurprise = sessionCount > 0 && sessionCount % 5 === 0;
  const [open, setOpen] = useState(showSurprise);
  const momentsToNext = 5 - (sessionCount % 5 || 5);

  return (
    <>
      <SurpriseModal open={open} setOpen={setOpen} sessionCount={sessionCount} show={showSurprise} />

      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-left text-4xl font-semibold tracking-tight text-[#424242] leading-[1.2]">
          Hi {profile.first_name}, <br />
          <span className="text-[#949494]">You&apos;ve given</span> {totalHours} hour{totalHours === 1 ? '' : 's'}, <br />
          <span className="text-[#949494]">backed</span> {uniqueCauses} cause{uniqueCauses === 1 ? '' : 's'}, <br />
          <span className="text-[#949494]">shown up for</span> {sessionCount} moment{sessionCount === 1 ? '' : 's'} <br />
          <span className="text-[#949494]">that mattered.</span>
        </h1>
      </div>

      <div className="flex items-center justify-center -mt-20">
        <ChangemakrsAnimation sessionCount={sessionCount} />
      </div>

      <p className="text-[#6B59FF] font-semibold text-center text-md -mt-20">
        {momentsToNext} more moment{momentsToNext === 1 ? '' : 's'} to a little surprise! <br />
        Thank you for being a Changemakr 💜
      </p>

      <div className="flex justify-end items-center">
        <Link href="/dashboard/log">
          <LogSessionButton />
        </Link>
      </div>
    </>
  );
}
