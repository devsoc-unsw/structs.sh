import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import LinkedNode from '../drawableObjects/node';
import { EntityType } from '../types/frontendType';
import Edge from '../drawableObjects/edge';
import { VisualizerComponent } from './visualizer';
import { MotionCoord } from '../drawableObjects/drawable';

// TODO: Expand different component for different data structure, implementing common interface
const LinkedList: VisualizerComponent = ({ graphState, settings, setSettings, dimensions }) => {
  const [state, setNodes] = useState(graphState);
  const nodeRefs = useRef<{ [uid: string]: SVGSVGElement | null }>({});
  const controls = useAnimation();
  const [drawable, setDrawables] = useState<{
    [key: string]: JSX.Element;
  }>({});
  // Replace by store
  const [pos, _] = useState<{ [uid: string]: MotionCoord }>({});

  const renderNodes = useCallback(() => {
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
    Object.entries(state.nodes).forEach(([_, nodeConcrete]) => {
      if (!nodeConcrete) return;
      if (pos[nodeConcrete.uid] === undefined) {
        pos[nodeConcrete.uid] = {
          x: { val: nodeConcrete.x },
          y: { val: nodeConcrete.y },
        };
      } else {
        pos[nodeConcrete.uid].x.val = nodeConcrete.x;
        pos[nodeConcrete.uid].y.val = nodeConcrete.y;
      }
    });
    console.log(pos);

    // Create new drawable objects
    Object.values(state.cacheEntity).map((entity) => {
      switch (entity.type) {
        case EntityType.NODE:
          drawable[entity.uid] = (
            <LinkedNode
              ref={(ref) => {
                nodeRefs.current[entity.uid] = ref;
                return undefined;
              }}
              key={entity.uid}
              entity={entity}
              coord={pos[entity.uid]}
            />
          );
          break;
        case EntityType.EDGE:
          drawable[entity.uid] = (
            <Edge
              ref={(ref) => {
                nodeRefs.current[entity.uid] = ref;
                return undefined;
              }}
              key={entity.uid}
              entity={entity}
              graph={state}
              from={pos[entity.from]}
              to={pos[entity.from]}
            />
          );
          break;
        default:
          return null;
      }

      return null;
    });
    setDrawables(drawable);
  }, [state, settings]);

  useEffect(() => {
    setNodes(graphState);
    renderNodes();
    controls.start('visible');
  }, [graphState]);

  return (
    <AnimatePresence>
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        initial="hidden"
        animate={controls}
      >
        {Object.values(drawable)}
      </motion.svg>
    </AnimatePresence>
  );
};

export default LinkedList;
