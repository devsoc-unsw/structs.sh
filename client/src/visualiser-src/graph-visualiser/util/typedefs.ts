export interface Vertex {
  id: string;
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
  isBidirectional?: boolean;
}
