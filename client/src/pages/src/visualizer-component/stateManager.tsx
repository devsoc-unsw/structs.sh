import React, { useEffect, useRef, useState } from 'react';
import { UiState } from './types/uiState';
import './css/stateManager.css';
import { FrontendLinkedListGraph, GenericGraph } from './types/frontendType';
import { Debugger } from './util/debugger';
import { Timeline } from './util/timeline';
import { VisualizerComponent } from './visulizer/visualizer';

export interface StateManagerProp {
  state: GenericGraph;
  settings: UiState;
  setSettings: React.Dispatch<React.SetStateAction<UiState>>;
  nextState: () => void;

  Visualizer: VisualizerComponent;
}

// A generic interface to manages the history of frontend state,
// navigation between states
export const StateManager: React.FC<StateManagerProp> = ({
  state,
  nextState,
  settings,
  setSettings,
  Visualizer,
}) => {
  /**
   * Parse the background graph state into frontend ones
   */
  const [currGraphState, setCurrGraphState] = useState<FrontendLinkedListGraph>(state);
  const [historyGraphState, setHistoryGraphState] = useState<FrontendLinkedListGraph[]>([state]);

  useEffect(() => {
    setCurrGraphState(state);
    setHistoryGraphState([...historyGraphState, state]);
  }, [state]);

  useEffect(() => {
    setSettings(settings);
  }, [settings]);

  const visualizerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!visualizerRef) return;

      entries.forEach((element) => {
        if (element.target instanceof HTMLElement && element.target.className === 'visualizer') {
          const { width, height } = element.contentRect;

          if (dimensions.height === 0) {
            console.log('Triggered', width, height);
            setDimensions({ width, height });
          }
        }
      });
    });

    if (visualizerRef.current) {
      observer.observe(visualizerRef.current);
    }
    return () => {
      if (visualizerRef.current) {
        observer.unobserve(visualizerRef.current);
      }
    };
  }, [visualizerRef]);

  return (
    <div className="container">
      <div className="linked-list">
        <div className="visualizer" ref={visualizerRef}>
          <Visualizer
            settings={settings}
            graphState={currGraphState}
            setSettings={setSettings}
            dimensions={dimensions}
          />
        </div>
        <div className="timeline">
          <Timeline nextState={nextState} forwardState={() => {}} backwardState={() => {}} />
        </div>
      </div>
      <div className="debugger">{settings.debug && <Debugger src={currGraphState} />}</div>
    </div>
  );
};
