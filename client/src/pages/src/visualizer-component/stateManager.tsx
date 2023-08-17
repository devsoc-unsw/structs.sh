import React, { useEffect, useState } from 'react';
import { UiState } from './types/uiState';
import { ControlPanel } from './util/controlPanel';
import './css/drawingMotion.css';
import { FrontendLinkedListGraph, GenericGraph } from './types/graphState';
import { Debugger } from './util/debugger';
import { Timeline } from './util/timeline';
import { VisualizerComponent } from './visulizer/visualizer';
import { motion } from 'framer-motion';

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

  const movePosTest = () => {
    currGraphState.nodes.forEach((node) => {
      node.y += 10;
    });
    setCurrGraphState(currGraphState);
  };
  /**
   * Hard code for now yea yea
   */
  return (
    <div className="container">
      <div className="control-panel">
        <ControlPanel settings={settings} setSettings={setSettings} />
      </div>
      <div className="linked-list">
        <Visualizer settings={settings} graphState={currGraphState} setSettings={setSettings} />
        <Timeline nextState={nextState} forwardState={() => {}} backwardState={() => {}} />
        <motion.button className="state-button" type="button" onClick={movePosTest}>
          Check Move Ref
        </motion.button>
      </div>
      {settings.debug && <Debugger src={currGraphState} />}
    </div>
  );
};
