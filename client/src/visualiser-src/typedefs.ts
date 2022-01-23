// All visualisers must 'inherit' from this set of fundamental commands,
// implement each of them and extend it with their own data-structure-specific
// operations.
export interface Visualiser {
  play: () => void;
  pause: () => void;
  setTimeline: (val: number) => void;
  setSpeed: (val: number) => void;
  stepBack: () => void;
  stepForward: () => void;
}
