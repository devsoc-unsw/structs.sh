import { create } from 'zustand';

interface ConsolePathState {
  currWorkingDir: string,
  setCurrWorkingDir: (newWorkingDir: string) => void;
}

const useConsolePathStore = create<ConsolePathState>((set, get) => ({
  currWorkingDir: 'root',
  setCurrWorkingDir: (newWorkingDir) => set({ currWorkingDir: newWorkingDir }),
}));

export default useConsolePathStore;