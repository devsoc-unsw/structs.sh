import { create } from 'zustand';

export interface GlobalState {
  isDevMode: boolean;
}

const useGlobalState = create<GlobalState>(() => ({
  isDevMode: false,
}));

export default useGlobalState;
