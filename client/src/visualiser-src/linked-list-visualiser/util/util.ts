import {
  actualNodeDiameter,
  insertedNodeTopOffset,
  nodePathWidth,
  pathLength,
  topOffset,
} from './constants';
import { getPointerStartEndCoordinates } from './../../binary-search-tree-visualiser/util/util';
export enum Style {
  UP,
  RIGHT,
  CURVED_RIGHT,
  UP_RIGHT,
  DOWN_RIGHT,
}
export const getPointerPath = (style: Style) => {
  let startCentreX, startCentreY, endCentreX, endCentreY;
  switch (style) {
    case Style.UP:
      startCentreX = actualNodeDiameter / 2;
      startCentreY = topOffset + actualNodeDiameter / 2 + pathLength;
      endCentreX = actualNodeDiameter / 2;
      endCentreY = topOffset;
      break;
    case Style.RIGHT:
      startCentreX = actualNodeDiameter / 2;
      startCentreY = topOffset;
      endCentreX = actualNodeDiameter / 2 + nodePathWidth;
      endCentreY = topOffset;
      break;
    case Style.UP_RIGHT:
      startCentreX = actualNodeDiameter / 2;
      startCentreY = insertedNodeTopOffset;
      endCentreX = pathLength + actualNodeDiameter / 2;
      endCentreY = topOffset;
      break;
    case Style.DOWN_RIGHT:
      startCentreX = actualNodeDiameter / 2;
      startCentreY = topOffset;
      endCentreX = pathLength + actualNodeDiameter / 2;
      endCentreY = insertedNodeTopOffset;
      break;
    case Style.CURVED_RIGHT:
      return `M ${actualNodeDiameter},${topOffset} Q ${
        pathLength + (3 * actualNodeDiameter) / 2
      },10 ${2 * nodePathWidth},${topOffset}`;
  }
  const [[startX, startY], [endX, endY]] = getPointerStartEndCoordinates(
    startCentreX,
    startCentreY,
    endCentreX,
    endCentreY
  );
  return `M ${startX},${startY} Q ${(startX + endX) / 2},${(startY + endY) / 2} ${endX},${endY}`;
};
