import { boxWidth, whitespace, textCy, leftOffset } from './constants';

export function getX(index): number {
  return leftOffset + index * (boxWidth + whitespace);
}

export function getCx(index): number {
  return leftOffset + index * (boxWidth + whitespace) + boxWidth / 2;
}

export function getY(value): number {
  return textCy - 10 - Math.sqrt(value * 90);
}
