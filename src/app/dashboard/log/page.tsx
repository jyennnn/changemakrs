"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { SessionSchema } from "@/models/dashboard";
import { supabase } from "@/lib/supabase/client";

import StepOne from "@/components/LogSession/StepOne";
import StepTwo from "@/components/LogSession/StepTwo";
import StepThree from "@/components/LogSession/StepThree";

import { Button } from "@/components/ui/button";

export default function LogSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [form, setForm] = useState({
    date: "",
    time: "",
    hours: 1,
    role: "",
    cause: "",
    customCause: "",
    organisation: "",
    description: "",
    photo: null as File | null,
  });

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isStepValid = () => {
    if (step === 1) return form.date && form.time && form.hours > 0;
    if (step === 2)
      return (
        form.role.trim() &&
        form.cause.trim() &&
        (form.cause !== "Others" || form.customCause.trim())
      );
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
     const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (sessionError || !user) {
    alert("You must be logged in.");
    setLoading(false);
    return;
  }

    const id = uuidv4();
    const finalCause = form.cause === "Others" ? form.customCause : form.cause;

    let photo_url = "";
    if (form.photo) {
      const ext = form.photo.name.split(".").pop();
      const fileName = `${id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("changemakrs-session-photos")
        .upload(fileName, form.photo);

      if (uploadError) {
        alert("Photo upload failed.");
        setLoading(false);
        return;
      }

      photo_url = fileName;
    }

    const sessionData = {
      id,
      date: form.date,
      time: form.time,
      hours: form.hours,
      role: form.role,
      cause: finalCause,
      organisation: form.organisation,
      description: form.description,
      photo_url,
      user_id: user.id,
    };

    const result = SessionSchema.safeParse(sessionData);
    if (!result.success) {
      console.error(result.error.format());
      alert("Validation failed.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("sessions").insert(result.data);
    if (error) {
      alert("Failed to save session.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-2xl"
          >
            ←
          </button>
        ) : (
          <div className="w-6 h-6" />
        )}
        <div className="text-center flex-1">
          <h1 className="text-xl font-semibold">Log Session</h1>
          <p className="text-sm text-gray-500">Step {step} of 3</p>
        </div>
        <div className="w-6 h-6" />
      </div>

      {/* Progress Bar */}
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

      {/* Step Content */}
      <div className="pt-8 pb-8 space-y-4">
       {step === 1 && <StepOne form={form} updateForm={updateForm} showErrors={showErrors} />}
{step === 2 && <StepTwo form={form} updateForm={updateForm} showErrors={showErrors} />}
        {step === 3 && <StepThree form={form} updateForm={updateForm} showErrors={showErrors} />}
      </div>

      {/* Navigation */}
      <div className="pt-4">
        {step < 3 ? (
          <Button
            onClick={() => {
              setShowErrors(true);
              if (isStepValid()) {
                setStep((s) => s + 1);
                setShowErrors(false); // Reset for next step
              }
            }}
            className="w-full bg-[#6B59FF] h-11 rounded-3xl"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#6B59FF] h-11 rounded-3xl"
          >
            {loading ? "Saving..." : "Log my Session"}
          </Button>
        )}
      </div>
    </main>
  );
}
