"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Cause, SessionSchema } from "@/models/dashboard";
import { supabase } from "../../../lib/supabase/client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function LogSessionPage() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState(1);
  const [role, setRole] = useState("");
  const [cause, setCause] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const causeOptions = Object.values(Cause);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not logged in:", userError);
      alert("You must be logged in to log a session.");
      return;
    }

    let photo_url = "";

    if (photo) {
      const ext = photo.name.split(".").pop();
      const fileName = `${uuidv4()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("changemakrs-session-photos")
        .upload(fileName, photo);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Photo upload failed.");
        return;
      }

      photo_url = fileName;
    }

    const result = SessionSchema.safeParse({
      id: uuidv4(),
      date,
      time,
      hours,
      role,
      cause,
      organisation,
      description,
      photo_url,
      user_id: user.id,
    });

    if (!result.success) {
      console.error(result.error.format());
      alert("Validation failed.");
      return;
    }

    const { error } = await supabase.from("sessions").insert(result.data);

    if (error) {
      console.error("Supabase insert error:", error);
      alert("Failed to save session.");
      return;
    }

    // ✅ Redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <main className="p-4 mx-auto w-full max-w-xl">
      <h1 className="text-xl font-bold mb-4">Log a Volunteering Session</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <Input
          type="number"
          min={1}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          placeholder="Hours volunteered"
          required
        />
        <Input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role (e.g. Tree Planter)"
          required
        />

        <Select value={cause} onValueChange={setCause}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a cause" />
          </SelectTrigger>
          <SelectContent>
            {causeOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          placeholder="Organisation (optional)"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes (optional)"
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />

        <Button type="submit" className="w-full">
          Save Session
        </Button>
      </form>
    </main>
  );
}
