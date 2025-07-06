import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LogSessionForm {
  date: string;
  time: string;
  hours: number;
  role: string;
  cause: string;
  customCause: string;
  organisation: string;
  description: string;
  photo: File | null;
}

interface LogSessionState {
  step: number;
  form: LogSessionForm;
  hasHydrated: boolean;
  setStep: (step: number) => void;
  setFormValue: <K extends keyof LogSessionForm>(key: K, value: LogSessionForm[K]) => void;
  resetForm: () => void;
  resetAll: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

const initialForm: LogSessionForm = {
  date: "",
  time: "",
  hours: 1,
  role: "",
  cause: "",
  customCause: "",
  organisation: "",
  description: "",
  photo: null,
};

export const useLogSession = create<LogSessionState>()(
  persist(
    (set) => ({
      step: 1,
      form: initialForm,
      hasHydrated: false,
      setStep: (step) => set({ step }),
      setFormValue: (key, value) =>
        set((state) => ({
          form: {
            ...state.form,
            [key]: value,
          },
        })),
      resetForm: () => set({ form: initialForm }),
      resetAll: () => set({ form: initialForm, step: 1 }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "log-session-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
