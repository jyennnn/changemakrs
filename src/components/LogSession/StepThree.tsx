"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function StepThree({ form, updateForm }: any) {
  return (
    <>
      <h2 className="text-lg font-semibold">Add a photo (optional)</h2>

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => updateForm("photo", e.target.files?.[0] || null)}
      />

      <div className="space-y-2 pt-4">
        <label className="text-sm font-medium">Your favourite moment today</label>
        <Textarea
          value={form.description}
          onChange={(e) => updateForm("description", e.target.value)}
          placeholder="What did you help with? Any moments that stayed with you?"
          className="text-sm"
        />
      </div>
    </>
  );
}
