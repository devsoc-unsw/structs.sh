// src/store/toastStateStore.ts
import create from 'zustand';

interface Message {
  colorTheme: 'info' | 'warning' | 'error' | string;
  content: string | JSX.Element;
  durationMs: number;
}

export const DEFAULT_MESSAGE_DURATION: number = 2000;

interface ToastState {
  currentToastMessage?: Message;
  setToastMessage: (message: Message) => void;
  clearToastMessage: () => void;
}

export const useToastStateStore = create<ToastState>((set) => ({
  currentToastMessage: undefined,
  setToastMessage: (message) => {
    set({ currentToastMessage: message });
  },
  clearToastMessage: () => {
    set({ currentToastMessage: undefined });
  },
}));
