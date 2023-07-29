import React, { useEffect, useState } from 'react';
import LinkedList from './visulizer/linkedList';
import { DEFAULT_UISTATE, UiState } from './types/uiState';
import { ControlPanel } from './util/controlPanel';
import './css/drawingMotion.css';
import {
  BackendLinkedList,
  BackendLinkedListNode,
  EdgeEntity,
  EntityConcrete,
  EntityType,
  FrontendLinkedListGraph,
  NodeEntity,
} from './types/graphState';
import { Debugger } from './util/debugger';
import { Timeline } from './util/timeline';
import { parserFactory } from './parser/parserFactory';
import { visualizerFactory } from './visulizer/visualizerFactory';

export interface StateManagerProp {
  state: BackendLinkedList;
  settings: UiState;
  setSettings: React.Dispatch<React.SetStateAction<UiState>>;
  nextState: () => void;
}

export const StateManager: React.FC<StateManagerProp> = ({ state, nextState, settings, setSettings }) => {
  /**
   * Parse the background graph state into frontend ones
   */
  const parseState = (backendState: BackendLinkedList): FrontendLinkedListGraph => {
    const nodeEntities: NodeEntity[] = [];
    const edgeEntities: EdgeEntity[] = [];
    const cacheEntity: {
      [uid: string]: EntityConcrete;
    } = {};

    // Create a mapping for the backend nodes
    const nodeMapping: { [key: string]: BackendLinkedListNode } = {};
    backendState.nodes.forEach((node) => {
      nodeMapping[node.nodeId] = node;
    });

    // Now we build the NodeEntities and EdgeEntities
    backendState.nodes.forEach((node, index) => {
      // Convert backend node to frontend node
      const nodeEntity: NodeEntity = {
        uid: node.nodeId,
        type: EntityType.NODE,
        title: node.value ? node.value.toString() : '',
        colorHex: '#FFFFFF',
        size: 50,
        edges: [],
        x: 200 + index * 200,
        y: 100,
      };
      nodeEntities.push(nodeEntity);
    });

    backendState.nodes.forEach((node) => {
      const nodeEntity: NodeEntity | undefined = nodeEntities.find((n) => n.uid === node.nodeId);
      if (!nodeEntity) return;

      // If there's a next node, create an edge between the current node and the next node
      if (node.next) {
        const nextNode = nodeMapping[node.next];
        if (nextNode === undefined) return;
        const toNode = nodeEntities.find((n) => n.uid === nextNode.nodeId);
        if (nextNode && toNode) {
          const edgeEntity: EdgeEntity = {
            uid: `${node.nodeId}-${nextNode.nodeId}`,
            type: EntityType.EDGE,
            from: nodeEntity.uid,
            to: toNode.uid, // It's sure to find because we've already created all the nodes
            label: '', // you might need a better way to label the edge
            colorHex: '#FFFFFF', // default color
          };
          edgeEntities.push(edgeEntity);

          // Attach this edge to the node
          nodeEntity.edges.push(edgeEntity.uid);
        }
      }
    });

    [...nodeEntities, ...edgeEntities].forEach((entity) => {
      cacheEntity[entity.uid] = entity;
    });

    const frontendState: FrontendLinkedListGraph = {
      nodes: nodeEntities,
      edges: edgeEntities,
      cacheEntity,
    };

    return frontendState;
  };
  const parser = parserFactory(settings);
  const [Visualizer, setVisualizer] = useState(() => visualizerFactory(settings));

  const initialFrontendState = parseState(state);
  const [currGraphState, setCurrGraphState] =
    useState<FrontendLinkedListGraph>(initialFrontendState);
  const [historyGraphState, setHistoryGraphState] = useState<FrontendLinkedListGraph[]>([
    initialFrontendState,
  ]);

  useEffect(() => {
    const newFrontendState = parseState(state);

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
