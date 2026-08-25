import { describe, expect, it } from 'vitest';

import { DataStructure } from '@/visualiser-src/common/typedefs';

import {
  snapshotStructureTypeToTopic,
  topicToSnapshotStructureType,
} from '../snapshotTopicMap';

describe('snapshotTopicMap', () => {
  it('maps the Linked Lists topic to the API type', () => {
    expect(
      topicToSnapshotStructureType(
        DataStructure.LINKED_LISTS
      )
    ).toBe('linked-list');
  });

  it('rejects unsupported Phase 1 topics', () => {
    expect(
      topicToSnapshotStructureType(
        DataStructure.AVL_TREE
      )
    ).toBeNull();
  });

  it('maps the API type back to the UI topic', () => {
    expect(
      snapshotStructureTypeToTopic(
        'linked-list'
      )
    ).toBe(DataStructure.LINKED_LISTS);
  });
});