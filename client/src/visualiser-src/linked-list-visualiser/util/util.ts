import { ACTUAL_NODE_DIAMETER, MARKER_LENGTH } from '../../common/constants';
import { getPointerStartEndCoordinates } from '../../common/helpers';

export enum Style {
  STRAIGHT,
  CURVED,
}

export const getPointerPath = (
  startCentreX: number,
  startCentreY: number,
  endCentreX: number,
  endCentreY: number,
  style: Style = Style.STRAIGHT
) => {
  const [[startX, startY], [endX, endY]] = getPointerStartEndCoordinates(
    startCentreX,
    startCentreY,
    endCentreX,
    endCentreY
  );
  return style === Style.CURVED
    ? `M ${
        startX - ACTUAL_NODE_DIAMETER / 2 + (ACTUAL_NODE_DIAMETER / 2) * Math.cos(Math.PI / 4)
      },${startY - (ACTUAL_NODE_DIAMETER / 2) * Math.sin(Math.PI / 4)} Q ${
        (startX + endX) / 2 + MARKER_LENGTH / 4
      },-30 ${
        endX +
        (ACTUAL_NODE_DIAMETER + MARKER_LENGTH) / 2 +
        -((ACTUAL_NODE_DIAMETER + MARKER_LENGTH) / 2) * Math.cos(Math.PI / 4)
      },${endY - ((ACTUAL_NODE_DIAMETER + MARKER_LENGTH) / 2) * Math.sin(Math.PI / 4)}`
    : `M ${startX},${startY} Q ${(startX + endX) / 2},${(startY + endY) / 2} ${endX},${endY}`;
};
