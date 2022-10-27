export class Edge {
  public source: string;

  public target: string;

  public weight: number;

  public isBidirectional: boolean;

  private constructor(source: string, target: string, weight: number, isBidirectional: boolean) {
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.isBidirectional = isBidirectional;
  }

  public static from(source: string, target: string, weight: number, isBidirectional: boolean) {
    return new Edge(source, target, weight, isBidirectional);
  }
}
