import { boxWidth, whitespace } from '../util/constants';

export default class helpers {
    public static getX(index): number {
        return index * (boxWidth + whitespace) + whitespace;
    }
    
    public static getCx(index): number {
        return index * (boxWidth + whitespace) + (boxWidth / 2 + whitespace);
    }

    public static getY(value): number {
        return 350 - Math.sqrt(value * 90);
    }
}