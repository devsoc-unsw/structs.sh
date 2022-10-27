export class Vertex {
  // Note: d3 expects this to be named exactly `id`.
  public id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static from(id: number) {
    return new Vertex(String(id));
  }
}
