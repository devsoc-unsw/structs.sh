import { strokeWidth } from '../../common/constants';

export const nodeStyle = {
  fill: '#ffffff',
  stroke: '#000',
  'stroke-width': strokeWidth,
  opacity: 0,
};

export const nodeWidth = 50;

export const textStyle = {
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  opacity: 0,
};

export const lineStyle = {
  'stroke-width': 3,
  'stroke-linecap': 'round',
  opacity: 0,
  stroke: '#000',
};

// we need this so that all svg elements have some padding
export const canvasPadding = 75;
