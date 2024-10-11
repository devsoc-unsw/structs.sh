import { create } from 'zustand';

interface FileFsState {
  onboardingCurrFile: string;
  setOnboardingCurrFile: (file: string) => void;
}

export const useFileOnboardingStateStore = create<FileFsState>((set) => ({
  onboardingCurrFile: '',
  setOnboardingCurrFile: (file: string) => set({ onboardingCurrFile: file }),
}));
