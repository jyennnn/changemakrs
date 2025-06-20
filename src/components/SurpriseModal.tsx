'use client';

import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SurpriseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sessionCount: number;
  show: boolean;
}

const headings = [
  "💜 You Made a Difference",
  "🌱 Your Kindness Is Growing Roots",
  "✨ You're a Light in the Dark",
  "🌟 You're Living Your Values",
];

export default function SurpriseModal({
  open,
  setOpen,
  sessionCount,
  show,
}: SurpriseModalProps) {
  const [quote, setQuote] = useState<string | null>(null);
  const [hasFired, setHasFired] = useState(false);

  const selectedTitle = useMemo(() => {
    const index = Math.floor(Math.random() * headings.length);
    return headings[index];
  }, []);

  // 🎉 Confetti on modal open (once)
  useEffect(() => {
    if (open && !hasFired) {
      setHasFired(true);
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 },
          scalar: 1.2,
        });
      }, 200);
    }
  }, [open, hasFired]);

  // 💬 Fetch quote
  useEffect(() => {
    if (!open) return;

    async function fetchQuote() {
      try {
        const res = await fetch('https://api.quotable.io/random?tags=inspirational|wisdom');
        const data = await res.json();
        if (data?.content && data?.author) {
          setQuote(`"${data.content}" – ${data.author}`);
        } else {
          throw new Error('No quote');
        }
      } catch {
        const fallbacks = [
          {
            content: "Service to others is the rent you pay for your room here on earth.",
            author: "Muhammad Ali",
          },
          {
            content: "No one has ever become poor by giving.",
            author: "Anne Frank",
          },
          {
            content: "The meaning of life is to find your gift. The purpose of life is to give it away.",
            author: "Pablo Picasso",
          },
        ];
        const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        setQuote(`"${fallback.content}" – ${fallback.author}`);
      }
    }

    fetchQuote();
  }, [open]);

  if (!show) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl shadow-xl border-0 max-w-md text-center px-6 py-8 bg-white">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-3xl font-bold text-[#6B59FF] leading-tight">
            {selectedTitle}
          </DialogTitle>

          <DialogDescription asChild>
            <div className="text-md text-[#444] leading-relaxed space-y-4">
              <div>
                You’ve now shown up for <strong>{sessionCount}</strong> meaningful moments.
                That’s time you gave freely, generously, and with heart. 💫
              </div>
              <div>
                Your impact is real — and felt. Whether seen or unseen, you’ve moved the world forward.
              </div>
              {quote && (
                <div className="text-sm italic text-[#888] mt-2">
                  {quote}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Button
            onClick={() => setOpen(false)}
            className="bg-[#6B59FF] hover:bg-[#5848e0] text-white w-full"
          >
            Keep Making Magic ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
