import { create } from "zustand";
import { Decision } from "../data/dummyData";

interface AppState {
  currentDecision: Decision | null;
  setCurrentDecision: (decision: Decision | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentDecision: null,
  setCurrentDecision: (currentDecision) => set({ currentDecision }),
}));
