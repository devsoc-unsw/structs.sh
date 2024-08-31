import { boxWidth, whitespace, textCy, leftOffset } from './constants';

export function getX(index: number): number {
  return leftOffset + index * (boxWidth + whitespace);
}

export function getCx(index: number): number {
  return leftOffset + index * (boxWidth + whitespace) + boxWidth / 2;
}

export function getY(value: number): number {
  return textCy - 10 - Math.sqrt(value * 90);
}
