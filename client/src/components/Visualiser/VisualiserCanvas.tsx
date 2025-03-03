import React, { PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { mat3, vec2 } from 'gl-matrix';

const ZoomableSvg = styled('svg')<{ transformMat: mat3 }>(({ transformMat }) => ({
  width: '100%',
  height: '100%',
  // transition: 'transform 0.2s linear',
  // transformOrigin: 'center',
  transform: `matrix(${transformMat[0]}, ${transformMat[1]}, ${transformMat[3]}, ${transformMat[4]}, ${transformMat[6]}, ${transformMat[7]})`,
}));

const ZOOM_SPEED = 0.0002;
const MAX_SCALE = 4;
const MIN_SCALE = 0.5;
const DEBUG = false;

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 *
 * Uses affine transformations to implement pan and zoom functionality.
 * See the following article for a beginner-friendly intro:
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web#
 */
const VisualiserCanvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [transform, setTransform] = useState<mat3>(mat3.create());
  const [workspaceOrigin, setWorkspaceOrigin] = useState<vec2>(
    vec2.fromValues(window.innerWidth / 2, window.innerHeight / 2)
  );

  const onScroll = useCallback(
    (e: React.WheelEvent) => {
      setTransform((prev) => {
        // === Zoom in/out at mouse position on scroll ===
        // Uses some matrix transforms. See following link for explanation:
        // https://math.stackexchange.com/questions/3245481/rotate-and-scale-a-point-around-different-origins

        // Calculate mouse position relative to viewport origin
        // Yields coords in viewport space (relative to viewport)
        const mouseFromWorkspaceOrigin = vec2.subtract(
          vec2.create(),
          vec2.fromValues(e.clientX, e.clientY),
          workspaceOrigin
        );

        // Transformed mouse position using the previous pan-zoom transform
        // Yields coords in workspace space (relative to workspace origin)
        const mouseFromWorkspaceOriginTransformed = vec2.transformMat3(
          vec2.create(),
          mouseFromWorkspaceOrigin,
          mat3.invert(mat3.create(), prev)
        );

        const newTransform = mat3.clone(prev);

        // Translate the transform to the mouse position
        mat3.translate(newTransform, newTransform, mouseFromWorkspaceOriginTransformed);

        // Scale the transform by scroll amount, same factor in both x and y directions
        // Constrain the scaled transform to a minimum and maximum scaling factor
        const scaleMag = -ZOOM_SPEED * e.deltaY;
        const scaleFactor = 1 + scaleMag;
        if (scaleFactor * newTransform[0] > MAX_SCALE) {
          mat3.scale(
            newTransform,
            newTransform,
            vec2.fromValues(MAX_SCALE / newTransform[0], MAX_SCALE / newTransform[4])
          );
        } else if (scaleFactor * newTransform[0] < MIN_SCALE) {
          mat3.scale(
            newTransform,
            newTransform,
            vec2.fromValues(MIN_SCALE / newTransform[0], MIN_SCALE / newTransform[4])
          );
        } else {
          const scaleVec = vec2.fromValues(scaleFactor, scaleFactor);
          mat3.scale(newTransform, newTransform, scaleVec);
        }

        // Undo the translation to the mouse position
        mat3.translate(
          newTransform,
          newTransform,
          vec2.negate(vec2.create(), mouseFromWorkspaceOriginTransformed)
        );

        return newTransform;
      });
    },
    [workspaceOrigin]
  );

  const [isPointerDown, setIsPointerDown] = useState(false);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsPointerDown(true);

    const mouseFromWorkspaceOrigin = vec2.subtract(
      vec2.create(),
      vec2.fromValues(e.clientX, e.clientY),
      workspaceOrigin
    );

    if (DEBUG)
      console.log(
        `Clicked pos relative to workspace origin: ${mouseFromWorkspaceOrigin[0]}, ${mouseFromWorkspaceOrigin[1]}`
      );
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isPointerDown) {
        return;
      }

      if (svgRef.current) {
        // If the mouse is outside the workspace, don't do translation
        const workspaceBoundingRect = svgRef.current.getBoundingClientRect();
        if (
          event.clientX < workspaceBoundingRect.left ||
          event.clientY < workspaceBoundingRect.top ||
          event.clientX > workspaceBoundingRect.right ||
          event.clientY > workspaceBoundingRect.bottom
        ) {
          return;
        }
      }

      // Is this needed for anything?
      event.preventDefault();

      setTransform((prev) => {
        const translateVec = vec2.fromValues(event.movementX / prev[0], event.movementY / prev[4]);
        return mat3.translate(mat3.create(), prev, translateVec);
      });
    },
    [isPointerDown]
  );

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  useEffect(() => {
    if (svgRef.current) {
      const boundingClientRect = svgRef.current.getBoundingClientRect();
      setWorkspaceOrigin(
        vec2.fromValues(
          (boundingClientRect.left + boundingClientRect.right) / 2,
          (boundingClientRect.top + boundingClientRect.bottom) / 2
        )
      );
    }
  }, []);

  return (
    <Box
      onWheel={onScroll}
      id="visualiser-container"
      margin="auto"
      width="100vw"
      height="100vh"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <ZoomableSvg ref={svgRef} id="visualiser-canvas" transformMat={transform} />
    </Box>
  );
};

export default VisualiserCanvas;

/*
const constrain = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};
*/
