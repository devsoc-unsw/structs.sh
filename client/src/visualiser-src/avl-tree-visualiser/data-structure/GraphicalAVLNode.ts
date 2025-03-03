import GenericGraphicalTreeNode, {
  GenericGraphicalTreeNodeData,
} from 'visualiser-src/common/GenericGraphicalTreeNode';

export default class GraphicalAVLNode extends GenericGraphicalTreeNode {
  private _height: number;

  private constructor(data: GenericGraphicalTreeNodeData) {
    super(data);
    this._height = 1;
  }

  public static from(input: number): GraphicalAVLNode {
    return new GraphicalAVLNode(GenericGraphicalTreeNode.createData(input));
  }

  public updateHeight() {
    if (this.left === null && this.right === null) {
      this.height = 1;
    } else if (this.left === null) {
      this.height = this.right.height + 1;
    } else if (this.right === null) {
      this.height = this.left.height + 1;
    } else {
      this.height = Math.max(this.left.height, this.right.height) + 1;
    }
  }

  public get left(): GraphicalAVLNode {
    return this._left as GraphicalAVLNode;
  }

  public set left(left: GraphicalAVLNode) {
    this._left = left;
  }

  public get right(): GraphicalAVLNode {
    return this._right as GraphicalAVLNode;
  }

  public set right(right: GraphicalAVLNode) {
    this._right = right;
  }

  public get height() {
    return this._height;
  }

  public set height(height: number) {
    this._height = height;
  }

  public get balance() {
    if (this.left === null && this.right === null) {
      return 0;
    }
    if (this.left === null) {
      return -this.right.height;
    }
    if (this.right === null) {
      return this.left.height;
    }
    return this.left.height - this.right.height;
  }
}
