import { describe, expect, it } from 'vitest';

import { DataStructure } from '@/visualiser-src/common/typedefs';

import { snapshotStructureTypeToTopic, topicToSnapshotStructureType } from '../snapshotTopicMap';

describe('snapshotTopicMap', () => {
  it('maps the Linked Lists topic to the API type', () => {
    expect(topicToSnapshotStructureType(DataStructure.LINKED_LISTS)).toBe('linked-list');
  });

  it('rejects unsupported Phase 1 topics', () => {
    expect(topicToSnapshotStructureType(DataStructure.AVL_TREE)).toBeNull();
  });

  it('maps the API type back to the UI topic', () => {
    expect(snapshotStructureTypeToTopic('linked-list')).toBe(DataStructure.LINKED_LISTS);
  });
});

describe('snapshot topic boundaries', () => {
  it.each(['linked lists', 'LINKED LISTS', 'LiNkEd LiStS'])(
    'matches supported topic case-insensitively: %s',
    (topic) => {
      expect(topicToSnapshotStructureType(topic)).toBe('linked-list');
    }
  );

  it.each([
    '',
    'linked-list',
    ' Linked Lists ',
    DataStructure.BINARY_SEARCH_TREE,
    DataStructure.SORTING,
  ])('rejects unsupported topic %j', (topic) => {
    expect(topicToSnapshotStructureType(topic)).toBeNull();
  });

  it('returns null for an unsupported structure type received at runtime', () => {
    expect(
      snapshotStructureTypeToTopic('tree' as Parameters<typeof snapshotStructureTypeToTopic>[0])
    ).toBeNull();
  });
});
