/**
 * Calculates the starting and ending coordinates of a pointer, given the coordinates of the centres of the
 * originating nodes and target nodes.
 * It is calculated such that the pointer starts and ends at the edge of a node, rather than the centre.
 */
export const getPointerStartEndCoordinates = (
  startCentreX: number,
  startCentreY: number,
  endCentreX: number,
  endCentreY: number,
  nodeRadius: number
): [[number, number], [number, number]] => {
  const theta: number = Math.atan(
    Math.abs(startCentreX - endCentreX) / Math.abs(startCentreY - endCentreY)
  );
  let startX, endX;
  if (startCentreX < endCentreX) {
    startX = startCentreX + nodeRadius * Math.sin(theta);
    endX = endCentreX - nodeRadius * Math.sin(theta);
  } else {
    startX = startCentreX - nodeRadius * Math.sin(theta);
    endX = endCentreX + nodeRadius * Math.sin(theta);
  }
  let startY, endY;
  if (startCentreY < endCentreY) {
    startY = startCentreY + nodeRadius * Math.cos(theta);
    endY = endCentreY - nodeRadius * Math.cos(theta);
  } else {
    startY = startCentreY - nodeRadius * Math.cos(theta);
    endY = endCentreY + nodeRadius * Math.cos(theta);
  }
  return [
    [startX, startY],
    [endX, endY],
  ];
};
