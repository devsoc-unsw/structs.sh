import React, { PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { mat3, vec2 } from 'gl-matrix';
import { VISUALISER_CANVAS_ID, VISUALISER_WORKSPACE_ID } from 'visualiser-src/common/constants';

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

const getCentre = (rect: DOMRect) => {
  return vec2.fromValues((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);
};

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
  // Element ref to the visualiser "canvas" svg (not actually a HTMLCanvas)
  // Note: the visualiser canvas is not always same size as the visualiser workspace.
  // See this image: https://imgur.com/a/EK242BQ
  const svgRef = useRef<SVGSVGElement | null>(null);

  // top, left, bottom, right of workspace relative to viewport top-left
  const [workspaceRect, setWorkspaceRect] = useState<DOMRect>(
    new DOMRect(0, 0, window.innerWidth, window.innerHeight)
  );

  // transform matrix to represent accumulative panning and zooming.
  // The visualiser canvas position will be transformed by this matrix
  // and updated on scroll and drag events.
  const [transform, setTransform] = useState<mat3>(mat3.create());

  const onScroll = useCallback(
    (e: React.WheelEvent) => {
      setTransform((prevTransform) => {
        // === Zoom in/out at mouse position on scroll ===
        // Uses scaling matrix transform. See following link for explanation:
        // https://math.stackexchange.com/questions/3245481/rotate-and-scale-a-point-around-different-origins

        // Calculate mouse position relative to workspace origin,
        // in viewport space
        const mouseFromWorkspaceOrigin = vec2.subtract(
          vec2.create(),
          vec2.fromValues(e.clientX, e.clientY),
          getCentre(workspaceRect)
        );

        // Transformed mouse position using the previous pan-zoom transform
        // into transformed workspace space (taking into account accumulative
        // pan and zoom transformations)
        const mouseFromWorkspaceOriginTransformed = vec2.transformMat3(
          vec2.create(),
          mouseFromWorkspaceOrigin,
          mat3.invert(mat3.create(), prevTransform)
        );

        const newTransform = mat3.clone(prevTransform);

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
    [workspaceRect]
  );

  const [isPointerDown, setIsPointerDown] = useState(false);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      setIsPointerDown(true);

      const mouseFromWorkspaceOrigin = vec2.subtract(
        vec2.create(),
        vec2.fromValues(e.clientX, e.clientY),
        getCentre(workspaceRect)
      );

      if (DEBUG)
        console.log(
          `Clicked pos relative to workspace origin: ${mouseFromWorkspaceOrigin[0]}, ${mouseFromWorkspaceOrigin[1]}`
        );
    },
    [workspaceRect]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isPointerDown) {
        return;
      }

      // If the mouse is outside the workspace, don't do translation
      if (
        workspaceRect &&
        (event.clientX < workspaceRect.left ||
          event.clientY < workspaceRect.top ||
          event.clientX > workspaceRect.right ||
          event.clientY > workspaceRect.bottom)
      ) {
        if (DEBUG) console.log('Pointer left workspace');
        setIsPointerDown(false);
        return;
      }

      // Is this needed for anything?
      // event.preventDefault();

      setTransform((prev) => {
        const translateVec = vec2.fromValues(event.movementX / prev[0], event.movementY / prev[4]);
        return mat3.translate(mat3.create(), prev, translateVec);
      });
    },
    [isPointerDown, workspaceRect]
  );

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  useEffect(() => {
    // Callback for a ResizeObserver constructor
    const handleWorkspaceResize: ResizeObserverCallback = (entries) => {
      if (entries.length > 0 && entries[0].target.id === VISUALISER_WORKSPACE_ID) {
        const workspaceEntry = entries[0];
        const boundingClientRect = workspaceEntry.target.getBoundingClientRect();
        if (DEBUG)
          console.log(
            `Workspace resized. Setting new workspace rect left: ${boundingClientRect.left}, right: ${boundingClientRect.right}, top: ${boundingClientRect.top}, bottom: ${boundingClientRect.bottom} and updating transform...`
          );
        setWorkspaceRect(boundingClientRect);
      }

      if (entries.length !== 1) {
        // Note: I don't know why there would be none or multiple entries, I just assume
        // there is one entry passed to the resize handler when it is called by
        // the resize observer. So if this is not the case, maybe investigate\
        // what to do.
        console.warn(
          'Warning: Unexpected number of entries in ResizeObserver callback (more than 1).'
        );
      }
    };

    const visualiserWorkspaceEle = document.getElementById(VISUALISER_WORKSPACE_ID);
    if (visualiserWorkspaceEle) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API
      new ResizeObserver(handleWorkspaceResize).observe(visualiserWorkspaceEle);
    }
  }, []);

  return (
    <Box
      id={VISUALISER_WORKSPACE_ID}
      margin="auto"
      width="100vw"
      height="100vh"
      onWheel={onScroll}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <ZoomableSvg ref={svgRef} id={VISUALISER_CANVAS_ID} transformMat={transform} />
    </Box>
  );
};

export default VisualiserCanvas;
