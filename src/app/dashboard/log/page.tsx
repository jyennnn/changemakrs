"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { SessionSchema } from "@/models/dashboard";
import { supabase } from "@/lib/supabase/client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Book,
  TreePine,
  PawPrint,
  Handshake,
  Puzzle,
  Palette,
  MoreHorizontal,
} from "lucide-react";

const causeOptions = [
  { value: "Environment", label: "Environment", icon: TreePine },
  { value: "Animals", label: "Animals", icon: PawPrint },
  { value: "Youths", label: "Youths", icon: Book },
  { value: "Elderly", label: "Elderly", icon: Heart },
  { value: "Disabilities", label: "Disabilities", icon: Puzzle },
  { value: "Arts & Culture", label: "Arts & Culture", icon: Palette },
  { value: "Community", label: "Community", icon: Handshake },
  { value: "Others", label: "Others", icon: MoreHorizontal },
];

export default function LogSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

  function markTouched(step: number) {
    setTouched((prev) => ({
      ...prev,
      ...(step === 1 && { date: true, time: true, hours: true }),
      ...(step === 2 && {
        role: true,
        cause: true,
        ...(cause === "Others" && { customCause: true }),
      }),
    }));
  }

  function validate(step: number) {
    if (step === 1) return date && time && hours > 0;
    if (step === 2) {
      const baseValid = role.trim() && cause.trim();
      const customValid = cause !== "Others" || customCause.trim();
      return baseValid && customValid;
    }
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    const id = uuidv4();
    const finalCause = cause === "Others" ? customCause : cause;
    let photo_url = "";

    const sessionData = {
      id,
      date,
      time,
      hours,
      role,
      cause: finalCause,
      organisation,
      description,
      photo_url: "",
      user_id: user.id,
    };

    const result = SessionSchema.safeParse(sessionData);
    if (!result.success) {
      console.error(result.error.format());
      alert("Validation failed.");
      setLoading(false);
      return;
    }

    if (photo) {
      const ext = photo.name.split(".").pop();
      const fileName = `${id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("changemakrs-session-photos")
        .upload(fileName, photo);

      if (uploadError) {
        alert("Photo upload failed.");
        setLoading(false);
        return;
      }

      photo_url = fileName;
    }

    const { error } = await supabase.from("sessions").insert({
      ...result.data,
      photo_url,
    });

    if (error) {
      alert("Failed to save session.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-2xl">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-2xl"
            aria-label="Back"
          >
            ←
          </button>
        ) : (
          <div className="w-6 h-6" />
        )}
        <div className="flex flex-col items-center flex-grow">
          <h1 className="text-xl font-semibold">Log Session</h1>
          <p className="text-sm text-gray-500">Step {step} of 3</p>
        </div>
        <div className="w-6 h-6" />
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

      {/* Form Content */}
      <form className="space-y-4 pt-8 pb-8" onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">When did you volunteer?</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              {touched.date && !date && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              {touched.time && !time && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hours volunteered</label>
              <Input
                type="number"
                min={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
              {touched.hours && hours <= 0 && <p className="text-sm text-red-500">Must be more than 0</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">What did you do?</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your role</label>
              <Input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
              {touched.role && !role.trim() && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Organisation (optional)</label>
              <Input type="text" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cause</label>
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
              {touched.cause && !cause && <p className="text-sm text-red-500">Required</p>}
              {cause === "Others" && (
                <div className="mt-4 space-y-1">
                  <Input
                    className="text-sm"
                    placeholder="Enter custom cause"
                    value={customCause}
                    onChange={(e) => setCustomCause(e.target.value)}
                  />
                  {touched.customCause && !customCause.trim() && (
                    <p className="text-sm text-red-500">Required</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Add a photo (optional)</h2>
            <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            <div className="space-y-2 ">
              <label className="text-sm font-medium">Your favourite moment today</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you help with? Any moments that stayed with you?"
                className="text-sm"
              />
            </div>
          </>
        )}
      </form>

      {/* Navigation Button */}
      <div className="pt-4">
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => {
              markTouched(step);
              if (validate(step)) setStep((s) => s + 1);
            }}
            className="w-full bg-[#6B59FF] h-11 rounded-3xl"
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[#6B59FF] h-11 rounded-3xl"
            disabled={loading}
          >
            {loading ? "Saving..." : "Log my Session"}
          </Button>
        )}
      </div>
    </main>
  );
}
