import { Input } from "@/components/ui/input";
import { LogSessionForm } from "@/types/LogSession";

interface StepProps {
  form: LogSessionForm;
  updateForm: <K extends keyof LogSessionForm>(key: K, value: LogSessionForm[K]) => void;
  showErrors: boolean;
}

export default function StepOne({ form, updateForm, showErrors }: StepProps) {
  return (
    <>
      <h2 className="text-lg font-semibold">When did you volunteer?</h2>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => updateForm("date", e.target.value)}
        />
        {showErrors && !form.date && (
          <p className="text-sm text-red-500">Date is required</p>
        )}
      </div>

      {/* Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Time</label>
        <Input
          type="time"
          value={form.time}
          onChange={(e) => updateForm("time", e.target.value)}
        />
        {showErrors && !form.time && (
          <p className="text-sm text-red-500">Time is required</p>
        )}
      </div>

      {/* Hours */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Hours volunteered</label>
        <Input
          type="number"
          min={1}
          value={form.hours}
          onChange={(e) => updateForm("hours", Number(e.target.value))}
        />
        {showErrors && form.hours <= 0 && (
          <p className="text-sm text-red-500">Hours must be more than 0</p>
        )}
      </div>
    </>
  );
}
