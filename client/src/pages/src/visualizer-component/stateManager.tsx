import React, { useEffect, useState } from 'react';
import LinkedList from './visulizer/linkedList';
import { DEFAULT_UISTATE, UiState } from './types/uiState';
import { ControlPanel } from './util/controlPanel';
import './css/drawingMotion.css';
import {
  BackendStructure,
  FrontendLinkedListGraph,
} from './types/graphState';
import { Debugger } from './util/debugger';
import { Timeline } from './util/timeline';
import { parserFactory } from './parser/parserFactory';
import { visualizerFactory } from './visulizer/visualizerFactory';

export interface StateManagerProp {
  state: BackendStructure;
  settings: UiState;
  setSettings: React.Dispatch<React.SetStateAction<UiState>>;
  nextState: () => void;
}

export const StateManager: React.FC<StateManagerProp> = ({ state, nextState, settings, setSettings }) => {
  /**
   * Parse the background graph state into frontend ones
   */
  const parser = parserFactory(settings);
  const Visualizer = visualizerFactory(settings);

  const initialFrontendState = parser.parseInitialState(state, undefined);
  const [currGraphState, setCurrGraphState] =
    useState<FrontendLinkedListGraph>(initialFrontendState);
  const [historyGraphState, setHistoryGraphState] = useState<FrontendLinkedListGraph[]>([
    initialFrontendState,
  ]);

  useEffect(() => {
    const newFrontendState = parser.parseInitialState(state, undefined);

    setCurrGraphState(newFrontendState);
    setHistoryGraphState([...historyGraphState, newFrontendState]);
  }, [state]);

  useEffect(() => {
    setSettings(settings);
  }, [settings]);

  /**
   * Hard code for now yea yea
   */
  return (
    <div className="container">
      <div className="control-panel">
        <ControlPanel settings={settings} setSettings={setSettings} />
      </div>
      <div className="linked-list">
        <Visualizer
          settings={settings}
          graphState={currGraphState}
          setSettings={setSettings}
        />
        <Timeline nextState={nextState} forwardState={() => {}} backwardState={() => {}} />
      </div>
      {settings.debug && <Debugger src={currGraphState} />}
    </div>
  );
};
