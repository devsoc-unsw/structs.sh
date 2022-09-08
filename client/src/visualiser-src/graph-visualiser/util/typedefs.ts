export interface Vertex {
  id: string;
}

export interface Edge {
  source: number;
  target: number;
  weight: number;
  isBidirectional?: boolean;
}
