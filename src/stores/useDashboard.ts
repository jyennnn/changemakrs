import { create } from 'zustand';

type DashboardState = {
  name: string;
  sessionCount: number;
  totalHours: number;
  uniqueCauses: number;
    hydrated: boolean;
  setMetrics: (data: Partial<Omit<DashboardState, 'setMetrics' | 'hydrated'>>) => void;
};

export const useDashboard = create<DashboardState>((set) => ({
  name: '',
  sessionCount: 0,
  totalHours: 0,
  uniqueCauses: 0,
  hydrated: false,
  setMetrics: (data) =>
    set((state) => ({
      ...state,
      ...data,
      hydrated: true,
    })),
}));
