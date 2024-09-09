// src/store/toastStateStore.ts
import create from 'zustand';

interface Message {
  colorTheme: 'info' | 'warning' | 'error' | string;
  content: string | JSX.Element;
  durationMs: number;
}

export const DEFAULT_MESSAGE_DURATION: number = 2000;

interface ToastState {
  currentMessage?: Message;
  setMessage: (message: Message) => void;
  clearMessage: () => void;
}

export const useToastStateStore = create<ToastState>((set) => ({
  currentMessage: undefined,
  setMessage: (message) => {
    set({ currentMessage: message });
  },
  clearMessage: () => {
    set({ currentMessage: undefined });
  },
}));
