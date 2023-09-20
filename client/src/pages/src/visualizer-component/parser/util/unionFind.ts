export class UnionFind {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(nodes: Set<string>) {
    this.parent = new Map();
    this.rank = new Map();
    for (let uid of nodes) {
      this.parent.set(uid, uid);
      this.rank.set(uid, 0);
    }
  }

  find(uid: string): string {
    if (this.parent.get(uid) !== uid) {
      this.parent.set(uid, this.find(this.parent.get(uid)!));  // Path compression
    }
    return this.parent.get(uid)!;
  }

  union(x: string, y: string): void {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank.get(rootX)! < this.rank.get(rootY)!) {
        this.parent.set(rootX, rootY);
      } else if (this.rank.get(rootX)! > this.rank.get(rootY)!) {
        this.parent.set(rootY, rootX);
      } else {
        this.parent.set(rootY, rootX);
        this.rank.set(rootX, this.rank.get(rootX)! + 1);
      }
    }
  }

  getGroups(): Set<string[]> {
    const groupsMap: Map<string, string[]> = new Map();

    this.parent.forEach((_, uid) => {
      const root = this.find(uid);
      if (!groupsMap.has(root)) {
        groupsMap.set(root, []);
      }
      groupsMap.get(root)!.push(uid);
    });

    return new Set<string[]>([...groupsMap.values()]);
  }
}