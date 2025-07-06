// stores/useUser.ts
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUser = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
