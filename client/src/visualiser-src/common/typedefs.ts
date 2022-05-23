import { Text, Rect } from '@svgdotjs/svg.js';

export interface CodeLine {
  rectTarget: Rect;
  textTarget: Text;
}

export interface Documentation {
  command: string;
  args: string[];
  description: string;
}
