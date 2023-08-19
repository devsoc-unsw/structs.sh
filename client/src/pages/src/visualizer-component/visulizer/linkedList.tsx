import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import LinkedNode from '../drawableObjects/node';
import { EntityType } from '../types/frontendType';
import Edge from '../drawableObjects/edge';
import { VisualizerComponent } from './visualizer';

// TODO: Expand different component for different data structure, implementing common interface
const LinkedList: VisualizerComponent = ({ graphState, settings, setSettings, dimensions }) => {
  const [state, setNodes] = useState(graphState);
  const nodeRefs = useRef<{ [uid: string]: SVGSVGElement | null }>({});
  const controls = useAnimation();
  const [drawable, setDrawables] = useState<{
    [key: string]: JSX.Element;
  }>({});

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

    // Create new drawable objects
    Object.values(state.cacheEntity).map((entity) => {
      if (drawable[entity.uid] === undefined) {
        switch (entity.type) {
          case EntityType.NODE:
            drawable[entity.uid] = (
              <LinkedNode
                ref={(ref) => (nodeRefs.current[entity.uid] = ref)}
                key={entity.uid}
                entity={entity}
              />
            );
            break;
          case EntityType.EDGE:
            drawable[entity.uid] = (
              <Edge
                ref={(ref) => (nodeRefs.current[entity.uid] = ref)}
                key={entity.uid}
                entity={entity}
                graph={state}
              />
            );
            break;
          default:
            return null;
        }
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
