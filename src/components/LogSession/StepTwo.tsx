"use client";

import { Input } from "@/components/ui/input";
import { causeOptions } from "@/constants/causes";

export default function StepTwo({ form, updateForm, showErrors }: any) {
  return (
    <>
      <h2 className="text-lg font-semibold">What did you do?</h2>

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your role</label>
        <Input
          type="text"
          value={form.role}
          onChange={(e) => updateForm("role", e.target.value)}
        />
        {showErrors && !form.role.trim() && (
          <p className="text-sm text-red-500">Role is required</p>
        )}
      </div>

      {/* Organisation */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Organisation (optional)</label>
        <Input
          type="text"
          value={form.organisation}
          onChange={(e) => updateForm("organisation", e.target.value)}
        />
      </div>

      {/* Cause */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cause</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {causeOptions.map(({ value, label, icon: Icon }) => (
            <button
              type="button"
              key={value}
              onClick={() => updateForm("cause", value)}
              className={`border rounded-lg p-3 flex flex-col items-center space-y-1 text-sm ${
                form.cause === value ? "border-[#6B59FF] bg-[#f5f3ff]" : "border-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
        {showErrors && !form.cause && (
          <p className="text-sm text-red-500">Cause is required</p>
        )}
      </div>

      {/* Custom cause */}
      {form.cause === "Others" && (
        <div className="mt-4 space-y-2">
          <Input
            className="text-sm"
            placeholder="Enter custom cause"
            value={form.customCause}
            onChange={(e) => updateForm("customCause", e.target.value)}
          />
          {showErrors && !form.customCause.trim() && (
            <p className="text-sm text-red-500">Custom cause is required</p>
          )}
        </div>
      )}
    </>
  );
}
