import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GraphicalDataStructureFactory from '@/visualiser-src/common/GraphicalDataStructureFactory';
import type GraphicalDataStructure from '@/visualiser-src/common/GraphicalDataStructure';
import { DataStructure, type Documentation } from '@/visualiser-src/common/typedefs';
import VisualiserController from '../VisualiserController';

vi.mock('@/visualiser-src/common/GraphicalDataStructureFactory', () => ({
  default: { create: vi.fn() },
}));

// Exercise controller state/history with a deterministic structure and no SVG animations.
class TestStructure {
  data: number[] = [];

  documentation: Documentation = {
    append: { args: ['value'], description: '' },
    prepend: { args: ['value'], description: '' },
    insert: { args: ['value', 'index'], description: '' },
    search: { args: ['value'], description: '' },
    delete: { args: ['index'], description: '' },
  };

  load = vi.fn((values: number[]) => {
    this.data = values;
  });
  generate = vi.fn(() => {
    this.data = [7, 8];
  });
  append = vi.fn((value: number) => {
    this.data.push(value);
    return { allRunners: [] };
  });
  prepend = vi.fn((value: number) => {
    this.data.unshift(value);
    return { allRunners: [] };
  });
  insert = vi.fn((value: number, index: number) => {
    this.data.splice(index, 0, value);
    return { allRunners: [] };
  });
  search = vi.fn((_value: number) => ({ allRunners: [] }));
  delete = vi.fn((index: number) => {
    this.data.splice(index, 1);
    return { allRunners: [] };
  });
}

let structure: TestStructure;
let controller: VisualiserController;
const updateSlider = vi.fn();
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(GraphicalDataStructureFactory.create).mockImplementation(() => {
    structure = new TestStructure();
    return structure as unknown as GraphicalDataStructure;
  });
  controller = new VisualiserController(DataStructure.LINKED_LISTS);
});
afterEach(() => vi.restoreAllMocks());

describe('snapshot history', () => {
  it('captures named numeric arguments for every supported operation in execution order', () => {
    controller.loadData([1]);
    expect(controller.doOperation('append', updateSlider, '2')).toBe('');
    expect(controller.doOperation('prepend', updateSlider, '0')).toBe('');
    expect(controller.doOperation('insert', updateSlider, '99', '1')).toBe('');
    expect(controller.doOperation('search', updateSlider, '99')).toBe('');
    expect(controller.doOperation('delete', updateSlider, '2')).toBe('');
    expect(controller.buildSnapshotDraft('  Example  ')).toEqual({
      schemaVersion: 1,
      rendererVersion: 'preset-visualiser-v1',
      title: 'Example',
      structure: { type: 'linked-list', state: { values: [0, 99, 2] } },
      history: {
        initialState: { values: [1] },
        operations: [
          { name: 'append', arguments: { value: 2 } },
          { name: 'prepend', arguments: { value: 0 } },
          { name: 'insert', arguments: { value: 99, index: 1 } },
          { name: 'search', arguments: { value: 99 } },
          { name: 'delete', arguments: { index: 2 } },
        ],
      },
    });
    expect(structure.insert).toHaveBeenCalledWith(99, 1);
  });

  it('counts no-op operations and permits exactly 150 operations', () => {
    for (let index = 0; index < 150; index += 1) {
      expect(controller.doOperation('delete', updateSlider, '0')).toBe('');
    }
    expect(controller.buildSnapshotDraft().history.operations).toHaveLength(150);
    expect(controller.doOperation('delete', updateSlider, '0')).toBe(
      'History is limited to 150 operations. Start a new history to continue.'
    );
    expect(structure.delete).toHaveBeenCalledTimes(150);
    controller.loadData([1]);
    expect(controller.doOperation('search', updateSlider, '99')).toBe('');
    expect(controller.buildSnapshotDraft().history.operations).toEqual([
      { name: 'search', arguments: { value: 99 } },
    ]);
  });

  it('does not record an operation that throws', () => {
    structure.append.mockImplementationOnce(() => {
      throw new Error('operation failed');
    });
    expect(() => controller.doOperation('append', updateSlider, '1')).toThrow('operation failed');
    expect(controller.buildSnapshotDraft().history.operations).toEqual([]);
  });

  it('isolates loaded arrays and returned drafts from internal state and history', () => {
    const values = [1];
    controller.loadData(values);
    values.push(2);
    controller.doOperation('append', updateSlider, '3');
    const draft = controller.buildSnapshotDraft();
    draft.structure.state.values.push(99);
    draft.history.initialState.values.push(99);
    draft.history.operations[0].arguments = { value: 99 };
    draft.history.operations.push({ name: 'search', arguments: { value: 99 } });
    expect(controller.buildSnapshotDraft()).toMatchObject({
      structure: { state: { values: [1, 3] } },
      history: {
        initialState: { values: [1] },
        operations: [{ name: 'append', arguments: { value: 3 } }],
      },
    });
  });

  it.each(['load', 'generate', 'reset', 'topic'] as const)(
    'starts fresh history after %s',
    (action) => {
      controller.doOperation('append', updateSlider, '1');
      if (action === 'load') controller.loadData([9]);
      if (action === 'generate') controller.generateDataStructure();
      if (action === 'reset') controller.resetDataStructure();
      if (action === 'topic') controller.applyTopicTitle(DataStructure.LINKED_LISTS);
      const expected = action === 'load' ? [9] : action === 'generate' ? [7, 8] : [];
      expect(controller.buildSnapshotDraft().history).toEqual({
        initialState: { values: expected },
        operations: [],
      });
      expect(controller.data).toEqual(expected);
    }
  );

  it.each([undefined, '', '   '])('omits an empty title %j', (title) => {
    expect(controller.buildSnapshotDraft(title)).not.toHaveProperty('title');
  });

  it('accepts a 120-character title and rejects a longer one', () => {
    expect(controller.buildSnapshotDraft('x'.repeat(120)).title).toHaveLength(120);
    expect(() => controller.buildSnapshotDraft('x'.repeat(121))).toThrow();
  });

  it.each([undefined, DataStructure.AVL_TREE, DataStructure.SORTING])(
    'rejects snapshots for unsupported topic %j',
    (topic) => {
      expect(() => new VisualiserController(topic).buildSnapshotDraft()).toThrow(
        'Snapshots are only supported for Linked Lists.'
      );
    }
  );
});

describe('operation boundaries', () => {
  it.each(['append', 'prepend', 'insert'])(
    'allows %s at 99 values but prevents growth at 100',
    (command) => {
      controller.loadData(Array(99).fill(1));
      const args = command === 'insert' ? ['2', '0'] : ['2'];
      expect(controller.doOperation(command, updateSlider, ...args)).toBe('');
      expect(controller.data).toHaveLength(100);
      expect(controller.doOperation(command, updateSlider, ...args)).toBe(
        'Snapshots support at most 100 list values.'
      );
      expect(controller.data).toHaveLength(100);
      expect(controller.buildSnapshotDraft().history.operations).toHaveLength(1);
      expect(controller.doOperation('search', updateSlider, '1')).toBe('');
      expect(controller.doOperation('delete', updateSlider, '0')).toBe('');
      expect(controller.doOperation(command, updateSlider, ...args)).toBe('');
    }
  );

  it.each([{ values: [-1] }, { values: [100] }, { values: [1.5] }, { values: Array(101).fill(0) }])(
    'rejects invalid loaded data $values without losing the existing history',
    ({ values }) => {
      controller.doOperation('append', updateSlider, '1');
      const before = controller.buildSnapshotDraft();
      expect(() => controller.loadData(values)).toThrow();
      expect(controller.buildSnapshotDraft()).toEqual(before);
    }
  );

  it.each(['unknown', 'toString', 'constructor', '__proto__'])(
    'rejects undocumented or inherited command %s',
    (command) => {
      expect(controller.doOperation(command, updateSlider)).toBe(
        `Unsupported operation: ${command}`
      );
      expect(controller.buildSnapshotDraft().history.operations).toEqual([]);
    }
  );

  it('rejects a documented command with no callable implementation', () => {
    structure.documentation.missing = { args: [], description: '' };
    expect(controller.doOperation('missing', updateSlider)).toBe('Unsupported operation: missing');
    expect(controller.buildSnapshotDraft().history.operations).toEqual([]);
  });

  it('rejects a callable linked-list operation outside the snapshot contract', () => {
    structure.documentation.generate = { args: [], description: '' };
    expect(controller.doOperation('generate', updateSlider)).toBe(
      'Unsupported history operation: generate'
    );
    expect(structure.generate).not.toHaveBeenCalled();
  });

  it('validates captured argument names before executing', () => {
    structure.documentation.append.args = ['index'];
    expect(controller.doOperation('append', updateSlider, '1')).toBe(
      'Invalid Linked List operation arguments.'
    );
    expect(structure.append).not.toHaveBeenCalled();
    expect(controller.buildSnapshotDraft().history.operations).toEqual([]);
  });

  it('preserves numeric-list argument dispatch for other topics', () => {
    controller.applyTopicTitle(DataStructure.SORTING);
    const sort = vi.fn(() => ({ allRunners: [] }));
    Object.assign(structure, { sort });
    structure.documentation.sort = { args: ['values'], description: '' };
    expect(controller.doOperation('sort', updateSlider, '1, 2  3')).toBe('');
    expect(sort).toHaveBeenCalledExactlyOnceWith([1, 2, 3]);
  });
});
