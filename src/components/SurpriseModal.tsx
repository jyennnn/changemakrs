'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface SurpriseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sessionCount: number;
  show: boolean;
}

export default function SurpriseModal({
  open,
  setOpen,
  sessionCount,
  show,
}: SurpriseModalProps) {
  if (!show) return null;

  const messages = [
    {
      title: "💜 You Made a Difference",
      body: `You’ve shown up for <strong>{sessionCount}</strong> meaningful moments — and that’s something truly special.
      <br /><br />
      Thank you for giving your time, your energy, and your heart — not for applause, but because you care.
      <br /><br />
      <em>"The best way to find yourself is to lose yourself in the service of others." – Gandhi</em>`,
    },
    {
      title: "🌱 Your Kindness is Growing Roots",
      body: `That’s <strong>{sessionCount}</strong> times you gave freely.
      <br /><br />
      You’re planting seeds of hope that grow far beyond what you’ll ever see.
      <br /><br />
      <em>"Volunteering is the ultimate exercise in democracy." – Marjorie Moore</em>`,
    },
    {
      title: "✨ You're a Light in the Dark",
      body: `With <strong>{sessionCount}</strong> moments of showing up, you’ve lit the way for others.
      <br /><br />
      Never doubt that small, consistent actions change the world.
      <br /><br />
      <em>"No act of kindness, no matter how small, is ever wasted." – Aesop</em>`,
    },
    {
      title: "🌟 You're Living Your Values",
      body: `Every single moment — all <strong>{sessionCount}</strong> of them — is a reflection of who you are.
      <br /><br />
      And that person is compassionate, present, and powerful.
      <br /><br />
      <em>"We make a living by what we get, but we make a life by what we give." – Churchill</em>`,
    },
  ];

  // Pick a random message once per render
  const selected = useMemo(() => {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl shadow-xl border-0 max-w-md text-center px-6 py-8 bg-white">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-3xl font-bold text-[#6B59FF] leading-tight">
            {selected.title}
          </DialogTitle>
          <DialogDescription
            className="text-md text-[#444] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: selected.body.replace('{sessionCount}', sessionCount.toString()),
            }}
          />
        </DialogHeader>

        <div className="mt-6">
          <Button
            onClick={() => setOpen(false)}
            className="bg-[#6B59FF] hover:bg-[#5848e0] text-white w-full"
          >
            💫 Keep Making Magic
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
