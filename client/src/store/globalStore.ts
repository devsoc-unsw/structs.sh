import { create } from 'zustand';

export interface GlobalState {
  inDev: boolean;
}

const useGlobalState = create<GlobalState>(() => ({
  inDev: false,
}));

export default useGlobalState;
