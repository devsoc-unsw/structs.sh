import { actualNodeDiameter, markerLength } from '../../common/constants';
import { getPointerStartEndCoordinates } from '../../common/helpers';

export enum Style {
  RIGHT,
  CURVED_RIGHT,
  DOWN_RIGHT,
  UP_RIGHT,
}

export const getPointerPath = (
  startCentreX: number,
  startCentreY: number,
  endCentreX: number,
  endCentreY: number,
  style: Style
) => {
  const [[startX, startY], [endX, endY]] = getPointerStartEndCoordinates(
    startCentreX,
    startCentreY,
    endCentreX,
    endCentreY
  );
  return style === Style.CURVED_RIGHT
    ? `M ${startX - actualNodeDiameter / 2 + (actualNodeDiameter / 2) * Math.cos(Math.PI / 4)},${
        startY - (actualNodeDiameter / 2) * Math.sin(Math.PI / 4)
      } Q ${(startX + endX) / 2 + markerLength / 4},-30 ${
        endX +
        (actualNodeDiameter + markerLength) / 2 +
        -((actualNodeDiameter + markerLength) / 2) * Math.cos(Math.PI / 4)
      },${endY - ((actualNodeDiameter + markerLength) / 2) * Math.sin(Math.PI / 4)}`
    : `M ${startX},${startY} Q ${(startX + endX) / 2},${(startY + endY) / 2} ${endX},${endY}`;
};
