import { STROKE_WIDTH } from '../../common/constants';

export const nodeStyle = {
  fill: '#EBE8F4',
  stroke: '#000',
  'stroke-width': STROKE_WIDTH,
  opacity: 0,
};

export const nodeWidth = 50;

export const textStyle = {
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  'font-family': 'CodeText',
  'font-size': '24',
  opacity: 0,
};

export const lineStyle = {
  'stroke-width': 3,
  'stroke-linecap': 'round',
  opacity: 0,
  stroke: '#000',
};

// we need this so that all svg elements have some padding
export const canvasPadding = 40;
export const lineDiffY = 75;
