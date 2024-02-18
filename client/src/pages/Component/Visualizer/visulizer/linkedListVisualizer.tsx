import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, useAnimation } from 'framer-motion';
import LinkedNode from '../Entities/DrawableEntities/drawableNode';
import Edge from '../Entities/DrawableEntities/drawableEdge';
import { VisualizerComponent, VisualizerState } from './visualizer';
import { MotionCoord } from '../Entities/DrawableEntities/drawable';
import { assertUnreachable } from '../Util/util';
import Pointer from '../Entities/DrawableEntities/drawablePointer';
import { isAttachableEntity } from '../Entities/CoreEntity/attachableEntity';
import { EntityType } from '../Entities/BaseEntity/baseEntity';
import SvgComponent from './svgComponent';
import { Coord } from '../../../Types/geometryType';

// TODO: Expand different component for different data structure, implementing common interface
const LinkedList: VisualizerComponent = ({ graphState }: VisualizerState) => {
  const nodeRefs = useRef<{ [uid: string]: SVGSVGElement | null }>({});
  const controls = useAnimation();
  const [drawable, setDrawable] = useState<{
    [key: string]: JSX.Element;
  }>({});
  const [centerCoord, setCenterCoord] = useState<Coord>({
    x: 800,
    y: 400,
  });

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
              from={pos[entity.fromNodeUid]}
              to={pos[entity.toNodeUid]}
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

    setDrawable({ ...renderDrawable });

    // Find the center position from the node
    // Initial extreme values for the boundary
    const nodeSize = Object.values(graphState.nodes).length;
    const center = Object.values(graphState.nodes).reduce(
      (acc, node) => ({ x: acc.x + node.x / nodeSize, y: acc.y + node.y / nodeSize }),
      { x: 0, y: 0 }
    );

    // Set the derived boundary
    setCenterCoord(center);
  }, [graphState]);

  useEffect(() => {
    renderNodes();
    controls.start('visible');
  }, [graphState]);

  return (
    <SvgComponent centerCoord={centerCoord}>
      <AnimatePresence>{Object.values(drawable)} </AnimatePresence>
    </SvgComponent>
  );
};

export default LinkedList;
