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

export const countOccurences = (arr: number[]): { [key: number]: number } => {
  const counts: { [key: number]: number } = {};

  arr.forEach((num) => {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  });

  return counts;
};

export const letterMap = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
