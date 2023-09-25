import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import LinkedNode from '../drawableObjects/drawableNode';
import Edge from '../drawableObjects/drawableEdge';
import { VisualizerComponent, VisualizerState } from './visualizer';
import { MotionCoord } from '../drawableObjects/drawable';
import { assertUnreachable } from '../util/util';
import Pointer from '../drawableObjects/drawablePointer';
import { EntityType } from '../types/entity/baseEntity';
import { isAttachableEntity } from '../types/coreEntity/concreteEntity';

// TODO: Expand different component for different data structure, implementing common interface
const LinkedList: VisualizerComponent = ({ graphState, dimension }: VisualizerState) => {
  const nodeRefs = useRef<{ [uid: string]: SVGSVGElement | null }>({});
  const controls = useAnimation();
  const [drawable, setDrawables] = useState<{
    [key: string]: JSX.Element;
  }>({});
  // Replace by store
  const [pos] = useState<{ [uid: string]: MotionCoord }>({});

  const renderNodes = useCallback(() => {
    if (graphState === undefined) return;
    if (Object.keys(nodeRefs.current).length !== 0) {
      Object.keys(nodeRefs.current).forEach((key) => {
        if (graphState.cacheEntity[key] === undefined) {
          delete nodeRefs.current[key];
        }
      });
      Object.keys(graphState.cacheEntity).forEach((key) => {
        if (nodeRefs.current[key] === undefined) {
          nodeRefs.current[key] = null;
        }
      });
    }
    Object.entries(graphState.nodes).forEach(([_, nodeConcrete]) => {
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
    const renderDrawable = {};

    // Create new drawable objects
    Object.values(graphState.cacheEntity).forEach((entity) => {
      switch (entity.type) {
        case EntityType.NODE: {
          renderDrawable[entity.uid] = (
            <LinkedNode
              ref={(ref) => {
                if (nodeRefs.current[entity.uid] === undefined) nodeRefs.current[entity.uid] = ref;
                return nodeRefs.current[entity.uid];
              }}
              key={entity.uid}
              entity={entity}
              coord={pos[entity.uid]}
            />
          );
          break;
        }
        case EntityType.EDGE: {
          renderDrawable[entity.uid] = (
            <Edge
              ref={(ref) => {
                if (nodeRefs.current[entity.uid] === undefined) nodeRefs.current[entity.uid] = ref;
                return nodeRefs.current[entity.uid];
              }}
              key={entity.uid}
              entity={entity}
              graph={graphState}
              from={pos[entity.from]}
              to={pos[entity.to]}
            />
          );
          break;
        }
        case EntityType.POINTER: {
          const entityAttached = graphState.cacheEntity[entity.attachedUid];
          if (entityAttached && isAttachableEntity(entityAttached)) {
            renderDrawable[entity.uid] = (
              <Pointer
                ref={(ref) => {
                  if (nodeRefs.current[entity.uid] === undefined)
                    nodeRefs.current[entity.uid] = ref;
                  return nodeRefs.current[entity.uid];
                }}
                key={entity.uid}
                entity={entity}
                attachedEntity={entityAttached}
                pos={pos[entityAttached.uid]}
              />
            );
          }
          break;
        }
        default:
          assertUnreachable(entity);
      }
    });

    setDrawables({ ...renderDrawable });
  }, [graphState]);

  useEffect(() => {
    renderNodes();
    controls.start('visible');
  }, [graphState]);

  /**
   * SVG Section
   */
  const svgRef = useRef(null);
  const handleDrag = (event, info) => {
    event.preventDefault();
    const viewBox = svgRef.current.viewBox.baseVal;
    viewBox.x -= info.delta.x;
    viewBox.y -= info.delta.y;
  };
  const handleWheel = (event) => {
    event.preventDefault();

    const viewBox = svgRef.current.viewBox.baseVal;
    const zoomFactor = 1.045;

    const dx = (viewBox.width * (zoomFactor - 1)) / 2;
    const dy = (viewBox.height * (zoomFactor - 1)) / 2;

    if (event.deltaY < 0) {
      // zoom in
      viewBox.width /= zoomFactor;
      viewBox.height /= zoomFactor;
      viewBox.x += dx;
      viewBox.y += dy;
    } else {
      // zoom out
      viewBox.width *= zoomFactor;
      viewBox.height *= zoomFactor;
      viewBox.x -= dx;
      viewBox.y -= dy;
    }
  };

  return (
    <motion.svg
      ref={svgRef}
      width={dimension.width}
      height={dimension.height}
      viewBox="0 0 1000 1000"
      initial="hidden"
      animate={controls}
      drag
      onDrag={(event, info) => handleDrag(event, info)}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragMomentum={false}
      dragElastic={0}
      onWheel={(event) => handleWheel(event)}
      overflow="hidden"
    >
      <AnimatePresence>{Object.values(drawable)} </AnimatePresence>
    </motion.svg>
  );
};

export default LinkedList;
