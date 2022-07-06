import GraphicalBSTNode from 'visualiser-src/binary-search-tree-visualiser/data-structure/GraphicalBSTNode';

export default class GraphicalAVLNode extends GraphicalBSTNode {
  private _height: number;

  private constructor(data) {
    super(data);
    this._height = 0;
  }

  public static from(input: number): GraphicalAVLNode {
    return new GraphicalAVLNode(GraphicalBSTNode.createData(input));
  }
}
