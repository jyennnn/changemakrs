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
import { Heart, Book, Users, TreePine, PawPrint, Handshake, Puzzle, Palette, MoreHorizontal } from "lucide-react";

export default function LogSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState(1);
  const [role, setRole] = useState("");
  const [cause, setCause] = useState("");
  const [customCause, setCustomCause] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const causeOptions = [
    { value: "Environment", label: "Environment", icon: TreePine },
    { value: "Animals", label: "Animals", icon: PawPrint },
    { value: "Youths", label: "Youths", icon: Users },
    { value: "Elderly", label: "Elderly", icon: Heart },
    { value: "Disabilities", label: "Disabilities", icon: Puzzle },
    { value: "Arts & Culture", label: "Arts & Culture", icon: Palette },
    { value: "Community", label: "Community", icon: Handshake },
    { value: "Others", label: "Others", icon: MoreHorizontal },
  ];

  function markTouchedFields(step: number) {
    if (step === 1) {
      setTouched((prev) => ({ ...prev, date: true, time: true, hours: true }));
    } else if (step === 2) {
      setTouched((prev) => ({ ...prev, role: true, cause: true }));
    }
  }

  function validateStep(step: number): boolean {
    if (step === 1) return date !== "" && time !== "" && hours > 0;
    if (step === 2) return role.trim() !== "" && cause.trim() !== "";
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
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
        alert("Photo upload failed.");
        return;
      }

      photo_url = fileName;
    }

    const finalCause = cause === "Others" ? customCause : cause;

    const result = SessionSchema.safeParse({
      id: uuidv4(),
      date,
      time,
      hours,
      role,
      cause: finalCause,
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
      alert("Failed to save session.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="p-4 mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => prev - 1)}
            className="text-2xl"
            aria-label="Back"
          >
            ←
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className="flex flex-col items-center flex-grow">
          <h1 className="text-lg font-semibold">Log Session</h1>
          <p className="text-sm text-gray-500">Step {step} of 3</p>
        </div>

        <div className="w-6" />
      </div>

      <div className="flex justify-between mb-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 w-full mx-1 rounded-full ${
              step >= s ? "bg-[#6B59FF]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">When did you volunteer?</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {touched.date && !date && <p className="text-sm text-red-500">Please enter a date</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              {touched.time && !time && <p className="text-sm text-red-500">Please enter a time</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Hours volunteered</label>
              <Input
                type="number"
                min={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
              {touched.hours && hours <= 0 && <p className="text-sm text-red-500">Please enter a valid number of hours</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">What did you do?</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your role</label>
              <Input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              {touched.role && !role.trim() && <p className="text-sm text-red-500">Please enter your role</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Organisation (optional)</label>
              <Input
                type="text"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cause</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {causeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setCause(value)}
                    className={`border rounded-lg p-3 flex flex-col items-center space-y-1 text-sm ${
                      cause === value ? "border-[#6B59FF] bg-[#f5f3ff]" : "border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              {touched.cause && !cause && <p className="text-sm text-red-500">Please select a cause</p>}
              {cause === "Others" && (
                <Input
                  className="mt-2"
                  placeholder="Enter custom cause"
                  value={customCause}
                  onChange={(e) => setCustomCause(e.target.value)}
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you help with? Any moments that stayed with you?"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Add a photo (optional)</h2>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </>
        )}

        <div className="pt-4">
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => {
                markTouchedFields(step);
                if (!validateStep(step)) return;
                setStep(step + 1);
              }}
              className="w-full bg-[#6B59FF]"
            >
              Next
            </Button>
          ) : (
            <Button type="submit" className="w-full bg-[#6B59FF]">
              Log my Session
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}