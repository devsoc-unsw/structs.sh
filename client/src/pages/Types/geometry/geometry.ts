export interface Coord {
  x: number;
  y: number;
}

export enum ShapeType {
  Circle = 'circle',
  Rectangle = 'rectangle',
  Line = 'line',
}

export interface ShapeBase {
  type: ShapeType;
}

export interface Circle {
  type: ShapeType.Circle;
  center: Coord;
  radius: number;
}

export interface Rectangle {
  type: ShapeType.Rectangle;
  topLeft: Coord;
  width: number;
  height: number;
}

export interface Line {
  type: ShapeType.Line;
  start: Coord;
  end: Coord;
}

export type Shape = Circle | Rectangle | Line;
