import { DataStructure } from '@/visualiser-src/common/typedefs';

import type { SnapshotV1 } from './snapshotTypes';

export type SnapshotStructureType = SnapshotV1['structure']['type'];

export const topicToSnapshotStructureType = (topic: string): SnapshotStructureType | null => {
  if (topic.toLowerCase() === DataStructure.LINKED_LISTS.toLowerCase()) {
    return 'linked-list';
  }

  return null;
};

export const snapshotStructureTypeToTopic = (
  structureType: SnapshotStructureType
): DataStructure | null => {
  switch (structureType) {
    case 'linked-list':
      return DataStructure.LINKED_LISTS;
    default:
      return null;
  }
};
