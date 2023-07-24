import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import LinkedNode from "./linked-list/node";
import { UiState } from "./types/uiState";
import {
  EdgeEntity,
  EntityType,
  FrontendLinkedListGraph,
  NodeEntity,
} from "./types/graphState";
import Edge from "./linked-list/edge";
import { v4 } from "uuid";

export interface LinkedListState {
  linkedListState: FrontendLinkedListGraph;
  settings: UiState;
  setSettings: React.Dispatch<React.SetStateAction<UiState>>;
}

const LinkedList: React.FC<LinkedListState> = ({
  linkedListState,
  settings,
  setSettings,
}) => {
  // eslint-disable-next-line prefer-const
  let [state, setNodes] = useState(linkedListState);
  const nodeRefs = useRef<{
    [uid: string]: SVGSVGElement | null;
  }>({});
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (updated) {
      setUpdated(false);
    }
  }, [updated]);

  const localGlobalSetting = settings;
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    console.log("GraphState changes!!!", linkedListState);
    setNodes(linkedListState);

    state = linkedListState;
    setDrawables(renderNodes());
    setUpdated(true);
  }, [linkedListState]);

  useEffect(() => {
    if (Object.keys(nodeRefs.current).length === 0) {
      // Initialize it
    } else {
      // First remove the edge, node being removed from graph
      for (const key of Object.keys(nodeRefs.current)) {
        if (state.cacheEntity[key] === undefined) {
          delete nodeRefs.current[key];
        }
      }

      // Then add the node, edge to it
      for (const key of Object.keys(state.cacheEntity)) {
        if (nodeRefs.current[key] === undefined) {
          nodeRefs.current[key] = null;
        }
      }
    }
  }, [state]);

  useEffect(() => {
    console.log("settings changes!!!", settings);

    ["showHover", "showClick", "canDrag", "debug"].forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (settings[key] !== localGlobalSetting[key]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        localGlobalSetting[key] = settings[key];
      }
    });
    setDrawables(renderNodes());
  }, [settings]);

  const onReload = () => {
    console.log("Reload called? Node should updated?");
    setDrawables(renderNodes());
  };

  const onAddNode = (uid: string) => {
    const node = state.cacheEntity[uid] as NodeEntity;

    /**
     * Add a new node to the graph
     */
    const newNode: NodeEntity = {
      uid: v4(),
      type: EntityType.NODE,
      title: "New Node",
      colorHex: "#FFFFFF",
      size: 50,
      edges: [],
      x: node.x + 100,
      y: node.y + 140,
    };
    state.cacheEntity[newNode.uid] = newNode;

    /**
     * Add a new edge
     */
    const newEdge: EdgeEntity = {
      uid: `${node.uid}-${newNode.uid}`,
      type: EntityType.EDGE,
      from: node.uid,
      to: newNode.uid,
      label: "",
      colorHex: "#FFFFFF",
    };
    state.cacheEntity[newEdge.uid] = newEdge;

    setNodes({ ...state });
    onReload();
  };

  const renderNodes = () => {
    return Object.values(state.cacheEntity).map((entity, index) => {
      switch (entity.type) {
        case EntityType.NODE:
          return (
            <LinkedNode
              ref={(ref) => (nodeRefs.current[index] = ref)}
              key={entity.uid}
              nodeUid={entity.uid}
              graph={state}
              config={settings}
              onReload={onReload}
              onAddNode={onAddNode}
              setConfig={setSettings}
            />
          );
        case EntityType.EDGE:
          return (
            <Edge
              ref={(ref) => (nodeRefs.current[index] = ref)}
              key={entity.uid}
              color="#h122f6"
              graph={state}
              edgeUid={entity.uid}
            />
          );
      }
    });
  };

  const [drawables, setDrawables] = useState<JSX.Element[]>(renderNodes());

  return (
    <AnimatePresence>
      <motion.svg
        key={updated ? "updated" : "not-updated"}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        initial="hidden"
        animate="visible"
      >
        {drawables}
      </motion.svg>
    </AnimatePresence>
  );
};

export default LinkedList;
