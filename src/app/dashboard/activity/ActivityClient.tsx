'use client';

import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function ActivityClient({ sessions }: { sessions: any[] }) {
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

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
    const groups: { [date: string]: any[] } = {};
    for (const s of filteredSessions) {
      const dateKey = format(parseISO(s.date), 'dd MMMM yyyy');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(s);
    }
    return groups;
  }, [filteredSessions]);

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📆 Activity</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setSortAsc(!sortAsc)}>
          Sort: {sortAsc ? 'Oldest' : 'Newest'}
        </Button>
      </div>

      <ScrollArea className="h-[60vh] pr-2">
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date} className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground mt-4">{date}</p>
            {entries.map((entry) => (
              <Card
                key={entry.id}
                onClick={() => setSelected(entry)}
                className="cursor-pointer hover:bg-muted transition"
              >
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-base">{entry.role}</p>
                    <p className="text-sm text-muted-foreground">{entry.organisation}</p>
                    {entry.description && (
                      <p className="text-sm italic text-muted-foreground mt-1 line-clamp-2">
                        “{entry.description}”
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#6B59FF] whitespace-nowrap mt-1">
                    {entry.hours} hr{entry.hours > 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </ScrollArea>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
  {selected && (
    <>
      <DialogHeader className="p-4 border-b">
        <DialogTitle className="text-lg">{selected.role}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {selected.organisation}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="max-h-[70vh] p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Cause</span>
            <Badge variant="outline">{selected.cause}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Hours</span>
            <span>{selected.hours}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Date</span>
            <span>{format(parseISO(selected.date), 'dd MMM yyyy, h:mm a')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Logged at</span>
            <span>{new Date(selected.created_at).toLocaleString()}</span>
          </div>

          {selected.description && (
            <p className="italic text-muted-foreground pt-2">“{selected.description}”</p>
          )}

          {selected.photoUrl && (
            <div className="mt-4">
              <img
                src={selected.photoUrl}
                alt="Proof of volunteering"
                className="w-full rounded-xl border"
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
