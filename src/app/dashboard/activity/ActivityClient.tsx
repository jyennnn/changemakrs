'use client';

import { useState, useMemo } from 'react';
import type { JSX } from 'react';
import { format, parseISO } from 'date-fns';
import type { Session } from '@/models/dashboard';
import { Search, TreePine, PawPrint, Book, Heart, Puzzle, Palette, Handshake, MoreHorizontal, Leaf } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const causeStyles: Record<string, { icon: JSX.Element; bg: string }> = {
  Environment: { icon: <TreePine className="text-green-600 w-4 h-4" />, bg: 'bg-green-100' },
  Animals: { icon: <PawPrint className="text-orange-500 w-4 h-4" />, bg: 'bg-orange-100' },
  Youths: { icon: <Book className="text-blue-500 w-4 h-4" />, bg: 'bg-blue-100' },
  Elderly: { icon: <Heart className="text-pink-500 w-4 h-4" />, bg: 'bg-pink-100' },
  Disabilities: { icon: <Puzzle className="text-gray-500 w-4 h-4" />, bg: 'bg-gray-100' },
  'Arts & Culture': { icon: <Palette className="text-yellow-600 w-4 h-4" />, bg: 'bg-yellow-100' },
  Community: { icon: <Handshake className="text-purple-500 w-4 h-4" />, bg: 'bg-purple-100' },
  Others: { icon: <MoreHorizontal className="text-muted-foreground w-4 h-4" />, bg: 'bg-gray-100' },
};

export default function ActivityClient({ sessions }: { sessions: (Session & { photoUrl: string | null })[] }) {
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Session & { photoUrl: string | null } | null>(null);

  const filteredSessions = useMemo(() => {
    return [...sessions]
      .filter((s) =>
        [s.role, s.organisation, s.cause, s.description]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortAsc
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [search, sortAsc, sessions]);

  const grouped = useMemo(() => {
    const groups: { [date: string]: (Session & { photoUrl: string | null })[] } = {};
    for (const s of filteredSessions) {
      const dateKey = format(parseISO(s.date), 'dd MMMM yyyy');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(s);
    }
    return groups;
  }, [filteredSessions]);

  return (
    <main className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Activity</h1>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm w-full"
          />
        </div>
        <Button
          onClick={() => setSortAsc(!sortAsc)}
          className="bg-muted hover:bg-muted/80 text-black font-medium rounded-sm px-4 py-2 border-none shadow-none flex items-center gap-1"
        >
          Sort {sortAsc ? '↑' : '↓'}
        </Button>
      </div>

      <ScrollArea className="h-[60vh] pr-2">
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date} className="space-y-4">
            <p className="text-sm font-semibold text-black mt-4">{date}</p>
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelected(entry)}
                className="cursor-pointer flex justify-between items-start gap-4 px-1 py-2 hover:bg-gray-50 rounded-md transition"
              >
                <div className="flex gap-3 items-start">
                  <div className="pt-1">
                    {causeStyles[entry.cause]?.icon || <Leaf className="text-muted-foreground w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-black">{entry.role}</p>
                    <p className="text-sm text-gray-500">{entry.organisation}</p>
                    {entry.description && (
                      <p className="text-sm text-gray-500 italic mt-1 line-clamp-2">
                        “{entry.description}”
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#6B59FF] whitespace-nowrap mt-1">
                  {entry.hours} hr{entry.hours > 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
  <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-none bg-white rounded-xl">
    {selected && (
      <>
        <DialogHeader className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-base font-semibold text-black">
              {selected.role}
            </DialogTitle>
            <div className="flex justify-between items-center">
              <DialogDescription className="text-sm text-gray-500">
                {selected.organisation}
              </DialogDescription>
              <span className="text-xs text-gray-400">
                {format(parseISO(selected.date), 'dd MMM yyyy')}
              </span>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-3">
              {/* Hours card */}
              <div className="rounded-lg bg-gray-100 p-3 flex flex-col items-start">
                <span className="text-xs font-semibold text-gray-600 mb-1">Hours</span>
                <span className="text-sm font-medium">{selected.hours}</span>
              </div>
              
              {/* Cause card */}
              <div className={`rounded-lg p-3 ${causeStyles[selected.cause]?.bg || 'bg-gray-100'} flex flex-col items-start`}>
                <span className="text-xs font-semibold text-gray-600 mb-1">Cause</span>
                <div className="inline-flex items-center gap-1 text-sm font-medium">
                  {causeStyles[selected.cause]?.icon}
                  <span>{selected.cause}</span>
                </div>
              </div>

              
            </div>

            {selected.description && (
              <div>
                <span className="font-medium block mb-1">Notes</span>
                <p className="italic text-gray-500">“{selected.description}”</p>
              </div>
            )}

            {selected.photoUrl && (
              <div>
                <span className="font-medium block mb-2">Photo</span>
                <img
                  src={selected.photoUrl}
                  alt="Proof of volunteering"
                  className="w-full rounded-xl object-cover"
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </>
    )}
  </DialogContent>
</Dialog>


    </main>
  );
}