// todo: RENAME THIS FILE INTO SOMETHING ELSE

import GraphicalDataStructure from '@/visualiser-src/common/GraphicalDataStructure';
import { Documentation } from '@/visualiser-src/common/typedefs';

export default class GraphicalGraph extends GraphicalDataStructure {
  public get documentation(): Documentation {
    throw new Error('Method not implemented.');
  }

  public generate(): void {
    throw new Error('Method not implemented.');
  }
}
