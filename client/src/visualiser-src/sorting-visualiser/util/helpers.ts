import { boxWidth, whitespace, textCy } from './constants';

export function getX(index): number {
    return index * (boxWidth + whitespace) + whitespace;
}

export function getCx(index): number {
    return index * (boxWidth + whitespace) + (boxWidth / 2 + whitespace);
}

export function getY(value): number {
    return textCy - 10 - Math.sqrt(value * 90);
}