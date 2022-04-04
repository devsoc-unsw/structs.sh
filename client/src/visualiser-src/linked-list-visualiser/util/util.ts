import { insertedNodeTopOffset, nodePathWidth, pathLength, topOffset } from './constants';
import { actualNodeDiameter } from '../../common/constants';
import { getPointerStartEndCoordinates } from '../../common/helpers';

export enum Style {
  RIGHT,
  CURVED_RIGHT,
  UP_RIGHT,
  DOWN_RIGHT,
}
export const getPointerPath = (style: Style) => {
  let startCentreX;
  let startCentreY;
  let endCentreX;
  let endCentreY;
  switch (style) {
    case Style.RIGHT:
      startCentreX = actualNodeDiameter / 2;
      startCentreY = topOffset;
      endCentreX = actualNodeDiameter / 2 + nodePathWidth;
      endCentreY = topOffset;
      break;
    case Style.UP_RIGHT:
      startCentreX = actualNodeDiameter / 2;
      startCentreY = topOffset;
      endCentreX = pathLength + actualNodeDiameter / 2;
      endCentreY = 2 * topOffset - insertedNodeTopOffset;
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
      },-10 ${2 * nodePathWidth},${topOffset}`;
    default:
      break;
  }
  const [[startX, startY], [endX, endY]] = getPointerStartEndCoordinates(
    startCentreX,
    startCentreY,
    endCentreX,
    endCentreY
  );
  return `M ${startX},${startY} Q ${(startX + endX) / 2},${(startY + endY) / 2} ${endX},${endY}`;
};
