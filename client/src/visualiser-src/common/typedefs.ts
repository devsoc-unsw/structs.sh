import { Text, Rect } from '@svgdotjs/svg.js';

export interface CodeLine {
  rectTarget: Rect;
  textTarget: Text;
}

export interface OperationUsage {
  args: string[];
  description: string;
  id?: number;
}

export interface Documentation {
  [command: string]: OperationUsage;
}
