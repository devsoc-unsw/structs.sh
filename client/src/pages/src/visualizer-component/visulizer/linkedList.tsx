import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 } from 'uuid';
import LinkedNode from '../objects/node';
import { EdgeEntity, EntityType, NodeEntity } from '../types/graphState';
import Edge from '../objects/edge';
import { VisualizerComponent } from './visualizer';

const LinkedList: VisualizerComponent = ({ graphState, settings, setSettings }) => {
  const [state, setNodes] = useState(graphState);
  const nodeRefs = useRef<{ [uid: string]: SVGSVGElement | null }>({});
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (updated) {
      setUpdated(false);
    }
  }, [updated]);

  const localGlobalSetting = settings;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const [drawables, setDrawables] = useState<JSX.Element[]>([]);

  const onReload = useCallback(() => {
    setDrawables(renderNodes());
  }, [state, settings]);

  const onAddNode = useCallback(
    (uid: string) => {
      const node = state.cacheEntity[uid] as NodeEntity;
      const newNode: NodeEntity = {
        uid: v4(),
        type: EntityType.NODE,
        title: 'New Node',
        colorHex: '#FFFFFF',
        size: 50,
        edges: [],
        x: node.x + 100,
        y: node.y + 140,
      };
      state.cacheEntity[newNode.uid] = newNode;

      const newEdge: EdgeEntity = {
        uid: `${node.uid}-${newNode.uid}`,
        type: EntityType.EDGE,
        from: node.uid,
        to: newNode.uid,
        label: '',
        colorHex: '#FFFFFF',
      };
      state.cacheEntity[newEdge.uid] = newEdge;

      setNodes({ ...state });
      onReload();
    },
    [state]
  );

  const renderNodes = useCallback(
    () =>
      Object.values(state.cacheEntity).map((entity, index) => {
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
                graph={state}
                edgeUid={entity.uid}
              />
            );
          default:
            return null;
        }
      }),
    [state, settings, onReload, onAddNode]
  );

  useEffect(() => {
    setNodes(graphState);
    setDrawables(renderNodes());
    setUpdated(true);
  }, [graphState]);

  useEffect(() => {
    if (Object.keys(nodeRefs.current).length !== 0) {
      Object.keys(nodeRefs.current).forEach((key) => {
        if (state.cacheEntity[key] === undefined) {
          delete nodeRefs.current[key];
        }
      });
      Object.keys(state.cacheEntity).forEach((key) => {
        if (nodeRefs.current[key] === undefined) {
          nodeRefs.current[key] = null;
        }
      });
    }
  }, [state]);

  useEffect(() => {
    ['showHover', 'showClick', 'canDrag', 'debug'].forEach((key) => {
      if (settings[key] !== localGlobalSetting[key]) {
        localGlobalSetting[key] = settings[key];
      }
    });
    setDrawables(renderNodes());
  }, [settings]);

  return (
    <div className="LinkedList">
      <AnimatePresence>
        <motion.svg
          key={updated ? 'updated' : 'not-updated'}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          initial="hidden"
          animate="visible"
        >
          {drawables}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};

export default LinkedList;