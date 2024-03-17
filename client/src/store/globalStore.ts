import { create } from 'zustand';

export interface GlobalState {
  inDev: boolean;
}

const useGlobalState = create<GlobalState>(() => ({
  inDev: true,
}));

export default useGlobalState;
